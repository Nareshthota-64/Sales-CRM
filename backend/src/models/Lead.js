const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Lead name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    index: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  designation: {
    type: String,
    trim: true
  },
  linkedin: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters']
  },
  companyLogo: {
    type: String,
    default: null
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
  },
  industry: {
    type: String,
    trim: true
  },
  employeeCount: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Unqualified', 'Closed', 'Pending Approval'],
    required: true,
    default: 'New',
    index: true
  },
  source: {
    type: String,
    trim: true,
    default: 'Manual'
  },
  value: {
    type: Number,
    default: 0,
    min: [0, 'Value cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Lead owner is required'],
    index: true
  },
  assignedBde: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot exceed 2000 characters']
  },
  tags: [{
    type: String,
    trim: true
  }],

  // AI Enrichment
  aiInsights: {
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    temperature: {
      type: String,
      enum: ['Hot', 'Warm', 'Cold'],
      default: 'Cold'
    },
    summary: {
      type: String,
      maxlength: [1000, 'Summary cannot exceed 1000 characters']
    },
    talkingPoints: [{
      type: String,
      maxlength: [200, 'Talking point cannot exceed 200 characters']
    }],
    risks: [{
      type: String,
      maxlength: [300, 'Risk cannot exceed 300 characters']
    }],
    recommendedActions: [{
      type: String,
      maxlength: [300, 'Recommended action cannot exceed 300 characters']
    }],
    competitorAnalysis: {
      type: String,
      maxlength: [500, 'Competitor analysis cannot exceed 500 characters']
    },
    buyingSignals: [{
      type: String,
      maxlength: [200, 'Buying signal cannot exceed 200 characters']
    }]
  },

  // Contact Information
  contacts: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      trim: true
    },
    designation: {
      type: String,
      trim: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],

  // Social Media
  socialProfiles: {
    linkedin: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    facebook: {
      type: String,
      trim: true
    }
  },

  // Communication History
  lastContacted: {
    type: Date,
    default: null
  },
  nextFollowUp: {
    type: Date,
    default: null
  },
  communicationCount: {
    type: Number,
    default: 0,
    min: 0
  },

  // Metadata
  metadata: {
    sourceCampaign: {
      type: String,
      trim: true
    },
    utmParameters: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ipAddress: {
      type: String,
      default: null
    },
    deviceInfo: {
      type: String,
      default: null
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for better performance
leadSchema.index({ owner: 1, status: 1 });
leadSchema.index({ companyName: 1, status: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ 'aiInsights.temperature': 1, status: 1 });
leadSchema.index({ source: 1, status: 1 });

// Virtual fields
leadSchema.virtual('isHot').get(function() {
  return this.aiInsights.temperature === 'Hot';
});

leadSchema.virtual('daysSinceLastContact').get(function() {
  if (!this.lastContacted) return null;
  return Math.floor((Date.now() - this.lastContacted) / (1000 * 60 * 60 * 24));
});

leadSchema.virtual('followUpOverdue').get(function() {
  if (!this.nextFollowUp) return false;
  return new Date() > this.nextFollowUp;
});

// Pre-save middleware
leadSchema.pre('save', function(next) {
  // Set primary contact if none exists
  if (this.contacts.length > 0 && !this.contacts.some(c => c.isPrimary)) {
    this.contacts[0].isPrimary = true;
  }

  // Update AI temperature based on score
  if (this.aiInsights.score >= 70) {
    this.aiInsights.temperature = 'Hot';
  } else if (this.aiInsights.score >= 40) {
    this.aiInsights.temperature = 'Warm';
  } else {
    this.aiInsights.temperature = 'Cold';
  }

  next();
});

// Instance methods
leadSchema.methods.updateAIInsights = async function(insights) {
  this.aiInsights = {
    ...this.aiInsights,
    ...insights,
    score: Math.min(100, Math.max(0, insights.score || 0))
  };
  return await this.save();
};

leadSchema.methods.addActivity = function(activityType, content, author = null) {
  // This would typically create an activity record
  this.communicationCount = (this.communicationCount || 0) + 1;
  this.lastContacted = new Date();
  return this.save();
};

leadSchema.methods.changeStatus = function(newStatus, reason = '') {
  const oldStatus = this.status;
  this.status = newStatus;

  // Log status change activity
  // This would create an activity record in the activities collection

  return this.save();
};

// Static methods
leadSchema.statics.findByOwner = function(ownerId, filters = {}) {
  const query = { owner: ownerId, ...filters };
  return this.find(query).populate('owner', 'name email avatar');
};

leadSchema.statics.getLeadsByStatus = function(status = null) {
  const query = status ? { status } : {};
  return this.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$value' },
        avgScore: { $avg: '$aiInsights.score' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

leadSchema.statics.getHotLeads = function(limit = 10) {
  return this.find({
    'aiInsights.temperature': 'Hot',
    status: { $nin: ['Closed', 'Unqualified'] }
  })
  .sort({ 'aiInsights.score': -1, createdAt: -1 })
  .limit(limit)
  .populate('owner', 'name email');
};

leadSchema.statics.searchLeads = function(searchTerm, filters = {}) {
  const searchRegex = new RegExp(searchTerm, 'i');
  const searchQuery = {
    $or: [
      { name: searchRegex },
      { email: searchRegex },
      { companyName: searchRegex },
      { location: searchRegex },
      { 'contacts.email': searchRegex }
    ],
    ...filters
  };

  return this.find(searchQuery)
    .populate('owner', 'name email avatar')
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Lead', leadSchema);