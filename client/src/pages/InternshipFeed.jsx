import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import JobsTable from '../components/JobsTable.jsx';
import { API_URL } from '../config.js';

export default function InternshipFeed() {
  const [jobs, setJobs] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/jobs`)
      .then((res) => res.json())
      .then(setJobs)
      .catch(() => setError('Could not load internships.'));
  }, []);

  if (!jobs && !error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full px-4 sm:px-6 lg:px-12 pt-16 sm:pt-24 pb-10 sm:pb-16"
    >
      <h1 className="text-3xl font-bold mb-6">Internship Feed</h1>
      {error ? (
        <p className="text-(--color-accent)">{error}</p>
      ) : (
        <JobsTable jobs={jobs} />
      )}
    </motion.div>
  );
}