import Link from 'next/link';
import { Job } from '@/types/job';
import { MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface JobCardProps { job: Job; candidateCount?: number; }

const statusVariant: Record<Job['status'], 'green' | 'yellow' | 'gray'> = {
  open: 'green', screening: 'yellow', closed: 'gray',
};

export default function JobCard({ job, candidateCount = 0 }: JobCardProps) {
  return (
    <Link href={`/jobs/${job._id}`} className="block group">
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-brand-300 hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors truncate">
                {job.title}
              </h3>
              <Badge variant={statusVariant[job.status]}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{job.description}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {job.requiredSkills.slice(0, 4).map(s => (
                <span key={s} className="px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full text-xs font-medium">
                  {s}
                </span>
              ))}
              {job.requiredSkills.length > 4 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                  +{job.requiredSkills.length - 4}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.jobType}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{candidateCount} candidates</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-500 transition-colors flex-shrink-0 mt-1" />
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
          Created {formatDate(job.createdAt)}
        </div>
      </div>
    </Link>
  );
}
