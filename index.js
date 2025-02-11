import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const subDistributors = [
'https://timpo.onrender.com/forward-requests',
'https://hvi1.onrender.com/forward-requests',
'https://api9-nqqm.onrender.com/forward-requests',
'https://hing.onrender.com/forward-requests',
'https://pomb.onrender.com/forward-requests',
];

app.post('/forward-requests', (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).send('Access token is required');
  }

  const promises = subDistributors.map(url =>
    axios.post(url, { accessToken })
      .then(response => ({
        url,
        status: response.status,
        data: response.data,
      }))
      .catch(err => ({
        url,
        error: err.message,
        status: err.response ? err.response.status : 'Unknown',
        data: err.response ? err.response.data : 'No response data',
      }))
  );

  Promise.all(promises)
    .then(results => {
      console.log('Results:', results);
      res.status(200).send('Requests forwarded by main distributor');
    })
    .catch(err => {
      console.error('Error occurred while forwarding requests:', err);
      res.status(500).send('Error occurred while forwarding requests');
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Main distributor server listening on port ${port}`);
});
