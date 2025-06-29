import { GoogleGenerativeAI } from '@google/generative-ai'; 
import CommunicationSession from '../models/CommunicationSession.js'; 
import TherapySession from '../models/TherapySession.js';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);


export async function generateSessionReportTherapy(conversationHistory, therapyCoach, userId) {
  try {
    console.log(' Generating therapy session report with Gemini...');
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Format conversation history for analysis
    const formattedHistory = conversationHistory
      .map(entry => `${entry.speaker.toUpperCase()}: ${entry.text}`)
      .join('\n');
    
    const analysisPrompt = `
You are an expert therapeutic coach analyzer specializing in mental health support, stress management, anxiety treatment, and mindfulness practices. Please analyze the following conversation between a user and an AI therapy coach.

THERAPY COACH INFORMATION:
Name: ${therapyCoach.name}
Category: ${therapyCoach.category}
Description: ${therapyCoach.shortDescription}
Therapeutic Focus: ${therapyCoach.therapeuticFocus || 'General mental health support'}

CONVERSATION HISTORY:
${formattedHistory}

IMPORTANT THERAPEUTIC ASSESSMENT GUIDELINES:
Evaluate the DEPTH OF THERAPEUTIC ENGAGEMENT and EMOTIONAL PROCESSING:

MINIMUM REQUIREMENTS FOR SCORING ABOVE 50:
- User must have engaged in at least 3-4 meaningful therapeutic exchanges beyond basic greetings
- Conversation must show evidence of emotional exploration, self-reflection, or coping strategy discussion
- User must have shared specific details about their feelings, challenges, or mental health concerns
- There must be clear evidence of therapeutic work (processing emotions, exploring thoughts, practicing techniques)

THERAPEUTIC SCORING CRITERIA (0-100):
- 90-100: Exceptional therapeutic engagement with deep emotional processing, significant self-awareness breakthroughs, active participation in coping strategies, and meaningful progress toward mental wellness goals.
- 80-89: Strong therapeutic engagement with good emotional exploration, some self-awareness development, and active participation in therapeutic techniques.
- 70-79: Moderate therapeutic engagement with basic emotional sharing, some self-reflection, and willingness to explore coping strategies.
- 60-69: Limited but meaningful therapeutic engagement. User shares some concerns but lacks depth in emotional processing.
- 50-59: Minimal meaningful therapeutic engagement. Conversation touches on mental health topics but lacks substance.
- 30-49: Very limited therapeutic engagement. Mostly surface-level responses with little emotional exploration.
- 10-29: Extremely limited engagement. User barely participates in therapeutic process meaningfully.
- 0-9: No meaningful therapeutic engagement. Only greetings, one-word answers, or completely avoidant responses.

THERAPEUTIC QUALITY ASSESSMENT:
Evaluate these critical factors:
1. **Emotional Openness**: Does the user share feelings, concerns, or vulnerabilities authentically?
2. **Self-Reflection**: Does the user demonstrate introspection about their mental state, patterns, or behaviors?
3. **Therapeutic Receptivity**: How does the user respond to therapeutic techniques, suggestions, or coping strategies?
4. **Problem Exploration**: Does the user engage in exploring the root causes or triggers of their concerns?
5. **Coping Engagement**: Does the user show interest in or practice therapeutic techniques (mindfulness, breathing, etc.)?
6. **Progress Indicators**: Is there evidence of emotional regulation, insight development, or stress reduction?
7. **Safety Indicators**: Are there any signs of crisis, self-harm ideation, or need for immediate professional intervention?

SPECIAL THERAPEUTIC CONSIDERATIONS:
- If conversation is fewer than 4 substantive therapeutic exchanges, maximum score should be 40
- If user only mentions problems without engaging in therapeutic exploration, maximum score should be 50
- If user shows resistance to therapeutic process or avoids emotional topics, consider impact on score
- Brief sessions with high-quality emotional processing can still receive good scores if therapeutic value is clear
- Always assess for risk factors and safety concerns

RISK ASSESSMENT PRIORITY:
- Identify any indicators of self-harm, suicidal ideation, substance abuse, or crisis situations
- Note level of distress and coping capacity
- Assess need for professional referral or emergency intervention

Please provide a comprehensive therapeutic analysis in the following JSON format (respond with valid JSON only):

{
  "conversationSummary": "A detailed 3-4 sentence summary covering emotional themes discussed, therapeutic techniques used, and overall therapeutic engagement level",
  "sessionLength": "Brief/Short/Moderate/Extended",
  "engagementLevel": "Minimal/Limited/Moderate/High/Exceptional",
  "score": 0,
  "scoreJustification": "2-3 sentences explaining why this specific score was assigned based on therapeutic engagement depth and emotional processing quality",
  "concernsExpressed": [
    "List specific mental health concerns, stressors, or emotional challenges the user shared",
    "Be specific about anxiety symptoms, stress triggers, or mood-related issues mentioned"
  ],
  "emotionalState": {
    "initial": "Describe the user's apparent emotional state at the beginning of the session",
    "final": "Describe the user's apparent emotional state at the end of the session", 
    "progressNoted": true/false
  },
  "copingStrategiesDiscussed": [
    "List specific coping techniques, stress management strategies, or mindfulness practices discussed",
    "Include breathing exercises, grounding techniques, cognitive strategies mentioned"
  ],
  "therapeuticTechniquesUsed": [
    "List therapeutic approaches used by the AI coach (CBT techniques, mindfulness, validation, etc.)"
  ],
  "selfAwarenessIndicators": [
    "List evidence of user gaining insights about their patterns, triggers, or emotional responses",
    "Include moments of realization or self-discovery"
  ],
  "recommendedNextSteps": [
    "List actionable therapeutic recommendations appropriate for the user's current state",
    "Include specific practices, follow-up topics, or professional referrals if needed"
  ],
  "outcomeAchieved": "Honestly describe what therapeutic progress was made in this session",
  "keyBreakthroughs": [
    "List significant therapeutic insights, emotional breakthroughs, or coping victories (leave empty if none occurred)",
    "Only include genuine therapeutic progress, not assumed improvements"
  ],
  "therapeuticGoalProgress": {
    "goalsAddressed": ["List specific therapeutic goals or mental health objectives worked on"],
    "progressLevel": "None/Minimal/Some/Good/Significant",
    "specificEvidence": "Cite specific examples of progress toward mental wellness goals"
  },
  "therapeuticPatterns": {
    "positivePatterns": ["List healthy coping patterns, emotional regulation skills, or therapeutic engagement behaviors observed"],
    "challengingPatterns": ["List concerning patterns, avoidance behaviors, or areas needing therapeutic attention"]
  },
  "therapyReadiness": "Assess the user's readiness and openness to engage in therapeutic work",
  "riskAssessment": {
    "level": "None/Low/Moderate/High",
    "indicators": ["List any risk factors, warning signs, or safety concerns observed"],
    "recommendedActions": ["List immediate actions needed if any risks identified, including professional referral recommendations"]
  }
}
`;

    const result = await model.generateContent(analysisPrompt);
    const response = result.response;
    const text = response.text();
    
    console.log(' Raw Gemini therapy response:', text);
    
    // Parse the JSON response
    let reportData;
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        reportData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('❌ Error parsing Gemini therapy JSON response:', parseError);
      // Fallback report structure for therapy
      reportData = {
        conversationSummary: "Brief therapeutic session with limited user engagement in emotional processing.",
        sessionLength: "Brief",
        engagementLevel: "Limited",
        score: 25,
        scoreJustification: "Low score due to minimal therapeutic engagement and lack of meaningful emotional exploration or coping strategy discussion.",
        concernsExpressed: [],
        emotionalState: {
          initial: "Unclear due to limited sharing",
          final: "Unchanged due to minimal engagement",
          progressNoted: false
        },
        copingStrategiesDiscussed: [],
        therapeuticTechniquesUsed: [],
        selfAwarenessIndicators: [],
        recommendedNextSteps: [
          "Encourage more open sharing about feelings and concerns",
          "Practice basic grounding techniques",
          "Consider structured therapeutic exercises to build comfort"
        ],
        outcomeAchieved: "Minimal therapeutic progress due to limited emotional engagement",
        keyBreakthroughs: [],
        therapeuticGoalProgress: {
          goalsAddressed: [],
          progressLevel: "None",
          specificEvidence: "No evidence of therapeutic goal progress due to limited session engagement"
        },
        therapeuticPatterns: {
          positivePatterns: [],
          challengingPatterns: ["Minimal emotional sharing", "Limited engagement with therapeutic process"]
        },
        therapyReadiness: "User may need more time to build comfort with therapeutic process",
        riskAssessment: {
          level: "None",
          indicators: [],
          recommendedActions: []
        }
      };
    }
    
    // Validate and sanitize the therapy report data
    const validatedReport = {
      conversationSummary: reportData.conversationSummary || "Therapeutic session completed with basic interaction.",
      sessionLength: reportData.sessionLength || "Brief",
      engagementLevel: reportData.engagementLevel || "Limited",
      score: Math.min(100, Math.max(0, reportData.score || 25)),
      scoreJustification: reportData.scoreJustification || "Score based on limited therapeutic engagement and emotional processing.",
      concernsExpressed: Array.isArray(reportData.concernsExpressed) ? reportData.concernsExpressed.slice(0, 8) : [],
      emotionalState: {
        initial: reportData.emotionalState?.initial || "Not clearly expressed",
        final: reportData.emotionalState?.final || "Unchanged",
        progressNoted: reportData.emotionalState?.progressNoted || false
      },
      copingStrategiesDiscussed: Array.isArray(reportData.copingStrategiesDiscussed) ? 
        reportData.copingStrategiesDiscussed.slice(0, 6) : [],
      therapeuticTechniquesUsed: Array.isArray(reportData.therapeuticTechniquesUsed) ? 
        reportData.therapeuticTechniquesUsed.slice(0, 6) : [],
      selfAwarenessIndicators: Array.isArray(reportData.selfAwarenessIndicators) ? 
        reportData.selfAwarenessIndicators.slice(0, 5) : [],
      recommendedNextSteps: Array.isArray(reportData.recommendedNextSteps) ? 
        reportData.recommendedNextSteps.slice(0, 6) : ["Continue building therapeutic rapport"],
      outcomeAchieved: reportData.outcomeAchieved || "Basic therapeutic interaction completed",
      keyBreakthroughs: Array.isArray(reportData.keyBreakthroughs) ? reportData.keyBreakthroughs.slice(0, 4) : [],
      therapeuticGoalProgress: {
        goalsAddressed: Array.isArray(reportData.therapeuticGoalProgress?.goalsAddressed) ? 
          reportData.therapeuticGoalProgress.goalsAddressed : [],
        progressLevel: reportData.therapeuticGoalProgress?.progressLevel || "None",
        specificEvidence: reportData.therapeuticGoalProgress?.specificEvidence || 
          "No specific evidence of therapeutic progress in this session"
      },
      therapeuticPatterns: {
        positivePatterns: Array.isArray(reportData.therapeuticPatterns?.positivePatterns) ? 
          reportData.therapeuticPatterns.positivePatterns.slice(0, 5) : [],
        challengingPatterns: Array.isArray(reportData.therapeuticPatterns?.challengingPatterns) ? 
          reportData.therapeuticPatterns.challengingPatterns.slice(0, 5) : ["Limited therapeutic engagement"]
      },
      therapyReadiness: reportData.therapyReadiness || "Building readiness for therapeutic work",
      riskAssessment: {
        level: reportData.riskAssessment?.level || "None",
        indicators: Array.isArray(reportData.riskAssessment?.indicators) ? 
          reportData.riskAssessment.indicators.slice(0, 5) : [],
        recommendedActions: Array.isArray(reportData.riskAssessment?.recommendedActions) ? 
          reportData.riskAssessment.recommendedActions.slice(0, 5) : []
      }
    };
    
    console.log(' Generated therapy report:', validatedReport);
    return validatedReport;
    
  } catch (error) {
    console.error(' Error generating therapy session report:', error);
    
    // Return a realistic fallback report for minimal therapeutic engagement
    return {
      conversationSummary: "Brief therapeutic interaction with very limited emotional processing and minimal engagement with therapeutic techniques.",
      sessionLength: "Brief",
      engagementLevel: "Minimal",
      score: 20,
      scoreJustification: "Very low score due to lack of meaningful therapeutic engagement, no emotional exploration, and absence of coping strategy discussion.",
      concernsExpressed: [],
      emotionalState: {
        initial: "Not adequately assessed due to limited sharing",
        final: "No measurable change due to minimal engagement",
        progressNoted: false
      },
      copingStrategiesDiscussed: [],
      therapeuticTechniquesUsed: [],
      selfAwarenessIndicators: [],
      recommendedNextSteps: [
        "Focus on building therapeutic rapport and trust",
        "Start with very basic emotional check-ins",
        "Introduce simple grounding techniques gradually",
        "Consider shorter, more frequent sessions to build comfort",
        "Explore barriers to therapeutic engagement"
      ],
      outcomeAchieved: "Very limited therapeutic progress due to minimal participation in the therapeutic process.",
      keyBreakthroughs: [],
      therapeuticGoalProgress: {
        goalsAddressed: [],
        progressLevel: "None",
        specificEvidence: "User did not demonstrate engagement with therapeutic goals or mental health objectives during this minimal session"
      },
      therapeuticPatterns: {
        positivePatterns: [],
        challengingPatterns: [
          "Extremely limited emotional expression",
          "Avoidance of therapeutic topics",
          "Minimal response to therapeutic interventions",
          "No evidence of self-reflection or introspection"
        ]
      },
      therapyReadiness: "User appears to need significant support in developing comfort with the therapeutic process and may benefit from psychoeducation about therapy benefits",
      riskAssessment: {
        level: "None",
        indicators: [],
        recommendedActions: []
      }
    };
  }
}

export async function generateSessionReport(conversationHistory, coach, userId) {
  try {
    console.log(' Generating session report with Gemini...');
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Format conversation history for analysis
    const formattedHistory = conversationHistory
      .map(entry => `${entry.speaker.toUpperCase()}: ${entry.text}`)
      .join('\n');
    
    const analysisPrompt = `
You are an expert communication coach analyzer. Please analyze the following conversation between a user and an AI communication coach.

COACH INFORMATION:
Name: ${coach.name}
Category: ${coach.category}
Description: ${coach.shortDescription}
Learning Objectives: ${coach.learningObjectives}

CONVERSATION HISTORY:
${formattedHistory}

IMPORTANT SCORING GUIDELINES:
Before assigning a score, evaluate the SUBSTANCE and DEPTH of the conversation:

MINIMUM REQUIREMENTS FOR SCORING ABOVE 50:
- User must have engaged in at least 3-4 meaningful exchanges beyond basic greetings
- Conversation must show evidence of actual coaching work (reflection, goal-setting, problem-solving)
- User must have shared specific details about their situation, challenges, or goals
- There must be clear progress toward the stated learning objectives

SCORING CRITERIA (0-100):
- 90-100: Exceptional engagement with deep self-reflection, clear goal articulation, specific action planning, and multiple coaching breakthroughs. Conversation shows mastery-level communication.
- 80-89: Strong engagement with good self-reflection, some goal clarity, and actionable insights. Shows advanced communication skills.
- 70-79: Moderate engagement with basic self-reflection and some progress toward objectives. Shows developing communication skills.
- 60-69: Limited but meaningful engagement. User participates but lacks depth. Basic communication demonstrated.
- 50-59: Minimal meaningful engagement. Conversation lacks substance despite some participation.
- 30-49: Very limited engagement. Mostly surface-level responses with little coaching value.
- 10-29: Extremely limited engagement. User barely participates meaningfully.
- 0-9: No meaningful engagement. Only greetings, one-word answers, or completely off-topic responses.

CONVERSATION QUALITY ASSESSMENT:
Evaluate these factors:
1. **Depth of Responses**: Are answers detailed and thoughtful, or brief and surface-level?
2. **Self-Reflection**: Does the user demonstrate introspection and self-awareness?
3. **Goal Engagement**: Does the user actively work toward the stated learning objectives?
4. **Specificity**: Does the user provide concrete examples and specific details?
5. **Coaching Receptivity**: Does the user engage with coaching questions and guidance?
6. **Progress Indicators**: Is there measurable progress or insight development?

SPECIAL CONSIDERATIONS:
- If conversation is fewer than 4 substantive exchanges, maximum score should be 40
- If user only provides basic information without reflection, maximum score should be 50
- If user shows no evidence of working toward learning objectives, maximum score should be 60
- Brief conversations with high-quality engagement can still receive good scores, but must show clear coaching value

Please provide a comprehensive analysis in the following JSON format (respond with valid JSON only):

{
  "conversationSummary": "A detailed 3-4 sentence summary of the conversation covering key topics discussed, overall flow, and level of engagement",
  "conversationLength": "Brief/Short/Moderate/Extended",
  "engagementLevel": "Minimal/Limited/Moderate/High/Exceptional",
  "score": 0,
  "scoreJustification": "2-3 sentences explaining why this specific score was assigned based on the conversation content and depth",
  "strengths": [
    "List specific strengths demonstrated by the user (leave empty array if no notable strengths)",
    "Be specific about communication skills shown",
    "Include examples from the conversation where possible"
  ],
  "areasForImprovement": [
    "List specific areas where the user can improve based on what was actually observed",
    "Provide constructive feedback relevant to their current level",
    "Be encouraging while being honest about gaps"
  ],
  "recommendedNextSteps": [
    "List actionable next steps appropriate for their demonstrated level",
    "Include specific exercises or practices",
    "Suggest follow-up coaching topics if the conversation warrants it"
  ],
  "outcomeAchieved": "Describe what the user actually accomplished in this session (be honest if little was accomplished)",
  "keyInsights": [
    "List key insights or breakthroughs from the session (leave empty if none occurred)",
    "Only include genuine insights, not assumed ones"
  ],
  "learningObjectiveProgress": {
    "objectivesAddressed": ["List which learning objectives were actually worked on"],
    "progressLevel": "None/Minimal/Some/Good/Significant",
    "specificEvidence": "Cite specific examples of progress toward objectives"
  },
  "communicationPatterns": {
    "positivePatterns": ["List positive communication patterns actually observed"],
    "challengingPatterns": ["List patterns that were actually demonstrated and need improvement"]
  },
  "coachingReadiness": "Describe the user's apparent readiness for coaching based on their engagement level"
}
`;

    const result = await model.generateContent(analysisPrompt);
    const response = result.response;
    const text = response.text();
    
    console.log(' Raw Gemini response:', text);
    
    // Parse the JSON response
    let reportData;
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        reportData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('❌ Error parsing Gemini JSON response:', parseError);
      // Fallback report structure with new fields
      reportData = {
        conversationSummary: "Session completed with limited engagement from the user.",
        conversationLength: "Brief",
        engagementLevel: "Limited",
        score: 30,
        scoreJustification: "User provided minimal responses without demonstrating meaningful coaching engagement or self-reflection.",
        strengths: [],
        areasForImprovement: [
          "Engage more deeply in coaching conversations",
          "Provide more detailed responses to coaching questions",
          "Practice self-reflection and introspection"
        ],
        recommendedNextSteps: [
          "Start with shorter, focused coaching sessions",
          "Practice answering open-ended questions with more detail",
          "Set clear communication goals before next session"
        ],
        outcomeAchieved: "Limited progress due to minimal engagement",
        keyInsights: [],
        learningObjectiveProgress: {
          objectivesAddressed: [],
          progressLevel: "None",
          specificEvidence: "No evidence of progress toward learning objectives"
        },
        communicationPatterns: {
          positivePatterns: [],
          challengingPatterns: ["Very brief responses", "Limited engagement with coaching questions"]
        },
        coachingReadiness: "User may need more structured introduction to coaching process"
      };
    }
    
    // Validate and sanitize the report data with all new fields
    const validatedReport = {
      conversationSummary: reportData.conversationSummary || "Communication session completed successfully.",
      conversationLength: reportData.conversationLength || "Brief",
      engagementLevel: reportData.engagementLevel || "Limited",
      score: Math.min(100, Math.max(0, reportData.score || 30)),
      scoreJustification: reportData.scoreJustification || "Score assigned based on limited conversation depth and engagement.",
      strengths: Array.isArray(reportData.strengths) ? reportData.strengths.slice(0, 6) : [],
      areasForImprovement: Array.isArray(reportData.areasForImprovement) ? 
        reportData.areasForImprovement.slice(0, 6) : ["Continue practicing communication skills"],
      recommendedNextSteps: Array.isArray(reportData.recommendedNextSteps) ? 
        reportData.recommendedNextSteps.slice(0, 6) : ["Schedule follow-up sessions"],
      outcomeAchieved: reportData.outcomeAchieved || "User completed communication practice session",
      keyInsights: Array.isArray(reportData.keyInsights) ? reportData.keyInsights.slice(0, 4) : [],
      learningObjectiveProgress: {
        objectivesAddressed: Array.isArray(reportData.learningObjectiveProgress?.objectivesAddressed) ? 
          reportData.learningObjectiveProgress.objectivesAddressed : [],
        progressLevel: reportData.learningObjectiveProgress?.progressLevel || "None",
        specificEvidence: reportData.learningObjectiveProgress?.specificEvidence || 
          "No specific evidence of progress toward learning objectives"
      },
      communicationPatterns: {
        positivePatterns: Array.isArray(reportData.communicationPatterns?.positivePatterns) ? 
          reportData.communicationPatterns.positivePatterns.slice(0, 4) : [],
        challengingPatterns: Array.isArray(reportData.communicationPatterns?.challengingPatterns) ? 
          reportData.communicationPatterns.challengingPatterns.slice(0, 4) : ["Areas for development identified"]
      },
      coachingReadiness: reportData.coachingReadiness || "User shows basic readiness for coaching with room for increased engagement"
    };
    
    console.log(' Generated report:', validatedReport);
    return validatedReport;
    
  } catch (error) {
    console.error(' Error generating session report:', error);
    
    // Return a realistic fallback report for minimal engagement
    return {
      conversationSummary: "Brief communication session with limited user engagement and minimal coaching interaction.",
      conversationLength: "Brief",
      engagementLevel: "Minimal",
      score: 25,
      scoreJustification: "Low score due to very limited conversation depth, lack of meaningful exchanges, and no evidence of coaching progress.",
      strengths: [],
      areasForImprovement: [
        "Increase participation in coaching conversations",
        "Provide more detailed responses to questions",
        "Practice active engagement with coaching prompts",
        "Develop comfort with self-reflection exercises"
      ],
      recommendedNextSteps: [
        "Start with very short, structured coaching exercises",
        "Practice responding to simple coaching questions with more detail",
        "Set realistic expectations for gradual engagement improvement",
        "Consider preparatory exercises before next coaching session"
      ],
      outcomeAchieved: "Minimal progress due to limited engagement in the coaching process.",
      keyInsights: [],
      learningObjectiveProgress: {
        objectivesAddressed: [],
        progressLevel: "None",
        specificEvidence: "User did not demonstrate engagement with any specific learning objectives during this brief session"
      },
      communicationPatterns: {
        positivePatterns: [],
        challengingPatterns: [
          "Very brief, surface-level responses", 
          "Limited engagement with coaching questions",
          "No evidence of self-reflection or introspection"
        ]
      },
      coachingReadiness: "User appears to need more structured introduction to the coaching process and may benefit from shorter, more focused initial sessions"
    };
  }
}

export async function saveSessionAndGenerateReport(userId, coachId, conversationHistory, coach, startTime, coachType) {
  try {
    console.log(' Saving session and generating report...');
    
    const endTime = new Date();
    const durationInSeconds = Math.floor((endTime - startTime) / 1000);

    let report;
    let session;

    if (coachType === "communication-coach") {
      report = await generateSessionReport(conversationHistory, coach, userId);
      session = new CommunicationSession({
        userId,
        communication_coach_Id: coachId,
        type: 'communication',
        startTime,
        endTime,
        durationInSeconds,
        conversationHistory,
        report,
      });
    } else if (coachType === "therapy") {
      report = await generateSessionReportTherapy(conversationHistory, coach, userId);
      session = new TherapySession({
        userId,
        therapy_coach_Id: coachId,
        type: 'therapy',
        startTime,
        endTime,
        durationInSeconds,
        conversationHistory,
        report,
      });
    } else {
      throw new Error(`Unsupported coach type: ${coachType}`);
    }

    const savedSession = await session.save();
    console.log(' Session saved with ID:', savedSession._id);
    
    return savedSession;

  } catch (error) {
    console.error(' Error saving session and generating report:', error);
    throw error;
  }
}
