import Link from 'next/link';
import { ArrowRight, LayoutGrid, PlusCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in">
      <div className="bg-primary-100 p-5 rounded-3xl mb-10 shadow-inner">
        <LayoutGrid size={56} className="text-primary-600" />
      </div>
      <h1 className="text-6xl font-black text-[#3e2723] mb-8 tracking-tighter leading-tight max-w-3xl">
        Build Amazing Quizzes <span className="text-primary-600">Beautifully</span>
      </h1>
      <p className="text-xl text-[#5d4037] mb-12 max-w-2xl mx-auto leading-relaxed opacity-80">
        The most intuitive way to create, manage, and share custom quizzes with various question types. Experience the premium design in every interaction.
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <Link
          href="/create"
          className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-5 rounded-[2rem] font-bold text-xl shadow-2xl shadow-primary-200 transition-all flex items-center justify-center group transform hover:-translate-y-1"
        >
          <PlusCircle size={24} className="mr-3" />
          Create New Quiz
          <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
        </Link>
        <Link
          href="/quizzes"
          className="bg-[#f7f0e9] border-2 border-primary-100 hover:border-primary-300 hover:text-primary-700 text-[#5d4037] px-10 py-5 rounded-[2rem] font-bold text-xl transition-all flex items-center justify-center shadow-lg shadow-primary-50 hover:shadow-primary-100"
        >
          <LayoutGrid size={24} className="mr-3" />
          Dashboard
        </Link>
      </div>
    </div>
  );
}
