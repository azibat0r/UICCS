const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const connectDB = require('./config/db');
const jobsRouter = require('./routes/jobs');
const { syncInternships } = require('./services/githubSync');
const { checkAllSubmissions } = require('./services/submissionCheck');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

app.use('/api/jobs', jobsRouter);

const PORT = process.env.PORT || 4000;

const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');

app.use(cookieParser());
app.use('/api/auth', authRouter);

const groupsRouter = require('./routes/groups');
app.use('/api/groups', groupsRouter);

const surveyRouter = require('./routes/survey');
app.use('/api/survey', surveyRouter);

const submissionsRouter = require('./routes/submissions');
app.use('/api/submissions', submissionsRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  syncInternships();
  checkAllSubmissions();

  cron.schedule('0 * * * *', () => {
    console.log('[cron] Running scheduled internship sync...');
    syncInternships();
  });

  cron.schedule('*/5 * * * *', () => {
    console.log('[cron] Running scheduled submission check...');
    checkAllSubmissions();
  });
});