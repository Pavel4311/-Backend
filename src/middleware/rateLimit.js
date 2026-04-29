const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;

const requests = new Map();

const rateLimit = (req, res, next) => {
  const now = Date.now();
  const key = req.ip;
  const entry = requests.get(key);

  if (!entry || now - entry.start >= WINDOW_MS) {
    requests.set(key, { start: now, count: 1 });
    return next();
  }

  if (entry.count >= MAX_REQUESTS) {
    return res.status(429).json({ error: "Too many requests" });
  }

  entry.count += 1;
  return next();
};

module.exports = rateLimit;
