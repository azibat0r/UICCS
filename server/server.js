const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const connectDB = require('./config/db');
const jobsRouter = require('./routes/jobs');
const { syncInternships } = require('./services/githubSync');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));app.use(express.json());

app.use('/api/jobs', jobsRouter);

const PORT = process.env.PORT || 4000;

const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');

app.use(cookieParser());
app.use('/api/auth', authRouter);

const groupsRouter = require('./routes/groups');
app.use('/api/groups', groupsRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  syncInternships(); // run once immediately so the feed isn't empty

  
  cron.schedule('0 */6 * * *', () => {
    console.log('[cron] Running scheduled sync...');
    syncInternships();
  });
});
