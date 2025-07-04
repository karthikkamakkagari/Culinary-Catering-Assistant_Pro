
import React, { useState, useEffect } from 'react';
import { CookingItem, CookingItemUnits, Language, LocalizedText, LanguageLabels, UITranslationKeys } from '../types'; 
import { placeholderImage, DEFAULT_IMAGE_SIZE } from '../constants'; 
import { getTranslatedText } from '../localization'; 
import ImageInput from './ImageInput'; 
import { getUIText } from '../translations'; 

interface CookingItemFormProps {
    onSave: (data: Omit<CookingItem, 'id'> & {id?:string}) => void; 
    onCancel: () => void;
    existingCookingItem?: CookingItem | null;
    units: string[];
    generateId: () => string;
    currentUserPreferredLanguage: Language;
    isSubmitting: boolean; 
}

const CookingItemForm: React.FC<CookingItemFormProps> = 
({ onSave, onCancel, existingCookingItem, units, generateId, currentUserPreferredLanguage, isSubmitting }) => {
    const [nameInput, setNameInput] = useState('');
    const [image_url, setImageUrl] = useState<string | null>(existingCookingItem?.image_url || null); // Updated
    const [summaryInput, setSummaryInput] = useState('');
    const [unit, setUnit] = useState(existingCookingItem?.unit || units[0]);
    const [price, setPrice] = useState(existingCookingItem?.price || 0);
    const [error, setError] = useState('');

    useEffect(() => {
        if (existingCookingItem) {
            setNameInput(getTranslatedText(existingCookingItem.name_localized, currentUserPreferredLanguage, Language.EN)); // Updated
            setImageUrl(existingCookingItem.image_url || null); // Updated
            setSummaryInput(getTranslatedText(existingCookingItem.summary_localized, currentUserPreferredLanguage, Language.EN)); // Updated
            setUnit(existingCookingItem.unit || units[0]);
            setPrice(existingCookingItem.price || 0);
        } else {
            setNameInput('');
            setImageUrl(null);
            setSummaryInput('');
            setUnit(units[0]);
            setPrice(0);
        }
    }, [existingCookingItem, currentUserPreferredLanguage, units]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nameInput.trim() || !summaryInput.trim() || price < 0) {
            setError('Name, summary, and non-negative price are required.');
            return;
        }
        setError('');
        const nameLocalized: LocalizedText = existingCookingItem?.name_localized ? { ...existingCookingItem.name_localized } : {};
        nameLocalized[currentUserPreferredLanguage] = nameInput;
        if (currentUserPreferredLanguage !== Language.EN && !nameLocalized[Language.EN]) { nameLocalized[Language.EN] = nameInput; }

        const summaryLocalized: LocalizedText = existingCookingItem?.summary_localized ? { ...existingCookingItem.summary_localized } : {};
        summaryLocalized[currentUserPreferredLanguage] = summaryInput;
        if (currentUserPreferredLanguage !== Language.EN && !summaryLocalized[Language.EN]) { summaryLocalized[Language.EN] = summaryInput; }
        
        onSave({ 
            id: existingCookingItem?.id,
            name_localized: nameLocalized, // Updated
            image_url: image_url || undefined, // Updated
            summary_localized: summaryLocalized, // Updated
            unit,
            price
        });
    };

    const formTitle = existingCookingItem ? getUIText(UITranslationKeys.EDIT_COOKING_ITEM_TITLE, currentUserPreferredLanguage) : getUIText(UITranslationKeys.ADD_COOKING_ITEM_TITLE, currentUserPreferredLanguage);
    const nameLabel = `${getUIText(UITranslationKeys.COOKING_ITEM_NAME_LABEL, currentUserPreferredLanguage)} (in ${LanguageLabels[currentUserPreferredLanguage]})`;
    const imageLabel = getUIText(UITranslationKeys.IMAGE_LABEL, currentUserPreferredLanguage);
    const summaryLabel = `${getUIText(UITranslationKeys.SUMMARY_LABEL, currentUserPreferredLanguage)} (in ${LanguageLabels[currentUserPreferredLanguage]})`;
    const unitLabel = getUIText(UITranslationKeys.UNIT_LABEL, currentUserPreferredLanguage);
    const priceLabel = getUIText(UITranslationKeys.COOKING_ITEM_PRICE_PER_UNIT_LABEL, currentUserPreferredLanguage);
    const cancelText = getUIText(UITranslationKeys.CANCEL, currentUserPreferredLanguage);
    const saveButtonText = isSubmitting ? "Saving..." : (existingCookingItem ? getUIText(UITranslationKeys.SAVE_CHANGES, currentUserPreferredLanguage) : getUIText(UITranslationKeys.ADD_COOKING_ITEM_TITLE, currentUserPreferredLanguage));

    return (
        <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="citem-form-title">
            <h2 id="citem-form-title" className="text-2xl font-semibold text-slate-800 mb-6">{formTitle}</h2>
            {error && <p className="text-red-500 text-sm bg-red-100 p-2 rounded-md">{error}</p>}
            <div>
                <label htmlFor="citem-name" className="block text-sm font-medium text-slate-700">{nameLabel}</label>
                <input id="citem-name" type="text" value={nameInput} onChange={e => setNameInput(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required disabled={isSubmitting}/>
            </div>
            
            <ImageInput label={imageLabel} idPrefix="citem-img" currentImageUrl={image_url} onImageUrlChange={setImageUrl} />

            <div>
                <label htmlFor="citem-summary" className="block text-sm font-medium text-slate-700">{summaryLabel}</label>
                <textarea id="citem-summary" value={summaryInput} onChange={e => setSummaryInput(e.target.value)} rows={3} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required disabled={isSubmitting}></textarea>
            </div>
            <div>
                <label htmlFor="citem-unit" className="block text-sm font-medium text-slate-700">{unitLabel}</label>
                <select id="citem-unit" value={unit} onChange={e => setUnit(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" disabled={isSubmitting}>
                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="citem-price" className="block text-sm font-medium text-slate-700">{priceLabel}</label>
                <input id="citem-price" type="number" value={price} onChange={e => setPrice(parseFloat(e.target.value))} min="0" step="0.01" className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required disabled={isSubmitting}/>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md transition-colors" disabled={isSubmitting}>{cancelText}</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-75 disabled:cursor-not-allowed" disabled={isSubmitting}>{saveButtonText}</button>
            </div>
        </form>
    );
};

export default CookingItemForm;
