import mongoose, { Schema, Document } from 'mongoose';

export interface IEmbedding extends Document {
  email: string;  // Primary matching key
  vector: number[];  // The normalized preference vector
  metadata: {
    lastUpdated: Date;
    version: number;
    dimensions: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const EmbeddingSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,  // One embedding per email
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    vector: {
      type: [Number],
      required: [true, 'Please provide a preference vector'],
      validate: {
        validator: function(v: number[]) {
          // Ensure vector is normalized (length = 1)
          const magnitude = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
          return Math.abs(magnitude - 1) < 0.0001;  // Allow for small floating point errors
        },
        message: 'Vector must be normalized (length = 1)'
      }
    },
    metadata: {
      lastUpdated: {
        type: Date,
        default: Date.now
      },
      version: {
        type: Number,
        default: 1
      },
      dimensions: {
        type: Number,
        required: [true, 'Please specify vector dimensions']
      }
    }
  },
  { timestamps: true }
);

// Create indexes for vector similarity search and email lookups
EmbeddingSchema.index({ email: 1 });
EmbeddingSchema.index({ 'metadata.lastUpdated': -1 });

// Use mongoose.models.Embedding to avoid model overwrite error in development
export default mongoose.models.Embedding || mongoose.model<IEmbedding>('Embedding', EmbeddingSchema); 