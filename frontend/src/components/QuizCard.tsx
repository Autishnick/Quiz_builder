'use client';

import Link from 'next/link';
import { FileText, Trash2, ChevronRight } from 'lucide-react';

interface QuizCardProps {
  id: string;
  title: string;
  questionCount: number;
  index: number;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export default function QuizCard({ id, title, questionCount, index, onDelete }: QuizCardProps) {
  return (
    <Link
      href={`/quizzes/${id}`}
      className="group bg-[#fdfaf7] rounded-[2rem] shadow-sm border border-primary-100/50 hover:border-primary-300 hover:shadow-2xl hover:shadow-primary-100/50 transition-all p-8 block relative overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex justify-between items-start mb-8">
        <div className="bg-[#f7f0e9] p-4 rounded-2xl text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm">
          <FileText size={28} />
        </div>
        <button
          onClick={(e) => onDelete(e, id)}
          className="p-3 text-[#d7ccc8] hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
          title="Delete Quiz"
        >
          <Trash2 size={22} />
        </button>
      </div>
      <h3 className="text-2xl font-black text-[#3e2723] mb-4 group-hover:text-primary-700 transition-colors leading-tight">
        {title}
      </h3>
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-primary-50">
        <span className="text-sm font-bold uppercase tracking-widest text-[#8d6e63]">
          {questionCount} Questions
        </span>
        <div className="flex items-center text-primary-600 font-black text-sm uppercase tracking-tighter group-hover:translate-x-1 transition-transform">
          View <ChevronRight size={18} className="ml-1" />
        </div>
      </div>
    </Link>
  );
}
