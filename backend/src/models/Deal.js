const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Deal name is required'],
    trim: true,
    maxlength: [200, 'Deal name cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company is required'],
    index: true
  },
  value: {
    type: Number,
    required: [true, 'Deal value is required'],
    min: [0, 'Deal value cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP']
  },
  stage: {
    type: String,
    required: true,
    enum: ['Qualification', 'Needs Analysis', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
    default: 'Qualification',
    index: true
  },
  probability: {
    type: Number,
    min: 0,
    max: 100,
    default: 25
  },
  expectedCloseDate: {
    type: Date,
    required: [true, 'Expected close date is required'],
    index: true
  },
  actualCloseDate: {
    type: Date,
    default: null
  },

  // Deal Management
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Deal owner is required'],
    index: true
  },
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  source: {
    type: String,
    trim: true,
    default: 'Manual'
  },

  // Financial Details
  paymentStructure: {
    upfront: {
      type: Number,
      default: 0,
      min: [0, 'Upfront payment cannot be negative']
    },
    recurring: {
      type: Number,
      default: 0,
      min: [0, 'Recurring payment cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR', 'GBP']
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'quarterly', 'annual'],
      default: 'annual'
    }
  },

  // Deal Progress
  lastActivity: {
    type: Date,
    default: Date.now
  },
  nextMilestone: {
    type: String,
    trim: true
  },
  activities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity'
  }],

  // Competition
  competitors: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    strength: {
      type: String,
      trim: true
    },
    weakness: {
      type: String,
      trim: true
    },
    strategy: {
      type: String,
      trim: true
    }
  }],

  // Outcome Analysis
  winLossReason: {
    type: String,
    trim: true
  },
  lessonsLearned: {
    type: String,
    trim: true
  },
  customerFeedback: {
    type: String,
    trim: true
  },

  // AI Insights
  aiInsights: {
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 30
    },
    recommendedActions: [{
      type: String,
      maxlength: [300, 'Recommended action cannot exceed 300 characters']
    }],
    similarDeals: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deal'
    }],
    dealHealthMetrics: {
      engagementScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 70
      },
      timelineHealth: {
        type: String,
        enum: ['On Track', 'At Risk', 'Delayed'],
        default: 'On Track'
      },
      budgetAlignment: {
        type: String,
        enum: ['Aligned', 'Needs Discussion', 'Misaligned'],
        default: 'Aligned'
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for better performance
dealSchema.index({ company: 1, stage: 1 });
dealSchema.index({ owner: 1, stage: 1 });
dealSchema.index({ stage: 1, expectedCloseDate: 1 });
dealSchema.index({ value: -1, stage: 1 });
dealSchema.index({ createdAt: -1 });

// Virtual fields
dealSchema.virtual('valueINR').get(function() {
  return this.value;
});

dealSchema.virtual('daysToClose').get(function() {
  if (this.actualCloseDate) {
    return Math.floor((this.actualCloseDate - this.createdAt) / (1000 * 60 * 60 * 24));
  }
  return Math.floor((this.expectedCloseDate - this.createdAt) / (1000 * 60 * 60 * 24));
});

dealSchema.virtual('daysUntilExpectedClose').get(function() {
  return Math.floor((this.expectedCloseDate - Date.now()) / (1000 * 60 * 60 * 24));
});

dealSchema.virtual('isOverdue').get(function() {
  return new Date() > this.expectedCloseDate && !['Closed Won', 'Closed Lost'].includes(this.stage);
});

dealSchema.virtual('isWon').get(function() {
  return this.stage === 'Closed Won';
});

dealSchema.virtual('isLost').get(function() {
  return this.stage === 'Closed Lost';
});

dealSchema.virtual('isActive').get(function() {
  return !['Closed Won', 'Closed Lost'].includes(this.stage);
});

// Pre-save middleware
dealSchema.pre('save', function(next) {
  // Update probability based on stage
  this.updateProbabilityByStage();

  // Set actual close date when deal is closed
  if (['Closed Won', 'Closed Lost'].includes(this.stage) && !this.actualCloseDate) {
    this.actualCloseDate = new Date();
  }

  // Update AI insights
  this.updateAIInsights();

  next();
});

// Instance methods
dealSchema.methods.updateProbabilityByStage = function() {
  const stageProbabilities = {
    'Qualification': 25,
    'Needs Analysis': 40,
    'Proposal': 60,
    'Negotiation': 80,
    'Closed Won': 100,
    'Closed Lost': 0
  };

  if (stageProbabilities[this.stage] !== undefined) {
    this.probability = stageProbabilities[this.stage];
  }
};

dealSchema.methods.updateAIInsights = function() {
  let riskScore = 30; // Base risk score

  // Factor in overdue status
  if (this.isOverdue) {
    riskScore += 25;
  }

  // Factor in deal value (higher value = higher risk)
  if (this.value > 1000000) riskScore += 15; // >10L INR
  else if (this.value > 500000) riskScore += 10; // >5L INR

  // Factor in stage
  if (this.stage === 'Negotiation') riskScore += 10;
  if (this.stage === 'Qualification') riskScore += 20;

  // Factor in days to close
  const daysToClose = this.daysToClose;
  if (daysToClose > 180) riskScore += 15;
  else if (daysToClose > 90) riskScore += 10;

  this.aiInsights.riskScore = Math.min(100, Math.max(0, riskScore));

  // Update deal health metrics
  this.updateDealHealthMetrics();
};

dealSchema.methods.updateDealHealthMetrics = function() {
  const daysUntilClose = this.daysUntilExpectedClose;

  // Timeline health
  if (daysUntilClose < 0) {
    this.aiInsights.dealHealthMetrics.timelineHealth = 'Delayed';
  } else if (daysUntilClose < 14) {
    this.aiInsights.dealHealthMetrics.timelineHealth = 'At Risk';
  } else {
    this.aiInsights.dealHealthMetrics.timelineHealth = 'On Track';
  }

  // Engagement score (simplified calculation)
  let engagementScore = 70;
  if (this.lastActivity) {
    const daysSinceActivity = Math.floor((Date.now() - this.lastActivity) / (1000 * 60 * 60 * 24));
    if (daysSinceActivity > 14) engagementScore -= 20;
    else if (daysSinceActivity > 7) engagementScore -= 10;
    else if (daysSinceActivity < 3) engagementScore += 10;
  }

  this.aiInsights.dealHealthMetrics.engagementScore = Math.min(100, Math.max(0, engagementScore));
};

dealSchema.methods.advanceStage = function(newStage) {
  const oldStage = this.stage;
  this.stage = newStage;
  this.lastActivity = new Date();

  // Log stage change activity
  // This would create an activity record in the activities collection

  return this.save();
};

dealSchema.methods.closeDeal = function(outcome, reason = '', feedback = '') {
  if (outcome === 'won') {
    this.stage = 'Closed Won';
    this.probability = 100;
  } else {
    this.stage = 'Closed Lost';
    this.probability = 0;
  }

  this.actualCloseDate = new Date();
  this.winLossReason = reason;
  this.customerFeedback = feedback;

  return this.save();
};

dealSchema.methods.addCompetitor = function(competitorData) {
  this.competitors.push(competitorData);
  return this.save();
};

// Static methods
dealSchema.statics.findByOwner = function(ownerId, filters = {}) {
  const query = { owner: ownerId, ...filters };
  return this.find(query)
    .populate('company', 'name logo industry')
    .populate('owner', 'name email avatar')
    .sort({ createdAt: -1 });
};

dealSchema.statics.getPipelineValue = function(stage = null) {
  const query = stage ? { stage } : { stage: { $nin: ['Closed Won', 'Closed Lost'] } };

  return this.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$stage',
        count: { $sum: 1 },
        totalValue: { $sum: '$value' },
        avgValue: { $avg: '$value' },
        weightedValue: { $sum: { $multiply: ['$value', { $divide: ['$probability', 100] }] } }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

dealSchema.statics.getForecastData = function(months = 12) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + months);

  return this.aggregate([
    {
      $match: {
        expectedCloseDate: { $gte: startDate, $lte: endDate },
        stage: { $nin: ['Closed Won', 'Closed Lost'] }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$expectedCloseDate' },
          month: { $month: '$expectedCloseDate' }
        },
        forecastValue: { $sum: { $multiply: ['$value', { $divide: ['$probability', 100] }] } },
        pipelineValue: { $sum: '$value' },
        dealCount: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);
};

dealSchema.statics.getWinLossAnalysis = function() {
  return this.aggregate([
    {
      $match: {
        stage: { $in: ['Closed Won', 'Closed Lost'] },
        actualCloseDate: { $exists: true }
      }
    },
    {
      $group: {
        _id: '$stage',
        count: { $sum: 1 },
        totalValue: { $sum: '$value' },
        avgValue: { $avg: '$value' },
        avgDaysToClose: {
          $avg: {
            $divide: [
              { $subtract: ['$actualCloseDate', '$createdAt'] },
              1000 * 60 * 60 * 24 // Convert milliseconds to days
            ]
          }
        }
      }
    }
  ]);
};

dealSchema.statics.getTopDeals = function(limit = 10, stage = null) {
  const query = stage ? { stage } : { stage: { $nin: ['Closed Won', 'Closed Lost'] } };

  return this.find(query)
    .sort({ value: -1 })
    .limit(limit)
    .populate('company', 'name logo')
    .populate('owner', 'name email');
};

module.exports = mongoose.model('Deal', dealSchema);