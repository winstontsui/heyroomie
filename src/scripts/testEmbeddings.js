import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from '@xenova/transformers';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

// Initialize the embedding model
let embeddingModel = null;

// Function to initialize the model
async function initializeModel() {
  if (!embeddingModel) {
    // Using a lightweight model suitable for our use case
    embeddingModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embeddingModel;
}

// Function to convert preferences to a descriptive text
function preferencesToText(preferences) {
  const parts = [];
  
  if (preferences.sleepSchedule) {
    parts.push(`Sleep schedule is ${preferences.sleepSchedule.replace('_', ' ')}`);
  }
  
  if (preferences.cleanliness) {
    parts.push(`Cleanliness level is ${preferences.cleanliness} out of 5`);
  }
  
  if (preferences.smoking !== undefined) {
    parts.push(`Smoking is ${preferences.smoking ? 'allowed' : 'not allowed'}`);
  }
  
  if (preferences.drinking) {
    parts.push(`Drinking is ${preferences.drinking}`);
  }
  
  if (preferences.pets !== undefined) {
    parts.push(`Pets are ${preferences.pets ? 'allowed' : 'not allowed'}`);
  }
  
  if (preferences.guests) {
    parts.push(`Guest frequency is ${preferences.guests}`);
  }
  
  if (preferences.noise) {
    parts.push(`Noise level preference is ${preferences.noise}`);
  }
  
  return parts.join('. ');
}

// Function to normalize a vector
function normalizeVector(vector) {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => val / magnitude);
}

// Function to generate embeddings from user preferences
async function generateEmbedding(preferences) {
  try {
    const model = await initializeModel();
    
    // Convert preferences to text
    const text = preferencesToText(preferences);
    
    // Generate embedding
    const result = await model(text, { pooling: 'mean', normalize: true });
    
    // Get the embedding vector
    const embedding = Array.from(result.data);
    
    // Normalize the vector
    return {
      vector: normalizeVector(embedding),
      text
    };
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

// Define schemas
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  preferences: {
    sleepSchedule: String,
    cleanliness: Number,
    smoking: Boolean,
    drinking: String,
    pets: Boolean,
    guests: String,
    noise: String
  }
}, { timestamps: true });

const EmbeddingSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  vector: {
    type: [Number],
    required: true
  },
  metadata: {
    dimensions: Number,
    lastUpdated: Date,
    generatedText: String
  }
});

// Add post-save hook to User schema
UserSchema.post('save', async function(doc) {
  try {
    if (doc.preferences) {
      const { vector, text } = await generateEmbedding(doc.preferences);
      
      // Update or create embedding in the Embeddings collection
      await Embedding.findOneAndUpdate(
        { email: doc.email },
        {
          email: doc.email,
          vector,
          metadata: {
            dimensions: vector.length,
            lastUpdated: new Date(),
            generatedText: text
          }
        },
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.error('Error generating embedding:', error);
  }
});

// Create models
const User = mongoose.model('User', UserSchema);
const Embedding = mongoose.model('Embedding', EmbeddingSchema);

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

// Setup: Clean up any existing test data
const setup = async () => {
  try {
    await User.deleteOne({ email: 'test.user@example.com' });
    await Embedding.deleteOne({ email: 'test.user@example.com' });
    console.log('Cleaned up any existing test data');
  } catch (error) {
    console.error('Error during setup:', error);
    throw error;
  }
};

// Create test user with preferences
const createTestUser = async () => {
  try {
    // Create a test user with preferences
    const testUser = await User.create({
      name: 'Test User',
      email: 'test.user@example.com',
      password: 'password123',
      preferences: {
        sleepSchedule: 'early_bird',
        cleanliness: 4,
        smoking: false,
        drinking: 'occasionally',
        pets: true,
        guests: 'occasionally',
        noise: 'moderate'
      }
    });

    console.log('Test user created:', testUser);

    // Wait a moment for the post-save hook to complete
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if embedding was created
    const embedding = await Embedding.findOne({ email: testUser.email });
    if (!embedding) {
      throw new Error('No embedding was generated for the test user');
    }

    console.log('\nGenerated embedding:', {
      email: embedding.email,
      dimensions: embedding.metadata.dimensions,
      lastUpdated: embedding.metadata.lastUpdated,
      vectorLength: embedding.vector.length,
      vectorSample: embedding.vector.slice(0, 5) // Show first 5 dimensions
    });

    return { user: testUser, embedding };
  } catch (error) {
    console.error('Error in test:', error);
    throw error;
  }
};

// Clean up test data
const cleanup = async () => {
  try {
    await User.deleteOne({ email: 'test.user@example.com' });
    await Embedding.deleteOne({ email: 'test.user@example.com' });
    console.log('\nTest data cleaned up');
  } catch (error) {
    console.error('Error cleaning up:', error);
  }
};

// Main function
const main = async () => {
  try {
    await connectDB();
    await setup(); // Clean up before running the test
    const result = await createTestUser();
    
    // Verify the embedding
    if (result.embedding) {
      console.log('\n✅ Test passed: Embedding was successfully generated');
      console.log('Generated text:', result.embedding.metadata.generatedText);
    } else {
      console.log('\n❌ Test failed: No embedding was generated');
    }

    // Clean up
    await cleanup();
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nTest completed');
  }
};

main(); 