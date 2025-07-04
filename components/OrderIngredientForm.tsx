import React, { useState, useEffect } from 'react';
import { CumulativeIngredient, Ingredient, IngredientUnits, Language, LanguageLabels, UITranslationKeys } from '../types.ts';
import { getUIText } from '../translations.ts';
import { getIngredientName } from '../localization.ts';

interface OrderIngredientFormProps {
    onSave: (data: {
        customerId: string;
        orderLineItemId?: string; 
        masterIngredientId?: string; 
        quantity: number;
        unit: string;
        isAdding: boolean;
    }) => void;
    onCancel: () => void;
    context: {
        customerId: string;
        orderLineItemId?: string; 
        isAdding: boolean;
        existingOrderItemData?: { name: string; quantity: number; unit: string; masterIngredientId: string };
    };
    masterIngredients: Ingredient[]; 
    ingredientUnits: string[];
    currentUserPreferredLanguage: Language;
    isSubmitting: boolean; 
}

const OrderIngredientForm: React.FC<OrderIngredientFormProps> = ({
    onSave,
    onCancel,
    context,
    masterIngredients,
    ingredientUnits,
    currentUserPreferredLanguage,
    isSubmitting 
}) => {
    const { customerId, orderLineItemId, isAdding, existingOrderItemData } = context;

    const [selectedMasterIngredientId, setSelectedMasterIngredientId] = useState<string>(
        isAdding ? (masterIngredients.length > 0 ? masterIngredients[0].id : '') : (existingOrderItemData?.masterIngredientId || '')
    );
    const [quantity, setQuantity] = useState<number>(existingOrderItemData?.quantity || 1);
    const [unit, setUnit] = useState<string>(existingOrderItemData?.unit || ingredientUnits[0]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (isAdding) {
            setSelectedMasterIngredientId(masterIngredients.length > 0 ? masterIngredients[0].id : '');
            setQuantity(1);
            setUnit(ingredientUnits.length > 0 ? ingredientUnits[0] : 'gram');
        } else if (existingOrderItemData) {
            setSelectedMasterIngredientId(existingOrderItemData.masterIngredientId);
            setQuantity(existingOrderItemData.quantity);
            setUnit(existingOrderItemData.unit);
        }
    }, [isAdding, existingOrderItemData, masterIngredients, ingredientUnits]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (quantity <= 0) { setError('Quantity must be a positive number.'); return; }
        if (isAdding && !selectedMasterIngredientId) { setError('Please select an ingredient.'); return; }
        onSave({ customerId, orderLineItemId: isAdding ? undefined : orderLineItemId, masterIngredientId: isAdding ? selectedMasterIngredientId : undefined, quantity, unit, isAdding });
    };

    const formTitle = isAdding ? getUIText(UITranslationKeys.ADD_ORDER_INGREDIENT_TITLE, currentUserPreferredLanguage) : getUIText(UITranslationKeys.EDIT_ORDER_INGREDIENT_TITLE, currentUserPreferredLanguage);
    const saveButtonText = isSubmitting ? "Saving..." : getUIText(UITranslationKeys.SAVE_CHANGES, currentUserPreferredLanguage);

    return (
        <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="order-ingredient-form-title">
            <h2 id="order-ingredient-form-title" className="text-2xl font-semibold text-slate-800 mb-6">{formTitle}</h2>
            {error && <p className="text-red-500 text-sm bg-red-100 p-2 rounded-md" role="alert">{error}</p>}

            {isAdding ? (
                <div>
                    <label htmlFor="master-ingredient-select" className="block text-sm font-medium text-slate-700">{getUIText(UITranslationKeys.MASTER_INGREDIENT_LABEL, currentUserPreferredLanguage)}</label>
                    <select id="master-ingredient-select" value={selectedMasterIngredientId} onChange={(e) => setSelectedMasterIngredientId(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required disabled={isSubmitting}>
                        <option value="" disabled>{getUIText(UITranslationKeys.SELECT_INGREDIENT_PLACEHOLDER, currentUserPreferredLanguage)}</option>
                        {masterIngredients.map(ing => (<option key={ing.id} value={ing.id}>{getIngredientName(ing, currentUserPreferredLanguage)}</option>))}
                    </select>
                </div>
            ) : (
                <div>
                    <p className="block text-sm font-medium text-slate-700">{getUIText(UITranslationKeys.ORDER_INGREDIENT_NAME_LABEL, currentUserPreferredLanguage)}</p>
                    <p className="mt-1 text-lg text-slate-800">{existingOrderItemData?.name || 'N/A'}</p>
                </div>
            )}
            <div>
                <label htmlFor="order-ingredient-quantity" className="block text-sm font-medium text-slate-700">{getUIText(UITranslationKeys.QUANTITY_LABEL, currentUserPreferredLanguage)}</label>
                <input id="order-ingredient-quantity" type="number" value={quantity} onChange={(e) => setQuantity(parseFloat(e.target.value))} min="0.001" step="0.001" className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required disabled={isSubmitting}/>
            </div>
            <div>
                <label htmlFor="order-ingredient-unit" className="block text-sm font-medium text-slate-700">{getUIText(UITranslationKeys.UNIT_LABEL, currentUserPreferredLanguage)}</label>
                <select id="order-ingredient-unit" value={unit} onChange={(e) => setUnit(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" disabled={isSubmitting}>
                    {ingredientUnits.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md transition-colors" disabled={isSubmitting}>{getUIText(UITranslationKeys.CANCEL, currentUserPreferredLanguage)}</button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-75 disabled:cursor-not-allowed" disabled={isSubmitting}>{saveButtonText}</button>
            </div>
        </form>
    );
};

export default OrderIngredientForm;