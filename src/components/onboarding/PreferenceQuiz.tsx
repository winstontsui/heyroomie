'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BsCheckCircleFill, BsArrowRight, BsArrowLeft } from 'react-icons/bs';
import { IoIosCheckmarkCircle } from 'react-icons/io';

// Define types for our question objects
type QuestionOption = {
  value: string;
  label: string;
  emoji?: string;
  description?: string;
  image?: string;
};

type QuizQuestion = {
  id: string;
  type: string;
  title: string;
  description: string;
  buttonText?: string;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  key?: string;
  maxSelections?: number;
  placeholder?: string;
  maxLength?: number;
};

// Quiz questions with fun, interactive elements
const quizQuestions: QuizQuestion[] = [
  {
    id: 'intro',
    type: 'welcome',
    title: 'Welcome to HeyRoomie!',
    description: 'Let\'s find your perfect roommate match. This quick quiz will help us understand your preferences.',
    buttonText: 'Get Started',
  },
  {
    id: 'name',
    type: 'text-input',
    title: 'What\'s your name?',
    description: 'We\'ll use this to personalize your profile',
    placeholder: 'Your full name',
    key: 'name',
    maxLength: 50,
  },
  {
    id: 'age',
    type: 'text-input',
    title: 'How old are you?',
    description: 'Must be 18+ to use HeyRoomie',
    placeholder: 'Your age (e.g., 25)',
    key: 'age',
    maxLength: 3,
  },
  {
    id: 'gender',
    type: 'single-select',
    title: 'What\'s your gender?',
    description: 'This helps with roommate preferences',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'non-binary', label: 'Non-binary' },
      { value: 'prefer not to say', label: 'Prefer not to say' },
    ],
    key: 'gender',
  },
  {
    id: 'occupation',
    type: 'text-input',
    title: 'What\'s your occupation?',
    description: 'Let potential roommates know what you do',
    placeholder: 'Your job or student status',
    key: 'occupation',
    maxLength: 100,
  },
  {
    id: 'neighborhood',
    type: 'single-select',
    title: 'Where in NYC do you want to live?',
    description: 'Select your preferred neighborhood',
    options: [
      { value: 'upper-east-side', label: 'Upper East Side', image: '/images/neighborhoods/upper-east-side.jpg' },
      { value: 'upper-west-side', label: 'Upper West Side', image: '/images/neighborhoods/upper-west-side.jpg' },
      { value: 'chelsea', label: 'Chelsea', image: '/images/neighborhoods/chelsea.jpg' },
      { value: 'east-village', label: 'East Village', image: '/images/neighborhoods/east-village.jpg' },
      { value: 'west-village', label: 'West Village', image: '/images/neighborhoods/west-village.jpg' },
      { value: 'williamsburg', label: 'Williamsburg', image: '/images/neighborhoods/williamsburg.jpg' },
      { value: 'bushwick', label: 'Bushwick', image: '/images/neighborhoods/bushwick.jpg' },
      { value: 'astoria', label: 'Astoria', image: '/images/neighborhoods/astoria.jpg' },
      { value: 'long-island-city', label: 'Long Island City', image: '/images/neighborhoods/long-island-city.jpg' },
    ],
    key: 'neighborhood',
  },
  {
    id: 'budget',
    type: 'slider',
    title: 'What\'s your budget range?',
    description: 'Drag the slider to set your minimum and maximum rent budget',
    min: 500,
    max: 5000,
    step: 100,
    key: 'budget',
  },
  {
    id: 'lifestyle',
    type: 'single-select',
    title: 'What\'s your typical sleep schedule?',
    description: 'This helps us match roommates with compatible lifestyles',
    options: [
      { value: 'early_bird', label: 'Early Bird (In bed by 10pm, up by 6am)' },
      { value: 'night_owl', label: 'Night Owl (In bed after midnight, up after 9am)' },
      { value: 'flexible', label: 'Flexible (My schedule varies/adaptable)' },
    ],
    key: 'sleepSchedule',
  },
  {
    id: 'drinking',
    type: 'single-select',
    title: 'What\'s your stance on drinking?',
    description: 'This helps match roommates with compatible lifestyles',
    options: [
      { value: 'never', label: 'I don\'t drink' },
      { value: 'occasionally', label: 'Social drinker (occasionally)' },
      { value: 'frequently', label: 'Regular drinker' },
    ],
    key: 'drinking',
  },
  {
    id: 'cleanliness',
    type: 'emoji-scale',
    title: 'How clean do you keep your living space?',
    description: 'Be honest! This is one of the most important compatibility factors.',
    options: [
      { value: '1', label: 'Relaxed', emoji: '😌', description: 'Cleaning can wait until the weekend' },
      { value: '2', label: 'Casual', emoji: '🙂', description: 'Tidy, with occasional messes' },
      { value: '3', label: 'Balanced', emoji: '😊', description: 'Clean common areas, personal space varies' },
      { value: '4', label: 'Particular', emoji: '😇', description: 'I clean regularly and expect the same' },
      { value: '5', label: 'Meticulous', emoji: '✨', description: 'Everything has its place, always' },
    ],
    key: 'cleanliness',
  },
  {
    id: 'pets',
    type: 'yes-no',
    title: 'Are you open to living with pets?',
    description: 'Let us know if you\'d be comfortable with furry roommates',
    key: 'pets',
  },
  {
    id: 'smoking',
    type: 'yes-no',
    title: 'Are you open to living with smokers?',
    description: 'We\'ll make sure to match accordingly',
    key: 'smoking',
  },
  {
    id: 'social',
    type: 'single-select',
    title: 'How often do you have guests over?',
    description: 'This helps find roommates with similar social preferences',
    options: [
      { value: 'rarely', label: 'Rarely - I prefer a quiet home' },
      { value: 'occasionally', label: 'Occasionally - A friend now and then' },
      { value: 'frequently', label: 'Frequently - I\'m social and like having people over' },
    ],
    key: 'guests',
  },
  {
    id: 'noise',
    type: 'single-select',
    title: 'How much noise do you make?',
    description: 'This helps find roommates with similar noise preferences',
    options: [
      { value: 'quiet', label: 'Quiet - I keep to myself' },
      { value: 'moderate', label: 'Moderate - I make some noise, but respect others' },
      { value: 'loud', label: 'Loud - I like to have fun and make noise' },
    ],
    key: 'noise',
  },
  {
    id: 'bio',
    type: 'text-input',
    title: 'Tell potential roommates about yourself',
    description: 'Share your interests, lifestyle, and what makes you a great roommate',
    placeholder: "I'm a marketing professional who loves cooking, film, and weekend hikes. Looking for a friendly, respectful roommate who enjoys occasional movie nights but also values quiet time.",
    key: 'bio',
    maxLength: 400,
  },
  {
    id: 'final',
    type: 'completion',
    title: 'Perfect! Your profile is ready!',
    description: 'We\'ve analyzed your preferences and your profile is ready to start finding matches.',
    buttonText: 'See My Matches',
  }
];

interface PreferenceQuizProps {
  onComplete: (profileData: any) => void;
}

export default function PreferenceQuiz({ onComplete }: PreferenceQuizProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    neighborhood: [],
    budget: { min: 1000, max: 2500 },
    sleepSchedule: '',
    cleanliness: '3',
    pets: false,
    smoking: false,
    guests: '',
    bio: '',
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Calculate progress percentage
    setProgress(((currentStep) / (quizQuestions.length - 1)) * 100);
  }, [currentStep]);

  const handleNext = () => {
    const nextStep = currentStep + 1;
    if (nextStep < quizQuestions.length) {
      setCurrentStep(nextStep);
      window.scrollTo(0, 0);
    } else {
      // Quiz completed, format data for the profile
      const profileData = {
        // Extract basic profile fields
        name: answers.name || '',
        bio: answers.bio || '',
        // Convert age to number
        age: parseInt(answers.age) || 0,
        // Add gender directly
        gender: answers.gender || '',
        // Add occupation directly
        occupation: answers.occupation || '',
        // Format as proper budget object
        budget: {
          min: parseInt(answers.budget?.min) || 0,
          max: parseInt(answers.budget?.max) || 0
        },
        // Use neighborhood value directly (now it's a single string value, not an array)
        neighborhood: answers.neighborhood || '',
        // Format preferences correctly
        preferences: {
          sleepSchedule: answers.sleepSchedule || '',
          // Convert cleanliness from string to number to match model
          cleanliness: parseInt(answers.cleanliness) || 3,
          pets: Boolean(answers.pets),
          smoking: Boolean(answers.smoking),
          drinking: answers.drinking || '',
          guests: answers.guests || '',
          noise: answers.noise || ''
        }
      };
      
      // Log the data being sent for debugging
      console.log('Sending profile data:', profileData);
      
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
      const currentValues = prev[key] || [];
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

  const canProceed = () => {
    const currentQuestion = quizQuestions[currentStep];
    
    if (!currentQuestion.key) return true; // Intro or completion slide
    
    switch (currentQuestion.type) {
      case 'area-select':
        return answers[currentQuestion.key]?.length > 0;
      case 'single-select':
        return !!answers[currentQuestion.key];
      case 'text-input':
        return !!answers[currentQuestion.key];
      case 'yes-no':
      case 'emoji-scale':
      case 'slider':
        return true;
      default:
        return true;
    }
  };

  const renderQuestionContent = () => {
    const question = quizQuestions[currentStep];

    switch (question.type) {
      case 'welcome':
      case 'completion':
        return (
          <div className="text-center py-12">
            <div className="mb-8 w-20 h-20 mx-auto bg-gold-100 rounded-full flex items-center justify-center">
              <IoIosCheckmarkCircle className="w-12 h-12 text-gold-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">{question.title}</h2>
            <p className="text-light-600 mb-8 max-w-md mx-auto">{question.description}</p>
            <button
              onClick={handleNext}
              className="btn-primary px-8 py-3 text-lg"
            >
              {question.buttonText || 'Continue'}
            </button>
          </div>
        );
        
      case 'area-select':
        return (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {question.options?.map((option) => (
                <div
                  key={option.value}
                  onClick={() => question.key && handleMultiSelect(question.key, option.value)}
                  className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    question.key && answers[question.key]?.includes(option.value)
                      ? 'border-gold-500 shadow-md'
                      : 'border-light-200'
                  }`}
                >
                  <div className="aspect-[4/3] relative">
                    <div className="absolute inset-0 bg-light-900/20 z-10"></div>
                    {/* Show image if available */}
                    {option.image ? (
                      <div className="absolute w-full h-full">
                        <img 
                          src={option.image} 
                          alt={option.label} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="absolute w-full h-full bg-light-400">
                        <div className="h-full flex items-center justify-center text-light-500">
                          {option.label}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-white">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{option.label}</span>
                      {question.key && answers[question.key]?.includes(option.value) && (
                        <BsCheckCircleFill className="text-gold-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-light-500 text-sm">
              Selected: {question.key && (answers[question.key]?.length || 0)} of {question.maxSelections}
            </p>
          </div>
        );
        
      case 'slider':
        return (
          <div className="py-6">
            <div className="mb-12 bg-white rounded-xl shadow-sm p-6 border border-light-200">
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-gold-500 mb-2">
                  ${answers.budget.min} - ${answers.budget.max}
                </div>
                <p className="text-light-600 text-sm">
                  Drag the handles to set your budget range
                </p>
              </div>
              
              <div className="relative pt-8 pb-4">
                <div className="h-2 bg-light-200 rounded-full">
                  <div
                    className="absolute h-2 bg-gold-500 rounded-full"
                    style={{
                      left: `${(question.min !== undefined && question.max !== undefined) ? 
                        ((Number(answers.budget.min) - question.min) / (question.max - question.min)) * 100 : 0}%`,
                      right: `${(question.min !== undefined && question.max !== undefined) ? 
                        100 - ((Number(answers.budget.max) - question.min) / (question.max - question.min)) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                
                <input
                  type="range"
                  min={question.min}
                  max={question.max}
                  step={question.step}
                  value={answers.budget.min}
                  onChange={(e) => handleChange('budget', { min: parseInt(e.target.value), max: answers.budget.max })}
                  className="absolute w-full top-7 appearance-none bg-transparent pointer-events-auto cursor-pointer"
                />
                
                <input
                  type="range"
                  min={question.min}
                  max={question.max}
                  step={question.step}
                  value={answers.budget.max}
                  onChange={(e) => handleChange('budget', { min: answers.budget.min, max: parseInt(e.target.value) })}
                  className="absolute w-full top-7 appearance-none bg-transparent pointer-events-auto cursor-pointer"
                />
              </div>
              
              <div className="flex justify-between mt-2">
                <span className="text-sm text-light-600">${question.min}</span>
                <span className="text-sm text-light-600">${question.max}</span>
              </div>
            </div>
          </div>
        );
        
      case 'single-select':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <div
                key={option.value}
                onClick={() => question.key && handleChange(question.key, option.value)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  question.key && answers[question.key] === option.value
                    ? 'border-gold-500 bg-gold-50'
                    : 'border-light-300 bg-white hover:border-light-400'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border ${
                    question.key && answers[question.key] === option.value
                      ? 'border-gold-500 bg-gold-500'
                      : 'border-light-400'
                  } flex items-center justify-center mr-3`}>
                    {question.key && answers[question.key] === option.value && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="font-medium">{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'emoji-scale':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2 mb-6">
              {question.options?.map((option) => {
                const emojiOption = option as QuestionOption & { emoji: string };
                return (
                  <div
                    key={option.value}
                    onClick={() => question.key && handleChange(question.key, option.value)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                      question.key && answers[question.key] === option.value
                        ? 'bg-gold-50 border-2 border-gold-500'
                        : 'bg-white border border-light-300 hover:border-light-400'
                    }`}
                  >
                    <div className="text-3xl mb-1">{emojiOption.emoji}</div>
                    <div className="text-xs font-medium">{option.label}</div>
                  </div>
                );
              })}
            </div>
            
            {question.options?.map((option) => {
              const descOption = option as QuestionOption & { description: string };
              return question.key && answers[question.key] === option.value && (
                <div key={`desc-${option.value}`} className="bg-light-100 p-3 rounded-lg text-sm text-light-700">
                  <strong>{option.label}:</strong> {descOption.description}
                </div>
              );
            })}
          </div>
        );
        
      case 'yes-no':
        return (
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => question.key && handleChange(question.key, true)}
              className={`flex-1 p-6 rounded-xl flex flex-col items-center justify-center transition-all ${
                question.key && answers[question.key] === true
                  ? 'bg-gold-50 border-2 border-gold-500'
                  : 'bg-white border border-light-300 hover:border-light-400'
              }`}
            >
              <span className="text-4xl mb-2">👍</span>
              <span className="font-medium">Yes</span>
            </button>
            
            <button
              type="button"
              onClick={() => question.key && handleChange(question.key, false)}
              className={`flex-1 p-6 rounded-xl flex flex-col items-center justify-center transition-all ${
                question.key && answers[question.key] === false
                  ? 'bg-gold-50 border-2 border-gold-500'
                  : 'bg-white border border-light-300 hover:border-light-400'
              }`}
            >
              <span className="text-4xl mb-2">👎</span>
              <span className="font-medium">No</span>
            </button>
          </div>
        );
        
      case 'text-input':
        return (
          <div>
            <textarea
              className="w-full h-32 p-4 border border-light-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              placeholder={question.placeholder}
              value={question.key ? (answers[question.key] || '') : ''}
              onChange={(e) => question.key && handleChange(question.key, e.target.value)}
              maxLength={question.maxLength}
            />
            <div className="text-right text-sm text-light-500 mt-2">
              {question.key ? (answers[question.key]?.length || 0) : 0} / {question.maxLength}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-light-100 min-h-screen py-10">
      <div className="container max-w-4xl mx-auto">
        {/* Progress bar */}
        {currentStep > 0 && currentStep < quizQuestions.length - 1 && (
          <div className="w-full h-2 bg-light-300 rounded-full mb-6">
            <div
              className="h-2 bg-gold-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Question header */}
          {currentStep > 0 && currentStep < quizQuestions.length - 1 && (
            <div className="p-6 border-b border-light-200">
              <h2 className="text-2xl font-bold">{quizQuestions[currentStep].title}</h2>
              <p className="text-light-600">{quizQuestions[currentStep].description}</p>
            </div>
          )}
          
          {/* Question content */}
          <div className="p-6">
            {renderQuestionContent()}
          </div>
          
          {/* Navigation buttons */}
          {currentStep > 0 && currentStep < quizQuestions.length - 1 && (
            <div className="p-6 border-t border-light-200 flex justify-between">
              <button
                onClick={handleBack}
                className="px-6 py-2 rounded-md border border-light-300 hover:bg-light-100 transition-colors flex items-center"
              >
                <BsArrowLeft className="mr-2" /> Back
              </button>
              
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`px-6 py-2 rounded-md flex items-center ${
                  canProceed()
                    ? 'bg-gold-500 hover:bg-gold-600 text-white'
                    : 'bg-light-300 text-light-500 cursor-not-allowed'
                }`}
              >
                Continue <BsArrowRight className="ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
