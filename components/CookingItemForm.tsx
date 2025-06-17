
import React, { useState, useEffect } from 'react';
import { CookingItem, CookingItemUnits, Language, LocalizedText, LanguageLabels, UITranslationKeys } from '../types'; 
import { placeholderImage, DEFAULT_IMAGE_SIZE } from '../constants'; 
import { getTranslatedText } from '../localization'; // Updated import path
import ImageInput from './ImageInput'; // Added
import { getUIText } from '../translations'; // Added for UI localization

interface CookingItemFormProps {
    onSave: (data: { name: string, imageUrl: string | null, summary: string, unit: string, id?:string }) => void; // imageUrl can be null
    onCancel: () => void;
    existingCookingItem?: CookingItem | null;
    units: string[];
    generateId: () => string;
    currentUserPreferredLanguage: Language;
}

const CookingItemForm: React.FC<CookingItemFormProps> = 
({ onSave, onCancel, existingCookingItem, units, generateId, currentUserPreferredLanguage }) => {
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(existingCookingItem?.imageUrl || null);
    const [summary, setSummary] = useState('');
    const [unit, setUnit] = useState(existingCookingItem?.unit || units[0]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (existingCookingItem) {
            setName(getTranslatedText(existingCookingItem.name, currentUserPreferredLanguage, Language.EN));
            setImageUrl(existingCookingItem.imageUrl || null);
            setSummary(getTranslatedText(existingCookingItem.summary, currentUserPreferredLanguage, Language.EN));
            setUnit(existingCookingItem.unit || units[0]);
        } else {
            setName('');
            setImageUrl(null);
            setSummary('');
            setUnit(units[0]);
        }
    }, [existingCookingItem, currentUserPreferredLanguage, units]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !summary.trim()) {
            setError('Name and summary are required.'); // This error message could also be localized
            return;
        }
        setError('');
        onSave({ 
            id: existingCookingItem?.id, 
            name, 
            imageUrl, 
            summary, 
            unit 
        });
    };

    const formTitle = existingCookingItem 
        ? getUIText(UITranslationKeys.EDIT_COOKING_ITEM_TITLE, currentUserPreferredLanguage)
        : getUIText(UITranslationKeys.ADD_COOKING_ITEM_TITLE, currentUserPreferredLanguage);
    const nameLabel = `${getUIText(UITranslationKeys.COOKING_ITEM_NAME_LABEL, currentUserPreferredLanguage)} (in ${LanguageLabels[currentUserPreferredLanguage]})`;
    const imageLabel = getUIText(UITranslationKeys.IMAGE_LABEL, currentUserPreferredLanguage);
    const summaryLabel = `${getUIText(UITranslationKeys.SUMMARY_LABEL, currentUserPreferredLanguage)} (in ${LanguageLabels[currentUserPreferredLanguage]})`;
    const unitLabel = getUIText(UITranslationKeys.UNIT_LABEL, currentUserPreferredLanguage);
    const cancelText = getUIText(UITranslationKeys.CANCEL, currentUserPreferredLanguage);
    const saveButtonText = existingCookingItem 
        ? getUIText(UITranslationKeys.SAVE_CHANGES, currentUserPreferredLanguage) 
        : getUIText(UITranslationKeys.ADD_COOKING_ITEM_TITLE, currentUserPreferredLanguage);


    return (
        <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="citem-form-title">
        <h2 id="citem-form-title" className="text-2xl font-semibold text-slate-800 mb-6">{formTitle}</h2>
        {error && <p className="text-red-500 text-sm bg-red-100 p-2 rounded-md">{error}</p>}
        <div>
            <label htmlFor="citem-name" className="block text-sm font-medium text-slate-700">{nameLabel}</label>
            <input id="citem-name" type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
        </div>
        
        <ImageInput
            label={imageLabel}
            idPrefix="citem-img"
            currentImageUrl={imageUrl}
            onImageUrlChange={setImageUrl}
        />

        <div>
            <label htmlFor="citem-summary" className="block text-sm font-medium text-slate-700">{summaryLabel}</label>
            <textarea id="citem-summary" value={summary} onChange={e => setSummary(e.target.value)} rows={3} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required></textarea>
        </div>
        <div>
            <label htmlFor="citem-unit" className="block text-sm font-medium text-slate-700">{unitLabel}</label>
            <select id="citem-unit" value={unit} onChange={e => setUnit(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md transition-colors">{cancelText}</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">{saveButtonText}</button>
        </div>
        </form>
    );
};

export default CookingItemForm;
