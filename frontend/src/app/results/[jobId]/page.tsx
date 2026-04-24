'use client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Trophy, TrendingUp, Users, BrainCircuit, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import RankedList from '@/components/results/RankedList';
import ScreeningButton from '@/components/results/ScreeningButton';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { useScreening } from '@/hooks/useScreening';
import { getJob } from '@/lib/api';
import { Job } from '@/types/job';
import { ScreeningResult } from '@/types/candidate';

function ResultStat({ label, value, icon: Icon, color }: {
  label: string; value: string | number; icon: React.ElementType; color: string;
}) {
  return (
    <div className="text-center">
      <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function ScoreDistribution({ results }: { results: ScreeningResult[] }) {
  const counts = {
    Excellent: results.filter(r => r.compositeScore >= 80).length,
    Good: results.filter(r => r.compositeScore >= 60 && r.compositeScore < 80).length,
    Fair: results.filter(r => r.compositeScore >= 40 && r.compositeScore < 60).length,
    Poor: results.filter(r => r.compositeScore < 40).length,
  };

  const bars: { label: string; count: number; color: string }[] = [
    { label: 'Excellent (80+)', count: counts.Excellent, color: 'bg-green-500' },
    { label: 'Good (60-79)', count: counts.Good, color: 'bg-blue-500' },
    { label: 'Fair (40-59)', count: counts.Fair, color: 'bg-yellow-500' },
    { label: 'Poor (<40)', count: counts.Poor, color: 'bg-red-400' },
  ];

  const total = results.length || 1;

  return (
    <div className="space-y-2">
      {bars.map(b => (
        <div key={b.label} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-28 flex-shrink-0">{b.label}</span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${b.color} transition-all duration-500`}
              style={{ width: `${(b.count / total) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-700 w-4 flex-shrink-0">{b.count}</span>
        </div>
      ))}
    </div>
  );
}

export default function ResultsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();
  const { results, loading, error, refetch } = useScreening(jobId);
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    getJob(jobId).then(setJob).catch(() => {});
  }, [jobId]);

  const avgScore = results.length
    ? Math.round(results.reduce((sum, r) => sum + r.compositeScore, 0) / results.length)
    : 0;

  const topCandidate = results[0];
  const stronglyRecommended = results.filter(r => r.recommendation === 'Strongly Recommend').length;

  const exportCSV = () => {
    const headers = ['Rank', 'Name', 'Email', 'Score', 'Label', 'Recommendation', 'Skills Score', 'Experience Score'];
    const rows = results.map(r => [
      r.rank,
      r.candidateId?.name,
      r.candidateId?.email,
      r.compositeScore,
      r.label,
      r.recommendation,
      r.skillScore,
      r.experienceScore,
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `screening-results-${jobId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <Link href={`/jobs/${jobId}`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Job
        </Link>
        <PageHeader
          title={`AI Screening Results${job ? ` — ${job.title}` : ''}`}
          subtitle={results.length ? `${results.length} candidates screened and ranked by Gemini AI` : 'No results yet'}
          action={
            <div className="flex items-center gap-2">
              {results.length > 0 && (
                <Button variant="outline" size="sm" onClick={exportCSV}>
                  <Download className="w-4 h-4" /> Export CSV
                </Button>
              )}
              <ScreeningButton jobId={jobId} onComplete={refetch} />
            </div>
          }
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner label="Loading results…" />
        </div>
      ) : error ? (
        <p className="text-red-600 text-sm">{error}</p>
      ) : results.length === 0 ? (
        <Card className="text-center">
          <CardBody className="py-16">
            <BrainCircuit className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <p className="font-semibold text-gray-600 text-lg">No screening results yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-6">
              Make sure candidates are uploaded to this job, then run AI screening.
            </p>
            <ScreeningButton jobId={jobId} onComplete={refetch} />
          </CardBody>
        </Card>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card><CardBody><ResultStat label="Candidates" value={results.length} icon={Users} color="text-brand-600" /></CardBody></Card>
            <Card><CardBody><ResultStat label="Avg. Score" value={avgScore} icon={TrendingUp} color="text-blue-600" /></CardBody></Card>
            <Card><CardBody><ResultStat label="Top Score" value={topCandidate?.compositeScore ?? '—'} icon={Trophy} color="text-yellow-500" /></CardBody></Card>
            <Card><CardBody><ResultStat label="Strongly Rec." value={stronglyRecommended} icon={BrainCircuit} color="text-green-600" /></CardBody></Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Score distribution */}
            <Card className="lg:col-span-1">
              <CardHeader><h3 className="font-semibold text-gray-800">Score Distribution</h3></CardHeader>
              <CardBody><ScoreDistribution results={results} /></CardBody>
            </Card>

            {/* Top candidate spotlight */}
            {topCandidate && (
              <Card className="lg:col-span-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-gray-800">Top Candidate</h3>
                  </div>
                </CardHeader>
                <CardBody className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xl font-bold text-gray-900">{topCandidate.candidateId?.name}</p>
                      <p className="text-sm text-gray-500">{topCandidate.candidateId?.email}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-3xl font-black text-green-600">{topCandidate.compositeScore}</p>
                      <p className="text-xs text-gray-400">/ 100</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{topCandidate.explanation}</p>
                  <div className="flex flex-wrap gap-1">
                    {topCandidate.strengths.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">{s}</span>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Full ranked list */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Candidates — Ranked</h2>
            <RankedList results={results} />
          </div>
        </>
      )}
    </div>
  );
}
