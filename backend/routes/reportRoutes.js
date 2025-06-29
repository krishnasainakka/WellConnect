// routes/reportRoutes.js
import express from 'express';
import CommunicationSession from '../models/CommunicationSession.js';
import TherapySession from '../models/TherapySession.js';

const router = express.Router();

/**
 * GET /api/reports/:sessionId
 * Retrieve a session report by ID (works for both communication and therapy sessions)
 */
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    console.log('📊 Fetching report for session:', sessionId);
    
    // Try to find in communication sessions first
    let session = await CommunicationSession.findById(sessionId)
      .populate('communication_coach_Id', 'name shortDescription category avatarUrl')
      .exec();
    
    let sessionType = 'communication';
    
    // If not found in communication sessions, try therapy sessions
    if (!session) {
      session = await TherapySession.findById(sessionId)
        .populate('therapy_coach_Id', 'name shortDescription category avatarUrl')
        .exec();
      sessionType = 'therapy';
    }
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }
    
    // Format the response based on session type
    const coachInfo = sessionType === 'communication' 
      ? session.communication_coach_Id 
      : session.therapy_coach_Id;
    
    const reportData = {
      sessionId: session._id,
      sessionType: sessionType,
      coach: {
        name: coachInfo?.name || 'Unknown Coach',
        shortDescription: coachInfo?.shortDescription,
        category: coachInfo?.category,
        avatarUrl: coachInfo?.avatarUrl
      },
      sessionInfo: {
        startTime: session.startTime,
        endTime: session.endTime,
        durationInSeconds: session.durationInSeconds,
        durationFormatted: formatDuration(session.durationInSeconds)
      },
      conversationHistory: session.conversationHistory,
      report: session.report
    };
    
    console.log('✅ Report data retrieved successfully');
    
    res.json({
      success: true,
      data: reportData
    });
    
  } catch (error) {
    console.error('❌ Error fetching report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch report: ' + error.message
    });
  }
});

/**
 * GET /api/reports/user/:userId
 * Get all session reports for a specific user (both communication and therapy)
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, type = 'all' } = req.query;
    
    console.log('📊 Fetching reports for user:', userId, 'type:', type);
    
    let communicationSessions = [];
    let therapySessions = [];
    
    // Fetch communication sessions if requested
    if (type === 'all' || type === 'communication') {
      communicationSessions = await CommunicationSession.find({ userId })
        .populate('communication_coach_Id', 'name shortDescription category avatarUrl')
        .sort({ createdAt: -1 })
        .exec();
    }
    
    // Fetch therapy sessions if requested
    if (type === 'all' || type === 'therapy') {
      therapySessions = await TherapySession.find({ userId })
        .populate('therapy_coach_Id', 'name shortDescription category avatarUrl')
        .sort({ createdAt: -1 })
        .exec();
    }
    
    // Combine and format sessions
    const allSessions = [
      ...communicationSessions.map(session => formatSessionSummary(session, 'communication')),
      ...therapySessions.map(session => formatSessionSummary(session, 'therapy'))
    ];
    
    // Sort by creation date (newest first)
    allSessions.sort((a, b) => new Date(b.sessionInfo.startTime) - new Date(a.sessionInfo.startTime));
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedSessions = allSessions.slice(startIndex, endIndex);
    
    const totalSessions = allSessions.length;
    
    res.json({
      success: true,
      data: {
        sessions: paginatedSessions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalSessions / limit),
          totalSessions,
          hasNext: endIndex < totalSessions,
          hasPrev: page > 1
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching user reports:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user reports: ' + error.message
    });
  }
});

/**
 * GET /api/reports/stats/:userId
 * Get comprehensive statistics for a user (both communication and therapy)
 */
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('📈 Fetching stats for user:', userId);
    
    // Fetch both types of sessions
    const communicationSessions = await CommunicationSession.find({ userId })
      .populate('communication_coach_Id', 'name category')
      .exec();
    
    const therapySessions = await TherapySession.find({ userId })
      .populate('therapy_coach_Id', 'name category')
      .exec();
    
    const allSessions = [...communicationSessions, ...therapySessions];
    
    if (allSessions.length === 0) {
      return res.json({
        success: true,
        data: {
          totalSessions: 0,
          communicationSessions: 0,
          therapySessions: 0,
          averageScore: 0,
          totalPracticeTime: 0,
          coachDistribution: [],
          scoreProgression: [],
          recentActivity: [],
          sessionTypeDistribution: {
            communication: 0,
            therapy: 0
          }
        }
      });
    }
    
    // Calculate statistics
    const totalSessions = allSessions.length;
    const communicationCount = communicationSessions.length;
    const therapyCount = therapySessions.length;
    
    const scores = allSessions.map(s => s.report?.score || 0).filter(s => s > 0);
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const totalPracticeTime = allSessions.reduce((total, s) => total + (s.durationInSeconds || 0), 0);
    
    // Coach distribution (combined)
    const coachCount = {};
    communicationSessions.forEach(session => {
      const coachName = session.communication_coach_Id?.name || 'Unknown Communication Coach';
      coachCount[coachName] = (coachCount[coachName] || 0) + 1;
    });
    therapySessions.forEach(session => {
      const coachName = session.therapy_coach_Id?.name || 'Unknown Therapy Coach';
      coachCount[coachName] = (coachCount[coachName] || 0) + 1;
    });
    
    const coachDistribution = Object.entries(coachCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    // Score progression (last 10 sessions)
    const scoreProgression = allSessions
      .slice(-10)
      .map((session, index) => ({
        sessionNumber: index + 1,
        score: session.report?.score || 0,
        date: session.createdAt,
        type: session.type
      }));
    
    // Recent activity (last 5 sessions)
    const recentActivity = allSessions
      .slice(-5)
      .reverse()
      .map(session => {
        const coachName = session.type === 'communication' 
          ? session.communication_coach_Id?.name || 'Unknown Coach'
          : session.therapy_coach_Id?.name || 'Unknown Coach';
        
        return {
          sessionId: session._id,
          coachName,
          score: session.report?.score,
          date: session.createdAt,
          duration: formatDuration(session.durationInSeconds),
          type: session.type
        };
      });
    
    const stats = {
      totalSessions,
      communicationSessions: communicationCount,
      therapySessions: therapyCount,
      averageScore,
      totalPracticeTime,
      totalPracticeTimeFormatted: formatDuration(totalPracticeTime),
      coachDistribution,
      scoreProgression,
      recentActivity,
      sessionTypeDistribution: {
        communication: communicationCount,
        therapy: therapyCount
      }
    };
    
    console.log('✅ Stats calculated successfully');
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stats: ' + error.message
    });
  }
});

/**
 * Helper function to format session summary
 */
function formatSessionSummary(session, sessionType) {
  const coachInfo = sessionType === 'communication' 
    ? session.communication_coach_Id 
    : session.therapy_coach_Id;
  
  return {
    sessionId: session._id,
    sessionType: sessionType,
    coach: {
      name: coachInfo?.name || 'Unknown Coach',
      category: coachInfo?.category,
      avatarUrl: coachInfo?.avatarUrl
    },
    sessionInfo: {
      startTime: session.startTime,
      endTime: session.endTime,
      durationFormatted: formatDuration(session.durationInSeconds)
    },
    reportSummary: {
      score: session.report?.score,
      conversationSummary: session.report?.conversationSummary,
      engagementLevel: session.report?.engagementLevel,
      sessionLength: session.report?.conversationLength || session.report?.sessionLength
    }
  };
}

/**
 * Helper function to format duration in seconds to human readable format
 */
function formatDuration(seconds) {
  if (!seconds || seconds < 0) return '0m 0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}

export default router;