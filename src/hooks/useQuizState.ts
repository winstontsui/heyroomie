import { useState, useEffect } from 'react';
import { QuizAnswers, quizQuestions } from '@/data/quizQuestions';

// Create an index signature type that extends QuizAnswers to allow string indexing
type IndexableQuizAnswers = QuizAnswers & { 
  [key: string]: string | number | boolean | { min: number; max: number; } | string[] | undefined 
};

interface QuizState {
  currentStep: number;
  progress: number;
  answers: Partial<IndexableQuizAnswers>;
  handleNext: () => void;
  handleBack: () => void;
  handleChange: (key: string, value: any) => void;
  handleMultiSelect: (key: string, value: string) => void;
  canProceed: () => boolean;
  formatProfileData: () => any;
}

export function useQuizState(onComplete: (profileData: any) => void): QuizState {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Initialize with default values
  const [answers, setAnswers] = useState<Partial<IndexableQuizAnswers>>({
    budget: { min: 1000, max: 2500 },
    age: 25,
  });

  // Calculate progress when current step changes
  useEffect(() => {
    setProgress(((currentStep) / (quizQuestions.length - 1)) * 100);
  }, [currentStep]);

  const handleNext = () => {
    const nextStep = currentStep + 1;
    if (nextStep < quizQuestions.length) {
      setCurrentStep(nextStep);
      window.scrollTo(0, 0);
    } else {
      // Quiz completed, format data and call onComplete
      const profileData = formatProfileData();
      onComplete(profileData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleChange = (key: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleMultiSelect = (key: string, value: string) => {
    setAnswers(prev => {
      // Safely handle array values with proper type checking
      const currentValues = Array.isArray(prev[key]) 
        ? prev[key] as string[] 
        : [];
      const maxSelections = quizQuestions.find(q => q.key === key)?.maxSelections || 1;
      
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [key]: currentValues.filter((v: string) => v !== value)
        };
      } else if (currentValues.length < maxSelections) {
        return {
          ...prev,
          [key]: [...currentValues, value]
        };
      }
      
      return prev;
    });
  };

  const canProceed = (): boolean => {
    const currentQuestion = quizQuestions[currentStep];
    
    if (!currentQuestion.key) return true; // Intro or completion slide
    
    // Type guard to check if the key exists in our answers object
    const answerValue = answers[currentQuestion.key];
    
    switch (currentQuestion.type) {
      case 'area-select':
        return Array.isArray(answerValue) && answerValue.length > 0;
      case 'single-select':
      case 'text-input':
        return !!answerValue;
      case 'yes-no':
      case 'emoji-scale':
      case 'slider':
        return true;
      default:
        return true;
    }
  };

  // Format data for API submission
  const formatProfileData = () => {
    // Organize budget into a cleaner format for the API
    const formattedBudget = answers.budget ? {
      min: answers.budget.min,
      max: answers.budget.max
    } : { min: 1000, max: 2500 };

    // Find the label for the selected neighborhood
    const neighborhoodLabel = answers.neighborhood ?
      quizQuestions.find(q => q.id === 'neighborhood')?.options?.find(
        opt => opt.value === answers.neighborhood
      )?.label || answers.neighborhood : '';

    // Return a clean object with profile data, nesting preferences appropriately
    return {
      name: answers.name || '',
      bio: answers.bio || '',
      age: answers.age || 0,
      gender: answers.gender || '',
      occupation: answers.occupation || '',
      budget: formattedBudget,
      neighborhood: neighborhoodLabel,
      preferences: {
        sleepSchedule: answers.sleepSchedule || '',
        cleanliness: answers.cleanliness || '',
        pets: answers.pets !== undefined ? answers.pets : null,
        smoking: answers.smoking !== undefined ? answers.smoking : null,
        drinking: answers.drinking || '',
        guests: answers.guests || '',
        noise: answers.noise || ''
      }
    };
  };

  return {
    currentStep,
    progress,
    answers,
    handleNext,
    handleBack,
    handleChange,
    handleMultiSelect,
    canProceed,
    formatProfileData
  };
}
