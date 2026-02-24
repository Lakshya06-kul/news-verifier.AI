
import React, { useState, useCallback } from 'react';
import { InputType, AnalysisResult, ImageData, Verdict } from './types';
import { analyzeNews } from './services/geminiService';
import Header from './components/Header';
import InputTabs from './components/InputTabs';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to read file as base64 string.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });

const Spinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-brand-gray-800 font-medium">Analyzing... this may take a moment.</p>
    </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InputType>(InputType.Text);
  const [textInput, setTextInput] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleImageChange = useCallback((file: File) => {
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setError(null);
    setResult(null);
  }, []);

  const handleClearImage = useCallback(() => {
    setImageFile(null);
    if(imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  }, [imagePreview]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
    setError(null);
    setResult(null);
  };
  
  const handleSubmit = async () => {
    let prompt = '';
    let imageData: ImageData | undefined = undefined;

    if (activeTab === InputType.Text && !textInput.trim()) {
        setError('Please enter some text to analyze.');
        return;
    }
    if (activeTab === InputType.Image && !imageFile) {
        setError('Please upload an image to analyze.');
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
        if (activeTab === InputType.Image && imageFile) {
            prompt = "Analyze the content of this news article screenshot to determine if it's genuine or fake.";
            const base64 = await fileToBase64(imageFile);
            imageData = { base64, mimeType: imageFile.type };
        } else {
            prompt = `Please analyze the following news article text: "${textInput}"`;
        }
        
        const analysisResult = await analyzeNews(prompt, imageData);
        setResult(analysisResult);
    } catch (e: any) {
        setError(e.message || 'An unexpected error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  const isButtonDisabled = (activeTab === InputType.Text && !textInput.trim()) || (activeTab === InputType.Image && !imageFile) || isLoading;

  return (
    <div className="min-h-screen bg-brand-gray-100 font-sans">
      <Header />
      <main className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <InputTabs activeTab={activeTab} setActiveTab={(tab) => {
                setActiveTab(tab);
                setResult(null);
                setError(null);
            }} />
            
            <div className="mt-6">
            {activeTab === InputType.Text ? (
                <textarea
                    value={textInput}
                    onChange={handleTextChange}
                    placeholder="Paste the full text of the news article here..."
                    className="w-full h-48 p-3 border border-brand-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-shadow resize-y"
                    disabled={isLoading}
                />
            ) : (
                <ImageUploader 
                    imagePreview={imagePreview}
                    onImageChange={handleImageChange}
                    onClear={handleClearImage}
                />
            )}
            </div>

            <div className="mt-6">
                <button
                    onClick={handleSubmit}
                    disabled={isButtonDisabled}
                    className="w-full bg-brand-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-all duration-200 disabled:bg-brand-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? 'Analyzing...' : 'Verify News'}
                </button>
            </div>
        </div>

        <div className="mt-8">
            {isLoading && <Spinner />}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">{error}</div>}
            {result && <ResultDisplay result={result} />}
        </div>
      </main>
    </div>
  );
};

export default App;
