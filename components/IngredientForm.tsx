
import React, { useState, useEffect } from 'react';
import { Ingredient, IngredientUnits, Language, LocalizedText, LanguageLabels, UITranslationKeys } from '../types'; 
import { placeholderImage, DEFAULT_IMAGE_SIZE } from '../constants'; 
import { getTranslatedText } from '../localization'; 
import ImageInput from './ImageInput'; 
import { getUIText } from '../translations'; 

interface IngredientFormProps {
    onSave: (data: { name: string, imageUrl: string | null, quantity: number, unit: string, price: number, id?: string }) => void;
    onCancel: () => void;
    existingIngredient?: Ingredient | null;
    units: string[];
    generateId: () => string;
    currentUserPreferredLanguage: Language;
}

const IngredientForm: React.FC<IngredientFormProps> = 
({ onSave, onCancel, existingIngredient, units, generateId, currentUserPreferredLanguage }) => {
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(existingIngredient?.imageUrl || null);
    const [quantity, setQuantity] = useState(existingIngredient?.quantity || 0);
    const [unit, setUnit] = useState(existingIngredient?.unit || units[0]);
    const [price, setPrice] = useState(existingIngredient?.price || 0);
    const [error, setError] = useState('');

    useEffect(() => {
        if (existingIngredient) {
            setName(getTranslatedText(existingIngredient.name, currentUserPreferredLanguage, Language.EN));
            setImageUrl(existingIngredient.imageUrl || null);
            setQuantity(existingIngredient.quantity || 0);
            setUnit(existingIngredient.unit || units[0]);
            setPrice(existingIngredient.price || 0);
        } else {
            setName('');
            setImageUrl(null);
            setQuantity(0);
            setUnit(units[0]);
            setPrice(0);
        }
    }, [existingIngredient, currentUserPreferredLanguage, units]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || quantity <= 0 || price < 0) {
            setError('Name, positive quantity, and non-negative price are required.');
            return;
        }
        setError('');
        
        onSave({ 
            id: existingIngredient?.id, 
            name, 
            imageUrl, 
            quantity, 
            unit,
            price
        });
    };
    
    const formTitle = existingIngredient 
        ? getUIText(UITranslationKeys.EDIT_INGREDIENT_TITLE, currentUserPreferredLanguage)
        : getUIText(UITranslationKeys.ADD_INGREDIENT_TITLE, currentUserPreferredLanguage);
    const nameLabel = `${getUIText(UITranslationKeys.INGREDIENT_NAME_LABEL, currentUserPreferredLanguage)} (in ${LanguageLabels[currentUserPreferredLanguage]})`;
    const imageLabel = getUIText(UITranslationKeys.IMAGE_LABEL, currentUserPreferredLanguage);
    const quantityLabel = getUIText(UITranslationKeys.QUANTITY_LABEL, currentUserPreferredLanguage);
    const unitLabel = getUIText(UITranslationKeys.UNIT_LABEL, currentUserPreferredLanguage);
    const priceLabel = getUIText(UITranslationKeys.INGREDIENT_PRICE_FOR_QTY_UNIT_LABEL, currentUserPreferredLanguage);
    const cancelText = getUIText(UITranslationKeys.CANCEL, currentUserPreferredLanguage);
    const saveButtonText = existingIngredient 
        ? getUIText(UITranslationKeys.SAVE_CHANGES, currentUserPreferredLanguage) 
        : getUIText(UITranslationKeys.ADD_INGREDIENT_TITLE, currentUserPreferredLanguage);


    return (
        <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="ingredient-form-title">
        <h2 id="ingredient-form-title" className="text-2xl font-semibold text-slate-800 mb-6">{formTitle}</h2>
        {error && <p className="text-red-500 text-sm bg-red-100 p-2 rounded-md">{error}</p>}
        <div>
            <label htmlFor="ing-name" className="block text-sm font-medium text-slate-700">{nameLabel}</label>
            <input id="ing-name" type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
        </div>
        
        <ImageInput
            label={imageLabel}
            idPrefix="ing-img"
            currentImageUrl={imageUrl}
            onImageUrlChange={setImageUrl}
        />

        <div>
            <label htmlFor="ing-quantity" className="block text-sm font-medium text-slate-700">{quantityLabel}</label>
            <input id="ing-quantity" type="number" value={quantity} onChange={e => setQuantity(parseFloat(e.target.value))} min="0.001" step="0.001" className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
        </div>
        <div>
            <label htmlFor="ing-unit" className="block text-sm font-medium text-slate-700">{unitLabel}</label>
            <select id="ing-unit" value={unit} onChange={e => setUnit(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
        </div>
        <div>
            <label htmlFor="ing-price" className="block text-sm font-medium text-slate-700">{priceLabel}</label>
            <input id="ing-price" type="number" value={price} onChange={e => setPrice(parseFloat(e.target.value))} min="0" step="0.001" className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md transition-colors">{cancelText}</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">{saveButtonText}</button>
        </div>
        </form>
    );
};

export default IngredientForm;