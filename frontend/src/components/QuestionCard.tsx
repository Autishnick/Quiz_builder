'use client';

import { Trash2, X, Plus, CheckCircle2 } from 'lucide-react';
import { UseFormRegister, UseFormSetValue, UseFormTrigger } from 'react-hook-form';

interface QuestionCardProps {
  index: number;
  register: UseFormRegister<any>;
  remove: (index: number) => void;
  watch: (name: string) => any;
  setValue: UseFormSetValue<any>;
  trigger: UseFormTrigger<any>;
  errors: any;
  handleOptionChange: (qIndex: number, oIndex: number, text: string) => void;
  handleToggleCorrect: (qIndex: number, oIndex: number) => void;
  handleRemoveCheckboxOption: (qIndex: number, oIndex: number) => void;
  handleAddCheckboxOption: (index: number) => void;
}

export default function QuestionCard({
  index,
  register,
  remove,
  watch,
  setValue,
  trigger,
  errors,
  handleOptionChange,
  handleToggleCorrect,
  handleRemoveCheckboxOption,
  handleAddCheckboxOption,
}: QuestionCardProps) {
  const type = watch(`questions.${index}.type`);
  const options = watch(`questions.${index}.options`) || [];

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-primary-100/50 relative group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
      <button
        type="button"
        onClick={() => remove(index)}
        className="absolute top-6 right-6 p-2 text-[#d7ccc8] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm"
        title="Remove Question"
      >
        <Trash2 size={24} />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <label className="block text-xs font-black text-[#8d6e63] mb-3 uppercase tracking-[0.2em]">Question Text</label>
          <input
            {...register(`questions.${index}.text` as const)}
            className="w-full px-5 py-3.5 rounded-xl border border-primary-100 bg-[#fdfaf7] focus:ring-4 focus:ring-primary-50 focus:border-primary-400 outline-none transition-all font-bold text-[#3e2723] placeholder:text-[#d7ccc8]"
            placeholder="Enter your question here..."
          />
          {errors.questions?.[index]?.text && (
            <p className="mt-2 text-xs text-red-500 font-bold">{errors.questions[index].text.message}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-black text-[#8d6e63] mb-3 uppercase tracking-[0.2em]">Question Type</label>
          <select
            {...register(`questions.${index}.type` as const)}
            className="w-full px-5 py-3.5 rounded-xl border border-primary-100 bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-400 outline-none transition-all cursor-pointer font-bold text-[#3e2723] shadow-sm"
            onChange={(e) => {
              const val = e.target.value;
              setValue(`questions.${index}.type`, val as any);
              if (val === 'CHECKBOX') {
                setValue(`questions.${index}.options`, [
                  { text: '', isCorrect: false },
                  { text: '', isCorrect: false }
                ]);
              } else if (val === 'BOOLEAN') {
                setValue(`questions.${index}.options`, [
                  { text: 'True', isCorrect: true },
                  { text: 'False', isCorrect: false }
                ]);
              } else {
                setValue(`questions.${index}.options`, null);
              }
            }}
          >
            <option value="INPUT">Short Answer</option>
            <option value="BOOLEAN">True / False</option>
            <option value="CHECKBOX">Multiple Choice</option>
          </select>
        </div>
      </div>

      {/* Dynamic Options for Checkbox */}
      {type === 'CHECKBOX' && (
        <div className="space-y-4 pt-8 border-t border-primary-50 mt-8">
          <div className="flex items-center justify-between text-[10px] font-black text-[#8d6e63] uppercase tracking-[0.2em]">
            <span>Option Text</span>
            <span>Correct?</span>
          </div>
          {options.map((option: any, oIndex: number) => (
            <div key={oIndex} className="flex items-center space-x-4 group/option">
              <div className="flex-1 flex items-center space-x-3">
                <input
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
                  className="flex-1 px-5 py-3 rounded-xl border border-primary-100 bg-[#fdfaf7] focus:border-primary-400 outline-none transition-all font-bold text-[#3e2723] text-sm"
                  placeholder={`Option ${oIndex + 1}`}
                />
              </div>
              <button
                type="button"
                onClick={() => handleToggleCorrect(index, oIndex)}
                className={`p-3 rounded-xl border-2 transition-all ${option.isCorrect
                  ? 'bg-primary-100 border-primary-400 text-primary-700'
                  : 'bg-white border-primary-50 text-[#d7ccc8] hover:border-primary-200'
                  }`}
                title={option.isCorrect ? "Marked as Correct" : "Mark as Correct"}
              >
                <CheckCircle2 size={20} />
              </button>
              <button
                type="button"
                onClick={() => handleRemoveCheckboxOption(index, oIndex)}
                className="p-3 text-[#d7ccc8] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <div className="flex flex-col space-y-3">
            <button
              type="button"
              onClick={() => handleAddCheckboxOption(index)}
              className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-black flex items-center space-x-2 py-3 px-5 rounded-xl hover:bg-primary-50 transition-all w-fit bg-[#f7f0e9] border border-primary-100"
            >
              <Plus size={18} />
              <span>Add Option</span>
            </button>
            {errors.questions?.[index]?.options && (
              <p className="text-xs text-red-500 font-black uppercase tracking-wider bg-red-50 px-4 py-2 rounded-lg border border-red-100">
                {(errors.questions[index].options as any).message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Preview for Boolean */}
      {type === 'BOOLEAN' && (
        <div className="pt-8 border-t border-primary-50 mt-8">
          <label className="block text-xs font-black text-[#8d6e63] mb-4 uppercase tracking-[0.2em]">Correct Answer</label>
          <div className="grid grid-cols-2 gap-6">
            {options.map((option: any, oIndex: number) => (
              <button
                key={oIndex}
                type="button"
                onClick={() => {
                  const opts = options.map((o: any, idx: number) => ({
                    ...o,
                    isCorrect: idx === oIndex
                  }));
                  setValue(`questions.${index}.options`, opts);
                  trigger(`questions.${index}.options`);
                }}
                className={`flex items-center justify-between px-8 py-5 rounded-2xl border-2 transition-all ${option.isCorrect
                  ? 'border-primary-600 bg-primary-50 text-primary-700 font-black shadow-lg shadow-primary-100'
                  : 'border-primary-50 bg-[#fdfaf7] text-[#d7ccc8] hover:border-primary-200 hover:text-[#8d6e63]'
                  }`}
              >
                <span className="text-lg">{option.text}</span>
                {option.isCorrect && <CheckCircle2 size={24} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
