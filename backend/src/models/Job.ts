import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceYears: number;
  educationLevel: 'Any' | 'Bachelor' | 'Master' | 'PhD';
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  status: 'open' | 'closed' | 'screening';
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requiredSkills: { type: [String], default: [] },
    preferredSkills: { type: [String], default: [] },
    experienceYears: { type: Number, default: 0, min: 0 },
    educationLevel: {
      type: String,
      enum: ['Any', 'Bachelor', 'Master', 'PhD'],
      default: 'Any',
    },
    location: { type: String, default: 'Remote' },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Remote'],
      default: 'Full-time',
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'screening'],
      default: 'open',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IJob>('Job', JobSchema);
