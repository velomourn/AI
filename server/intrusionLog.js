import fs from 'fs';
export function logSuspiciousActivity(info) {
  const log = `[${new Date().toISOString()}] ${JSON.stringify(info)}\n`;
  fs.appendFileSync('intrusion.log', log, 'utf8');
}