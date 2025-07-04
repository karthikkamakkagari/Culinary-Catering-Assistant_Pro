
import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, ArrowUpTrayIcon, LinkIcon, PhotoIcon } from './icons.tsx';

interface ImageInputProps {
  currentImageUrl?: string | null;
  onImageUrlChange: (newUrl: string | null) => void;
  label: string;
  idPrefix: string;
}

const ImageInput: React.FC<ImageInputProps> = ({ currentImageUrl, onImageUrlChange, label, idPrefix }) => {
  const [inputType, setInputType] = useState<'upload' | 'url'>('url');
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [urlInputValue, setUrlInputValue] = useState(currentImageUrl && !currentImageUrl.startsWith('data:') ? currentImageUrl : '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(currentImageUrl || null);
    if (currentImageUrl && !currentImageUrl.startsWith('data:')) {
      setUrlInputValue(currentImageUrl);
    } else {
      setUrlInputValue(''); // Clear if it's a data URL or null
    }
  }, [currentImageUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File is too large. Please select an image under 5MB.");
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset file input
        }
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPreviewUrl(dataUrl);
        onImageUrlChange(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInputValue(event.target.value);
  };

  const handleUrlSet = () => {
    if (urlInputValue.trim()) {
        // Basic URL validation
        try {
            new URL(urlInputValue);
            setPreviewUrl(urlInputValue);
            onImageUrlChange(urlInputValue);
        } catch (_) {
            alert("Invalid URL format. Please enter a valid image URL.");
            // Optionally clear preview if URL is invalid and was previously set
            // setPreviewUrl(null); 
            // onImageUrlChange(null);
        }
    } else {
        // If URL is cleared, reflect this
        setPreviewUrl(null);
        onImageUrlChange(null);
    }
  };
  
  const handleClearImage = () => {
    setPreviewUrl(null);
    setUrlInputValue('');
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
    onImageUrlChange(null);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <div className="flex space-x-2 mb-2">
        <button
          type="button"
          onClick={() => setInputType('url')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            inputType === 'url' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          <LinkIcon className="w-4 h-4 inline mr-1" /> URL
        </button>
        <button
          type="button"
          onClick={() => setInputType('upload')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            inputType === 'upload' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          <ArrowUpTrayIcon className="w-4 h-4 inline mr-1" /> Upload
        </button>
      </div>

      {inputType === 'upload' && (
        <div>
          <input
            type="file"
            id={`${idPrefix}-file`}
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="block w-full text-sm text-slate-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
          <p className="text-xs text-slate-500 mt-1">Max file size: 5MB.</p>
        </div>
      )}

      {inputType === 'url' && (
        <div className="flex">
          <input
            type="url"
            id={`${idPrefix}-url`}
            value={urlInputValue}
            onChange={handleUrlInputChange}
            placeholder="https://example.com/image.jpg"
            className="flex-grow p-2 border border-slate-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
          />
          <button 
            type="button"
            onClick={handleUrlSet}
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-r-md text-sm"
          >
            Set
          </button>
        </div>
      )}

      {previewUrl && (
        <div className="mt-3 relative group w-36 h-36 border border-slate-200 rounded-md p-1">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded" />
          <button
            type="button"
            onClick={handleClearImage}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Clear image"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}
      {!previewUrl && (
         <div className="mt-3 w-36 h-36 border-2 border-dashed border-slate-300 rounded-md flex items-center justify-center bg-slate-50">
            <PhotoIcon className="w-12 h-12 text-slate-400" />
        </div>
      )}
    </div>
  );
};

export default ImageInput;