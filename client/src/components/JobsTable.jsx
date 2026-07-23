import { useEffect, useState } from 'react';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
}

export default function JobsTable() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [appliedIds, setAppliedIds] = useState(() => {
    const saved = localStorage.getItem('appliedJobs');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    fetch('http://localhost:4000/api/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch(() => setError('Could not load internships.'))
      .finally(() => setLoading(false));
  }, []);

  function toggleApplied(jobId) {
    setAppliedIds((prev) => {
      const updated = { ...prev, [jobId]: !prev[jobId] };
      localStorage.setItem('appliedJobs', JSON.stringify(updated));
      return updated;
    });
  }

  const filteredJobs = jobs.filter((job) => {
    const term = search.toLowerCase();
    return (
      job.company?.toLowerCase().includes(term) ||
      job.title?.toLowerCase().includes(term) ||
      job.locations?.some((loc) => loc.toLowerCase().includes(term))
    );
  });

  if (loading) return <p className="text-(--color-text-muted)">Loading roles...</p>;
  if (error) return <p className="text-(--color-accent)">{error}</p>;

  return (
    <div>
      <input
        type="text"
        placeholder="Search by company, role, or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-md rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-accent)"
      />

      <p className="mb-2 text-xs text-(--color-text-muted)">
        Showing {filteredJobs.length} of {jobs.length} internships
      </p>

      <div className="overflow-x-auto rounded-xl border border-(--color-border)">
        <table className="w-full text-left text-sm">
          <thead className="bg-(--color-surface) text-(--color-text-muted)">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Application/Link</th>
              <th className="px-4 py-3">Date Posted</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Applied</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => {
              const isApplied = !!appliedIds[job._id];
              return (
                <tr key={job._id} className="border-t border-(--color-border)">
                  <td className="px-4 py-4 font-medium">{job.company}</td>
                  <td className="px-4 py-4">{job.title}</td>
                  <td className="px-4 py-4 text-(--color-text-muted)">{job.locations?.join(', ')}</td>
                  <td className="px-4 py-4">
                    <a href={job.url} target="_blank" rel="noreferrer" className="rounded-md bg-(--color-surface) border border-(--color-border) px-3 py-1.5 text-xs hover:border-(--color-accent) transition">Apply</a>
                  </td>
                  <td className="px-4 py-4 text-(--color-text-muted)">{formatDate(job.datePosted)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex h-4 w-4 rounded-full border ${isApplied ? 'bg-green-500 border-green-400' : 'bg-red-500 border-red-400'}`} style={{ minWidth: '1rem', minHeight: '1rem' }} />
                  </td>
                  <td className="px-4 py-4">
                    <button onClick={() => toggleApplied(job._id)} className={`rounded-md px-3 py-1.5 text-xs border transition ${isApplied ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-(--color-surface) border-(--color-border) hover:border-(--color-accent)'}`}>
                      Applied
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}