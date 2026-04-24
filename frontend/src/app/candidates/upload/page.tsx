'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, FileSpreadsheet, FileJson, FileText } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import UploadZone from '@/components/candidates/UploadZone';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { uploadCandidateFile, uploadResumePDFs } from '@/lib/api';
import toast from 'react-hot-toast';

type Tab = 'csv-json' | 'pdf';

function UploadPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('csv-json');
  const [jobId, setJobId] = useState(searchParams.get('jobId') || '');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!jobId.trim()) { toast.error('Please enter a Job ID'); return; }
    if (!files.length) { toast.error('Please select at least one file'); return; }
    setLoading(true);
    try {
      let res;
      if (tab === 'csv-json') {
        res = await uploadCandidateFile(jobId, files[0]);
        toast.success(`${res.data?.inserted ?? 'Some'} candidates imported from ${files[0].name}`);
      } else {
        res = await uploadResumePDFs(jobId, files);
        toast.success(`${res.data?.inserted ?? files.length} resumes imported`);
      }
      router.push(`/jobs/${jobId}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'csv-json', label: 'CSV / JSON', icon: FileSpreadsheet },
    { id: 'pdf', label: 'PDF Resumes', icon: FileText },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/jobs" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Jobs
        </Link>
        <PageHeader title="Upload Candidates" subtitle="Import candidates via CSV, JSON, or PDF resumes" />
      </div>

      <Card>
        <CardHeader>
          <Input
            label="Job ID"
            value={jobId}
            onChange={e => setJobId(e.target.value)}
            placeholder="Paste the Job ID from the job detail page"
            hint="You can find this in the URL: /jobs/{jobId}"
          />
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setFiles([]); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  tab === t.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>

          {/* Upload zones */}
          {tab === 'csv-json' ? (
            <div className="space-y-4">
              <UploadZone
                accept=".csv,.json"
                onFiles={f => setFiles(f)}
                label="Drop your CSV or JSON file here"
                hint="Supported: .csv, .json — max 10MB"
              />

              {/* Format guide */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 space-y-2">
                <p className="font-semibold text-gray-700 flex items-center gap-1">
                  <FileJson className="w-3.5 h-3.5" /> Expected CSV/JSON columns:
                </p>
                <p className="font-mono text-gray-500">
                  name, email, phone, skills (comma-separated), experience_years, education, category, resume_text
                </p>
                <p className="text-gray-400">Download our <span className="text-brand-600 cursor-pointer hover:underline">sample template</span> to get started.</p>
              </div>
            </div>
          ) : (
            <UploadZone
              accept=".pdf"
              multiple
              onFiles={f => setFiles(f)}
              label="Drop PDF resumes here (up to 20)"
              hint="Supported: .pdf — max 5MB each. Text will be extracted automatically."
            />
          )}

          <Button
            onClick={handleUpload}
            loading={loading}
            disabled={!files.length || !jobId}
            size="lg"
            className="w-full"
          >
            {loading ? 'Uploading…' : `Upload ${files.length ? `(${files.length} file${files.length > 1 ? 's' : ''})` : ''}`}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default function CandidateUploadPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full" /></div>}>
      <UploadPageContent />
    </Suspense>
  );
}
