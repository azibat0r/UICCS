import JobsTable from '../components/JobsTable.jsx';

export default function InternshipFeed() {
  return (
    <div className="w-full px-6 lg:px-12 py-16">
      <h1 className="text-3xl font-bold mb-6">Internship Feed</h1>
      <JobsTable />
    </div>
  );
}