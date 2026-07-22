import { useEffect, useState } from 'react';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
}

export default function JobsTable() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch(() => setError('Could not load internships.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-(--color-text-muted)">Loading roles…</p>;
  if (error) return <p className="text-(--color-accent)">{error}</p>;

  return (
    <div className="overflow-x-auto rounded-xl border border-(--color-border)">
      <table className="w-full text-left text-sm">
        <thead className="bg-(--color-surface) text-(--color-text-muted)">
          <tr>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Application/Link</th>
            <th className="px-4 py-3">Date Posted</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id} className="border-t border-(--color-border)">
              <td className="px-4 py-4 font-medium">{job.company}</td>
              <td className="px-4 py-4">{job.title}</td>
              <td className="px-4 py-4 text-(--color-text-muted)">{job.locations?.join(', ')}</td>
              <td className="px-4 py-4">
                <a href={job.url} target="_blank" rel="noreferrer" className="rounded-md bg-(--color-surface) border border-(--color-border) px-3 py-1.5 text-xs hover:border-(--color-accent) transition">Apply</a>
              </td>
              <td className="px-4 py-4 text-(--color-text-muted)">{formatDate(job.datePosted)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}