'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { triggerScreening } from '@/lib/api';
import { BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';

interface ScreeningButtonProps {
  jobId: string;
  onComplete?: () => void;
}

export default function ScreeningButton({ jobId, onComplete }: ScreeningButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleScreen = async () => {
    setLoading(true);
    const toastId = toast.loading('AI is screening candidates — this may take a moment…');
    try {
      const res = await triggerScreening(jobId);
      toast.success(`Screened ${res.data?.screened ?? ''} candidates successfully!`, { id: toastId });
      onComplete?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Screening failed. Please try again.';
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleScreen} loading={loading} size="lg">
      <BrainCircuit className="w-5 h-5" />
      {loading ? 'AI Screening…' : 'Run AI Screening'}
    </Button>
  );
}
