'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, Users, BrainCircuit, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import JobCard from '@/components/jobs/JobCard';
import Spinner from '@/components/ui/Spinner';
import { getJobs } from '@/lib/api';
import { Job } from '@/types/job';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bg: string;
}

function StatCard({ label, value, icon: Icon, color, bg }: StatCardProps) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </CardBody>
    </Card>
  );
}

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs()
      .then(setJobs)
      .finally(() => setLoading(false));
  }, []);

  const openJobs = jobs.filter(j => j.status === 'open').length;
  const screeningJobs = jobs.filter(j => j.status === 'screening').length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your recruitment pipeline"
        action={
          <Link href="/jobs/new">
            <Button size="md">
              <Plus className="w-4 h-4" />
              New Job
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Jobs" value={jobs.length} icon={Briefcase} color="text-brand-600" bg="bg-brand-50" />
        <StatCard label="Open Positions" value={openJobs} icon={TrendingUp} color="text-green-600" bg="bg-green-50" />
        <StatCard label="In Screening" value={screeningJobs} icon={BrainCircuit} color="text-purple-600" bg="bg-purple-50" />
        <StatCard label="Total Candidates" value="—" icon={Users} color="text-blue-600" bg="bg-blue-50" />
      </div>

      {/* Recent Jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
          <Link href="/jobs" className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner label="Loading jobs…" />
          </div>
        ) : jobs.length === 0 ? (
          <Card>
            <CardBody className="text-center py-16">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-600">No jobs yet</p>
              <p className="text-sm text-gray-400 mb-4">Create your first job to start screening candidates</p>
              <Link href="/jobs/new">
                <Button size="sm">
                  <Plus className="w-4 h-4" />
                  Create Job
                </Button>
              </Link>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.slice(0, 6).map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* Quick start */}
      {jobs.length === 0 && !loading && (
        <Card className="border-brand-200 bg-brand-50">
          <CardBody>
            <div className="flex items-start gap-4">
              <BrainCircuit className="w-8 h-8 text-brand-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-brand-900 mb-1">Get started in 3 steps</h3>
                <ol className="text-sm text-brand-800 space-y-1 list-decimal list-inside">
                  <li>Create a job with required skills and experience</li>
                  <li>Upload candidates via CSV, JSON, or PDF resumes</li>
                  <li>Run AI screening and get ranked results instantly</li>
                </ol>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
