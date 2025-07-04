import React, { useState, useEffect } from 'react';
import { Customer, Dish, CookingItem, CustomerDishSelection, CustomerCookingItemSelection, Ingredient, UserRole, Language, LocalizedText, LanguageLabels } from '../types'; 
import { placeholderImage, DEFAULT_IMAGE_SIZE } from '../constants';
import { PlusIcon, TrashIcon } from './icons'; 
import { getTranslatedText, getIngredientName } from '../localization'; 
import ImageInput from './ImageInput'; 

const FormField: React.FC<{ label: string; children: React.ReactNode; error?: string; id?: string }> = ({ label, children, error, id }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1" role="alert">{error}</p>}
  </div>
);

interface CustomerFormProps {
    onSave: (data: Customer) => void;
    onCancel: () => void;
    existingCustomer?: (Omit<Customer, 'image_url'> & {image_url: string | null}) | null;
    dishes: Dish[];
    cookingItems: CookingItem[];
    ingredients: Ingredient[];
    currentUserId?: string;
    userRole?: UserRole;
    isProfileForm?: boolean;
    generateId: () => string;
    currentUserPreferredLanguage: Language;
    isSubmitting: boolean; 
}

const CustomerForm: React.FC<CustomerFormProps> = ({ 
    onSave, 
    onCancel, 
    existingCustomer, 
    dishes, 
    cookingItems, 
    ingredients, 
    currentUserId, 
    userRole, 
    isProfileForm = false,
    generateId,
    currentUserPreferredLanguage,
    isSubmitting 
}) => {
  const [name, setName] = useState(''); 
  const [image_url, setImageUrl] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [catering_name, setCateringName] = useState(''); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [currentCredits, setCurrentCredits] = useState<number | undefined>(undefined);
  const [number_of_persons, setNumberOfPersons] = useState(1); // Updated
  const [selectedDishes, setSelectedDishes] = useState<CustomerDishSelection[]>([]);
  const [selectedCookingItems, setSelectedCookingItems] = useState<CustomerCookingItemSelection[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (existingCustomer) {
        setName(existingCustomer.name || '');
        setImageUrl(existingCustomer.image_url || null); 
        setPhone(existingCustomer.phone || '');
        setAddress(existingCustomer.address || '');
        if (isProfileForm) {
            setEmail(existingCustomer.email || '');
            setCateringName(existingCustomer.catering_name || ''); 
            setCurrentCredits(existingCustomer.credits);
        } else {
            setNumberOfPersons(existingCustomer.number_of_persons || 1); // Updated
            setSelectedDishes(existingCustomer.selectedDishes || []);
            setSelectedCookingItems(existingCustomer.selectedCookingItems || []);
        }
    } else { 
        setName(''); setImageUrl(null); setPhone(''); setAddress('');
        if (isProfileForm) { setEmail(''); setCateringName(''); setCurrentCredits(undefined); }
        else { setNumberOfPersons(1); setSelectedDishes([]); setSelectedCookingItems([]); }
    }
  }, [existingCustomer, isProfileForm]);

  const nameInputId = isProfileForm ? 'profile-username' : 'customer-name';
  const phoneInputId = isProfileForm ? 'profile-phone' : 'customer-phone';
  const addressInputId = isProfileForm ? 'profile-address' : 'customer-address';
  const emailInputId = 'profile-email';
  const cateringNameInputId = 'profile-cateringname'; 
  const newPasswordInputId = 'profile-newpassword';
  const confirmNewPasswordInputId = 'profile-confirmnewpassword';
  const personsInputId = 'customer-persons';
  const imageInputIdPrefix = isProfileForm ? 'profile-img' : 'customer-img';

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = isProfileForm ? "Username is required." : "Name is required.";
    if (isProfileForm && name.length < 3 && name.trim()) newErrors.name = "Username must be at least 3 characters.";
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\+?[0-9\s-]{7,15}$/.test(phone)) newErrors.phone = "Invalid phone number format.";
    if (!address.trim()) newErrors.address = "Address is required.";
    if (isProfileForm) {
        if(!email.trim()) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format.";
        if (!catering_name.trim()) newErrors.catering_name = "Catering name is required."; 
        if (newPassword && newPassword.length < 6) newErrors.newPassword = "New password must be at least 6 characters.";
        if (newPassword && newPassword !== confirmNewPassword) newErrors.confirmNewPassword = "New passwords do not match.";
    } else if (number_of_persons <= 0) newErrors.number_of_persons = "Number of persons must be positive."; // Updated
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleToggleDish = (dishId: string) => { if(!isSubmitting) setSelectedDishes(prev => prev.find(sd => sd.dishId === dishId) ? prev.filter(sd => sd.dishId !== dishId) : [...prev, { dishId }]); };
  const handleCookingItemQuantityChange = (itemId: string, quantity: number) => {
    if(isSubmitting) return;
    const numQuantity = Number(quantity);
    setSelectedCookingItems(prev => {
      const existing = prev.find(sci => sci.cookingItemId === itemId);
      if (numQuantity > 0) return existing ? prev.map(sci => sci.cookingItemId === itemId ? { ...sci, quantity: numQuantity } : sci) : [...prev, { cookingItemId: itemId, quantity: numQuantity }];
      else return prev.filter(sci => sci.cookingItemId !== itemId);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let customerUserId = existingCustomer?.userId;
    if (!customerUserId && !existingCustomer && (userRole === UserRole.USER || userRole === UserRole.ADMIN) && currentUserId) {
        customerUserId = currentUserId;
    }
    
    const dataToSave: Customer = { 
        id: existingCustomer?.id || generateId(), 
        name, 
        image_url: image_url || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, name), 
        phone, 
        address,
        number_of_persons,
        selectedDishes,
        selectedCookingItems,
        userId: customerUserId,
        email: isProfileForm ? email : '',
        catering_name: isProfileForm ? catering_name : '',
        newPassword: isProfileForm ? (newPassword || undefined) : undefined,
        credits: existingCustomer?.credits,
        generated_order_details: existingCustomer?.generated_order_details || null,
    };
    onSave(dataToSave);
  };
  
  const getDishDetailsString = (dish: Dish): string => dish.ingredients.map(di => { const ing = ingredients.find(i => i.id === di.ingredientId); return ing ? `${getIngredientName(ing, currentUserPreferredLanguage)} (${di.quantity} ${ing.unit || ''})` : 'N/A'; }).join(', ') || 'No ingredients'; // Updated
  const formTitle = isProfileForm ? "Edit Profile" : (existingCustomer ? "Edit Customer Order" : "Add Customer Order");
  const saveButtonText = isSubmitting ? "Saving..." : (isProfileForm ? 'Save Profile' : (existingCustomer ? 'Save Changes' : 'Add Customer'));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2" aria-labelledby="form-title-id">
      <h2 id="form-title-id" className="text-2xl font-semibold text-slate-800 mb-6">{formTitle}</h2>
      {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
      <FormField label={isProfileForm ? "Username" : "Customer Name"} error={errors.name} id={nameInputId}>
        <input id={nameInputId} type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required disabled={isSubmitting}/>
      </FormField>
      <ImageInput label={isProfileForm ? "Profile Image" : "Customer Image"} idPrefix={imageInputIdPrefix} currentImageUrl={image_url} onImageUrlChange={setImageUrl}/> 
      <FormField label="Phone Number" error={errors.phone} id={phoneInputId}>
        <input id={phoneInputId} type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required disabled={isSubmitting}/>
      </FormField>
      <FormField label="Address" error={errors.address} id={addressInputId}>
        <textarea id={addressInputId} value={address} onChange={e => setAddress(e.target.value)} rows={3} className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required disabled={isSubmitting}></textarea>
      </FormField>
      {isProfileForm && (
        <>
          <FormField label="Email" error={errors.email} id={emailInputId}><input id={emailInputId} type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required disabled={isSubmitting}/></FormField>
          <FormField label="Catering Name" error={errors.catering_name} id={cateringNameInputId}><input id={cateringNameInputId} type="text" value={catering_name} onChange={e => setCateringName(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required disabled={isSubmitting}/></FormField> 
          <FormField label="New Password (leave blank to keep current)" error={errors.newPassword} id={newPasswordInputId}><input id={newPasswordInputId} type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min. 6 characters" className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" disabled={isSubmitting}/></FormField>
          {newPassword && (<FormField label="Confirm New Password" error={errors.confirmNewPassword} id={confirmNewPasswordInputId}><input id={confirmNewPasswordInputId} type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" disabled={isSubmitting}/></FormField>)}
          {currentCredits !== undefined && (<div className="mb-4 p-3 bg-slate-100 rounded-md"><p className="text-sm font-medium text-slate-700">Your Credits: <span className="font-bold text-blue-600">{userRole === UserRole.SUPREM ? 'Unlimited' : currentCredits}</span></p></div>)}
        </>
      )}
      {!isProfileForm && (
        <>
            <FormField label="Number of Persons" error={errors.number_of_persons} id={personsInputId}><input id={personsInputId} type="number" value={number_of_persons} onChange={e => setNumberOfPersons(parseInt(e.target.value))} min="1" className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required disabled={isSubmitting}/></FormField> {/* Updated */}
            <fieldset className="border-t pt-4 mt-4"><legend className="text-lg font-medium text-slate-700 mb-2">Select Dishes</legend>{dishes.length === 0 && <p className="text-sm text-slate-500">No dishes available.</p>}<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">{dishes.map(dish => (<label key={dish.id} className="flex items-start p-3 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"><input type="checkbox" checked={!!selectedDishes.find(sd => sd.dishId === dish.id)} onChange={() => handleToggleDish(dish.id)} className="mr-3 mt-1 h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" aria-labelledby={`dish-label-${dish.id}`} disabled={isSubmitting}/><div id={`dish-label-${dish.id}`}><span className="font-medium text-slate-700">{getTranslatedText(dish.name_localized, currentUserPreferredLanguage)}</span><p className="text-xs text-slate-500">Ingredients: {getDishDetailsString(dish)}</p></div></label>))}</div></fieldset> {/* Updated */}
            <fieldset className="border-t pt-4 mt-4"><legend className="text-lg font-medium text-slate-700 mb-2">Select Cooking Items</legend>{cookingItems.length === 0 && <p className="text-sm text-slate-500">No cooking items available.</p>}<div className="space-y-2 max-h-48 overflow-y-auto">{cookingItems.map(item => { const currentSelection = selectedCookingItems.find(sci => sci.cookingItemId === item.id); return (<div key={item.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-md"><div><label htmlFor={`cookingitem-qty-${item.id}`} className="font-medium text-slate-700">{getTranslatedText(item.name_localized, currentUserPreferredLanguage)}</label><p className="text-xs text-slate-500">Unit: {item.unit}</p></div><input id={`cookingitem-qty-${item.id}`} type="number" min="0" value={currentSelection?.quantity || 0} onChange={e => handleCookingItemQuantityChange(item.id, parseInt(e.target.value))} className="w-20 p-1 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500" aria-label={`Quantity for ${getTranslatedText(item.name_localized, currentUserPreferredLanguage)}`} disabled={isSubmitting}/></div>); })}</div></fieldset> {/* Updated */}
        </>
      )}
      <div className="flex justify-end space-x-3 pt-6">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md transition-colors" disabled={isSubmitting}>Cancel</button>
        <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-75 disabled:cursor-not-allowed" disabled={isSubmitting}>{saveButtonText}</button>
      </div>
    </form>
  );
};

export default CustomerForm;