const https = require('https');
https.get('https://api.codetabs.com/v1/proxy?quest=https://drive.google.com/uc?export=download&id=1cGBcdZRCSZORnNRE7E7kfYRgjEwjQz1t', (res) => {
  console.log('codetabs headers:', res.headers['content-type'], res.statusCode);
});
https.get('https://corsproxy.io/?' + encodeURIComponent('https://drive.google.com/uc?export=download&id=1cGBcdZRCSZORnNRE7E7kfYRgjEwjQz1t'), (res) => {
  console.log('corsproxy headers:', res.headers['content-type'], res.statusCode);
});
