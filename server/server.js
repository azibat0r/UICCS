const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const jobsRouter = require('./routes/jobs');
const { syncInternships } = require('./services/githubSync');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json());

app.use('/api/jobs', jobsRouter);

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  syncInternships(); // run once immediately so the feed isn't empty
});