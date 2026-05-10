exports.handler = async function (event) {
  const { path, appId, secret } = JSON.parse(event.body || '{}');

  if (!path || !appId || !secret) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing params' }) };
  }

  const base64 = Buffer.from(`${appId}:${secret}`).toString('base64');

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
