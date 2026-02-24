
import React from 'react';
import { AnalysisResult, Verdict } from '../types';

const VerdictIcon: React.FC<{ verdict: Verdict, className?: string }> = ({ verdict, className }) => {
    const icons = {
        [Verdict.Genuine]: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        [Verdict.Fake]: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
        ),
        [Verdict.PotentiallyMisleading]: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
        ),
        [Verdict.Inconclusive]: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
        ),
        [Verdict.Unknown]: <div />,
    };
    return <div className={className}>{icons[verdict]}</div>;
};


interface ResultDisplayProps {
  result: AnalysisResult | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  if (!result) return null;

  const verdictConfig = {
    [Verdict.Genuine]: {
      text: 'Genuine',
      bg: 'bg-green-100',
      text_color: 'text-brand-green',
      icon_color: 'text-brand-green',
    },
    [Verdict.Fake]: {
      text: 'Likely Fake',
      bg: 'bg-red-100',
      text_color: 'text-brand-red',
      icon_color: 'text-brand-red',
    },
    [Verdict.PotentiallyMisleading]: {
      text: 'Potentially Misleading',
      bg: 'bg-yellow-100',
      text_color: 'text-brand-yellow',
      icon_color: 'text-brand-yellow',
    },
    [Verdict.Inconclusive]: {
      text: 'Inconclusive',
      bg: 'bg-gray-200',
      text_color: 'text-brand-gray-800',
      icon_color: 'text-brand-gray-600',
    },
    [Verdict.Unknown]: {
        text: '',
        bg: '',
        text_color: '',
        icon_color: '',
    }
  };

  const config = verdictConfig[result.verdict];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
      <div className={`p-4 rounded-lg flex items-center ${config.bg}`}>
        <VerdictIcon verdict={result.verdict} className={`h-8 w-8 mr-4 ${config.icon_color}`} />
        <h2 className={`text-xl font-bold ${config.text_color}`}>{config.text}</h2>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-brand-gray-900 mb-2">AI Explanation</h3>
        <p className="text-brand-gray-800 whitespace-pre-wrap">{result.explanation}</p>
      </div>

      {result.sources && result.sources.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-brand-gray-900 mb-2">Sources Consulted</h3>
          <ul className="space-y-2">
            {result.sources.map((source, index) => (
              source.web && (
                <li key={index} className="flex items-start">
                  <span className="text-brand-blue mr-2">&#8226;</span>
                  <a 
                    href={source.web.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-brand-blue hover:underline break-all"
                  >
                    {source.web.title || source.web.uri}
                  </a>
                </li>
              )
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
