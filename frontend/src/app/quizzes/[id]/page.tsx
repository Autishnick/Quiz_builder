'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { quizService } from '@/services/api';
import { ArrowLeft, Type, CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  type: 'BOOLEAN' | 'INPUT' | 'CHECKBOX';
  options: Option[];
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export default function QuizDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await quizService.getQuiz(id as string);
        setQuiz(data);
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
        alert('Quiz not found');
        router.push('/quizzes');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchQuiz();
  }, [id, router]);

  if (loading) return <LoadingSpinner />;

  if (!quiz) return null;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Link
        href="/quizzes"
        className="inline-flex items-center text-[#8d6e63] hover:text-primary-600 font-bold mb-8 transition-colors group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="bg-[#fdfaf7] rounded-[2.5rem] shadow-sm border border-primary-100 overflow-hidden mb-8 transition-all hover:shadow-xl hover:shadow-primary-100/30">
        <div className="bg-primary-600 px-10 py-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <CheckCircle2 size={160} />
          </div>
          <h1 className="text-5xl font-black tracking-tight relative z-10">{quiz.title}</h1>
          <div className="flex items-center space-x-4 mt-6 relative z-10">
            <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-md border border-white/10 uppercase tracking-widest">
              {quiz.questions.length} Questions
            </span>
          </div>
        </div>

        <div className="p-10 space-y-16 bg-white/50 backdrop-blur-sm">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="relative pl-20">
              <div className="absolute left-0 top-0 bg-primary-50 text-primary-600 font-black w-14 h-14 rounded-3xl flex items-center justify-center text-xl shadow-inner border border-primary-100 italic">
                {index + 1}
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-[#3e2723] leading-tight mb-3">
                  {question.text}
                </h3>
                <div className="flex items-center space-x-3">
                  <span className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#8d6e63] bg-[#f7f0e9] px-3 py-1.5 rounded-lg border border-primary-100">
                    {question.type === 'INPUT' && <><Type size={12} className="mr-2" /> Short Answer</>}
                    {question.type === 'BOOLEAN' && <><CheckCircle2 size={12} className="mr-2" /> True/False</>}
                    {question.type === 'CHECKBOX' && <><Circle size={12} className="mr-2" /> Multiple Choice</>}
                  </span>
                </div>
              </div>

              <div className="space-y-4 max-w-2xl">
                {question.type === 'INPUT' && (
                  <div className="w-full h-16 bg-[#fdfaf7] border border-primary-100 rounded-2xl px-6 flex items-center text-[#d7ccc8] italic font-medium shadow-inner">
                    Participant response area...
                  </div>
                )}

                {question.type === 'BOOLEAN' && (
                  <div className="grid grid-cols-2 gap-4">
                    {(question.options as Option[] || []).map((option, oIndex) => (
                      <div key={oIndex} className={`flex items-center justify-between px-6 py-5 rounded-2xl border-2 transition-all ${option.isCorrect
                        ? 'border-primary-500 bg-primary-50 text-primary-800'
                        : 'border-primary-50 bg-[#fdfaf7] text-[#d7ccc8]'
                        }`}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-6 h-6 rounded-full border-2 ${option.isCorrect ? 'border-primary-500 bg-primary-500 ring-4 ring-primary-100' : 'border-[#d7ccc8]'}`}></div>
                          <span className="font-bold text-lg">{option.text}</span>
                        </div>
                        {option.isCorrect && <span className="text-[10px] font-black uppercase tracking-widest bg-primary-200 px-2 py-1 rounded text-primary-800">Correct</span>}
                      </div>
                    ))}
                  </div>
                )}

                {question.type === 'CHECKBOX' && (
                  <div className="grid grid-cols-1 gap-4">
                    {(question.options as Option[] || []).map((option, oIndex) => (
                      <div key={oIndex} className={`flex items-center justify-between px-8 py-5 rounded-2xl border-2 transition-all ${option.isCorrect
                        ? 'border-primary-500 bg-primary-50 text-primary-900 shadow-lg shadow-primary-50'
                        : 'border-primary-50 bg-[#fdfaf7] text-[#8d6e63]'
                        }`}>
                        <div className="flex items-center space-x-5 font-bold">
                          <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${option.isCorrect
                            ? 'border-primary-600 bg-primary-600 text-white shadow-lg shadow-primary-200'
                            : 'border-[#d7ccc8]'
                            }`}>
                            {option.isCorrect && <CheckCircle2 size={18} />}
                          </div>
                          <span className="text-lg">{option.text}</span>
                        </div>
                        {option.isCorrect && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-100 px-3 py-1.5 rounded-xl border border-primary-200">
                            Correct Option
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
