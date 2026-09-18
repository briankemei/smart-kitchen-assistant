import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  HelpCircle, 
  CreditCard, 
  Receipt, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { Subscription, PlanDefinition, BillingCycle, SubscriptionTier } from '../../types';
import { subscriptionPlans, subscriptionFAQs } from '../../data/subscriptionPlans';
import { CheckoutModal } from './CheckoutModal';
import { InvoicesModal } from './InvoicesModal';

interface SubscriptionPlansProps {
  subscription: Subscription;
  onUpgrade: (tier: SubscriptionTier, billingCycle: BillingCycle, paymentMethod: string, price: number) => Promise<void>;
  onCancel: () => Promise<void>;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  subscription,
  onUpgrade,
  onCancel,
}) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(subscription.billingCycle || 'monthly');
  const [checkoutPlan, setCheckoutPlan] = useState<PlanDefinition | null>(null);
  const [isInvoicesOpen, setIsInvoicesOpen] = useState(false);

  const handleCancelClick = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will be downgraded to the Free tier.')) {
      await onCancel();
    }
  };

  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Flexible Subscription & Monetization</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Supercharge Your Kitchen Intelligence
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Move beyond manual logging. Choose the plan that fits your lifestyle—from everyday smart pantry automation to executive biological fuel synchronization.
        </p>

        {/* Current Plan Overview Pill */}
        <div className="pt-2 flex items-center justify-center space-x-3">
          <span className="text-xs text-slate-400">Your Current Status:</span>
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-300 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {subscription.tier} Member
          </span>
          <button
            onClick={() => setIsInvoicesOpen(true)}
            className="text-xs text-slate-400 hover:text-white underline flex items-center gap-1"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>View Invoices</span>
          </button>
        </div>

        {/* Billing Toggle (Monthly / Annual) */}
        <div className="pt-4 flex items-center justify-center">
          <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 inline-flex items-center space-x-1 shadow-inner">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                billingCycle === 'monthly'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
                SAVE 33%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {subscriptionPlans.map((plan) => {
          const isCurrent = subscription.tier === plan.tier;
          const displayPrice = billingCycle === 'annual' ? plan.annualPricePerMonth : plan.monthlyPrice;

          return (
            <div
              key={plan.tier}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                  : 'bg-slate-900/70 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Badges */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white">{plan.name}</h3>
                  {isCurrent && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                      Current Plan
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.tagline}</p>

                {/* Price */}
                <div className="mt-5 pb-5 border-b border-slate-800 flex items-baseline space-x-1.5">
                  <span className="text-4xl font-extrabold text-white font-mono">
                    ${displayPrice === 0 ? '0' : displayPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    / month {billingCycle === 'annual' && displayPrice > 0 && '(billed annually)'}
                  </span>
                </div>

                {/* Features List */}
                <div className="mt-6 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    What's Included:
                  </span>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                      <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Action CTA */}
              <div className="mt-8 pt-4 border-t border-slate-800">
                {isCurrent ? (
                  <div className="space-y-2">
                    <div className="w-full py-2.5 rounded-xl bg-slate-800/80 text-emerald-400 font-bold text-xs text-center border border-slate-700/80">
                      ✓ Active Subscription
                    </div>
                    {subscription.tier !== 'free' && (
                      <button
                        onClick={handleCancelClick}
                        className="w-full text-center text-[11px] text-slate-500 hover:text-rose-400 transition"
                      >
                        Cancel or downgrade subscription
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setCheckoutPlan(plan)}
                    className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition active:scale-98 shadow-md ${
                      plan.popular
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/25'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    <span>{plan.tier === 'free' ? 'Downgrade to Free' : `Upgrade to ${plan.name}`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQs Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm max-w-3xl mx-auto">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
          <HelpCircle className="w-4 h-4" />
          <span>Frequently Asked Questions</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-6">Common Subscription Queries</h3>

        <div className="space-y-4">
          {subscriptionFAQs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <h4 className="text-sm font-bold text-white">{faq.question}</h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutPlan && (
        <CheckoutModal
          isOpen={true}
          plan={checkoutPlan}
          billingCycle={billingCycle}
          onClose={() => setCheckoutPlan(null)}
          onSuccess={async (tier, cycle, paymentMethod, price) => {
            await onUpgrade(tier, cycle, paymentMethod, price);
            setCheckoutPlan(null);
          }}
        />
      )}

      {/* Invoices Modal */}
      <InvoicesModal
        isOpen={isInvoicesOpen}
        subscription={subscription}
        onClose={() => setIsInvoicesOpen(false)}
      />
    </div>
  );
};

