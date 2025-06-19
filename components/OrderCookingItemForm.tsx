import React, { useState, useEffect } from 'react';
import { CookingItem, Language, UITranslationKeys } from '../types';
import { getUIText } from '../translations';
import { getTranslatedText } from '../localization';

interface OrderCookingItemFormProps {
    onSave: (data: {
        customerId: string;
        orderLineItemId?: string; 
        masterCookingItemId?: string; 
        quantity: number;
        isAdding: boolean;
    }) => void;
    onCancel: () => void;
    context: {
        customerId: string;
        orderLineItemId?: string;
        isAdding: boolean;
        existingOrderItemData?: { 
            name: string; 
            quantity: number; 
            unit: string; 
            price: number;
            masterCookingItemId: string; 
        };
    };
    masterCookingItems: CookingItem[];
    currentUserPreferredLanguage: Language;
}

const OrderCookingItemForm: React.FC<OrderCookingItemFormProps> = ({
    onSave,
    onCancel,
    context,
    masterCookingItems,
    currentUserPreferredLanguage,
}) => {
    const { customerId, orderLineItemId, isAdding, existingOrderItemData } = context;

    const [selectedMasterCookingItemId, setSelectedMasterCookingItemId] = useState<string>(
        isAdding ? (masterCookingItems.length > 0 ? masterCookingItems[0].id : '') : (existingOrderItemData?.masterCookingItemId || '')
    );
    const [quantity, setQuantity] = useState<number>(existingOrderItemData?.quantity || 1);
    const [error, setError] = useState<string>('');
    
    // Display unit based on selected master item or existing item
    const displayUnit = isAdding 
        ? masterCookingItems.find(ci => ci.id === selectedMasterCookingItemId)?.unit 
        : existingOrderItemData?.unit;

    useEffect(() => {
        if (isAdding) {
            setSelectedMasterCookingItemId(masterCookingItems.length > 0 ? masterCookingItems[0].id : '');
            setQuantity(1);
        } else if (existingOrderItemData) {
            setSelectedMasterCookingItemId(existingOrderItemData.masterCookingItemId);
            setQuantity(existingOrderItemData.quantity);
        }
    }, [isAdding, existingOrderItemData, masterCookingItems]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (quantity <= 0) {
            setError('Quantity must be a positive number.');
            return;
        }
        if (isAdding && !selectedMasterCookingItemId) {
            setError('Please select a cooking item.');
            return;
        }

        onSave({
            customerId,
            orderLineItemId: isAdding ? undefined : orderLineItemId,
            masterCookingItemId: isAdding ? selectedMasterCookingItemId : undefined, // Send master ID for adding
            quantity,
            isAdding,
        });
    };

    const formTitle = isAdding
        ? getUIText(UITranslationKeys.ADD_ORDER_COOKING_ITEM_TITLE, currentUserPreferredLanguage)
        : getUIText(UITranslationKeys.EDIT_ORDER_COOKING_ITEM_TITLE, currentUserPreferredLanguage);

    return (
        <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="order-cooking-item-form-title">
            <h2 id="order-cooking-item-form-title" className="text-2xl font-semibold text-slate-800 mb-6">{formTitle}</h2>
            {error && <p className="text-red-500 text-sm bg-red-100 p-2 rounded-md" role="alert">{error}</p>}

            {isAdding ? (
                <div>
                    <label htmlFor="master-cooking-item-select" className="block text-sm font-medium text-slate-700">
                        {getUIText(UITranslationKeys.MASTER_COOKING_ITEM_LABEL, currentUserPreferredLanguage)}
                    </label>
                    <select
                        id="master-cooking-item-select"
                        value={selectedMasterCookingItemId}
                        onChange={(e) => setSelectedMasterCookingItemId(e.target.value)}
                        className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="" disabled>{getUIText(UITranslationKeys.SELECT_COOKING_ITEM_PLACEHOLDER, currentUserPreferredLanguage)}</option>
                        {masterCookingItems.map(item => (
                            <option key={item.id} value={item.id}>
                                {getTranslatedText(item.name, currentUserPreferredLanguage)} (Unit: {item.unit}, Price: ₹{item.price.toFixed(2)})
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                 <div>
                    <p className="block text-sm font-medium text-slate-700">
                      {getUIText(UITranslationKeys.ORDER_COOKING_ITEM_NAME_LABEL, currentUserPreferredLanguage)}
                    </p>
                    <p className="mt-1 text-lg text-slate-800">{existingOrderItemData?.name || 'N/A'}</p>
                    {existingOrderItemData?.unit && <p className="text-xs text-slate-500">Unit: {existingOrderItemData.unit}</p>}
                    {existingOrderItemData?.price && <p className="text-xs text-slate-500">Price per unit: ₹{existingOrderItemData.price.toFixed(2)}</p>}
                </div>
            )}

            <div>
                <label htmlFor="order-cooking-item-quantity" className="block text-sm font-medium text-slate-700">
                    {getUIText(UITranslationKeys.QUANTITY_LABEL, currentUserPreferredLanguage)} {displayUnit ? `(in ${displayUnit})` : ''}
                </label>
                <input
                    id="order-cooking-item-quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                    min="1"
                    step="1"
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md transition-colors"
                >
                    {getUIText(UITranslationKeys.CANCEL, currentUserPreferredLanguage)}
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                    {getUIText(UITranslationKeys.SAVE_CHANGES, currentUserPreferredLanguage)}
                </button>
            </div>
        </form>
    );
};

export default OrderCookingItemForm;
