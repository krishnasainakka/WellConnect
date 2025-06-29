import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  username: {
    type: String,
    required: true,
    trim: true
  },

  // User data
  badges: [
    {
      badgeId: {
        type: String,
        required: true
      },
      earnedDate: {
        type: Date,
        required: true
      }
    }
  ],

  stats: {
    totalSessions: {
      type: Number,
      default: 0
    },
    avgCommunicationScore: {
      type: Number,
      default: 0.0
    },
    numberOfBadges: {
      type: Number,
      default: 0
    },
    timeSpentPracticing: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    lastActivityDate: Date
  },

  // Profile information
  isActive: {
    type: Boolean,
    default: true
  },

  lastLogin: {
    type: Date,
    default: Date.now
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 10 (simpler than 12)
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.model('User', userSchema);