exports.handler = async function (event) {
  // Use env vars server-side — credentials never exposed to volunteers
  const appId = process.env.PCO_APP_ID;
  const secret = process.env.PCO_SECRET;

  // Allow admin override from request body if provided
  const body = JSON.parse(event.body || '{}');
  const finalId = body.appId || appId;
  const finalSecret = body.secret || secret;
  const path = body.path;

  if (!path) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing path' }) };
  }
  if (!finalId || !finalSecret) {
    return { statusCode: 500, body: JSON.stringify({ error: 'PCO credentials not configured' }) };
  }

  const base64 = Buffer.from(`${finalId}:${finalSecret}`).toString('base64');

  try {
    const res = await fetch(`https://api.planningcenteronline.com${path}`, {
      headers: {
        Authorization: `Basic ${base64}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
