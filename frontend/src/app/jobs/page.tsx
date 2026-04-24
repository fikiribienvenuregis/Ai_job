'use client';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import JobCard from '@/components/jobs/JobCard';
import Spinner from '@/components/ui/Spinner';
import { useJobs } from '@/hooks/useJobs';

export default function JobsPage() {
  const { jobs, loading, error } = useJobs();
  const [search, setSearch] = useState('');

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        subtitle={`${jobs.length} position${jobs.length !== 1 ? 's' : ''} created`}
        action={
          <Link href="/jobs/new">
            <Button>
              <Plus className="w-4 h-4" />
              New Job
            </Button>
          </Link>
        }
      />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search jobs…"
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner label="Loading jobs…" />
        </div>
      ) : error ? (
        <p className="text-red-600 text-sm">{error}</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="font-medium">{search ? 'No jobs match your search' : 'No jobs yet'}</p>
          {!search && (
            <Link href="/jobs/new">
              <Button className="mt-4" variant="outline" size="sm">
                <Plus className="w-4 h-4" /> Create your first job
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(job => <JobCard key={job._id} job={job} />)}
        </div>
      )}
    </div>
  );
}
