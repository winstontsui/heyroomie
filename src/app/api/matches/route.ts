import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/db/mongoose';
import User from '@/models/User';

// Helper function to calculate compatibility score between two users
function calculateCompatibilityScore(user1: any, user2: any) {
  // Initialize scores for different dimensions
  let lifestyleScore = 0;
  let locationScore = 0;
  let financialScore = 0;
  let personalityScore = 0;
  
  // Total possible points
  let lifestyleTotal = 0;
  let locationTotal = 0;
  let financialTotal = 0;
  let personalityTotal = 0;
  
  // --- Lifestyle compatibility ---
  // Sleep schedule (20 points)
  if (user1.preferences?.sleepSchedule && user2.preferences?.sleepSchedule) {
    lifestyleTotal += 20;
    if (user1.preferences.sleepSchedule === user2.preferences.sleepSchedule) {
      lifestyleScore += 20; // Perfect match
    } else if (
      (user1.preferences.sleepSchedule === 'flexible' || user2.preferences.sleepSchedule === 'flexible')
    ) {
      lifestyleScore += 15; // One is flexible
    } else {
      lifestyleScore += 5; // Opposite schedules
    }
  }
  
  // Smoking (15 points)
  if (user1.preferences?.smoking !== undefined && user2.preferences?.smoking !== undefined) {
    lifestyleTotal += 15;
    if (user1.preferences.smoking === user2.preferences.smoking) {
      lifestyleScore += 15; // Both smoke or both don't
    } else if (user1.preferences.smoking || user2.preferences.smoking) {
      lifestyleScore += 5; // One is okay with smoking
    }
  }
  
  // Drinking (10 points)
  if (user1.preferences?.drinking && user2.preferences?.drinking) {
    lifestyleTotal += 10;
    if (user1.preferences.drinking === user2.preferences.drinking) {
      lifestyleScore += 10; // Same drinking habits
    } else if (
      (user1.preferences.drinking === 'occasionally' && user2.preferences.drinking === 'never') ||
      (user1.preferences.drinking === 'never' && user2.preferences.drinking === 'occasionally')
    ) {
      lifestyleScore += 7; // Close enough
    } else {
      lifestyleScore += 3; // Big difference
    }
  }
  
  // Pets (10 points)
  if (user1.preferences?.pets !== undefined && user2.preferences?.pets !== undefined) {
    lifestyleTotal += 10;
    if (user1.preferences.pets === user2.preferences.pets) {
      lifestyleScore += 10; // Both like or dislike pets
    } else if (user1.preferences.pets || user2.preferences.pets) {
      lifestyleScore += 5; // One is okay with pets
    }
  }
  
  // Noise (15 points)
  if (user1.preferences?.noise && user2.preferences?.noise) {
    lifestyleTotal += 15;
    const noiseValues = { quiet: 1, moderate: 2, loud: 3 };
    const noiseDiff = Math.abs(
      noiseValues[user1.preferences.noise as keyof typeof noiseValues] - 
      noiseValues[user2.preferences.noise as keyof typeof noiseValues]
    );
    
    if (noiseDiff === 0) {
      lifestyleScore += 15; // Same noise preference
    } else if (noiseDiff === 1) {
      lifestyleScore += 8; // Adjacent noise preferences
    } else {
      lifestyleScore += 2; // Opposite noise preferences
    }
  }
  
  // Guests (10 points)
  if (user1.preferences?.guests && user2.preferences?.guests) {
    lifestyleTotal += 10;
    const guestValues = { rarely: 1, occasionally: 2, frequently: 3 };
    const guestDiff = Math.abs(
      guestValues[user1.preferences.guests as keyof typeof guestValues] - 
      guestValues[user2.preferences.guests as keyof typeof guestValues]
    );
    
    if (guestDiff === 0) {
      lifestyleScore += 10; // Same guest preference
    } else if (guestDiff === 1) {
      lifestyleScore += 6; // Adjacent guest preferences
    } else {
      lifestyleScore += 2; // Opposite guest preferences
    }
  }
  
  // Cleanliness (20 points)
  if (user1.preferences?.cleanliness && user2.preferences?.cleanliness) {
    lifestyleTotal += 20;
    const cleanDiff = Math.abs(Number(user1.preferences.cleanliness) - Number(user2.preferences.cleanliness));
    
    if (cleanDiff === 0) {
      lifestyleScore += 20; // Same cleanliness level
    } else if (cleanDiff === 1) {
      lifestyleScore += 16; // Close cleanliness levels
    } else if (cleanDiff === 2) {
      lifestyleScore += 10; // Moderate difference
    } else if (cleanDiff === 3) {
      lifestyleScore += 5; // Significant difference
    } else {
      lifestyleScore += 2; // Extreme difference
    }
  }
  
  // --- Location compatibility ---
  // Neighborhood (100 points)
  if (user1.neighborhood && user2.neighborhood) {
    locationTotal += 100;
    if (user1.neighborhood === user2.neighborhood) {
      locationScore += 100; // Same neighborhood
    } else {
      // Different neighborhoods but both specified, partial credit
      locationScore += 50;
    }
  }
  
  // --- Financial compatibility ---
  // Budget (100 points)
  if (
    user1.budget?.min !== undefined && 
    user1.budget?.max !== undefined && 
    user2.budget?.min !== undefined && 
    user2.budget?.max !== undefined
  ) {
    financialTotal += 100;
    
    // Check if the budget ranges overlap
    const overlap = Math.min(user1.budget.max, user2.budget.max) - Math.max(user1.budget.min, user2.budget.min);
    
    if (overlap >= 0) {
      // Calculate how much the budgets overlap as a percentage of the smaller range
      const user1Range = user1.budget.max - user1.budget.min;
      const user2Range = user2.budget.max - user2.budget.min;
      const smallerRange = Math.min(user1Range, user2Range);
      
      // Avoid division by zero
      if (smallerRange > 0) {
        const overlapPercent = overlap / smallerRange;
        financialScore += Math.round(overlapPercent * 100);
      } else {
        // If one user has the same min and max (exact budget)
        // and it falls within the other's range, give high score
        if (
          (user1.budget.min === user1.budget.max && 
           user1.budget.min >= user2.budget.min && 
           user1.budget.min <= user2.budget.max) ||
          (user2.budget.min === user2.budget.max && 
           user2.budget.min >= user1.budget.min && 
           user2.budget.min <= user1.budget.max)
        ) {
          financialScore += 90;
        } else {
          financialScore += 50; // No range but values are close
        }
      }
    } else {
      // No budget overlap, calculate how far apart they are
      const gap = Math.abs(overlap);
      const minBudgetDifference = Math.min(user1.budget.min, user2.budget.min);
      
      // If the gap is less than 20% of the minimum budget, give some points
      if (minBudgetDifference > 0 && gap / minBudgetDifference < 0.2) {
        financialScore += 40;
      } else if (minBudgetDifference > 0 && gap / minBudgetDifference < 0.5) {
        financialScore += 20;
      } else {
        financialScore += 0; // Budgets are too far apart
      }
    }
  }
  
  // --- Personality compatibility ---
  // Age (50 points) - closer ages get higher scores
  if (user1.age && user2.age) {
    personalityTotal += 50;
    const ageDiff = Math.abs(user1.age - user2.age);
    
    if (ageDiff <= 2) {
      personalityScore += 50; // Very close in age
    } else if (ageDiff <= 5) {
      personalityScore += 40;
    } else if (ageDiff <= 10) {
      personalityScore += 30;
    } else if (ageDiff <= 15) {
      personalityScore += 20;
    } else {
      personalityScore += 10; // Big age difference
    }
  }
  
  // Gender preference is not scored but can be used as a filter
  // Occupation is not scored but included in the match summary
  
  // Calculate weighted percentage scores for each category
  const lifestylePercentage = lifestyleTotal > 0 ? (lifestyleScore / lifestyleTotal) * 100 : 0;
  const locationPercentage = locationTotal > 0 ? (locationScore / locationTotal) * 100 : 0;
  const financialPercentage = financialTotal > 0 ? (financialScore / financialTotal) * 100 : 0;
  const personalityPercentage = personalityTotal > 0 ? (personalityScore / personalityTotal) * 100 : 0;
  
  // Calculate overall compatibility score with weights
  const totalPoints = lifestyleTotal + locationTotal + financialTotal + personalityTotal;
  const totalScore = lifestyleScore + locationScore + financialScore + personalityScore;
  
  const overallPercentage = totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0;
  
  // Create matching summary with reasons
  const matchingSummary = [];
  
  if (lifestylePercentage >= 80) {
    matchingSummary.push('You have very similar lifestyle preferences');
  } else if (lifestylePercentage >= 60) {
    matchingSummary.push('You have compatible lifestyle preferences');
  } else if (lifestylePercentage > 0) {
    matchingSummary.push('You have somewhat different lifestyle preferences');
  }
  
  if (locationPercentage >= 80) {
    matchingSummary.push('You prefer the same neighborhoods');
  } else if (locationPercentage > 0) {
    matchingSummary.push('You have different neighborhood preferences');
  }
  
  if (financialPercentage >= 80) {
    matchingSummary.push('Your budget ranges align well');
  } else if (financialPercentage >= 60) {
    matchingSummary.push('Your budget ranges somewhat overlap');
  } else if (financialPercentage > 0) {
    matchingSummary.push('Your budget ranges are different');
  }
  
  if (personalityPercentage >= 80) {
    matchingSummary.push('You are in similar age groups');
  } else if (personalityPercentage > 0) {
    matchingSummary.push('There is an age difference between you');
  }
  
  return {
    overallPercentage: Math.round(overallPercentage),
    categories: {
      lifestyle: Math.round(lifestylePercentage),
      location: Math.round(locationPercentage),
      financial: Math.round(financialPercentage),
      personality: Math.round(personalityPercentage),
    },
    matchingSummary,
  };
}

// GET /api/matches - Get user matches
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get current user
    const currentUser = await User.findOne({ email: session.user.email });
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if user has filled out their profile
    if (!currentUser.preferences || !currentUser.budget) {
      return NextResponse.json(
        { error: 'Please complete your profile before viewing matches', completed: false },
        { status: 400 }
      );
    }
    
    // Find all other users with completed profiles
    const potentialMatches = await User.find({
      email: { $ne: session.user.email }, // Exclude current user
      preferences: { $exists: true, $ne: null }, // Must have preferences
      budget: { $exists: true, $ne: null }, // Must have budget
    });
    
    // Calculate compatibility scores for each potential match
    const matches = potentialMatches.map(match => {
      const compatibility = calculateCompatibilityScore(currentUser, match);
      
      return {
        id: match._id,
        name: match.name,
        age: match.age,
        occupation: match.occupation,
        neighborhood: match.neighborhood,
        bio: match.bio,
        compatibility,
      };
    });
    
    // Sort matches by overall compatibility score (descending)
    matches.sort((a, b) => b.compatibility.overallPercentage - a.compatibility.overallPercentage);
    
    return NextResponse.json({
      matches,
      completed: true,
    });
  } catch (error: any) {
    console.error('Error getting matches:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching matches' },
      { status: 500 }
    );
  }
}
