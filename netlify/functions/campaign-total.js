// Live total for the capital campaign bar on donate.html.
// Total = gifts received outside Stripe (CAMPAIGN_OFFLINE env var, default below)
// + completed Stripe Checkout Sessions whose client_reference_id is "capital-campaign"
// (the "Give to the Campaign" button on donate.html adds that tag).
// Needs a Stripe restricted key with read-only access to Checkout Sessions,
// saved in Netlify as the environment variable STRIPE_CAMPAIGN_KEY.
// Without the key, the bar shows the offline figure.
const GOAL = Number(process.env.CAMPAIGN_GOAL || 150000);
const OFFLINE = Number(process.env.CAMPAIGN_OFFLINE || 17000);
const START = Math.floor(Date.parse('2026-10-15T00:00:00Z') / 1000);
const REF = 'capital-campaign';

exports.handler = async () => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300',
  };
  const key = process.env.STRIPE_CAMPAIGN_KEY;
  let cents = 0, gifts = 0, live = false;
  if (key) {
    try {
      let after = null;
      for (let page = 0; page < 20; page++) {
        const q = new URLSearchParams({ limit: '100', status: 'complete', 'created[gte]': String(START) });
        if (after) q.set('starting_after', after);
        const r = await fetch('https://api.stripe.com/v1/checkout/sessions?' + q, {
          headers: { Authorization: 'Bearer ' + key },
        });
        if (!r.ok) throw new Error('Stripe ' + r.status);
        const j = await r.json();
        for (const s of j.data) {
          if (s.client_reference_id === REF && s.payment_status === 'paid' && s.currency === 'usd') {
            cents += s.amount_total || 0;
            gifts++;
          }
        }
        if (!j.has_more || !j.data.length) break;
        after = j.data[j.data.length - 1].id;
      }
      live = true;
    } catch (e) {
      // fall back to the offline figure
    }
  }
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ goal: GOAL, raised: OFFLINE + Math.round(cents / 100), gifts, live }),
  };
};
