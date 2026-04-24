'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft, MapPin, Clock, GraduationCap,
  Upload, BarChart2, Trash2, Users
} from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import CandidateTable from '@/components/candidates/CandidateTable';
import ScreeningButton from '@/components/results/ScreeningButton';
import { getJob, deleteJob } from '@/lib/api';
import { useCandidates } from '@/hooks/useCandidates';
import { Job } from '@/types/job';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

const statusVariant: Record<Job['status'], 'green' | 'yellow' | 'gray'> = {
  open: 'green', screening: 'yellow', closed: 'gray',
};

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { candidates, loading: candLoading, refetch } = useCandidates(id);

  useEffect(() => {
    getJob(id)
      .then(setJob)
      .catch(() => toast.error('Job not found'))
      .finally(() => setJobLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this job and all its candidates? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteJob(id);
      toast.success('Job deleted');
      router.push('/jobs');
    } catch {
      toast.error('Failed to delete job');
      setDeleting(false);
    }
  };

  if (jobLoading) return <div className="flex justify-center py-20"><Spinner label="Loading job…" /></div>;
  if (!job) return <p className="text-red-600">Job not found.</p>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <Link href="/jobs" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Jobs
        </Link>
        <PageHeader
          title={job.title}
          subtitle={`Created ${formatDate(job.createdAt)}`}
          action={
            <div className="flex items-center gap-2">
              <Link href={`/candidates/upload?jobId=${id}`}>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4" /> Upload Candidates
                </Button>
              </Link>
              <Link href={`/results/${id}`}>
                <Button variant="secondary" size="sm">
                  <BarChart2 className="w-4 h-4" /> View Results
                </Button>
              </Link>
              <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          }
        />
      </div>

      {/* Job info cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Overview */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-800">Overview</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Badge variant={statusVariant[job.status]}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-gray-400" />{job.jobType}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" />{job.location}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <GraduationCap className="w-4 h-4 text-gray-400" />
              {job.educationLevel === 'Any' ? 'Any education level' : `${job.educationLevel}'s degree required`}
            </div>
            <p className="text-sm text-gray-600">Min. {job.experienceYears} year{job.experienceYears !== 1 ? 's' : ''} of experience</p>
            <p className="text-sm text-gray-700 leading-relaxed">{job.description}</p>
          </CardBody>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-800">Skills</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Required</p>
              <div className="flex flex-wrap gap-1.5">
                {job.requiredSkills.length ? job.requiredSkills.map(s => (
                  <span key={s} className="px-2.5 py-1 bg-brand-100 text-brand-800 rounded-full text-xs font-medium">{s}</span>
                )) : <span className="text-sm text-gray-400">None specified</span>}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Preferred</p>
              <div className="flex flex-wrap gap-1.5">
                {job.preferredSkills.length ? job.preferredSkills.map(s => (
                  <span key={s} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{s}</span>
                )) : <span className="text-sm text-gray-400">None specified</span>}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* AI Screening CTA */}
      <Card className="border-brand-200 bg-gradient-to-r from-brand-50 to-white">
        <CardBody className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-900">Ready to screen {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}?</p>
            <p className="text-sm text-gray-500 mt-0.5">
              Gemini AI will evaluate each candidate against the job requirements and rank them.
            </p>
          </div>
          <ScreeningButton
            jobId={id}
            onComplete={() => router.push(`/results/${id}`)}
          />
        </CardBody>
      </Card>

      {/* Candidates table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              Candidates
              <span className="ml-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                {candidates.length}
              </span>
            </h3>
            <Link href={`/candidates/upload?jobId=${id}`}>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4" /> Upload More
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {candLoading ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : (
            <CandidateTable candidates={candidates} />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
