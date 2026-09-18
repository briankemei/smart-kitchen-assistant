import { UserProfile, Subscription, SubscriptionTier, BillingCycle } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export async function fetchUserProfile(): Promise<{ user: UserProfile; subscription: Subscription } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/user/profile`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success) {
      return { user: data.user, subscription: data.subscription };
    }
  } catch (err) {
    console.warn('Backend database API not reachable, using local state fallback', err);
  }
  return null;
}

export async function saveUserProfileToDb(profile: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success) {
      return data.user;
    }
  } catch (err) {
    console.warn('Failed to save user profile to database API', err);
  }
  return null;
}

export async function upgradeSubscriptionInDb(params: {
  tier: SubscriptionTier;
  billingCycle: BillingCycle;
  paymentMethod: string;
  pricePerMonth: number;
}): Promise<Subscription | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/subscription/upgrade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success) {
      return data.subscription;
    }
  } catch (err) {
    console.warn('Failed to update subscription in database API', err);
  }
  return null;
}

export async function cancelSubscriptionInDb(): Promise<Subscription | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/subscription/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'usr-1' }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.success) {
      return data.subscription;
    }
  } catch (err) {
    console.warn('Failed to cancel subscription in database API', err);
  }
  return null;
}

