const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const organisationRoutes = require('./routes/organisationRoutes');
const userRoutes = require('./routes/userRoutes');
const foreignNationalRoutes = require('./routes/foreignNationalRoutes');
const permitTypeRoutes = require('./routes/permitTypeRoutes');
const permitRoutes = require('./routes/permitRoutes');
const { router: verifyRoutes, logRouter } = require('./routes/verificationRoutes');
const renewalRoutes = require('./routes/renewalRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const alertRoutes = require('./routes/alertRoutes');
const iotRoutes = require('./routes/iotRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

app.use(cors({
  origin: env.frontendUrls,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'DigiPermit API is running', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/organisations', organisationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/foreign-nationals', foreignNationalRoutes);
app.use('/api/permit-types', permitTypeRoutes);
app.use('/api/permits', permitRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/verification-logs', logRouter);
app.use('/api/renewal-update-requests', renewalRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
