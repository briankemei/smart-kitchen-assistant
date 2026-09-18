const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.json');

function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = { users: [], subscriptions: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file:', err);
    return { users: [], subscriptions: [] };
  }
}

function writeDb(data) {
  try {
    const tmpPath = `${DB_PATH}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpPath, DB_PATH);
  } catch (err) {
    console.error('Error writing to database:', err);
    throw err;
  }
}

function getUser(userId = 'usr-1') {
  const db = readDb();
  return db.users.find((u) => u.id === userId) || null;
}

function updateUser(userId = 'usr-1', updates) {
  const db = readDb();
  let user = db.users.find((u) => u.id === userId);

  if (!user) {
    user = {
      id: userId,
      name: updates.name || 'User',
      email: updates.email || '',
      avatar: updates.avatar || '👨‍🍳',
      fitnessGoal: updates.fitnessGoal || 'muscle_hypertrophy',
      dietaryPreference: updates.dietaryPreference || 'high_protein_athletic',
      dailyCalorieGoal: updates.dailyCalorieGoal || 2200,
      targetProteinGrams: updates.targetProteinGrams || 160,
      targetCarbsGrams: updates.targetCarbsGrams || 200,
      targetFatGrams: updates.targetFatGrams || 65,
      connectedWearable: updates.connectedWearable || 'Apple Watch',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.users.push(user);
  } else {
    Object.assign(user, updates, { updatedAt: new Date().toISOString() });
  }

  writeDb(db);
  return user;
}

function getSubscription(userId = 'usr-1') {
  const db = readDb();
  let sub = db.subscriptions.find((s) => s.userId === userId);
  if (!sub) {
    sub = {
      id: `sub-${Date.now()}`,
      userId,
      tier: 'free',
      status: 'active',
      billingCycle: 'monthly',
      pricePerMonth: 0,
      renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod: 'Free Tier',
      invoices: [],
    };
    db.subscriptions.push(sub);
    writeDb(db);
  }
  return sub;
}

function updateSubscription(userId = 'usr-1', { tier, billingCycle, paymentMethod, pricePerMonth }) {
  const db = readDb();
  let sub = db.subscriptions.find((s) => s.userId === userId);

  const renewsDays = billingCycle === 'annual' ? 365 : 30;
  const renewsDate = new Date(Date.now() + renewsDays * 24 * 60 * 60 * 1000).toISOString();

  const newInvoice = {
    id: `inv-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    amount: pricePerMonth * (billingCycle === 'annual' ? 12 : 1),
    planName: `KitchenSync ${tier.toUpperCase()} (${billingCycle})`,
    status: 'paid',
    paymentMethod: paymentMethod || '•••• 4242 (Visa)',
  };

  if (!sub) {
    sub = {
      id: `sub-${Date.now()}`,
      userId,
      tier,
      status: 'active',
      billingCycle,
      pricePerMonth,
      renewsAt: renewsDate,
      paymentMethod: paymentMethod || '•••• 4242 (Visa)',
      invoices: [newInvoice],
    };
    db.subscriptions.push(sub);
  } else {
    sub.tier = tier;
    sub.status = 'active';
    sub.billingCycle = billingCycle;
    sub.pricePerMonth = pricePerMonth;
    sub.renewsAt = renewsDate;
    if (paymentMethod) sub.paymentMethod = paymentMethod;
    if (!sub.invoices) sub.invoices = [];
    sub.invoices.unshift(newInvoice);
  }

  writeDb(db);
  return sub;
}

function cancelSubscription(userId = 'usr-1') {
  const db = readDb();
  let sub = db.subscriptions.find((s) => s.userId === userId);
  if (sub) {
    sub.status = 'canceled';
    sub.tier = 'free';
    sub.pricePerMonth = 0;
    writeDb(db);
  }
  return sub;
}

module.exports = {
  readDb,
  writeDb,
  getUser,
  updateUser,
  getSubscription,
  updateSubscription,
  cancelSubscription,
};

