import Link from 'next/link';
import { LayoutGrid, PlusCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-[#fdfaf7] border-b border-[#e7e0d9] glass-morphism sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/quizzes" className="flex items-center space-x-2 text-primary-600 font-bold text-xl transition-all hover:scale-105">
              <LayoutGrid size={24} />
              <span className="tracking-tight">Quiz Builder</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/create"
              className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary-100/50"
            >
              <PlusCircle size={20} />
              <span className="font-semibold">Create Quiz</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
