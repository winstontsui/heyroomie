import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  bio?: string;
  age?: number;
  gender?: string;
  occupation?: string;
  neighborhood?: string;
  budget?: {
    min: number;
    max: number;
  };
  preferences?: {
    sleepSchedule?: string;
    cleanliness?: number;
    smoking?: boolean;
    drinking?: string;
    pets?: boolean;
    guests?: string;
    noise?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters'],
    },
    age: {
      type: Number,
      min: [18, 'You must be at least 18 years old'],
      max: [120, 'Invalid age'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'prefer not to say'],
    },
    occupation: {
      type: String,
      maxlength: [100, 'Occupation cannot be more than 100 characters'],
    },
    neighborhood: {
      type: String,
    },
    budget: {
      min: {
        type: Number,
        min: [0, 'Minimum budget cannot be negative'],
      },
      max: {
        type: Number,
        min: [0, 'Maximum budget cannot be negative'],
      },
    },
    preferences: {
      sleepSchedule: {
        type: String,
        enum: ['early_bird', 'night_owl', 'flexible'],
      },
      cleanliness: {
        type: Number,
        min: 1,
        max: 5,
      },
      smoking: {
        type: Boolean,
        default: false,
      },
      drinking: {
        type: String,
        enum: ['never', 'occasionally', 'frequently'],
      },
      pets: {
        type: Boolean,
        default: false,
      },
      guests: {
        type: String,
        enum: ['rarely', 'occasionally', 'frequently'],
      },
      noise: {
        type: String,
        enum: ['quiet', 'moderate', 'loud'],
      },
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Use mongoose.models.User to avoid model overwrite error in development
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
