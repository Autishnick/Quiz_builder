'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { quizService } from '@/services/api';
import { Plus, Save, X } from 'lucide-react';
import QuestionCard from '@/components/QuestionCard';

const questionSchema = z.object({
  text: z.string().trim().min(3, 'Question text must be at least 3 characters (not including spaces)'),
  type: z.enum(['BOOLEAN', 'INPUT', 'CHECKBOX']),
  options: z.any().optional(),
}).refine((data) => {
  if (data.type === 'CHECKBOX' || data.type === 'BOOLEAN') {
    if (!Array.isArray(data.options)) return false;
    if (!data.options.every(opt => opt.text && opt.text.trim().length > 0)) {
      return false;
    }
    if (data.type === 'CHECKBOX') {
      if (data.options.length < 2) return false;
      return data.options.some(opt => opt.isCorrect);
    }
  }
  return true;
}, {
  message: "All options must have text. Multiple choice questions must have at least 2 options and one correct answer.",
  path: ["options"]
});

const quizSchema = z.object({
  title: z.string().trim().min(3, 'Quiz title must be at least 3 characters (not including spaces)'),
  questions: z.array(questionSchema).min(1, 'Add at least one question'),
});

type QuizFormValues = z.infer<typeof quizSchema>;

export default function CreateQuizPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      questions: [{ text: '', type: 'INPUT' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = async (data: QuizFormValues) => {
    setIsSubmitting(true);
    try {
      await quizService.createQuiz(data);
      router.push('/quizzes');
    } catch (error) {
      alert('Failed to create quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCheckboxOption = (index: number) => {
    const currentOptions = watch(`questions.${index}.options`) || [];
    setValue(`questions.${index}.options`, [...currentOptions, { text: '', isCorrect: false }]);
  };

  const handleRemoveCheckboxOption = (qIndex: number, oIndex: number) => {
    const currentOptions = watch(`questions.${qIndex}.options`) as any[];
    const nextOptions = currentOptions.filter((_, i) => i !== oIndex);
    setValue(`questions.${qIndex}.options`, nextOptions);
    trigger(`questions.${qIndex}.options`);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, text: string) => {
    const currentOptions = watch(`questions.${qIndex}.options`) as any[];
    const nextOptions = [...currentOptions];
    nextOptions[oIndex] = { ...nextOptions[oIndex], text };
    setValue(`questions.${qIndex}.options`, nextOptions);
    trigger(`questions.${qIndex}.options`);
  };

  const handleToggleCorrect = (qIndex: number, oIndex: number) => {
    const currentOptions = watch(`questions.${qIndex}.options`) as any[];
    const nextOptions = [...currentOptions];
    nextOptions[oIndex] = { ...nextOptions[oIndex], isCorrect: !nextOptions[oIndex].isCorrect };
    setValue(`questions.${qIndex}.options`, nextOptions);
    trigger(`questions.${qIndex}.options`);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-[#3e2723] tracking-tighter">Create New Quiz</h1>
          <p className="text-lg text-[#8d6e63] mt-2 font-medium">Design your interactive learning experience</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="bg-[#fdfaf7] p-10 rounded-[2.5rem] shadow-sm border border-primary-100 transition-all hover:shadow-xl hover:shadow-primary-100/30">
          <label className="block text-xs font-black text-[#8d6e63] mb-4 uppercase tracking-[0.2em]">Quiz Title</label>
          <input
            {...register('title')}
            className={`w-full px-6 py-5 text-2xl font-bold rounded-2xl border ${errors.title ? 'border-red-400 bg-red-50' : 'border-primary-100 bg-white'
              } focus:ring-8 focus:ring-primary-50 focus:border-primary-400 outline-none transition-all placeholder:text-[#d7ccc8] shadow-inner`}
            placeholder="What's your quiz about?"
          />
          {errors.title && <p className="mt-3 text-sm text-red-500 font-bold flex items-center"><X size={16} className="mr-2" /> {errors.title.message}</p>}
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-primary-50 pb-6">
            <h2 className="text-3xl font-black text-[#3e2723] tracking-tight">Questions</h2>
            <span className="text-sm font-bold text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full border border-primary-100 uppercase tracking-widest">
              {fields.length} {fields.length === 1 ? 'Question' : 'Questions'}
            </span>
          </div>

          {fields.map((field, index) => (
            <QuestionCard
              key={field.id}
              index={index}
              register={register}
              remove={remove}
              watch={watch}
              setValue={setValue}
              trigger={trigger}
              errors={errors}
              handleOptionChange={handleOptionChange}
              handleToggleCorrect={handleToggleCorrect}
              handleRemoveCheckboxOption={handleRemoveCheckboxOption}
              handleAddCheckboxOption={handleAddCheckboxOption}
            />
          ))}

          <button
            type="button"
            onClick={() => append({ text: '', type: 'INPUT' })}
            className="group w-full py-10 border-4 border-dashed border-primary-100 rounded-[2.5rem] text-[#d7ccc8] hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/50 transition-all flex flex-col items-center justify-center space-y-4"
          >
            <div className="p-4 bg-primary-50 rounded-full group-hover:bg-primary-100 transition-all shadow-inner">
              <Plus size={36} />
            </div>
            <span className="font-black text-xl uppercase tracking-widest">Add New Question</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-12 border-t border-primary-100">
          <button
            type="button"
            onClick={() => router.push('/quizzes')}
            className="px-8 py-4 rounded-2xl font-black text-[#8d6e63] hover:text-[#3e2723] hover:bg-[#f7f0e9] transition-all uppercase tracking-widest text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="relative bg-primary-600 hover:bg-primary-700 text-white px-12 py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-primary-200 transition-all flex items-center space-x-4 disabled:opacity-50 overflow-hidden group"
          >
            <div className="absolute inset-0 w-1/4 h-full bg-white/10 -skew-x-12 translate-x-[-150%] group-hover:translate-x-[400%] transition-all duration-1000"></div>
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white"></div>
            ) : (
              <Save size={28} />
            )}
            <span className="uppercase tracking-tighter">Save Quiz</span>
          </button>
        </div>
      </form>
    </div>
  );
}
