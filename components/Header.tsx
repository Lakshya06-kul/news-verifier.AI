
import React from 'react';

const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <ShieldCheckIcon className="h-8 w-8 text-brand-blue" />
          <h1 className="ml-3 text-2xl font-bold text-brand-gray-900 tracking-tight">
            News Verifier AI
          </h1>
        </div>
        <p className="text-center mt-1 text-sm text-brand-gray-600">
          Your AI-powered tool to combat misinformation.
        </p>
      </div>
    </header>
  );
};

export default Header;
