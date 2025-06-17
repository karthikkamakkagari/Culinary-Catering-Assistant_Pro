
import React from 'react';
import { PlusIcon, SearchIcon } from './icons'; 
import { Language, UITranslationKeys } from '../types'; 
// No direct import of getTranslatedText, as items are pre-filtered with their display names
import { getUIText } from '../translations'; // For static UI elements

interface CrudSectionProps {
  title: string; 
  items: any[]; 
  renderItem: (item: any) => React.ReactNode;
  onAdd: () => void;
  entityType: 'ingredient' | 'dish' | 'cookingItem' | 'customer';
  canAdd: boolean; 
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  currentUserPreferredLanguage: Language; 
  hasItems: boolean; 
  extraHeaderContent?: React.ReactNode; // Added prop
}

const CrudSection: React.FC<CrudSectionProps> = ({
  title,
  items,
  renderItem,
  onAdd,
  entityType,
  canAdd,
  searchTerm,
  onSearchTermChange,
  currentUserPreferredLanguage,
  hasItems, 
  extraHeaderContent, // Destructure new prop
}) => {

  const filteredItems = items; 

  const addButtonText = getUIText(UITranslationKeys.ADD_NEW, currentUserPreferredLanguage);
  const searchPlaceholderText = `${getUIText(UITranslationKeys.SEARCH_PLACEHOLDER, currentUserPreferredLanguage)} ${title.toLowerCase()}...`;


  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-slate-800 flex-shrink-0">{title}</h2>
        <div className="flex items-center gap-2 flex-wrap justify-end"> {/* Container for buttons */}
            {extraHeaderContent} {/* Render extra content here */}
            {canAdd && (
            <button
                onClick={onAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center"
                aria-label={`${addButtonText} ${entityType}`}
            >
                <PlusIcon className="w-5 h-5 mr-2" /> {addButtonText}
            </button>
            )}
        </div>
      </div>
      { (hasItems || searchTerm) && ( 
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder={searchPlaceholderText}
            className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            aria-label={`Search through ${title}`}
          />
          <SearchIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      )}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(renderItem)}
        </div>
      ) : (
        <p className="text-center text-slate-500 py-8 text-lg">
          {!hasItems 
            ? `No ${title.toLowerCase()} available. ${
                canAdd ? `${addButtonText} some!` : ''
              }`
            : 'No items match your search.'}
        </p>
      )}
    </div>
  );
};

export default CrudSection;
