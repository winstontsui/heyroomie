import mongoose from 'mongoose';
import Embedding from '../models/Embedding';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create a test embedding
const createTestEmbedding = async () => {
  try {
    // Create a normalized vector (example with 5 dimensions)
    const testVector = [0.2, 0.3, 0.4, 0.5, 0.6];
    const magnitude = Math.sqrt(testVector.reduce((sum, val) => sum + val * val, 0));
    const normalizedVector = testVector.map(val => val / magnitude);

    const embedding = await Embedding.create({
      email: 'test@example.com',
      vector: normalizedVector,
      metadata: {
        dimensions: normalizedVector.length
      }
    });

    console.log('Test embedding created:', embedding);
  } catch (error) {
    console.error('Error creating test embedding:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await createTestEmbedding();
  await mongoose.disconnect();
  console.log('Script completed');
};

main(); 