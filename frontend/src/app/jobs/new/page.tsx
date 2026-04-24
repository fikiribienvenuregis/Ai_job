'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import JobForm from '@/components/jobs/JobForm';
import { createJob } from '@/lib/api';
import { JobFormData } from '@/types/job';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: JobFormData) => {
    setLoading(true);
    try {
      const job = await createJob(data);
      toast.success('Job created successfully!');
      router.push(`/jobs/${job._id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/jobs" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Jobs
        </Link>
        <PageHeader title="Create New Job" subtitle="Define the role requirements for AI-powered screening" />
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-800">Job Details</h2>
        </CardHeader>
        <CardBody>
          <JobForm onSubmit={handleSubmit} loading={loading} />
        </CardBody>
      </Card>
    </div>
  );
}
