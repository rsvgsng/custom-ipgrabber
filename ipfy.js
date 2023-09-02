const express = require('express');
const dns = require('dns');
const app = express();
require('isomorphic-fetch');
const cors = require('cors')
app.use(cors())
function formatIP(ip) {
  const regex = /^(?:https?:\/\/)?([^/]+)(?:\/|$)/;
  const match = ip.match(regex);
  return (match[1]);
}
app.get('/', (req, res) => {
  if (!req.query.ip) return res.status(500).json({
    message: "Invalid Params",
    code: 500
  })

  let formattedIp = formatIP(req.query.ip)
  dns.lookup(formattedIp, async (err, address, family) => {
    if (err) {
      res.status(500).send({
        ip: null,
        message: "Invalid Hostname"
      });
    } else {
      let a = await fetch(`https://api.findip.net/${address}/?token=c15c975411174d2e8110c6bd7e88979c`)
      let b = await a.json()
      let result = [b, address]
      res.status(200).send(result)
    }
  });
});
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
