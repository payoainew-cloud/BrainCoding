import React, { useState, useCallback } from 'react';
import { AppStep } from './types';
import RuleInput from './components/RuleInput';
import PracticeMode from './components/PracticeMode';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [rule, setRule] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleRuleSubmit = useCallback((newRule: string) => {
    if (!newRule.trim()) {
      setError('Proszę wpisać jakąś regułkę, aby zacząć zabawę!');
      return;
    }
    setError('');
    setRule(newRule);
    setStep(AppStep.PRACTICE);
  }, []);

  const handleReset = () => {
    setStep(AppStep.INPUT);
    setRule('');
    setError('');
  };

  const renderStep = () => {
    switch (step) {
      case AppStep.INPUT:
        return <RuleInput key="input" onSubmit={handleRuleSubmit} />;
      case AppStep.PRACTICE:
        return <PracticeMode key="practice" rule={rule} onReset={handleReset} />;
      default:
        return <RuleInput key="default-input" onSubmit={handleRuleSubmit} />;
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 text-slate-700 flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 transition-colors duration-500">
      <header className="w-full max-w-5xl text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start space-x-3">
          <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center transform -rotate-12">
            <span className="text-3xl font-bold text-white transform rotate-12">B</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 font-display">
            BrainCoding
          </h1>
        </div>
      </header>
      
      <main className="w-full max-w-4xl my-8">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6 text-center animate-scale-in" role="alert">{error}</div>}
        {renderStep()}
      </main>

      <footer className="w-full max-w-5xl text-center text-slate-500">
        <p>Stworzone z pasją 🧠 przez Brain Team</p>
      </footer>
    </div>
  );
};

export default App;