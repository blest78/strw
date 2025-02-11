import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const subDistributors = [
'https://timpo.onrender.com',
'https://hvi1.onrender.com',
'https://api9-nqqm.onrender.com',
'https://hing.onrender.com',
'https://pomb.onrender.com',
];

app.post('/forward-requests', (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).send('Access token is required');
  }

  const promises = subDistributors.map(url =>
    axios.post(url, { accessToken })
  );

  Promise.all(promises)
    .then(() => res.status(200).send('Requests forwarded by main distributor'))
    .catch(err => {
      console.error(err);
      res.status(500).send('Error occurred while forwarding requests');
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Main distributor server listening on port ${port}`);
});
