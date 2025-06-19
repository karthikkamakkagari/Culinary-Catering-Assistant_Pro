
import React, { useState, useEffect } from 'react';
import { Dish, Ingredient, DishIngredient, Language, LocalizedText, LanguageLabels, UITranslationKeys } from '../types'; 
import { placeholderImage, DEFAULT_IMAGE_SIZE } from '../constants'; 
import { getTranslatedText } from '../localization'; 
import ImageInput from './ImageInput'; 
import { getUIText } from '../translations';

interface DishFormProps {
    onSave: (data: { name: string, imageUrl: string | null, ingredients: DishIngredient[], id?: string, preparationSteps: string }) => void; // imageUrl can be null
    onCancel: () => void;
    existingDish?: Dish | null;
    ingredients: Ingredient[];
    generateId: () => string;
    currentUserPreferredLanguage: Language;
}

const DishForm: React.FC<DishFormProps> = 
({ onSave, onCancel, existingDish, ingredients, generateId, currentUserPreferredLanguage }) => {
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(existingDish?.imageUrl || null);
    const [selectedIngredients, setSelectedIngredients] = useState<DishIngredient[]>(existingDish?.ingredients || []);
    const [preparationStepsString, setPreparationStepsString] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (existingDish) {
            setName(getTranslatedText(existingDish.name, currentUserPreferredLanguage, Language.EN));
            setImageUrl(existingDish.imageUrl || null);
            setSelectedIngredients(existingDish.ingredients || []);
            setPreparationStepsString(getTranslatedText(existingDish.preparationSteps, currentUserPreferredLanguage, Language.EN));
        } else {
            setName('');
            setImageUrl(null);
            setSelectedIngredients([]);
            setPreparationStepsString('');
        }
    }, [existingDish, currentUserPreferredLanguage]);

    const handleIngredientToggle = (ingredientId: string) => {
        setSelectedIngredients(prev => {
            const isSelected = prev.find(i => i.ingredientId === ingredientId);
            if (isSelected) {
                return prev.filter(i => i.ingredientId !== ingredientId);
            } else {
                return [...prev, { ingredientId, quantity: 1 }];
            }
        });
    };

    const handleIngredientQuantityChange = (ingredientId: string, quantityValue: string) => {
        const quantity = parseFloat(quantityValue);
        setSelectedIngredients(prev => 
            prev.map(item => 
                item.ingredientId === ingredientId 
                ? { ...item, quantity: quantity > 0 ? quantity : 0 } 
                : item
            ).filter(item => item.quantity > 0) 
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
         if (!name.trim() || selectedIngredients.filter(si => si.quantity > 0).length === 0) {
            setError('Dish name and at least one ingredient with a quantity greater than 0 are required.'); // This error could be localized too
            return;
        }
        setError('');
        onSave({ 
            id: existingDish?.id, 
            name, 
            imageUrl, 
            ingredients: selectedIngredients.filter(si => si.quantity > 0), 
            preparationSteps: preparationStepsString,
        });
    };
    
    const formTitle = existingDish 
        ? getUIText(UITranslationKeys.EDIT_DISH_TITLE, currentUserPreferredLanguage)
        : getUIText(UITranslationKeys.ADD_DISH_TITLE, currentUserPreferredLanguage);
    const nameLabel = `${getUIText(UITranslationKeys.DISH_NAME_LABEL, currentUserPreferredLanguage)} (in ${LanguageLabels[currentUserPreferredLanguage]})`;
    const imageLabel = getUIText(UITranslationKeys.IMAGE_LABEL, currentUserPreferredLanguage);
    const prepStepsLabel = `${getUIText(UITranslationKeys.PREPARATION_STEPS_LABEL, currentUserPreferredLanguage)} (in ${LanguageLabels[currentUserPreferredLanguage]})`;
    const selectIngredientsLabel = getUIText(UITranslationKeys.SELECT_INGREDIENTS_LABEL, currentUserPreferredLanguage);
    const noIngredientsAvailableText = getUIText(UITranslationKeys.NO_INGREDIENTS_AVAILABLE, currentUserPreferredLanguage);
    const cancelText = getUIText(UITranslationKeys.CANCEL, currentUserPreferredLanguage);
    const saveButtonText = existingDish 
        ? getUIText(UITranslationKeys.SAVE_CHANGES, currentUserPreferredLanguage) 
        : getUIText(UITranslationKeys.ADD_DISH_TITLE, currentUserPreferredLanguage);


    return (
        <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="dish-form-title">
        <h2 id="dish-form-title" className="text-2xl font-semibold text-slate-800 mb-6">{formTitle}</h2>
        {error && <p className="text-red-500 text-sm bg-red-100 p-2 rounded-md">{error}</p>}
        <div>
            <label htmlFor="dish-name" className="block text-sm font-medium text-slate-700">{nameLabel}</label>
            <input id="dish-name" type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
        </div>
        
        <ImageInput
            label={imageLabel}
            idPrefix="dish-img"
            currentImageUrl={imageUrl}
            onImageUrlChange={setImageUrl}
        />

        <div>
            <label htmlFor="dish-prep-steps" className="block text-sm font-medium text-slate-700">{prepStepsLabel}</label>
            <textarea 
                id="dish-prep-steps" 
                value={preparationStepsString} 
                onChange={e => setPreparationStepsString(e.target.value)} 
                rows={4}
                className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Enter each step on a new line..."
            />
        </div>
        <div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">{selectIngredientsLabel}</h3>
            {ingredients.length === 0 && <p className="text-sm text-slate-500">{noIngredientsAvailableText}</p>}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {ingredients.map(ing => {
                const currentSelection = selectedIngredients.find(si => si.ingredientId === ing.id);
                const isSelected = !!currentSelection;
                return (
                    <div key={ing.id} className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between gap-2">
                            <label htmlFor={`ing-checkbox-${ing.id}`} className="flex items-center cursor-pointer flex-grow">
                                <input 
                                    type="checkbox"
                                    id={`ing-checkbox-${ing.id}`}
                                    checked={isSelected}
                                    onChange={() => handleIngredientToggle(ing.id)}
                                    className="mr-3 h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-700 ">{getTranslatedText(ing.name, currentUserPreferredLanguage)}</span>
                            </label>
                            {isSelected && (
                                <div className="flex items-center">
                                    <input 
                                        type="number" 
                                        min="0.01" 
                                        step="0.01" 
                                        value={currentSelection?.quantity || ''} 
                                        onChange={e => handleIngredientQuantityChange(ing.id, e.target.value)}
                                        className="w-20 p-1 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 text-right"
                                        aria-label={`Quantity for ${getTranslatedText(ing.name, currentUserPreferredLanguage)}`}
                                    />
                                    <span className="ml-2 text-sm text-slate-600 w-16 text-left truncate" title={ing.unit}>{ing.unit}</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
            </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md transition-colors">{cancelText}</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">{saveButtonText}</button>
        </div>
        </form>
    );
};

export default DishForm;