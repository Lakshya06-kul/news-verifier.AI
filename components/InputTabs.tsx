
import React from 'react';
import { InputType } from '../types';

interface InputTabsProps {
  activeTab: InputType;
  setActiveTab: (tab: InputType) => void;
}

const TextIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
  </svg>
);

const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const InputTabs: React.FC<InputTabsProps> = ({ activeTab, setActiveTab }) => {
  const commonButtonClasses = "flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue rounded-md flex items-center justify-center";
  const activeClasses = "bg-brand-blue text-white shadow";
  const inactiveClasses = "bg-brand-gray-200 text-brand-gray-800 hover:bg-brand-gray-300";

  return (
    <div className="flex space-x-2 bg-brand-gray-100 p-1 rounded-lg">
      <button
        onClick={() => setActiveTab(InputType.Text)}
        className={`${commonButtonClasses} ${activeTab === InputType.Text ? activeClasses : inactiveClasses}`}
      >
        <TextIcon className="h-5 w-5 mr-2" />
        Paste Article Text
      </button>
      <button
        onClick={() => setActiveTab(InputType.Image)}
        className={`${commonButtonClasses} ${activeTab === InputType.Image ? activeClasses : inactiveClasses}`}
      >
        <ImageIcon className="h-5 w-5 mr-2" />
        Upload Screenshot
      </button>
    </div>
  );
};

export default InputTabs;
