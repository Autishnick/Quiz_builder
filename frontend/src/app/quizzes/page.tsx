'use client';

import { useEffect, useState } from 'react';
import { quizService } from '@/services/api';
import Link from 'next/link';
import { Trash2, FileText, ChevronRight, PlusCircle } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import QuizCard from '@/components/QuizCard';

interface QuizItem {
  id: string;
  title: string;
  questionCount: number;
  createdAt: string;
}

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = async () => {
    try {
      const { data } = await quizService.getQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this quiz?')) {
      try {
        await quizService.deleteQuiz(id);
        setQuizzes(quizzes.filter((q) => q.id !== id));
      } catch (error) {
        alert('Failed to delete quiz');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-[#3e2723] tracking-tight">Your Quizzes</h1>
          <p className="text-[#8d6e63] font-medium mt-1">Manage your collection of interactive quizzes</p>
        </div>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-[#fdfaf7] border-2 border-dashed border-primary-100 rounded-[2.5rem] p-20 text-center max-w-3xl mx-auto shadow-sm">
          <div className="bg-primary-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <FileText className="text-primary-600" size={48} />
          </div>
          <h3 className="text-3xl font-black text-[#5d4037] mb-4">No quizzes yet</h3>
          <p className="text-[#8d6e63] mb-10 text-lg max-w-md mx-auto leading-relaxed">Your collection is empty. Start by creating your first interactive quiz</p>
          <Link
            href="/create"
            className="inline-flex items-center space-x-3 bg-primary-600 hover:bg-primary-700 text-white px-10 py-4 rounded-[2rem] font-bold text-lg transition-all shadow-xl shadow-primary-200"
          >
            <span>Create Your First Quiz</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes.map((quiz, index) => (
            <QuizCard
              key={quiz.id}
              id={quiz.id}
              title={quiz.title}
              questionCount={quiz.questionCount}
              index={index}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
