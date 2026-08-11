const localtunnel = require('localtunnel');

(async () => {
  const tunnel = await localtunnel({ port: 9040 });
  console.log(tunnel.url);
  const fs = require('fs');
  fs.writeFileSync('tunnel_url.txt', tunnel.url);

  tunnel.on('close', () => {
    console.log('tunnel closed');
  });
})();
