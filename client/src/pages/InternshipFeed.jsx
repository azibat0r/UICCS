import JobsTable from '../components/JobsTable.jsx';

export default function InternshipFeed() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">Internship Feed</h1>
      <JobsTable />
    </div>
  );
}