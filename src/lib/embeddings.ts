import { pipeline } from '@xenova/transformers';

// Initialize the embedding model
let embeddingModel: any = null;

// Function to initialize the model
async function initializeModel() {
  if (!embeddingModel) {
    // Using a lightweight model suitable for our use case
    embeddingModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embeddingModel;
}

// Function to convert preferences to a descriptive text
function preferencesToText(preferences: any): string {
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
function normalizeVector(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => val / magnitude);
}

// Main function to generate embeddings from user preferences
export async function generateEmbedding(preferences: any): Promise<{ vector: number[], text: string }> {
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