'use client';

import { useRouter } from 'next/navigation';
import { BsCheckCircleFill, BsArrowRight, BsArrowLeft } from 'react-icons/bs';
import { IoIosCheckmarkCircle } from 'react-icons/io';

// Import quiz questions from data file
import { quizQuestions, QuestionOption } from '@/data/quizQuestions';
import { useQuizState } from '@/hooks/useQuizState';

interface PreferenceQuizProps {
  onComplete: (profileData: any) => void;
}

export default function PreferenceQuiz({ onComplete }: PreferenceQuizProps) {
  const router = useRouter();
  
  // Use our custom hook for state management
  const {
    currentStep,
    progress,
    answers,
    handleNext,
    handleBack,
    handleChange,
    handleMultiSelect,
    canProceed
  } = useQuizState(onComplete);

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
                    question.key && Array.isArray(answers[question.key]) && (answers[question.key] as string[]).includes(option.value)
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
                      {question.key && Array.isArray(answers[question.key]) && (answers[question.key] as string[]).includes(option.value) && (
                        <BsCheckCircleFill className="text-gold-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-light-500 text-sm">
              Selected: {question.key && Array.isArray(answers[question.key]) ? (answers[question.key] as string[]).length : 0} of {question.maxSelections}
            </p>
          </div>
        );
        
      case 'slider':
        // Check if it's the budget slider or age slider
        if (question.key === 'budget') {
          return (
            <div className="py-6">
              <div className="mb-12 bg-white rounded-xl shadow-sm p-6 border border-light-200">
                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-gold-500 mb-2">
                    ${answers.budget?.min || 1000} - ${answers.budget?.max || 2500}
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
                        left: `${(question.min !== undefined && question.max !== undefined && answers.budget) ? 
                          ((Number(answers.budget.min) - question.min) / (question.max - question.min)) * 100 : 0}%`,
                        right: `${(question.min !== undefined && question.max !== undefined && answers.budget) ? 
                          100 - ((Number(answers.budget.max) - question.min) / (question.max - question.min)) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  
                  <input
                    type="range"
                    min={question.min}
                    max={question.max}
                    step={question.step}
                    value={answers.budget?.min || 1000}
                    onChange={(e) => handleChange('budget', { min: parseInt(e.target.value), max: answers.budget?.max || 2500 })}
                    className="absolute w-full top-7 appearance-none bg-transparent pointer-events-auto cursor-pointer"
                  />
                  
                  <input
                    type="range"
                    min={question.min}
                    max={question.max}
                    step={question.step}
                    value={answers.budget?.max || 2500}
                    onChange={(e) => handleChange('budget', { min: answers.budget?.min || 1000, max: parseInt(e.target.value) })}
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
        } else if (question.key === 'age') {
          // For the age slider, we want a single value
          return (
            <div className="py-6">
              <div className="mb-12 bg-white rounded-xl shadow-sm p-6 border border-light-200">
                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-gold-500 mb-2">
                    {answers.age}
                  </div>
                  <p className="text-light-600 text-sm">
                    Drag the slider to set your age
                  </p>
                </div>
                
                <div className="relative pt-8 pb-4">
                  <div className="h-2 bg-light-200 rounded-full">
                    <div
                      className="absolute h-2 bg-gold-500 rounded-full"
                      style={{
                        left: 0,
                        width: `${(question.min !== undefined && question.max !== undefined) ? 
                          ((Number(answers.age) - question.min) / (question.max - question.min)) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  
                  <input
                    type="range"
                    min={question.min}
                    max={question.max}
                    step={question.step}
                    value={answers.age}
                    onChange={(e) => handleChange('age', parseInt(e.target.value))}
                    className="absolute w-full top-7 appearance-none bg-transparent pointer-events-auto cursor-pointer"
                  />
                </div>
                
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-light-600">{question.min} years</span>
                  <span className="text-sm text-light-600">{question.max} years</span>
                </div>
              </div>
            </div>
          );
        }
        return null;
      ;
        
      case 'single-select':
        // Special handling for neighborhood selection with images
        if (question.id === 'neighborhood') {
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {question.options?.map((option) => (
                <div
                  key={option.value}
                  onClick={() => question.key && handleChange(question.key, option.value)}
                  className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    question.key && answers[question.key] === option.value
                      ? 'border-gold-500 shadow-md'
                      : 'border-light-200 hover:border-light-300'
                  }`}
                >
                  <div className="aspect-[4/3] relative">
                    {/* Image container with overlay */}
                    {option.image && (
                      <div className="absolute inset-0">
                        <img 
                          src={option.image} 
                          alt={option.label} 
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute inset-0 ${
                          question.key && answers[question.key] === option.value
                            ? 'bg-gold-500/30'
                            : 'bg-light-900/10 hover:bg-light-900/20'
                        } transition-all`}></div>
                      </div>
                    )}
                    
                    {/* Selected indicator */}
                    {question.key && answers[question.key] === option.value && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className="bg-gold-500 text-white p-1 rounded-full">
                          <BsCheckCircleFill className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className="p-3 bg-white">
                    <div className="font-medium text-center">{option.label}</div>
                  </div>
                </div>
              ))}
            </div>
          );
        }
        
        // Regular single select for other questions
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
              value={question.key ? (typeof answers[question.key] === 'string' ? answers[question.key] as string : '') : ''}
              onChange={(e) => question.key && handleChange(question.key, e.target.value)}
              maxLength={question.maxLength}
            />
            <div className="text-right text-sm text-light-500 mt-2">
              {question.key ? (typeof answers[question.key] === 'string' ? (answers[question.key] as string).length : 0) : 0} / {question.maxLength}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // QuizUI Component - Better semantics with a clear separation of concerns
  return (
    <div className="bg-light-100 min-h-screen py-10">
      <div className="container max-w-4xl mx-auto">
        {/* Progress bar */}
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={quizQuestions.length} 
          progress={progress} 
        />
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Question header */}
          <QuestionHeader 
            currentStep={currentStep} 
            totalSteps={quizQuestions.length} 
            question={quizQuestions[currentStep]} 
          />
          
          {/* Question content */}
          <div className="p-6">
            {renderQuestionContent()}
          </div>
          
          {/* Navigation buttons */}
          <NavigationButtons 
            currentStep={currentStep} 
            totalSteps={quizQuestions.length} 
            canProceed={canProceed()} 
            handleBack={handleBack} 
            handleNext={handleNext} 
          />
        </div>
      </div>
    </div>
  );
}

// Helper components for better organization and readability
function ProgressBar({ currentStep, totalSteps, progress }: { currentStep: number, totalSteps: number, progress: number }) {
  if (currentStep === 0 || currentStep === totalSteps - 1) return null;
  
  return (
    <div className="w-full h-2 bg-light-300 rounded-full mb-6">
      <div
        className="h-2 bg-gold-500 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

function QuestionHeader({ currentStep, totalSteps, question }: { currentStep: number, totalSteps: number, question: any }) {
  if (currentStep === 0 || currentStep === totalSteps - 1) return null;
  
  return (
    <div className="p-6 border-b border-light-200">
      <h2 className="text-2xl font-bold">{question.title}</h2>
      <p className="text-light-600">{question.description}</p>
    </div>
  );
}

function NavigationButtons({ 
  currentStep, 
  totalSteps, 
  canProceed, 
  handleBack, 
  handleNext 
}: { 
  currentStep: number, 
  totalSteps: number, 
  canProceed: boolean, 
  handleBack: () => void, 
  handleNext: () => void 
}) {
  if (currentStep === 0 || currentStep === totalSteps - 1) return null;
  
  return (
    <div className="p-6 border-t border-light-200 flex justify-between">
      <button
        onClick={handleBack}
        className="px-6 py-2 rounded-md border border-light-300 hover:bg-light-100 transition-colors flex items-center"
      >
        <BsArrowLeft className="mr-2" /> Back
      </button>
      
      <button
        onClick={handleNext}
        disabled={!canProceed}
        className={`px-6 py-2 rounded-md flex items-center ${
          canProceed
            ? 'bg-gold-500 hover:bg-gold-600 text-white'
            : 'bg-light-300 text-light-500 cursor-not-allowed'
        }`}
      >
        Continue <BsArrowRight className="ml-2" />
      </button>
    </div>
  );
}
