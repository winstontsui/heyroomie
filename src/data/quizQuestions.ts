// Define types for our question objects
export type QuestionOption = {
  value: string;
  label: string;
  emoji?: string;
  description?: string;
  image?: string;
};

export type QuizQuestion = {
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
  isOptional?: boolean;
};

// Define our answer types for better type safety
export interface QuizAnswers {
  name?: string;
  age?: number;
  gender?: string;
  occupation?: string;
  neighborhood?: string;
  budget: {
    min: number;
    max: number;
  };
  sleepSchedule?: string;
  cleanliness?: string;
  pets?: boolean;
  smoking?: boolean;
  drinking?: string;
  guests?: string;
  noise?: string;
  bio?: string;
  profilePicture?: string;
}

// Quiz questions with fun, interactive elements
export const quizQuestions: QuizQuestion[] = [
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
    type: 'slider',
    title: 'How old are you?',
    description: 'Must be 18+ to use HeyRoomie',
    min: 18,
    max: 65,
    step: 1,
    key: 'age',
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
      { value: 'upper-east-side', label: 'Manhattan - Upper East Side', image: '/images/neighborhoods/upper-east-side.jpg' },
      { value: 'upper-west-side', label: 'Manhattan - Upper West Side', image: '/images/neighborhoods/upper-west-side.jpg' },
      { value: 'chelsea', label: 'Manhattan - Chelsea', image: '/images/neighborhoods/chelsea.jpg' },
      { value: 'east-village', label: 'Manhattan - East Village', image: '/images/neighborhoods/east-village.jpg' },
      { value: 'west-village', label: 'Manhattan - West Village', image: '/images/neighborhoods/west-village.jpg' },
      { value: 'williamsburg', label: 'Brooklyn - Williamsburg', image: '/images/neighborhoods/williamsburg.jpg' },
      { value: 'bushwick', label: 'Brooklyn - Bushwick', image: '/images/neighborhoods/bushwick.jpg' },
      { value: 'astoria', label: 'Queens - Astoria', image: '/images/neighborhoods/astoria.jpg' },
      { value: 'long-island-city', label: 'Queens - Long Island City', image: '/images/neighborhoods/long-island-city.jpg' },
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
    id: 'profile-picture',
    type: 'profile-picture',
    title: 'Add a profile picture',
    description: 'Show roommates who you are (optional)',
    key: 'profilePicture',
    isOptional: true,
  },
  {
    id: 'final',
    type: 'completion',
    title: 'Perfect! Your profile is ready!',
    description: 'We\'ve analyzed your preferences and your profile is ready to start finding matches.',
    buttonText: 'See My Matches',
  }
];
