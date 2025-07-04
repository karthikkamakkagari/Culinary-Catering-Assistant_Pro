
import React, { useState, useEffect } from 'react';
import { Dish, Ingredient, DishIngredient, Language, LocalizedText, LanguageLabels, UITranslationKeys } from '../types'; 
import { placeholderImage, DEFAULT_IMAGE_SIZE } from '../constants'; 
import { getTranslatedText, getIngredientName } from '../localization'; 
import ImageInput from './ImageInput'; 
import { getUIText } from '../translations';

interface DishFormProps {
    onSave: (data: Omit<Dish, 'id'> & {id?:string}) => void; 
    onCancel: () => void;
    existingDish?: Dish | null;
    ingredients: Ingredient[];
    generateId: () => string;
    currentUserPreferredLanguage: Language;
    isSubmitting: boolean; 
}

const DishForm: React.FC<DishFormProps> = 
({ onSave, onCancel, existingDish, ingredients, generateId, currentUserPreferredLanguage, isSubmitting }) => {
    const [nameInput, setNameInput] = useState('');
    const [image_url, setImageUrl] = useState<string | null>(existingDish?.image_url || null);
    const [selectedIngredients, setSelectedIngredients] = useState<DishIngredient[]>(existingDish?.ingredients || []);
    const [preparationStepsInput, setPreparationStepsInput] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (existingDish) {
            setNameInput(getTranslatedText(existingDish.name_localized, currentUserPreferredLanguage, Language.EN));
            setImageUrl(existingDish.image_url || null);
            setSelectedIngredients(existingDish.ingredients || []);
            setPreparationStepsInput(getTranslatedText(existingDish.preparation_steps_localized, currentUserPreferredLanguage, Language.EN));
        } else {
            setNameInput('');
            setImageUrl(null);
            setSelectedIngredients([]);
            setPreparationStepsInput('');
        }
    }, [existingDish, currentUserPreferredLanguage]);

    const handleIngredientToggle = (ingredientId: string) => {
        if(isSubmitting) return;
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
        if(isSubmitting) return;
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
         if (!nameInput.trim() || selectedIngredients.filter(si => si.quantity > 0).length === 0) {
            setError('Dish name and at least one ingredient with a quantity greater than 0 are required.');
            return;
        }
        setError('');
        const nameLocalized: LocalizedText = existingDish?.name_localized ? { ...existingDish.name_localized } : {};
        nameLocalized[currentUserPreferredLanguage] = nameInput;
        if (currentUserPreferredLanguage !== Language.EN && !nameLocalized[Language.EN]) { nameLocalized[Language.EN] = nameInput; }
        
        const prepStepsLocalized: LocalizedText = existingDish?.preparation_steps_localized ? { ...existingDish.preparation_steps_localized } : {};
        prepStepsLocalized[currentUserPreferredLanguage] = preparationStepsInput;
        if (currentUserPreferredLanguage !== Language.EN && !prepStepsLocalized[Language.EN]) { prepStepsLocalized[Language.EN] = preparationStepsInput; }
        
        onSave({ 
            id: existingDish?.id,
            name_localized: nameLocalized,
            image_url: image_url || undefined,
            ingredients: selectedIngredients.filter(si => si.quantity > 0), 
            preparation_steps_localized: prepStepsLocalized,
        });
    };
    
    const formTitle = existingDish ? getUIText(UITranslationKeys.EDIT_DISH_TITLE, currentUserPreferredLanguage) : getUIText(UITranslationKeys.ADD_DISH_TITLE, currentUserPreferredLanguage);
    const nameLabel = `${getUIText(UITranslationKeys.DISH_NAME_LABEL, currentUserPreferredLanguage)} (in ${LanguageLabels[currentUserPreferredLanguage]})`;
    const imageLabel = getUIText(UITranslationKeys.IMAGE_LABEL, currentUserPreferredLanguage);
    const prepStepsLabel = `${getUIText(UITranslationKeys.PREPARATION_STEPS_LABEL, currentUserPreferredLanguage)} (in ${LanguageLabels[currentUserPreferredLanguage]})`;
    const selectIngredientsLabel = getUIText(UITranslationKeys.SELECT_INGREDIENTS_LABEL, currentUserPreferredLanguage);
    const noIngredientsAvailableText = getUIText(UITranslationKeys.NO_INGREDIENTS_AVAILABLE, currentUserPreferredLanguage);
    const cancelText = getUIText(UITranslationKeys.CANCEL, currentUserPreferredLanguage);
    const saveButtonText = isSubmitting ? "Saving..." : (existingDish ? getUIText(UITranslationKeys.SAVE_CHANGES, currentUserPreferredLanguage) : getUIText(UITranslationKeys.ADD_DISH_TITLE, currentUserPreferredLanguage));

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2" aria-labelledby="dish-form-title">
            <h2 id="dish-form-title" className="text-2xl font-semibold text-slate-800 mb-6">{formTitle}</h2>
            {error && <p className="text-red-500 text-sm bg-red-100 p-2 rounded-md">{error}</p>}
            <div>
                <label htmlFor="dish-name" className="block text-sm font-medium text-slate-700">{nameLabel}</label>
                <input id="dish-name" type="text" value={nameInput} onChange={e => setNameInput(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required disabled={isSubmitting}/>
            </div>

            <ImageInput label={imageLabel} idPrefix="dish-img" currentImageUrl={image_url} onImageUrlChange={setImageUrl} />

            <div>
                <label htmlFor="dish-prep-steps" className="block text-sm font-medium text-slate-700">{prepStepsLabel}</label>
                <textarea id="dish-prep-steps" value={preparationStepsInput} onChange={e => setPreparationStepsInput(e.target.value)} rows={4} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" disabled={isSubmitting}></textarea>
            </div>

            <fieldset>
                <legend className="text-lg font-medium text-slate-700">{selectIngredientsLabel}</legend>
                {ingredients.length === 0 ? (
                    <p className="text-sm text-slate-500">{noIngredientsAvailableText}</p>
                ) : (
                    <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border border-slate-200 rounded-md p-2">
                        {ingredients.map(ing => {
                            const selected = selectedIngredients.find(i => i.ingredientId === ing.id);
                            return (
                                <div key={ing.id} className={`p-2 rounded-md transition-colors ${selected ? 'bg-blue-50' : ''}`}>
                                    <div className="flex items-center">
                                        <input
                                            id={`ing-checkbox-${ing.id}`}
                                            type="checkbox"
                                            checked={!!selected}
                                            onChange={() => handleIngredientToggle(ing.id)}
                                            className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                            disabled={isSubmitting}
                                        />
                                        <label htmlFor={`ing-checkbox-${ing.id}`} className="ml-3 block text-sm font-medium text-slate-700 flex-grow cursor-pointer">
                                            {getIngredientName(ing, currentUserPreferredLanguage)}
                                        </label>
                                    </div>
                                    {selected && (
                                        <div className="mt-2 pl-7 flex items-center space-x-2">
                                            <label htmlFor={`ing-qty-${ing.id}`} className="text-sm text-slate-600">
                                                {getUIText(UITranslationKeys.QUANTITY_LABEL, currentUserPreferredLanguage)}:
                                            </label>
                                            <input
                                                id={`ing-qty-${ing.id}`}
                                                type="number"
                                                value={selected.quantity}
                                                onChange={e => handleIngredientQuantityChange(ing.id, e.target.value)}
                                                min="0.001"
                                                step="any"
                                                className="w-24 p-1 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                                required
                                                disabled={isSubmitting}
                                            />
                                            <span className="text-sm text-slate-500">{ing.unit}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </fieldset>

            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md transition-colors" disabled={isSubmitting}>{cancelText}</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-75 disabled:cursor-not-allowed" disabled={isSubmitting}>{saveButtonText}</button>
            </div>
        </form>
    );
};

export default DishForm;
