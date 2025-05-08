const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

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

    // Define the Embedding schema
    const EmbeddingSchema = new mongoose.Schema({
      email: {
        type: String,
        required: true,
        unique: true,
      },
      vector: {
        type: [Number],
        required: true,
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
          required: true
        }
      }
    }, { timestamps: true });

    // Create the model
    const Embedding = mongoose.model('Embedding', EmbeddingSchema);

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