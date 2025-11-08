const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters'],
    index: true
  },
  logo: {
    type: String,
    default: null
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  industry: {
    type: String,
    trim: true,
    index: true
  },
  foundedYear: {
    type: Number,
    min: [1800, 'Founded year must be after 1800'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future']
  },
  employeeCount: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    index: true
  },
  revenue: {
    type: Number,
    default: 0,
    min: [0, 'Revenue cannot be negative']
  },

  // Location
  headquarters: {
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true,
      default: 'India'
    },
    postalCode: {
      type: String,
      trim: true
    }
  },

  // Account Management
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Account owner is required'],
    index: true
  },
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Account Health
  health: {
    type: String,
    enum: ['Healthy', 'Needs Attention', 'At Risk'],
    default: 'Healthy',
    index: true
  },
  healthScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 80
  },
  arr: {
    type: Number,
    default: 0,
    min: [0, 'ARR cannot be negative'],
    index: true
  },
  ltv: {
    type: Number,
    default: 0,
    min: [0, 'LTV cannot be negative']
  },
  cac: {
    type: Number,
    default: 0,
    min: [0, 'CAC cannot be negative']
  },

  // Relationship Data
  relationshipStage: {
    type: String,
    enum: ['Prospect', 'Customer', 'Partner', 'Churned'],
    default: 'Customer'
  },
  contractValue: {
    type: Number,
    default: 0,
    min: [0, 'Contract value cannot be negative']
  },
  contractStart: {
    type: Date,
    default: null
  },
  contractEnd: {
    type: Date,
    default: null
  },

  // Contacts
  contacts: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
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
    avatar: {
      type: String,
      default: null
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    isDecisionMaker: {
      type: Boolean,
      default: false
    }
  }],

  // AI Insights
  aiInsights: {
    positive: [{
      type: String,
      maxlength: [300, 'Positive indicator cannot exceed 300 characters']
    }],
    negative: [{
      type: String,
      maxlength: [300, 'Risk factor cannot exceed 300 characters']
    }],
    opportunities: [{
      type: String,
      maxlength: [300, 'Opportunity cannot exceed 300 characters']
    }],
    recommendedActions: [{
      type: String,
      maxlength: [300, 'Recommended action cannot exceed 300 characters']
    }],
    competitorThreats: [{
      type: String,
      maxlength: [300, 'Competitor threat cannot exceed 300 characters']
    }]
  },

  // Activity Tracking
  lastActivity: {
    type: Date,
    default: Date.now
  },
  totalInteractions: {
    type: Number,
    default: 0,
    min: 0
  },
  meetingsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  callsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  emailsCount: {
    type: Number,
    default: 0,
    min: 0
  },

  // Billing Information
  billing: {
    address: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    gstNumber: {
      type: String,
      trim: true,
      match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GST number']
    },
    panNumber: {
      type: String,
      trim: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number']
    },
    paymentTerms: {
      type: String,
      enum: ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Immediate'],
      default: 'Net 30'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for better performance
companySchema.index({ owner: 1, health: 1 });
companySchema.index({ industry: 1, arr: -1 });
companySchema.index({ 'headquarters.city': 1, health: 1 });
companySchema.index({ relationshipStage: 1, lastActivity: -1 });

// Virtual fields
companySchema.virtual('isAtRisk').get(function() {
  return this.health === 'At Risk';
});

companySchema.virtual('daysSinceLastActivity').get(function() {
  return Math.floor((Date.now() - this.lastActivity) / (1000 * 60 * 60 * 24));
});

companySchema.virtual('primaryContact').get(function() {
  return this.contacts.find(contact => contact.isPrimary) || this.contacts[0];
});

companySchema.virtual('decisionMakers').get(function() {
  return this.contacts.filter(contact => contact.isDecisionMaker);
});

companySchema.virtual('contractValueINR').get(function() {
  return this.contractValue;
});

companySchema.virtual('arrINR').get(function() {
  return this.arr;
});

// Pre-save middleware
companySchema.pre('save', function(next) {
  // Set primary contact if none exists
  if (this.contacts.length > 0 && !this.contacts.some(c => c.isPrimary)) {
    this.contacts[0].isPrimary = true;
  }

  // Update health score based on various factors
  this.updateHealthScore();

  next();
});

// Instance methods
companySchema.methods.updateHealthScore = function() {
  let score = 80; // Base score

  // Factor in recent activity
  const daysSinceActivity = this.daysSinceLastActivity;
  if (daysSinceActivity > 30) score -= 20;
  else if (daysSinceActivity > 14) score -= 10;
  else if (daysSinceActivity < 7) score += 10;

  // Factor in ARR
  if (this.arr > 1000000) score += 10; // >10L INR
  else if (this.arr > 500000) score += 5; // >5L INR

  // Factor in relationship stage
  if (this.relationshipStage === 'Churned') score -= 40;
  else if (this.relationshipStage === 'Partner') score += 15;

  // Ensure score is within bounds
  this.healthScore = Math.min(100, Math.max(0, score));

  // Update health status based on score
  if (this.healthScore >= 70) {
    this.health = 'Healthy';
  } else if (this.healthScore >= 40) {
    this.health = 'Needs Attention';
  } else {
    this.health = 'At Risk';
  }
};

companySchema.methods.addContact = function(contactData) {
  // If this is the first contact or marked as primary, make it primary
  if (this.contacts.length === 0 || contactData.isPrimary) {
    // Remove primary from all other contacts
    this.contacts.forEach(contact => contact.isPrimary = false);
    contactData.isPrimary = true;
  }

  this.contacts.push(contactData);
  return this.save();
};

companySchema.methods.updateActivity = function(type) {
  this.lastActivity = new Date();
  this.totalInteractions = (this.totalInteractions || 0) + 1;

  switch (type) {
    case 'meeting':
      this.meetingsCount = (this.meetingsCount || 0) + 1;
      break;
    case 'call':
      this.callsCount = (this.callsCount || 0) + 1;
      break;
    case 'email':
      this.emailsCount = (this.emailsCount || 0) + 1;
      break;
  }

  return this.save();
};

companySchema.methods.getRevenueMetrics = function() {
  return {
    arr: this.arr || 0,
    ltv: this.ltv || 0,
    cac: this.cac || 0,
    contractValue: this.contractValue || 0,
    ltvCacRatio: this.cac > 0 ? (this.ltv / this.cac).toFixed(2) : 'N/A'
  };
};

// Static methods
companySchema.statics.findByOwner = function(ownerId, filters = {}) {
  const query = { owner: ownerId, ...filters };
  return this.find(query).populate('owner', 'name email avatar').populate('team', 'name email avatar');
};

companySchema.statics.getCompaniesByHealth = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$health',
        count: { $sum: 1 },
        totalARR: { $sum: '$arr' },
        avgHealthScore: { $avg: '$healthScore' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

companySchema.statics.getTopPerformers = function(limit = 10) {
  return this.find({ relationshipStage: { $ne: 'Churned' } })
    .sort({ arr: -1 })
    .limit(limit)
    .populate('owner', 'name email');
};

companySchema.statics.getAtRiskCompanies = function(limit = 10) {
  return this.find({ health: 'At Risk' })
    .sort({ healthScore: 1, lastActivity: 1 })
    .limit(limit)
    .populate('owner', 'name email');
};

companySchema.statics.getIndustryBreakdown = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$industry',
        count: { $sum: 1 },
        totalARR: { $sum: '$arr' },
        avgARR: { $avg: '$arr' }
      }
    },
    { $match: { _id: { $ne: null } } },
    { $sort: { totalARR: -1 } }
  ]);
};

module.exports = mongoose.model('Company', companySchema);