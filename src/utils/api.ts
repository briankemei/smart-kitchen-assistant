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

export async function saveUserProfileToDb(profile: Partial<UserProfile>): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/user/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to save profile`);
  const data = await res.json();
  if (data.success && data.user) {
    return data.user;
  }
  throw new Error(data.message || 'Unknown database save error');
}

export async function upgradeSubscriptionInDb(params: {
  tier: SubscriptionTier;
  billingCycle: BillingCycle;
  paymentMethod: string;
  pricePerMonth: number;
}): Promise<Subscription> {
  const res = await fetch(`${API_BASE_URL}/subscription/upgrade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to update subscription`);
  const data = await res.json();
  if (data.success && data.subscription) {
    return data.subscription;
  }
  throw new Error(data.message || 'Unknown subscription upgrade error');
}

export async function cancelSubscriptionInDb(): Promise<Subscription> {
  const res = await fetch(`${API_BASE_URL}/subscription/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'usr-1' }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to cancel subscription`);
  const data = await res.json();
  if (data.success && data.subscription) {
    return data.subscription;
  }
  throw new Error(data.message || 'Unknown subscription cancellation error');
}


