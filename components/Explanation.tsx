import React, { useMemo } from 'react';

interface ExplanationProps {
  explanation: string;
  originalRule: string;
  onNext: () => void;
}

const Explanation: React.FC<ExplanationProps> = ({ explanation, originalRule, onNext }) => {
  
  const formattedExplanation = useMemo(() => {
    // Proste parsowanie pogrubień (**słowo**) na tag <strong>
    const html = explanation
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-800">$1</strong>')
      .replace(/\n/g, '<br />');
    return { __html: html };
  }, [explanation]);

  return (
    <div className="space-y-6 animate-fade-in">
        <div>
          <h3 className="text-sm font-semibold text-slate-500 mb-1">Twoja regułka:</h3>
          <p className="bg-slate-100 p-3 rounded-lg text-slate-600">{originalRule}</p>
        </div>
      
      <div className="p-5 bg-amber-100/50 rounded-2xl border-2 border-amber-200/80">
        <h2 className="text-xl font-bold text-slate-700 font-display mb-3">BrainBot wyjaśnia... 🤖</h2>
        <div 
          className="text-slate-600 leading-relaxed space-y-2" 
          dangerouslySetInnerHTML={formattedExplanation} 
        />
      </div>

      <button
        onClick={onNext}
        className="w-full bg-amber-400 text-slate-800 font-bold text-lg py-4 px-4 rounded-xl hover:bg-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-300/80 transition-all duration-300 transform hover:scale-105"
      >
        Rozumiem, chcę ćwiczyć!
      </button>
    </div>
  );
};

export default Explanation;