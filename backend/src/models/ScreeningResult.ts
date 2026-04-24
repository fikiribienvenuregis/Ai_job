import mongoose, { Document, Schema } from 'mongoose';

export interface IScreeningResult extends Document {
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  compositeScore: number;
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  projectScore: number;
  label: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  explanation: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: 'Strongly Recommend' | 'Recommend' | 'Maybe' | 'Not Recommended';
  rank?: number;
  screenedAt: Date;
}

const ScreeningResultSchema = new Schema<IScreeningResult>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
    compositeScore: { type: Number, required: true, min: 0, max: 100 },
    skillScore: { type: Number, required: true, min: 0, max: 100 },
    experienceScore: { type: Number, required: true, min: 0, max: 100 },
    educationScore: { type: Number, required: true, min: 0, max: 100 },
    projectScore: { type: Number, required: true, min: 0, max: 100 },
    label: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Poor'],
      required: true,
    },
    explanation: { type: String, required: true },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    recommendation: {
      type: String,
      enum: ['Strongly Recommend', 'Recommend', 'Maybe', 'Not Recommended'],
      required: true,
    },
    rank: { type: Number },
    screenedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ScreeningResultSchema.index({ jobId: 1, compositeScore: -1 });

export default mongoose.model<IScreeningResult>('ScreeningResult', ScreeningResultSchema);
