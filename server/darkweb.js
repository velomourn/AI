import tr from 'tor-request';

export async function fetchOnion(url) {
  return new Promise((resolve, reject) => {
    tr.request(url, function (err, res, body) {
      if (err) return reject(`Dark web error: ${err.message}`);
      if (res && res.statusCode !== 200) return reject(`Dark web request failed with status ${res.statusCode}`);
      resolve(body);
    });
  });
}