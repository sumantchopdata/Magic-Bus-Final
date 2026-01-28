import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface ScreeningTestFormProps {
  studentId: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    question: 'A price increases from $200 to $250. What is the percentage increase?',
    options: ['20%', '22%', '25%', '30%']
  },
  {
    id: 2,
    question: 'Simple interest on $1,200 at 5% per annum for 3 years is:',
    options: ['$150', '$180', '$200', '$220']
  },
  {
    id: 3,
    question: '$1,000 compounded annually at 10% for 2 years becomes:',
    options: ['$1,100', '$1,200', '$1,210', '$1,220']
  },
  {
    id: 4,
    question: 'If a:b = 3:5, then (a+b):b equals:',
    options: ['3:5', '8:5', '5:3', '5:8']
  },
  {
    id: 5,
    question: 'An item bought for $400 sold for $460. Profit percentage is:',
    options: ['10%', '12%', '15%', '20%']
  },
  {
    id: 6,
    question: 'A completes a job in 12 days; B in 18 days. Together they take:',
    options: ['6 days', '7.2 days', '8 days', '9 days']
  },
  {
    id: 7,
    question: 'A tank fills in 10 h. A leak empties it in 20 h. Net fill time is:',
    options: ['15 h', '20 h', '25 h', '30 h']
  },
  {
    id: 8,
    question: 'A car travels 180 km at 60 km/h. Travel time is:',
    options: ['2 h', '2.5 h', '3 h', '4 h']
  },
  {
    id: 9,
    question: 'Number of distinct arrangements of LEVEL:',
    options: ['15', '20', '30', '60']
  },
  {
    id: 10,
    question: 'Probability of at least 2 heads in 3 fair coin tosses:',
    options: ['3/8', '1/2', '5/8', '3/4']
  }
];

export default function ScreeningTestForm({ studentId }: ScreeningTestFormProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState(false);
  const [testData, setTestData] = useState(null);

  useEffect(() => {
    loadTestData();
  }, [studentId]);

  const loadTestData = async () => {
    if (!studentId) return;
    const { data } = await supabase
      .from('screening_tests')
      .select('*')
      .eq('student_id', studentId)
      .maybeSingle();

    if (data) {
      setTestData(data);
      if (data.answers) {
        setAnswers(data.answers);
      }
      if (data.completed) {
        setCompleted(true);
      }
    }
  };

  const handleAnswerChange = (optionIndex: number) => {
    setAnswers({
      ...answers,
      [currentQuestion]: questions[currentQuestion].options[optionIndex]
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length === questions.length) {
      try {
        const { data: existing } = await supabase
          .from('screening_tests')
          .select('id')
          .eq('student_id', studentId)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('screening_tests')
            .update({
              answers,
              completed: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);
        } else {
          await supabase.from('screening_tests').insert({
            student_id: studentId,
            answers,
            completed: true
          });
        }

        setCompleted(true);
      } catch (error) {
        console.error('Error saving screening test:', error);
      }
    }
  };

  if (completed) {
    return (
      <div className="space-y-6">
        <h3 className="text-4xl font-bold text-gray-900 mb-8">Screening Test - Quantitative Section</h3>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-8 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h4 className="text-2xl font-bold text-green-700 mb-2">Quiz Completed!</h4>
          <p className="text-gray-700 mb-4">Your answers have been saved successfully.</p>
          <div className="text-sm text-gray-600">
            <p>Total Questions: {questions.length}</p>
            <p>Answered: {Object.keys(answers).length}</p>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isAnswered = currentQuestion in answers;
  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-4xl font-bold text-gray-900 mb-2">Screening Test - Quantitative Section</h3>
        <p className="text-gray-600">Answer all 10 questions to complete the screening test</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">Progress: {Object.keys(answers).length}/{questions.length} answered</span>
          <span className="text-sm font-semibold text-blue-600">Question {currentQuestion + 1} of {questions.length}</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
        <h4 className="text-lg font-bold text-gray-900 mb-6">{question.question}</h4>

        <div className="space-y-3 mb-8">
          {question.options.map((option, index) => (
            <label key={index} className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all">
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={option}
                checked={answers[currentQuestion] === option}
                onChange={() => handleAnswerChange(index)}
                className="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-800 font-medium">{option}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-4 justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 font-semibold rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="flex items-center gap-2 px-8 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-5 sm:grid-cols-10 gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded-lg font-semibold text-sm transition-all ${
                index === currentQuestion
                  ? 'bg-blue-500 text-white'
                  : index in answers
                  ? 'bg-green-400 text-white'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {!isAnswered && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-sm text-yellow-700 font-medium">
            Please select an option to answer this question
          </p>
        </div>
      )}
    </div>
  );
}
