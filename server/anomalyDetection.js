const recentIPs = {};

export function anomalyDetection(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  recentIPs[ip] = recentIPs[ip] || [];
  recentIPs[ip] = recentIPs[ip].filter(ts => now - ts < 60000);
  recentIPs[ip].push(now);

  if (recentIPs[ip].length > 30) {
    // Too many requests in 1 minute = suspicious
    logSuspiciousActivity({ ip, reason: 'Possible intrusion: too many requests' });
  }
  next();
}