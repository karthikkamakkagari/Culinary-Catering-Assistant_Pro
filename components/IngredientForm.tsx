
import React, { useState, useEffect } from 'react';
import { Ingredient, IngredientUnits, Language, LanguageLabels, UITranslationKeys, LocalizedText } from '../types'; 
import { placeholderImage, DEFAULT_IMAGE_SIZE } from '../constants'; 
import { getIngredientName } from '../localization'; 
import ImageInput from './ImageInput'; 
import { getUIText } from '../translations'; 

interface IngredientFormProps {
    onSave: (data: Partial<Ingredient>) => void; 
    onCancel: () => void;
    existingIngredient?: Ingredient | null;
    units: string[];
    generateId: () => string;
    currentUserPreferredLanguage: Language;
    isSubmitting: boolean; 
}

const IngredientForm: React.FC<IngredientFormProps> = 
({ onSave, onCancel, existingIngredient, units, generateId, currentUserPreferredLanguage, isSubmitting }) => {
    const [nameInput, setNameInput] = useState('');
    const [image_url, setImageUrl] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [unit, setUnit] = useState(units[0]);
    const [price, setPrice] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        if (existingIngredient) {
            setNameInput(getIngredientName(existingIngredient, currentUserPreferredLanguage));
            setImageUrl(existingIngredient.image_url || null);
            setQuantity(existingIngredient.quantity || 1);
            setUnit(existingIngredient.unit || units[0]);
            setPrice(existingIngredient.price || 0);
        } else {
            setNameInput('');
            setImageUrl(null);
            setQuantity(1);
            setUnit(units[0]);
            setPrice(0);
        }
    }, [existingIngredient, currentUserPreferredLanguage, units]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nameInput.trim() || quantity <= 0 || price < 0) {
            setError('Name, positive quantity, and non-negative price are required.');
            return;
        }
        setError('');
        
        const nameLocalized: LocalizedText = existingIngredient?.name_localized ? { ...existingIngredient.name_localized } : {};
        nameLocalized[currentUserPreferredLanguage] = nameInput;
        
        // Ensure English name is present if it's not the current lang and doesn't exist.
        if (currentUserPreferredLanguage !== Language.EN && !nameLocalized[Language.EN]) {
            nameLocalized[Language.EN] = nameInput;
        }
        
        const dataToSave: Partial<Ingredient> = {
            id: existingIngredient?.id,
            name_localized: nameLocalized,
            image_url: image_url || undefined,
            quantity,
            unit,
            price,
        };

        onSave(dataToSave);
    };
    
    const formTitle = existingIngredient ? getUIText(UITranslationKeys.EDIT_INGREDIENT_TITLE, currentUserPreferredLanguage) : getUIText(UITranslationKeys.ADD_INGREDIENT_TITLE, currentUserPreferredLanguage);
    const nameLabel = `${getUIText(UITranslationKeys.INGREDIENT_NAME_LABEL, currentUserPreferredLanguage)} (in ${LanguageLabels[currentUserPreferredLanguage]})`;
    const imageLabel = getUIText(UITranslationKeys.IMAGE_LABEL, currentUserPreferredLanguage);
    const quantityLabel = getUIText(UITranslationKeys.QUANTITY_LABEL, currentUserPreferredLanguage);
    const unitLabel = getUIText(UITranslationKeys.UNIT_LABEL, currentUserPreferredLanguage);
    const priceLabel = getUIText(UITranslationKeys.INGREDIENT_PRICE_FOR_QTY_UNIT_LABEL, currentUserPreferredLanguage);
    const cancelText = getUIText(UITranslationKeys.CANCEL, currentUserPreferredLanguage);
    const saveButtonText = isSubmitting ? "Saving..." : (existingIngredient ? getUIText(UITranslationKeys.SAVE_CHANGES, currentUserPreferredLanguage) : getUIText(UITranslationKeys.ADD_INGREDIENT_TITLE, currentUserPreferredLanguage));


    return (
        <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="ingredient-form-title">
            <h2 id="ingredient-form-title" className="text-2xl font-semibold text-slate-800 mb-6">{formTitle}</h2>
            {error && <p className="text-red-500 text-sm bg-red-100 p-2 rounded-md">{error}</p>}
            
            <div>
                <label htmlFor="ingredient-name" className="block text-sm font-medium text-slate-700">{nameLabel}</label>
                <input id="ingredient-name" type="text" value={nameInput} onChange={e => setNameInput(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required disabled={isSubmitting}/>
            </div>
            
            <ImageInput label={imageLabel} idPrefix="ingredient-img" currentImageUrl={image_url} onImageUrlChange={setImageUrl} />

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="ingredient-quantity" className="block text-sm font-medium text-slate-700">{quantityLabel}</label>
                    <input id="ingredient-quantity" type="number" value={quantity} onChange={e => setQuantity(parseFloat(e.target.value))} min="0.001" step="any" className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required disabled={isSubmitting}/>
                </div>
                <div>
                    <label htmlFor="ingredient-unit" className="block text-sm font-medium text-slate-700">{unitLabel}</label>
                    <select id="ingredient-unit" value={unit} onChange={e => setUnit(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" disabled={isSubmitting}>
                        {units.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="ingredient-price" className="block text-sm font-medium text-slate-700">{priceLabel}</label>
                <input id="ingredient-price" type="number" value={price} onChange={e => setPrice(parseFloat(e.target.value))} min="0" step="0.01" className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required disabled={isSubmitting}/>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md transition-colors" disabled={isSubmitting}>{cancelText}</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-75 disabled:cursor-not-allowed" disabled={isSubmitting}>{saveButtonText}</button>
            </div>
        </form>
    );
};

export default IngredientForm;
