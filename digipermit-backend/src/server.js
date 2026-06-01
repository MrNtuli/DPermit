require('dotenv').config();
const app = require('./app');
const env = require('./config/env');
const { startExpiryJob } = require('./jobs/expiryCheckJob');

const PORT = env.port;

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`DigiPermit API running on http://localhost:${PORT}`);
  console.log(`Environment: ${env.nodeEnv}`);
  startExpiryJob();
});
