const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't return password in queries by default
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['bde', 'master'],
    required: true,
    default: 'bde'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    required: true,
    default: 'Active'
  },
  profile: {
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    department: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    signature: {
      type: String,
      trim: true
    }
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  goals: {
    monthlyTarget: {
      type: Number,
      default: 0,
      min: [0, 'Target cannot be negative']
    },
    quarterlyTarget: {
      type: Number,
      default: 0,
      min: [0, 'Target cannot be negative']
    },
    annualTarget: {
      type: Number,
      default: 0,
      min: [0, 'Target cannot be negative']
    }
  },
  metadata: {
    lastLogin: {
      type: Date,
      default: null
    },
    loginCount: {
      type: Number,
      default: 0
    },
    createdIp: {
      type: String,
      default: null
    },
    deviceId: {
      type: String,
      default: null
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ 'metadata.lastLogin': -1 });

// Virtual fields
userSchema.virtual('fullProfile').get(function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    status: this.status,
    avatar: this.avatar,
    profile: this.profile,
    preferences: this.preferences
  };
});

// Pre-save middleware for password hashing
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.updateLastLogin = async function(ip, deviceId) {
  this.metadata.lastLogin = new Date();
  this.metadata.loginCount = (this.metadata.loginCount || 0) + 1;
  if (ip) this.metadata.createdIp = ip;
  if (deviceId) this.metadata.deviceId = deviceId;
  return await this.save();
};

userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.metadata;
  return userObject;
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function(role = null) {
  const query = { status: 'Active' };
  if (role) query.role = role;
  return this.find(query).select('-password');
};

userSchema.statics.getUserStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
        },
        bdeCount: {
          $sum: { $cond: [{ $eq: ['$role', 'bde'] }, 1, 0] }
        },
        masterCount: {
          $sum: { $cond: [{ $eq: ['$role', 'master'] }, 1, 0] }
        }
      }
    }
  ]);

  return stats[0] || {
    totalUsers: 0,
    activeUsers: 0,
    bdeCount: 0,
    masterCount: 0
  };
};

module.exports = mongoose.model('User', userSchema);