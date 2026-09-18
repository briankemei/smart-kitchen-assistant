const express = require('express');
const cors = require('cors');
const { 
  getUser, 
  updateUser, 
  getSubscription, 
  updateSubscription, 
  cancelSubscription 
} = require('./db/dbManager.cjs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    database: 'connected (JSON-ACID)', 
    timestamp: new Date().toISOString() 
  });
});

// Get User Profile & Subscription
app.get('/api/user/profile', (req, res) => {
  const userId = req.query.userId || 'usr-1';
  const user = getUser(userId);
  const subscription = getSubscription(userId);
  res.json({ success: true, user, subscription });
});

// Update User Profile (Saves information to database)
app.post('/api/user/profile', (req, res) => {
  const userId = req.body.id || 'usr-1';
  const updates = req.body;
  
  if (!updates.name || !updates.email) {
    return res.status(400).json({ success: false, error: 'Name and email are required.' });
  }

  const updatedUser = updateUser(userId, updates);
  res.json({ 
    success: true, 
    message: 'User profile successfully saved to database.', 
    user: updatedUser 
  });
});

// Get Active Subscription
app.get('/api/subscription', (req, res) => {
  const userId = req.query.userId || 'usr-1';
  const subscription = getSubscription(userId);
  res.json({ success: true, subscription });
});

// Upgrade or change subscription tier
app.post('/api/subscription/upgrade', (req, res) => {
  const { userId = 'usr-1', tier, billingCycle, paymentMethod, pricePerMonth } = req.body;
  
  if (!tier || !billingCycle) {
    return res.status(400).json({ success: false, error: 'Tier and billingCycle required.' });
  }

  const updatedSub = updateSubscription(userId, {
    tier,
    billingCycle,
    paymentMethod,
    pricePerMonth: Number(pricePerMonth) || 0,
  });

  res.json({ 
    success: true, 
    message: `Successfully upgraded to ${tier.toUpperCase()} tier!`, 
    subscription: updatedSub 
  });
});

// Cancel subscription
app.post('/api/subscription/cancel', (req, res) => {
  const userId = req.body.userId || 'usr-1';
  const sub = cancelSubscription(userId);
  res.json({ 
    success: true, 
    message: 'Subscription has been canceled. Downgraded to free tier.', 
    subscription: sub 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 KitchenSync Database API server running on http://localhost:${PORT}`);
});

