import React, { useState } from 'react';

interface RuleInputProps {
  onSubmit: (rule: string) => void;
}

const RuleInput: React.FC<RuleInputProps> = ({ onSubmit }) => {
  const [rule, setRule] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rule);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 font-display leading-tight">
          Wpisz regułkę, którą chcesz
          <span className="text-amber-500"> opanować do perfekcji!</span>
        </h2>
        <p className="text-slate-500 mt-2 text-lg">Zacznijmy magiczną podróż do świata wiedzy ✨</p>
      </div>

      <div className="relative group">
        <textarea
          value={rule}
          onChange={(e) => setRule(e.target.value)}
          placeholder="Np. 'Fotosynteza to proces, w którym rośliny przekształcają światło słoneczne w energię.' 🌿"
          className="w-full h-48 p-6 bg-white border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-amber-300 focus:border-amber-400 transition-all duration-300 resize-none text-xl text-slate-700 placeholder-slate-400 shadow-lg shadow-amber-200/50 group-hover:shadow-xl group-hover:shadow-amber-200/80"
          aria-label="Pole do wpisania regułki"
        />
         <div className="absolute -top-3 left-6 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold transition-transform duration-300 group-focus-within:scale-105">
           Twoja Regułka
        </div>
      </div>
      
      <button
        type="submit"
        disabled={!rule.trim()}
        className="w-full flex justify-center items-center gap-3 bg-amber-400 text-slate-800 font-bold text-xl py-5 px-6 rounded-2xl hover:bg-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-300/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-95 hover:shadow-2xl hover:shadow-amber-400/50"
      >
        <span>Zaczynamy Ćwiczyć!</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </form>
  );
};

export default RuleInput;