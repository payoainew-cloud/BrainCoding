import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { HintLevel, PracticeResult } from '../types';

interface PracticeModeProps {
  rule: string;
  onReset: () => void;
}

const baseNormalizeText = (text: string) => {
  return text.trim().replace(/\s+/g, ' ');
};

// Normalizacja do sprawdzania wyniku - ignoruje wielkość liter i interpunkcję
const strictNormalizeText = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[.,;!?:"'()]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

const generateHint = (text: string, level: HintLevel): string => {
  const words = text.split(' ');
  switch (level) {
    case HintLevel.FIRST_LETTER:
      return words.map(word => word.length > 0 ? word[0] + '·'.repeat(word.length - 1) : '').join(' ');
    case HintLevel.EVERY_OTHER:
      return words.map((word, index) => (index % 2 === 0 ? word : '·'.repeat(word.length))).join(' ');
    case HintLevel.GAPS:
        return words.map((word, index) => (Math.random() > 0.5 && index > 0 ? '·'.repeat(word.length) : word)).join(' ');
    case HintLevel.SHAPE:
        return text.replace(/[^\s]/g, '·');
    case HintLevel.ZEN:
      return '';
    default:
      return '';
  }
};

const motivationalQuotes = [
  'Świetna robota! Każdy błąd to krok do przodu. 💪',
  'Wow, idzie Ci rewelacyjnie! ✨ Jesteś mistrzem!',
  'Tak trzymaj! Praktyka czyni mistrza. 🚀',
  'Niesamowite! Twój mózg właśnie stał się silniejszy. 🧠',
  'Jesteś nie do zatrzymania! Kolejna próba? 🔥'
];

const PracticeMode: React.FC<PracticeModeProps> = ({ rule, onReset }) => {
  const [userInput, setUserInput] = useState('');
  const [hintLevel, setHintLevel] = useState<HintLevel>(HintLevel.FIRST_LETTER);
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isHighlightingEnabled, setIsHighlightingEnabled] = useState(true);
  
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const normalizedRule = useMemo(() => baseNormalizeText(rule), [rule]);
  const hint = useMemo(() => generateHint(normalizedRule, hintLevel), [normalizedRule, hintLevel]);

  useEffect(() => {
    textInputRef.current?.focus();
  }, []);

  const checkAnswer = useCallback(() => {
    if (!userInput.trim()) return;

    const normalizedUserInput = strictNormalizeText(userInput);
    const normalizedTargetRule = strictNormalizeText(normalizedRule);

    const inputWords = normalizedUserInput.split(' ');
    const ruleWords = normalizedTargetRule.split(' ');
    let correctCount = 0;
    
    inputWords.forEach((word, index) => {
        if (ruleWords[index] && word === ruleWords[index]) {
            correctCount++;
        }
    });

    const totalWords = ruleWords.length;
    const accuracy = totalWords > 0 ? Math.round((correctCount / totalWords) * 100) : 0;

    setResult({
        correctCount,
        incorrectCount: Math.max(0, totalWords - correctCount),
        totalWords,
        accuracy,
        points: correctCount * 10,
    });
    setShowResult(true);
  }, [userInput, normalizedRule]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      checkAnswer();
    }
  };
  
  const handleTryAgain = () => {
      setShowResult(false);
      setUserInput('');
      setResult(null);
      setTimeout(() => textInputRef.current?.focus(), 100);
  }

  const renderResultDiff = () => {
    const inputWords = baseNormalizeText(userInput).split(' ');
    const ruleWords = normalizedRule.split(' ');

    return ruleWords.map((word, index) => {
        const userWord = inputWords[index] || '';
        // Porównanie z normalizacją do podświetlania
        const isCorrect = strictNormalizeText(userWord) === strictNormalizeText(word);
        
        if (isCorrect) {
            return <span key={index} className="text-green-600 bg-green-100 px-1 rounded mr-1">{word}</span>
        }
        return (
            <span key={index} className="relative inline-block mr-1">
                <span className="text-red-500 bg-red-100 px-1 rounded line-through">{userWord || '·'}</span>
                <span className="absolute -bottom-5 left-0 text-xs text-green-700 bg-green-200 px-1.5 py-0.5 rounded-full">{word}</span>
            </span>
        )
    });
  }

  const renderUserProgress = () => {
    // Helper function to strip punctuation for comparison
    const clean = (text: string) => text.replace(/[.,;!?:"'()]/g, '');

    const cleanRule = clean(normalizedRule);
    const cleanInput = clean(userInput);
    
    const charsToRender = [];
    let cleanInputIndex = 0;

    // 1. Render user's input with color coding
    for (let i = 0; i < userInput.length; i++) {
        const userChar = userInput[i];
        const isPunctuation = /[.,;!?:"'()]/.test(userChar);

        if (isPunctuation) {
            // Render punctuation neutrally, as it's ignored in validation
            charsToRender.push(<span key={`user-punc-${i}`} className="text-slate-800 animate-pop-in">{userChar}</span>);
        } else {
            // It's a character to be checked against the "clean" rule
            const ruleChar = cleanRule[cleanInputIndex];
            const isCharCorrect = ruleChar && userChar.toLowerCase() === ruleChar.toLowerCase();
            
            const shouldHighlightError = isHighlightingEnabled && !isCharCorrect;
            const charClass = shouldHighlightError ? 'text-red-500' : 'text-slate-800';

            charsToRender.push(<span key={`user-${i}`} className={`${charClass} animate-pop-in`}>{userChar}</span>);
            cleanInputIndex++;
        }
    }
    
    // 2. Determine where the user left off in the original rule
    let ruleIndexAfterInput = 0;
    let cleanCharsCounted = 0;
    while(ruleIndexAfterInput < normalizedRule.length && cleanCharsCounted < cleanInputIndex) {
        const isPunctuation = /[.,;!?:"'()]/.test(normalizedRule[ruleIndexAfterInput]);
        if (!isPunctuation) {
            cleanCharsCounted++;
        }
        ruleIndexAfterInput++;
    }

    // 3. Render the rest of the hint from that point
    for (let i = ruleIndexAfterInput; i < normalizedRule.length; i++) {
        const hintChar = hint[i] || ' ';
        const finalChar = hintLevel === HintLevel.ZEN ? ' ' : hintChar;
        if (finalChar !== ' ') {
            charsToRender.push(<span key={`hint-${i}`} className="text-slate-300">{finalChar}</span>)
        } else {
            charsToRender.push(<span key={`space-${i}`}> </span>);
        }
    }
    
    return charsToRender;
  };

  if (showResult && result) {
    return (
        <div className="fixed inset-0 bg-amber-50/50 backdrop-blur-lg flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-center animate-scale-in border-2 border-amber-200">
                <h2 className="text-3xl font-extrabold font-display">{result.accuracy > 80 ? 'Doskonale!' : 'Świetna próba!'}</h2>
                
                <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                    <h3 className="text-sm font-semibold text-slate-500">Porównanie:</h3>
                    <div className="text-left text-lg leading-10">{renderResultDiff()}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-green-100 p-4 rounded-xl">
                        <div className="text-4xl font-bold text-green-700">{result.accuracy}%</div>
                        <div className="text-sm text-green-600 font-semibold">Poprawność</div>
                    </div>
                     <div className="bg-amber-100 p-4 rounded-xl">
                        <div className="text-4xl font-bold text-amber-700">{result.points}</div>
                        <div className="text-sm text-amber-600 font-semibold">Punktów</div>
                    </div>
                </div>
                <p className="p-4 bg-amber-100/60 rounded-xl text-amber-800 italic font-medium">{motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={handleTryAgain} className="w-full bg-amber-400 text-slate-800 font-bold py-3 px-4 rounded-lg hover:bg-amber-500 transition-transform transform hover:scale-105 active:scale-95">Spróbuj jeszcze raz!</button>
                    <button onClick={onReset} className="w-full text-slate-500 bg-slate-100 hover:bg-slate-200 font-bold py-3 px-4 rounded-lg transition-colors">Chcę inną regułkę</button>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-8 w-full animate-fade-in">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-700 font-display">Czas na praktykę!</h2>
        <p className="text-slate-500 mt-1">Wpisz regułkę poniżej i naciśnij <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Enter</kbd>, by sprawdzić.</p>
      </div>
      
      {/* --- Panel Kontrolny --- */}
      <div className="p-4 bg-white/60 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {Object.values(HintLevel).map(level => (
            <button key={level} onClick={() => setHintLevel(level)} className={`w-full py-2.5 px-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${hintLevel === level ? 'bg-amber-400 text-slate-800 shadow' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'}`}>
              {level}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
            <label htmlFor="highlight-toggle" className="text-sm font-medium text-slate-600">Podświetlaj błędy</label>
            <button onClick={() => setIsHighlightingEnabled(!isHighlightingEnabled)} role="switch" aria-checked={isHighlightingEnabled} className={`relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ${isHighlightingEnabled ? 'bg-amber-500' : 'bg-slate-300'}`}>
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${isHighlightingEnabled ? 'translate-x-5' : 'translate-x-0'}`}/>
            </button>
        </div>
      </div>
      
      {/* --- Pole do Pisania --- */}
      <div 
        className="relative w-full min-h-[16rem] p-6 sm:p-8 bg-white border-2 border-slate-200 rounded-2xl focus-within:ring-4 focus-within:ring-amber-300 focus-within:border-amber-400 transition-all duration-300 text-3xl md:text-4xl tracking-wide leading-relaxed cursor-text shadow-inner"
        onClick={() => textInputRef.current?.focus()}
      >
        <div className="whitespace-pre-wrap">
            {renderUserProgress()}
            <span className="inline-block bg-amber-500 w-1.5 h-10 -mb-2 ml-1 animate-blink"></span>
        </div>
        <textarea
          ref={textInputRef}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="absolute top-0 left-0 w-full h-full p-6 sm:p-8 bg-transparent border-none outline-none resize-none text-transparent caret-transparent tracking-wide leading-relaxed"
          aria-label="Pole do ćwiczenia regułki"
        />
      </div>
      
      <button onClick={onReset} className="w-full text-center text-slate-500 hover:text-amber-600 transition-colors duration-200 pt-2 font-semibold">
        Zacznij od nowa
      </button>
    </div>
  );
};

export default PracticeMode;
