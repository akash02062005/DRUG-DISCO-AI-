import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

function loadScript(src) {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function fmt(plan, config) {
  if (plan.price_inr === 0 && plan.price_usd === 0) return { amount: 'Free', period: 'forever' };
  if (config?.currency_usd) {
    return { amount: `$${plan.price_usd}`, period: `/${plan.period}` };
  }
  return { amount: `₹${plan.price_inr.toLocaleString('en-IN')}`, period: `/${plan.period}` };
}

export default function PricingPage() {
  const [plans, setPlans] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyPlan, setBusyPlan] = useState(null);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('dd_user') || 'null'); }
    catch { return null; }
  })();

  useEffect(() => {
    api.listPlans()
       .then((data) => {
         setPlans(data.plans || []);
         setConfig(data.config || null);
       })
       .catch((e) => setError(e?.response?.data?.detail || e.message))
       .finally(() => setLoading(false));
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }, []);

  const refreshUser = (patch) => {
    const next = { ...(user || {}), ...patch };
    localStorage.setItem('dd_user', JSON.stringify(next));
  };

  const startCheckout = async (plan) => {
    setError(null);
    if (!localStorage.getItem('dd_token')) {
      setError('Please sign in before upgrading.');
      return;
    }
    if (plan.id === 'free') {
      showToast('You are already on the Free plan.');
      return;
    }
    setBusyPlan(plan.id);
    try {
      const order = await api.createCheckout(plan.id);

      if (order.provider === 'razorpay') {
        await runRazorpay(order, plan);
      } else if (order.provider === 'stripe') {
        // Redirect to Stripe-hosted checkout
        window.location.href = order.checkout_url;
      } else if (order.provider === 'mock') {
        // Sandbox: auto-verify so the UI flow is demonstrable
        const result = await api.verifyPayment({
          provider: 'mock',
          plan_id: plan.id,
          order_id: order.order_id,
        });
        refreshUser({ tier: result.plan.id, credits: result.plan.credits_per_month });
        showToast(
          `✓ ${plan.name} activated in sandbox mode. ` +
          `Set RAZORPAY_KEY_ID / STRIPE_SECRET_KEY in backend/.env for real payments.`
        );
      } else if (order.provider === 'free') {
        showToast('Free plan — nothing to pay.');
      }
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    } finally {
      setBusyPlan(null);
    }
  };

  const runRazorpay = async (order, plan) => {
    const ok = await loadScript(RAZORPAY_SCRIPT);
    if (!ok) throw new Error('Could not load Razorpay checkout. Check your internet connection.');

    return new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'DrugDisco AI',
        description: `${plan.name} plan subscription`,
        order_id: order.order_id,
        prefill: {
          email: user?.email || '',
          name: user?.name || '',
        },
        theme: { color: '#6d5efc' },
        handler: async (response) => {
          try {
            const result = await api.verifyPayment({
              provider: 'razorpay',
              plan_id: plan.id,
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            refreshUser({ tier: result.plan.id, credits: result.plan.credits_per_month });
            showToast(`✓ ${plan.name} plan activated. Enjoy!`);
            resolve();
          } catch (e) {
            setError(e?.response?.data?.detail || e.message);
            reject(e);
          }
        },
        modal: {
          ondismiss: () => resolve(),
        },
      });
      rzp.on('payment.failed', (resp) => {
        setError(`Payment failed: ${resp.error?.description || resp.error?.code}`);
        reject(new Error(resp.error?.description));
      });
      rzp.open();
    });
  };

  const providerBadge = () => {
    if (!config) return null;
    const p = config.provider;
    const color = p === 'razorpay' ? '#0c2451' : p === 'stripe' ? '#635bff' : '#5d6691';
    const label = p === 'razorpay' ? 'Razorpay' : p === 'stripe' ? 'Stripe' : 'Sandbox';
    return (
      <span style={{
        marginLeft: 12, padding: '4px 10px', borderRadius: 999,
        background: color, color: 'white', fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
      }}>
        {label}
      </span>
    );
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>
            💎 Pricing
            {providerBadge()}
          </h1>
          <p>
            Pick the plan that fits your discovery workflow. Secure checkout powered
            by {config?.provider === 'stripe' ? 'Stripe' : 'Razorpay'}.
          </p>
        </div>
      </div>

      {error && <div className="panel error">⚠ {error}</div>}
      {toast && (
        <div className="panel success" style={{ borderLeft: '4px solid #22d3ee' }}>
          {toast}
        </div>
      )}

      {loading ? (
        <div className="panel"><span className="loader" /> Loading plans…</div>
      ) : (
        <div className="pricing-grid">
          {plans.map((plan) => {
            const { amount, period } = fmt(plan, config);
            const featured = plan.id === 'pro';
            const current = user?.tier === plan.id;
            return (
              <div key={plan.id} className={`price-card ${featured ? 'featured' : ''}`}>
                {featured && <div className="featured-tag">Most Popular</div>}
                {current && (
                  <div className="featured-tag" style={{ background: '#22d3ee', color: '#0a0e1f' }}>
                    Current Plan
                  </div>
                )}
                <div className="tier-name">{plan.name}</div>
                <div className="price">{amount}<small>{period}</small></div>
                <div style={{ fontSize: 12, color: '#8a94c3', marginBottom: 10 }}>
                  {plan.credits_per_month.toLocaleString()} credits / month
                </div>
                <ul>{plan.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
                <button
                  className="primary"
                  style={{ width: '100%' }}
                  disabled={busyPlan === plan.id || current}
                  onClick={() => startCheckout(plan)}
                >
                  {busyPlan === plan.id ? (
                    <><span className="loader" /> Opening checkout…</>
                  ) : current ? (
                    'Active'
                  ) : plan.id === 'free' ? (
                    'Get Started'
                  ) : plan.id === 'enterprise' ? (
                    'Upgrade to Enterprise'
                  ) : (
                    `Upgrade — ${amount}${period}`
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="panel" style={{ marginTop: 24 }}>
        <h2 style={{ marginTop: 0 }}>🔒 Secure payments</h2>
        <p className="help">
          All payments are processed through PCI-DSS compliant gateways. DrugDisco AI never
          stores card details. Razorpay supports UPI, net banking, cards, and wallets for
          Indian customers; Stripe supports credit/debit cards globally.
        </p>
        <p className="help">
          Need a custom enterprise quote, on-prem deployment, or team billing?{' '}
          <a href="mailto:sales@drugdisco.ai" style={{ color: '#22d3ee' }}>
            sales@drugdisco.ai
          </a>
        </p>
      </div>
    </div>
  );
}
