

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Page, Ingredient, Dish, CookingItem, Customer, ModalType, IngredientUnits, CookingItemUnits, DishIngredient, CustomerDishSelection, CustomerCookingItemSelection, GeneratedOrder, CumulativeIngredient, AuthUser, UserRole, Language, LocalizedText, LanguageLabels, UITranslationKeys } from './types';
import { APP_TITLE, placeholderImage, DEFAULT_IMAGE_SIZE, baseNavigationItems, DEFAULT_SUPREM_USER, SupportedLanguages, LanguageLabelMapping, IngredientBaseUnits, UnitConversionFactors } from './constants';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon, DocumentTextIcon, CalculatorIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon, UserCircleIcon, EyeIcon, EyeSlashIcon, UserPlusIcon, ArrowLeftOnRectangleIcon, CogIcon, CheckCircleIcon, ShieldCheckIcon, InformationCircleIcon, ArrowLeftIcon, PrinterIcon, DocumentArrowDownIcon, ArrowUpTrayIcon, ArrowDownTrayIcon } from './components/icons';
import Modal from './components/Modal';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import CustomerForm from './components/CustomerForm';
import CrudSection from './components/CrudSection';
import IngredientForm from './components/IngredientForm';
import DishForm from './components/DishForm';
import CookingItemForm from './components/CookingItemForm';
import UserManagementPage from './components/UserManagementPage';
import UserDetailsViewComponent from './components/UserDetailsViewComponent';
import PublicHomePage from './components/PublicHomePage';
import { getUIText } from './translations';
import { getTranslatedText } from './localization'; // Import from new location
import * as XLSX from 'xlsx';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 9);

// getTranslatedText function moved to localization.ts


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.PublicHome);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [users, setUsers] = useState<AuthUser[]>([DEFAULT_SUPREM_USER]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Sample multilingual data
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 'ing1', name: { en: 'Salt', te: 'ఉప్పు', ta: 'உப்பு', kn: 'ಉಪ್ಪು', hi: 'नमक' }, imageUrl: placeholderImage(100,100,'salt'), quantity: 1000, unit: 'gram' },
    { id: 'ing2', name: { en: 'Tomato', te: 'టమోటా', ta: 'தக்காளி', kn: 'ಟೊಮೆಟೊ', hi: 'टमाटर' }, imageUrl: placeholderImage(100,100,'tomato'), quantity: 50, unit: 'piece' },
    { id: 'ing3', name: { en: 'Onion', te: 'ఉల్లిపాయ', ta: 'வெங்காயம்', kn: 'ಈರುಳ್ಳಿ', hi: 'प्याज' }, imageUrl: placeholderImage(100,100,'onion'), quantity: 60, unit: 'piece' },
  ]);
  const [dishes, setDishes] = useState<Dish[]>([
    {
      id: 'dish1',
      name: { en: 'Tomato Soup', te: 'టమోటా సూప్', hi: 'टमाटर का सूप' },
      imageUrl: placeholderImage(150,150,'soup'),
      ingredients: [{ ingredientId: 'ing2', quantity: 5 }, { ingredientId: 'ing1', quantity: 0.1}],
      preparationSteps: {
        en: "1. Sauté onions and garlic.\n2. Add chopped tomatoes and vegetable broth.\n3. Simmer for 20 minutes.\n4. Blend until smooth.\n5. Season with salt, pepper, and herbs.",
        te: "1. ఉల్లిపాయలు మరియు వెల్లుల్లి వేయించాలి.\n2. తరిగిన టమోటాలు మరియు కూరగాయల రసం జోడించండి.\n3. 20 నిమిషాలు ఆవేశమును అణిచిపెట్టుకొను.\n4. మృదువైన వరకు కలపండి.\n5. ఉప్పు, మిరియాలు, మరియు మూలికలతో సీజన్.",
        hi: "1. प्याज और लहसुन भूनें।\n2. कटे हुए टमाटर और सब्जी का शोरबा डालें।\n3. 20 मिनट तक उबालें।\n4. चिकना होने तक ब्लेंड करें।\n5. नमक, काली मिर्च और जड़ी बूटियों के साथ सीजन करें।"
      }
    },
  ]);
  const [cookingItems, setCookingItems] = useState<CookingItem[]>([
    { id: 'ci1', name: { en: 'Large Pot', te: 'పెద్ద కుండ' }, summary: {en: 'A large pot for cooking for many.', te: 'చాలా మందికి వండడానికి పెద్ద కుండ.'}, imageUrl: placeholderImage(100,100,'pot'), unit: 'piece' },
  ]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedUserForView, setSelectedUserForView] = useState<AuthUser | null>(null);
  const [previousPageBeforeUserDetails, setPreviousPageBeforeUserDetails] = useState<Page | null>(null);

  const importIngredientsInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auth Handlers
  const handleLogin = (loggedInUser: AuthUser) => {
    setCurrentUser(loggedInUser);
    setCurrentPage(Page.Home);
  };

  const handleSignup = (newUserData: Omit<AuthUser, 'id' | 'isApproved' | 'role' | 'credits'> & {email: string, preferredLanguage: Language, imageUrl?: string | null}) => {
    const newUser: AuthUser = {
      ...newUserData,
      id: generateId(),
      isApproved: false,
      role: UserRole.USER,
      credits: 0,
      imageUrl: newUserData.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE,DEFAULT_IMAGE_SIZE, newUserData.username),
      preferredLanguage: newUserData.preferredLanguage || Language.EN,
    };
    setUsers(prev => [...prev, newUser]);
    alert('Waiting for approval.'); // Updated alert message
    setCurrentPage(Page.Login);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage(Page.PublicHome);
    setSelectedUserForView(null);
    setPreviousPageBeforeUserDetails(null);
  };

  const handleApproveUser = (userId: string, roleToAssign: UserRole) => {
    if (currentUser?.role !== UserRole.SUPREM) return;
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, isApproved: true, role: roleToAssign } : u));
    alert(`User approved and role set to ${roleToAssign}!`);
  };

  const handleSetUserCredits = (userId: string, newCredits: number) => {
    if (currentUser?.role !== UserRole.SUPREM) return;
    if (isNaN(newCredits) || newCredits < 0) {
        alert("Invalid credit amount. Please enter a non-negative number.");
        return;
    }
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.id === userId) return { ...u, credits: newCredits };
      return u;
    }));
    if (currentUser?.id === userId) {
        setCurrentUser(prev => prev ? {...prev, credits: newCredits} : null);
    }
    if (selectedUserForView && selectedUserForView.id === userId) {
        setSelectedUserForView(prev => prev ? {...prev, credits: newCredits} : null);
    }
    alert('User credits updated!');
  };

  const handleUpdateUserLanguage = (userId: string, language: Language) => {
    if (currentUser?.role !== UserRole.SUPREM && currentUser?.id !== userId) {
        alert("Permission denied to change language preference.");
        return;
    }
    setUsers(prevUsers => prevUsers.map(u => {
        if (u.id === userId) return { ...u, preferredLanguage: language };
        return u;
    }));
    if (currentUser?.id === userId) {
        setCurrentUser(prev => prev ? { ...prev, preferredLanguage: language } : null);
    }
    if (selectedUserForView?.id === userId) {
        setSelectedUserForView(prev => prev ? { ...prev, preferredLanguage: language } : null);
    }
    alert(`User language preference updated to ${LanguageLabelMapping[language]}.`);
  };

  const handleUpdateUserDetailsBySuprem = (userId: string, updatedDetails: Partial<Pick<AuthUser, 'username' | 'cateringName' | 'phone' | 'address' | 'email'>>) => {
    if (currentUser?.role !== UserRole.SUPREM) {
        alert("Permission denied.");
        return;
    }
    setUsers(prevUsers => prevUsers.map(u => {
        if (u.id === userId) {
            return { ...u, ...updatedDetails };
        }
        return u;
    }));
    if (selectedUserForView?.id === userId) {
        setSelectedUserForView(prev => prev ? { ...prev, ...updatedDetails } as AuthUser : null);
    }
    if (currentUser?.id === userId) {
        setCurrentUser(prev => prev ? { ...prev, ...updatedDetails } as AuthUser : null);
    }
    alert('User details updated successfully by Suprem.');
  };


  const handleViewUserDetails = (userToView: AuthUser) => {
    if (currentUser?.role !== UserRole.SUPREM) return;
    setSelectedUserForView(userToView);
    setPreviousPageBeforeUserDetails(currentPage);
    setCurrentPage(Page.UserDetailsView);
  };

  const openModal = (type: ModalType, item: any | null = null) => {
    setModalType(type);
    setEditingItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setModalType(null);
  };

  const canPerformAction = (action: 'add' | 'edit' | 'delete', entity: 'ingredient' | 'dish' | 'cookingItem' | 'customer', item?: any): boolean => {
    if (!currentUser) return false;
    const { role, credits, id: currentUserId } = currentUser;

    if (role === UserRole.SUPREM) return true;

    if (entity === 'ingredient') {
        if (role === UserRole.ADMIN) {
            if (action === 'add') return false; // ADMIN cannot add new ingredients
            return true; // ADMIN can edit/delete existing ingredients
        }
        return false; // USER cannot manage ingredients
    }

    if (entity === 'dish' || entity === 'cookingItem') {
        if (role === UserRole.ADMIN) return true; // Admins can manage dishes and cooking items
        return false; // Users cannot
    }
    
    if (entity === 'customer') {
        if (role === UserRole.ADMIN) {
            if (action === 'add') return credits > 0;
            if (action === 'edit' || action === 'delete') {
                // Admins can edit/delete customers they created, if credits are non-negative
                return item && item.userId === currentUserId && credits >= 0;
            }
        }
        if (role === UserRole.USER) {
            if (action === 'add') return credits > 0;
            if (action === 'edit' || action === 'delete') {
                // Users can edit/delete customers they created, if credits are non-negative
                return item && item.userId === currentUserId && credits >= 0;
            }
        }
        return false;
    }
    return false;
  };

  const handleSaveIngredient = (ingredientData: {name: string, imageUrl:string | null, quantity: number, unit: string, id?: string}) => {
    if (!canPerformAction(editingItem ? 'edit' : 'add', 'ingredient') || !currentUser) {
      alert(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser.preferredLanguage));
      return;
    }
    const id = ingredientData.id || editingItem?.id || generateId();
    const existing = ingredients.find(i => i.id === id);
    const newNameLocalized: LocalizedText = existing?.name ? {...existing.name} : {};
    newNameLocalized[currentUser.preferredLanguage] = ingredientData.name;
    if (!newNameLocalized[Language.EN] && currentUser.preferredLanguage !== Language.EN) newNameLocalized[Language.EN] = ingredientData.name;


    const ingredient: Ingredient = {
        id,
        name: newNameLocalized,
        imageUrl: ingredientData.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, getTranslatedText(newNameLocalized, currentUser.preferredLanguage)),
        quantity: ingredientData.quantity,
        unit: ingredientData.unit,
    };

    setIngredients(prev => editingItem ? prev.map(i => i.id === id ? ingredient : i) : [...prev, ingredient]);
    closeModal();
  };

  const handleDeleteIngredient = (id: string) => {
     if (!canPerformAction('delete', 'ingredient') || !currentUser) {
      alert(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser.preferredLanguage));
      return;
    }
    setIngredients(prev => prev.filter(i => i.id !== id));
    setDishes(prevDishes => prevDishes.map(dish => ({
      ...dish,
      ingredients: dish.ingredients.filter(di => di.ingredientId !== id)
    })));
  };

  const handleSaveDish = (dishData: {name: string, imageUrl:string | null, ingredients: DishIngredient[], id?:string, preparationSteps: string}) => {
    if (!canPerformAction(editingItem ? 'edit' : 'add', 'dish') || !currentUser) {
      alert(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser.preferredLanguage));
      return;
    }
    const id = dishData.id || editingItem?.id || generateId();
    const existing = dishes.find(d => d.id === id);

    const newNameLocalized: LocalizedText = existing?.name ? {...existing.name} : {};
    newNameLocalized[currentUser.preferredLanguage] = dishData.name;
    if (!newNameLocalized[Language.EN] && currentUser.preferredLanguage !== Language.EN) newNameLocalized[Language.EN] = dishData.name;

    const newPrepStepsLocalized: LocalizedText = existing?.preparationSteps ? {...existing.preparationSteps} : {};
    newPrepStepsLocalized[currentUser.preferredLanguage] = dishData.preparationSteps;
    if (!newPrepStepsLocalized[Language.EN] && currentUser.preferredLanguage !== Language.EN) {
        newPrepStepsLocalized[Language.EN] = dishData.preparationSteps;
    }

    const dish: Dish = {
        id,
        name: newNameLocalized,
        imageUrl: dishData.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, getTranslatedText(newNameLocalized, currentUser.preferredLanguage)),
        ingredients: dishData.ingredients,
        preparationSteps: newPrepStepsLocalized,
    };
    setDishes(prev => editingItem ? prev.map(d => d.id === id ? dish : d) : [...prev, dish]);
    closeModal();
  };

  const handleDeleteDish = (id: string) => {
    if (!canPerformAction('delete', 'dish') || !currentUser) {
      alert(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser.preferredLanguage));
      return;
    }
    setDishes(prev => prev.filter(d => d.id !== id));
    setCustomers(prevCustomers => prevCustomers.map(customer => ({
      ...customer,
      selectedDishes: customer.selectedDishes.filter(sd => sd.dishId !== id)
    })));
  };

  const handleSaveCookingItem = (itemData: {name: string, imageUrl:string | null, summary: string, unit: string, id?: string}) => {
     if (!canPerformAction(editingItem ? 'edit' : 'add', 'cookingItem') || !currentUser) {
      alert(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser.preferredLanguage));
      return;
    }
    const id = itemData.id || editingItem?.id || generateId();
    const existing = cookingItems.find(ci => ci.id === id);
    const newNameLocalized: LocalizedText = existing?.name ? {...existing.name} : {};
    const newSummaryLocalized: LocalizedText = existing?.summary ? {...existing.summary} : {};

    newNameLocalized[currentUser.preferredLanguage] = itemData.name;
    if (!newNameLocalized[Language.EN] && currentUser.preferredLanguage !== Language.EN) newNameLocalized[Language.EN] = itemData.name;
    newSummaryLocalized[currentUser.preferredLanguage] = itemData.summary;
    if (!newSummaryLocalized[Language.EN] && currentUser.preferredLanguage !== Language.EN) newSummaryLocalized[Language.EN] = itemData.summary;


    const item: CookingItem = {
        id,
        name: newNameLocalized,
        imageUrl: itemData.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE,DEFAULT_IMAGE_SIZE, getTranslatedText(newNameLocalized, currentUser.preferredLanguage)),
        summary: newSummaryLocalized,
        unit: itemData.unit,
    };
    setCookingItems(prev => editingItem ? prev.map(ci => ci.id === id ? item : ci) : [...prev, item]);
    closeModal();
  };

  const handleDeleteCookingItem = (id: string) => {
    if (!canPerformAction('delete', 'cookingItem') || !currentUser) {
      alert(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser.preferredLanguage));
      return;
    }
    setCookingItems(prev => prev.filter(ci => ci.id !== id));
    setCustomers(prevCustomers => prevCustomers.map(customer => ({
      ...customer,
      selectedCookingItems: customer.selectedCookingItems.filter(sci => sci.cookingItemId !== id)
    })));
  };

  const handleSaveCustomer = (submittedCustomerData: Customer) => {
    if (!currentUser) return;

    const finalImageUrl = submittedCustomerData.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, submittedCustomerData.name);

    if (editingItem) {
        const originalCustomer = editingItem as Customer;
        if (!canPerformAction('edit', 'customer', originalCustomer)) {
             alert(`Permission denied or insufficient credits to modify this customer.`);
             closeModal();
             return;
        }

        const updatedCustomer: Customer = {
            ...originalCustomer,
            ...submittedCustomerData,
            id: originalCustomer.id,
            imageUrl: finalImageUrl,
            userId: originalCustomer.userId,
        };

        setCustomers(prevCustomers =>
            prevCustomers.map(c => c.id === originalCustomer.id ? updatedCustomer : c)
        );
        alert('Customer details updated!');

    } else {
        if (!canPerformAction('add', 'customer')) {
            alert(`Insufficient credits to add a new customer.`);
            closeModal();
            return;
        }

        const newCustomer: Customer = {
            ...submittedCustomerData,
            id: generateId(), // Ensure new customers get a new ID
            imageUrl: finalImageUrl,
            userId: (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.USER) ? currentUser.id : undefined,
            generatedOrder: null,
        };

        setCustomers(prevCustomers => [...prevCustomers, newCustomer]);

        if (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.USER) {
            const newCreditCount = currentUser.credits - 1;
            setCurrentUser(prev => prev ? { ...prev, credits: newCreditCount } : null);
            setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? { ...u, credits: newCreditCount } : u));
            alert('Customer added! 1 credit used.');
        } else {
            alert('Customer added!');
        }
    }
    closeModal();
  };

  const handleSaveProfile = (profileData: Customer) => {
    if (!currentUser) return;

    const updatedUser: AuthUser = {
        ...currentUser,
        username: profileData.name,
        imageUrl: profileData.imageUrl || currentUser.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE,DEFAULT_IMAGE_SIZE, profileData.name),
        phone: profileData.phone,
        address: profileData.address,
        email: profileData.email || currentUser.email,
        password: profileData.newPassword && profileData.newPassword.length > 0 ? profileData.newPassword : currentUser.password,
    };

    setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    alert('Profile updated successfully!');
    closeModal();
};

  const handleDeleteCustomer = (id: string) => {
    if(!currentUser) return;
    const customerToDelete = customers.find(c => c.id === id);

    if (!customerToDelete) {
        alert("Customer not found.");
        return;
    }

    if (!canPerformAction('delete', 'customer', customerToDelete)) {
        alert(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser.preferredLanguage));
        return;
    }

    setCustomers(prev => prev.filter(c => c.id !== id));
    alert('Customer record deleted.');
  };

  // --- Smart Ingredient Calculation Helpers ---
  const convertToBaseUnit = (quantity: number, unit: string): { quantityInBase: number; baseUnit: string } => {
    const unitLower = unit.toLowerCase();
    const conversion = UnitConversionFactors[unitLower];

    if (conversion) {
        return { quantityInBase: quantity * conversion.toBase, baseUnit: conversion.baseUnit };
    }
    // For units not in factors (like 'piece', 'leaves'), or if baseUnit is not weight/volume (e.g. 'cup' of something specific)
    // pass through or handle as discrete. For now, pass through as 'piece' if not explicitly volume/weight.
    if (unitLower === IngredientBaseUnits.PIECE.toLowerCase() || unitLower === IngredientBaseUnits.LEAVES.toLowerCase()) {
         return { quantityInBase: quantity, baseUnit: unitLower };
    }
    // Default pass-through if no specific conversion found, assuming it's a discrete unit or already base.
    return { quantityInBase: quantity, baseUnit: unitLower };
  };

  const formatDisplayQuantity = (quantityInBase: number, baseUnit: string): { displayQuantity: number; displayUnit: string } => {
    if (baseUnit === IngredientBaseUnits.WEIGHT) {
        if (quantityInBase >= 1000) {
            return { displayQuantity: quantityInBase / 1000, displayUnit: 'kg' };
        }
        return { displayQuantity: quantityInBase, displayUnit: 'gram' };
    }
    if (baseUnit === IngredientBaseUnits.VOLUME) {
        if (quantityInBase >= 1000) {
            return { displayQuantity: quantityInBase / 1000, displayUnit: 'liters' };
        }
        return { displayQuantity: quantityInBase, displayUnit: 'ml' };
    }
    // For discrete units like 'piece', 'leaves', or unconvertible pass-throughs
    return { displayQuantity: quantityInBase, displayUnit: baseUnit };
  };
  // --- End Smart Ingredient Calculation Helpers ---

  const handleGenerateOrder = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer || !currentUser) return;

    const cumulativeIngredientsMap = new Map<string, { totalQuantityInBase: number; baseUnit: string; displayName: string }>();

    customer.selectedDishes.forEach(sd => {
      const dish = dishes.find(d => d.id === sd.dishId);
      if (dish) {
        dish.ingredients.forEach(di => {
          const ingredient = ingredients.find(i => i.id === di.ingredientId);
          if (ingredient) {
            const { quantityInBase, baseUnit } = convertToBaseUnit(di.quantity, ingredient.unit);
            const requiredQuantityInBase = quantityInBase * customer.numberOfPersons;

            const current = cumulativeIngredientsMap.get(ingredient.id) || {
                totalQuantityInBase: 0,
                baseUnit: baseUnit, // Store the base unit
                displayName: getTranslatedText(ingredient.name, currentUser.preferredLanguage)
            };

            // Ensure accumulation happens in the same base unit if an ingredient is used with different initial units
            if (current.baseUnit !== baseUnit && ( (current.baseUnit === IngredientBaseUnits.WEIGHT && baseUnit === IngredientBaseUnits.WEIGHT) || (current.baseUnit === IngredientBaseUnits.VOLUME && baseUnit === IngredientBaseUnits.VOLUME) ) ){
                // This scenario (e.g. salt in grams and salt in kg for same dish) should ideally be standardized
                // or the convertToBaseUnit should always return the primary base (gram/ml).
                // For now, if baseUnits are compatible (both weight or both volume), it should be fine.
                // If radically different (e.g. piece vs gram), the map key (ingredient.id) handles separation.
            }

            current.totalQuantityInBase += requiredQuantityInBase;
            cumulativeIngredientsMap.set(ingredient.id, current);
          }
        });
      }
    });

    const cumulativeIngredientsResult: CumulativeIngredient[] = Array.from(cumulativeIngredientsMap.values()).map(entry => {
        const { displayQuantity, displayUnit } = formatDisplayQuantity(entry.totalQuantityInBase, entry.baseUnit);
        return {
            name: entry.displayName,
            totalQuantity: displayQuantity,
            unit: displayUnit
        };
    });

    const selectedCookingItemsDetails = customer.selectedCookingItems.map(sci => {
        const item = cookingItems.find(ci => ci.id === sci.cookingItemId);
        return item ? {
            name: getTranslatedText(item.name, currentUser.preferredLanguage),
            quantity: sci.quantity,
            unit: item.unit
        } : null;
    }).filter(Boolean) as Array<{ name: string; quantity: number; unit: string }>;

    const generatedOrder: GeneratedOrder = {
        cumulativeIngredients: cumulativeIngredientsResult,
        selectedCookingItems: selectedCookingItemsDetails,
    };

    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, generatedOrder } : c));
    alert(`Order generated for ${customer.name}! Check customer details.`);
  };

  const generateOrderHtmlContent = (customer: Customer, forUser: AuthUser): string => {
    if (!customer.generatedOrder) return "<p>Order not generated.</p>";
    const userLang = forUser.preferredLanguage;
    const { name, phone, address, numberOfPersons, generatedOrder } = customer;

    let html = `
      <!DOCTYPE html>
      <html lang="${userLang}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${getUIText(UITranslationKeys.PDF_ORDER_SUMMARY_TITLE, userLang)} - ${name}</title>
        <style>
          body { font-family: sans-serif; margin: 20px; color: #333; }
          .container { max-width: 800px; margin: auto; padding: 20px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          h1, h2, h3 { color: #333; }
          h1 { text-align: center; margin-bottom: 5px; }
          h2 { border-bottom: 2px solid #eee; padding-bottom: 5px; margin-top: 30px; }
          .logo { max-width: 150px; max-height: 70px; display: block; margin: 0 auto 10px; }
          .meta-info { text-align: center; font-size: 0.9em; color: #555; margin-bottom: 20px; }
          .section { margin-bottom: 20px; }
          .section p { margin: 5px 0; }
          .section strong { display: inline-block; min-width: 120px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          ul { padding-left: 20px; }
          .footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
    `;

    if (forUser.imageUrl) {
        html += `<img src="${forUser.imageUrl}" alt="${getUIText(UITranslationKeys.PDF_USER_LOGO_ALT, userLang)}" class="logo">`;
    }
    html += `<h1>${forUser.cateringName || APP_TITLE}</h1>`;
    html += `<p class="meta-info">${getUIText(UITranslationKeys.PDF_ORDER_SUMMARY_TITLE, userLang)}<br>${getUIText(UITranslationKeys.PDF_GENERATED_ON_LABEL, userLang)} ${new Date().toLocaleString()}</p>`;

    html += `<div class="section"><h2>${getUIText(UITranslationKeys.PDF_PREPARED_BY_LABEL, userLang)}</h2>`;
    html += `<p><strong>${getUIText(UITranslationKeys.NAME_LABEL, userLang)}</strong> ${forUser.username}</p>`;
    html += `<p><strong>${getUIText(UITranslationKeys.PDF_USER_CATERING_NAME_LABEL, userLang)}</strong> ${forUser.cateringName}</p>`;
    html += `<p><strong>${getUIText(UITranslationKeys.PDF_USER_PHONE_LABEL, userLang)}</strong> ${forUser.phone}</p>`;
    html += `<p><strong>${getUIText(UITranslationKeys.PDF_USER_ADDRESS_LABEL, userLang)}</strong> ${forUser.address}</p></div>`;

    html += `<div class="section"><h2>${getUIText(UITranslationKeys.PDF_CUSTOMER_LABEL, userLang)} ${name}</h2>`;
    html += `<p><strong>${getUIText(UITranslationKeys.PDF_CUSTOMER_PHONE_LABEL, userLang)}</strong> ${phone}</p>`;
    html += `<p><strong>${getUIText(UITranslationKeys.PDF_CUSTOMER_ADDRESS_LABEL, userLang)}</strong> ${address}</p>`;
    html += `<p><strong>${getUIText(UITranslationKeys.PDF_NUM_PERSONS_LABEL, userLang)}</strong> ${numberOfPersons}</p></div>`;

    html += `<div class="section"><h2>${getUIText(UITranslationKeys.PDF_SELECTED_DISHES_TITLE, userLang)}</h2>`;
    if (customer.selectedDishes.length > 0) {
        html += `<ul>`;
        customer.selectedDishes.forEach(sd => {
            const dish = dishes.find(d => d.id === sd.dishId);
            if (dish) {
                 html += `<li>${getTranslatedText(dish.name, userLang)}</li>`;
            }
        });
        html += `</ul>`;
    } else {
        html += `<p>${getUIText(UITranslationKeys.PDF_NO_DISHES_SELECTED, userLang)}</p>`;
    }
    html += `</div>`;

    html += `<div class="section"><h2>${getUIText(UITranslationKeys.PDF_REQUIRED_INGREDIENTS_TITLE, userLang)}</h2>`;
    if (generatedOrder.cumulativeIngredients.length > 0) {
        html += `<table><thead><tr><th>${getUIText(UITranslationKeys.PDF_INGREDIENTS_TABLE_HEADER_NAME, userLang)}</th><th>${getUIText(UITranslationKeys.PDF_INGREDIENTS_TABLE_HEADER_QUANTITY, userLang)}</th><th>${getUIText(UITranslationKeys.PDF_INGREDIENTS_TABLE_HEADER_UNIT, userLang)}</th></tr></thead><tbody>`;
        generatedOrder.cumulativeIngredients.forEach(ing => {
            html += `<tr><td>${ing.name}</td><td>${ing.totalQuantity.toFixed(2)}</td><td>${ing.unit}</td></tr>`;
        });
        html += `</tbody></table>`;
    } else {
        html += `<p>${getUIText(UITranslationKeys.PDF_NO_INGREDIENTS_CALCULATED, userLang)}</p>`;
    }
    html += `</div>`;

    html += `<div class="section"><h2>${getUIText(UITranslationKeys.PDF_SELECTED_COOKING_ITEMS_TITLE, userLang)}</h2>`;
    if (generatedOrder.selectedCookingItems.length > 0) {
        html += `<table><thead><tr><th>${getUIText(UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_NAME, userLang)}</th><th>${getUIText(UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_QUANTITY, userLang)}</th><th>${getUIText(UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_UNIT, userLang)}</th></tr></thead><tbody>`;
        generatedOrder.selectedCookingItems.forEach(item => {
            html += `<tr><td>${item.name}</td><td>${item.quantity}</td><td>${item.unit}</td></tr>`;
        });
        html += `</tbody></table>`;
    } else {
        html += `<p>${getUIText(UITranslationKeys.PDF_NO_COOKING_ITEMS_SELECTED, userLang)}</p>`;
    }
    html += `</div>`;

    html += `<p class="footer">${getUIText(UITranslationKeys.PDF_THANK_YOU_MESSAGE, userLang)}</p>`;
    html += `</div></body></html>`;
    return html;
  };

  const handleViewHtmlOrder = (customer: Customer) => {
    if (!customer.generatedOrder || !currentUser) {
      alert("Please generate the order first.");
      return;
    }
    const htmlContent = generateOrderHtmlContent(customer, currentUser);
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    } else {
      alert("Could not open new window. Please check your pop-up blocker settings.");
    }
  };

  const handlePrintOrder = (customer: Customer) => {
    if (!customer.generatedOrder || !currentUser) {
      alert("Please generate the order first.");
      return;
    }
    const htmlContent = generateOrderHtmlContent(customer, currentUser);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => { // Ensure content is loaded before printing
        printWindow.focus(); // Focus is important for some browsers
        printWindow.print();
        // printWindow.close(); // Optional: close after print dialog
      };
    } else {
      alert("Could not open new window for printing. Please check your pop-up blocker settings.");
    }
  };


  const handleViewPdfOrder = async (customer: Customer) => {
    if (!customer.generatedOrder || !currentUser) {
      alert("Please generate the order first.");
      return;
    }

    const globalJspdf = (window as any).jspdf;
    if (!globalJspdf || !globalJspdf.jsPDF) {
        alert("PDF library (jsPDF) not loaded. Please check browser console for errors.");
        console.error("jsPDF or window.jspdf is undefined.");
        return;
    }

    const jsPDFConstructor = globalJspdf.jsPDF;
    const doc = new jsPDFConstructor();

    if (typeof (doc as any).autoTable !== 'function') {
        alert("PDF Table plugin (jsPDF-AutoTable) not loaded correctly.");
        console.error("doc.autoTable is not a function.");
        return;
    }

    const userLang = currentUser.preferredLanguage;
    let yPos = 15;
    const pageMargin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = (text: string) => doc.getTextWidth(text);
    const centerText = (text: string, y: number) => {
        doc.text(text, (pageWidth - textWidth(text)) / 2, y);
    };

    // Add Logo (if available)
    if (currentUser.imageUrl) {
        try {
            const imgData = currentUser.imageUrl;
            let imageFormat = 'JPEG';
            if (imgData.startsWith('data:image/png') || imgData.toLowerCase().endsWith('.png')) {
                imageFormat = 'PNG';
            } else if (imgData.startsWith('data:image/jpeg') || imgData.toLowerCase().endsWith('.jpg') || imgData.toLowerCase().endsWith('.jpeg')) {
                imageFormat = 'JPEG';
            }
            const img = new Image();
            img.src = imgData;

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            const logoHeight = 15;
            const logoWidth = (img.width * logoHeight) / img.height;
            doc.addImage(imgData, imageFormat, pageMargin, yPos, logoWidth, logoHeight);
            yPos += logoHeight + 5;
        } catch (e) {
            console.error("Failed to add logo to PDF:", e);
            doc.setFontSize(8);
            doc.text(`(${getUIText(UITranslationKeys.PDF_USER_LOGO_ALT, userLang)} - ${getUIText(UITranslationKeys.IMAGE_LABEL, userLang)} error)`, pageMargin, yPos + 5);
            yPos += 10;
        }
    }


    doc.setFontSize(18);
    centerText(currentUser.cateringName || APP_TITLE, yPos); yPos += 7;
    doc.setFontSize(14);
    centerText(getUIText(UITranslationKeys.PDF_ORDER_SUMMARY_TITLE, userLang), yPos); yPos += 5;
    doc.setFontSize(10);
    centerText(`${getUIText(UITranslationKeys.PDF_GENERATED_ON_LABEL, userLang)} ${new Date().toLocaleString()}`, yPos); yPos += 10;

    doc.setFontSize(12);
    doc.text(`${getUIText(UITranslationKeys.PDF_PREPARED_BY_LABEL, userLang)}`, pageMargin, yPos); yPos += 6;
    doc.setFontSize(10);
    doc.text(`${getUIText(UITranslationKeys.NAME_LABEL, userLang)}: ${currentUser.username}`, pageMargin + 5, yPos); yPos += 5;
    doc.text(`${getUIText(UITranslationKeys.PDF_USER_CATERING_NAME_LABEL, userLang)}: ${currentUser.cateringName}`, pageMargin + 5, yPos); yPos += 5;
    doc.text(`${getUIText(UITranslationKeys.PDF_USER_PHONE_LABEL, userLang)}: ${currentUser.phone}`, pageMargin + 5, yPos); yPos += 5;
    doc.text(`${getUIText(UITranslationKeys.PDF_USER_ADDRESS_LABEL, userLang)}: ${currentUser.address}`, pageMargin + 5, yPos); yPos += 10;

    doc.setLineWidth(0.2);
    doc.line(pageMargin, yPos - 3, pageWidth - pageMargin, yPos - 3);


    doc.setFontSize(12);
    doc.text(`${getUIText(UITranslationKeys.PDF_CUSTOMER_LABEL, userLang)} ${customer.name}`, pageMargin, yPos); yPos += 6;
    doc.setFontSize(10);
    doc.text(`${getUIText(UITranslationKeys.PDF_CUSTOMER_PHONE_LABEL, userLang)} ${customer.phone}`, pageMargin + 5, yPos); yPos += 5;
    doc.text(`${getUIText(UITranslationKeys.PDF_CUSTOMER_ADDRESS_LABEL, userLang)} ${customer.address}`, pageMargin + 5, yPos); yPos += 5;
    doc.text(`${getUIText(UITranslationKeys.PDF_NUM_PERSONS_LABEL, userLang)} ${customer.numberOfPersons}`, pageMargin + 5, yPos); yPos += 10;

    doc.setFontSize(12);
    doc.text(getUIText(UITranslationKeys.PDF_SELECTED_DISHES_TITLE, userLang), pageMargin, yPos); yPos += 7;
    if (customer.selectedDishes.length > 0) {
        customer.selectedDishes.forEach(sd => {
            const dish = dishes.find(d => d.id === sd.dishId);
            if (dish) {
                doc.setFontSize(10);
                doc.text(`- ${getTranslatedText(dish.name, userLang)}`, pageMargin + 5, yPos); yPos += 5;
            }
        });
    } else {
        doc.setFontSize(10);
        doc.text(getUIText(UITranslationKeys.PDF_NO_DISHES_SELECTED, userLang), pageMargin + 5, yPos); yPos += 7;
    }
    yPos += 5;

    doc.setFontSize(14);
    doc.text(getUIText(UITranslationKeys.PDF_REQUIRED_INGREDIENTS_TITLE, userLang), pageMargin, yPos); yPos += 8;

    if (customer.generatedOrder.cumulativeIngredients.length > 0) {
      (doc as any).autoTable({
        startY: yPos,
        head: [[
            getUIText(UITranslationKeys.PDF_INGREDIENTS_TABLE_HEADER_NAME, userLang),
            getUIText(UITranslationKeys.PDF_INGREDIENTS_TABLE_HEADER_QUANTITY, userLang),
            getUIText(UITranslationKeys.PDF_INGREDIENTS_TABLE_HEADER_UNIT, userLang)
        ]],
        body: customer.generatedOrder.cumulativeIngredients.map(ing => [ing.name, ing.totalQuantity.toFixed(2), ing.unit]),
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
        margin: { left: pageMargin, right: pageMargin }
      });
      yPos = (doc as any).lastAutoTable.finalY + 10;
    } else {
      doc.setFontSize(10);
      doc.text(getUIText(UITranslationKeys.PDF_NO_INGREDIENTS_CALCULATED, userLang), pageMargin, yPos); yPos += 7;
    }

    doc.setFontSize(14);
    doc.text(getUIText(UITranslationKeys.PDF_SELECTED_COOKING_ITEMS_TITLE, userLang), pageMargin, yPos); yPos += 8;

    if (customer.generatedOrder.selectedCookingItems.length > 0) {
      (doc as any).autoTable({
        startY: yPos,
        head: [[
            getUIText(UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_NAME, userLang),
            getUIText(UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_QUANTITY, userLang),
            getUIText(UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_UNIT, userLang)
        ]],
        body: customer.generatedOrder.selectedCookingItems.map(item => [item.name, item.quantity, item.unit]),
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
        margin: { left: pageMargin, right: pageMargin }
      });
      yPos = (doc as any).lastAutoTable.finalY + 10;
    } else {
      doc.setFontSize(10);
      doc.text(getUIText(UITranslationKeys.PDF_NO_COOKING_ITEMS_SELECTED, userLang), pageMargin, yPos); yPos +=7;
    }

    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
            `${currentUser.cateringName} - ${getUIText(UITranslationKeys.PDF_PAGE_LABEL, userLang)} ${i} ${getUIText(UITranslationKeys.PDF_OF_LABEL, userLang)} ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }
    doc.setPage(pageCount);

    doc.setFontSize(10);
    centerText(getUIText(UITranslationKeys.PDF_THANK_YOU_MESSAGE, userLang), yPos + 5);

    doc.output('dataurlnewwindow');
};

  const handleEditProfile = () => {
    if (!currentUser) return;
    const profileFormData: Customer = {
      id: currentUser.id,
      name: currentUser.username,
      imageUrl: currentUser.imageUrl || '',
      phone: currentUser.phone,
      address: currentUser.address,
      email: currentUser.email,
      credits: currentUser.credits,
      numberOfPersons: 0,
      selectedDishes: [],
      selectedCookingItems: [],
    };
    openModal('profile', profileFormData);
  };

  const getVisibleNavItems = () => {
    if (!currentUser) return [];
    return baseNavigationItems.filter(item => item.roles.includes(currentUser.role));
  };

    const handleExportIngredientsExcel = () => {
        if (!currentUser || (currentUser.role !== UserRole.SUPREM && currentUser.role !== UserRole.ADMIN)) {
            alert(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser.preferredLanguage));
            return;
        }

        const dataToExport = ingredients.map(ing => {
            const row: any = {
                id: ing.id,
                imageUrl: ing.imageUrl,
                quantity: ing.quantity,
                unit: ing.unit,
            };
            SupportedLanguages.forEach(lang => {
                row[`name_${lang}`] = ing.name[lang] || '';
            });
            return row;
        });

        // Define header order explicitly for consistency
        const headers = ["id", ...SupportedLanguages.map(lang => `name_${lang}`), "imageUrl", "quantity", "unit"];
        const worksheet = XLSX.utils.json_to_sheet(dataToExport, { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ingredients");
        XLSX.writeFile(workbook, "ingredients_export.xlsx");

        alert(getUIText(UITranslationKeys.ALERT_INGREDIENTS_EXPORTED_SUCCESS, currentUser.preferredLanguage));
    };

    const handleImportIngredientsExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!currentUser || (currentUser.role !== UserRole.SUPREM && currentUser.role !== UserRole.ADMIN)) {
            alert(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser.preferredLanguage));
            return;
        }
        const file = event.target.files?.[0];
        if (!file) {
            alert(getUIText(UITranslationKeys.EXCEL_NO_FILE_SELECTED_ALERT, currentUser.preferredLanguage));
            return;
        }
        if (!file.name.toLowerCase().endsWith(".xlsx")) {
             alert(getUIText(UITranslationKeys.EXCEL_INVALID_FILE_FORMAT_ALERT, currentUser.preferredLanguage));
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target?.result;
            if (!data) {
                alert(getUIText(UITranslationKeys.EXCEL_IMPORT_FAILURE_ALERT, currentUser.preferredLanguage));
                return;
            }
            try {
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]; // header:1 gives array of arrays

                if (jsonData.length < 2) { // Must have header + at least one data row
                    alert(getUIText(UITranslationKeys.EXCEL_IMPORT_FAILURE_ALERT, currentUser.preferredLanguage) + " (Empty or header-only file)");
                    return;
                }

                const rawHeaders = jsonData[0].map(h => String(h).trim());

                const expectedBaseHeaders = ["id", "imageUrl", "quantity", "unit"];
                const expectedNameHeaders = SupportedLanguages.map(lang => `name_${lang}`);
                const expectedHeaders = [...expectedBaseHeaders.slice(0,1), ...expectedNameHeaders, ...expectedBaseHeaders.slice(1)];


                if (rawHeaders.length !== expectedHeaders.length || !expectedHeaders.every(eh => rawHeaders.includes(eh))) {
                     alert(getUIText(UITranslationKeys.EXCEL_HEADER_MISMATCH_ALERT, currentUser.preferredLanguage, Language.EN, {
                        expectedHeaders: expectedHeaders.join(', '),
                        actualHeaders: rawHeaders.join(', ')
                     }));
                    return;
                }

                // Create a map of header names to their column index
                const headerMap: { [key: string]: number } = {};
                rawHeaders.forEach((header, index) => {
                    headerMap[header] = index;
                });


                let existingIngredients = [...ingredients];
                let importedCount = 0;
                let updatedCount = 0;

                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i];
                    if (!row || row.every(cell => cell === null || cell === undefined || String(cell).trim() === '')) continue; // Skip empty rows

                    const nameLocalized: LocalizedText = {};
                    SupportedLanguages.forEach(lang => {
                        const langKey = `name_${lang}`;
                        if (row[headerMap[langKey]] !== undefined && String(row[headerMap[langKey]]).trim() !== '') {
                             nameLocalized[lang] = String(row[headerMap[langKey]]).trim();
                        }
                    });

                    const quantityVal = row[headerMap.quantity];
                    const quantity = parseFloat(String(quantityVal));

                    if (isNaN(quantity)) {
                        console.warn(`Skipping row ${i+1} due to invalid quantity: ${quantityVal}`);
                        continue;
                    }

                    const unitVal = String(row[headerMap.unit]).trim();
                    if (!unitVal || !IngredientUnits.includes(unitVal)) {
                        console.warn(`Skipping row ${i+1} due to invalid unit: ${unitVal}`);
                        continue;
                    }

                    if (Object.keys(nameLocalized).length === 0) {
                        console.warn(`Skipping row ${i+1} as no name provided in any language.`);
                        continue;
                    }

                    const idVal = row[headerMap.id] !== undefined ? String(row[headerMap.id]).trim() : generateId();
                    const imageUrlVal = row[headerMap.imageUrl] !== undefined ? String(row[headerMap.imageUrl]).trim() : '';

                    const ingredientEntry: Ingredient = {
                        id: idVal,
                        name: nameLocalized,
                        imageUrl: imageUrlVal || placeholderImage(100,100, getTranslatedText(nameLocalized, Language.EN) || 'imported'),
                        quantity: quantity,
                        unit: unitVal,
                    };

                    const existingIndex = existingIngredients.findIndex(ing => ing.id === ingredientEntry.id);
                    if (existingIndex !== -1) {
                        existingIngredients[existingIndex] = ingredientEntry;
                        updatedCount++;
                    } else {
                        existingIngredients.push(ingredientEntry);
                        importedCount++;
                    }
                }
                setIngredients(existingIngredients);
                alert(`${getUIText(UITranslationKeys.EXCEL_IMPORT_SUCCESS_ALERT, currentUser.preferredLanguage)} Imported: ${importedCount}, Updated: ${updatedCount}`);

            } catch (error) {
                console.error("Error parsing Excel:", error);
                alert(`${getUIText(UITranslationKeys.EXCEL_IMPORT_FAILURE_ALERT, currentUser.preferredLanguage)} See console for details.`);
            } finally {
                if(importIngredientsInputRef.current) importIngredientsInputRef.current.value = ""; // Reset file input
            }
        };
        reader.readAsArrayBuffer(file);
    };


  const renderIngredientItem = (ingredient: Ingredient) => (
    <div key={ingredient.id} className="bg-slate-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200">
      <img src={ingredient.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, getTranslatedText(ingredient.name, currentUser!.preferredLanguage))} alt={getTranslatedText(ingredient.name, currentUser!.preferredLanguage)} className="w-full h-32 object-cover rounded-md mb-3" />
      <h3 className="text-xl font-semibold text-slate-700 mb-1">{getTranslatedText(ingredient.name, currentUser!.preferredLanguage)}</h3>
      <p className="text-sm text-slate-600 mb-3">Quantity: {ingredient.quantity} {ingredient.unit}</p>
      { (canPerformAction('edit', 'ingredient') || canPerformAction('delete', 'ingredient')) && (
        <div className="flex space-x-2">
            {canPerformAction('edit', 'ingredient') &&
              <button onClick={() => openModal('ingredient', ingredient)} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                  <PencilIcon className="w-4 h-4 mr-1" /> Edit
              </button>
            }
            {canPerformAction('delete', 'ingredient') &&
              <button onClick={() => handleDeleteIngredient(ingredient.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                  <TrashIcon className="w-4 h-4 mr-1" /> Delete
              </button>
            }
        </div>
      )}
    </div>
  );

  const renderDishItem = (dish: Dish) => (
    <div key={dish.id} className="bg-slate-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200">
      <img src={dish.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, getTranslatedText(dish.name, currentUser!.preferredLanguage))} alt={getTranslatedText(dish.name, currentUser!.preferredLanguage)} className="w-full h-32 object-cover rounded-md mb-3" />
      <h3 className="text-xl font-semibold text-slate-700 mb-1">{getTranslatedText(dish.name, currentUser!.preferredLanguage)}</h3>
      <p className="text-xs text-slate-500 mb-2">
        Ingredients: {dish.ingredients.map(di => {
            const ing = ingredients.find(i=>i.id===di.ingredientId);
            return ing ? getTranslatedText(ing.name, currentUser!.preferredLanguage) : 'N/A';
        }).join(', ') || 'None'}
      </p>
      <details className="text-xs bg-sky-50 p-2 rounded-md mb-2">
          <summary className="cursor-pointer font-medium text-sky-700">How to Prepare</summary>
          <div className="mt-2 space-y-1 whitespace-pre-line">
              {getTranslatedText(dish.preparationSteps, currentUser!.preferredLanguage) || 'No preparation steps provided.'}
          </div>
      </details>
       { (canPerformAction('edit', 'dish') || canPerformAction('delete', 'dish')) && (
        <div className="flex space-x-2">
            {canPerformAction('edit', 'dish') &&
              <button onClick={() => openModal('dish', dish)} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                  <PencilIcon className="w-4 h-4 mr-1" /> Edit
              </button>
            }
            {canPerformAction('delete', 'dish') &&
              <button onClick={() => handleDeleteDish(dish.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                  <TrashIcon className="w-4 h-4 mr-1" /> Delete
              </button>
            }
        </div>
      )}
    </div>
  );

  const renderCookingItem = (item: CookingItem) => (
    <div key={item.id} className="bg-slate-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200">
      <img src={item.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, getTranslatedText(item.name, currentUser!.preferredLanguage))} alt={getTranslatedText(item.name, currentUser!.preferredLanguage)} className="w-full h-32 object-cover rounded-md mb-3" />
      <h3 className="text-xl font-semibold text-slate-700 mb-1">{getTranslatedText(item.name, currentUser!.preferredLanguage)}</h3>
      <p className="text-sm text-slate-600 mb-1">Unit: {item.unit}</p>
      <p className="text-xs text-slate-500 mb-2 truncate" title={getTranslatedText(item.summary, currentUser!.preferredLanguage)}>Summary: {getTranslatedText(item.summary, currentUser!.preferredLanguage)}</p>
      { (canPerformAction('edit', 'cookingItem') || canPerformAction('delete', 'cookingItem')) && (
        <div className="flex space-x-2">
            {canPerformAction('edit', 'cookingItem') &&
              <button onClick={() => openModal('cookingItem', item)} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                  <PencilIcon className="w-4 h-4 mr-1" /> Edit
              </button>
            }
            {canPerformAction('delete', 'cookingItem') &&
              <button onClick={() => handleDeleteCookingItem(item.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                  <TrashIcon className="w-4 h-4 mr-1" /> Delete
              </button>
            }
        </div>
      )}
    </div>
  );

  const renderCustomerItem = (customer: Customer) => {
    if (!currentUser) return null;
    const userLang = currentUser.preferredLanguage;
    const dishNames = customer.selectedDishes.map(sd => {
        const dish = dishes.find(d=>d.id === sd.dishId);
        return dish ? getTranslatedText(dish.name, userLang) : null;
    }).filter(Boolean).join(', ') || 'None';

    const cookingItemNames = customer.selectedCookingItems.map(sci => {
        const item = cookingItems.find(ci => ci.id === sci.cookingItemId);
        return item ? `${getTranslatedText(item.name, userLang)} (x${sci.quantity})` : 'N/A';
    }).join(', ') || 'None';

    const canEditThisCustomer = canPerformAction('edit', 'customer', customer);
    const canDeleteThisCustomer = canPerformAction('delete', 'customer', customer);

    return (
        <div key={customer.id} className="bg-slate-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200 flex flex-col justify-between">
        <div>
            <img src={customer.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, customer.name)} alt={customer.name} className="w-full h-32 object-cover rounded-md mb-3" />
            <h3 className="text-xl font-semibold text-slate-700 mb-1">{customer.name}</h3>
            <p className="text-sm text-slate-600 mb-1">Phone: {customer.phone}</p>
            <p className="text-sm text-slate-600 mb-1">Address: {customer.address}</p>
            <p className="text-sm text-slate-600 mb-1">Persons: {customer.numberOfPersons}</p>
            <p className="text-xs text-slate-500 mb-1 truncate" title={dishNames}>Selected Dishes: {dishNames}</p>
            <p className="text-xs text-slate-500 mb-2 truncate" title={cookingItemNames}>Cooking Items: {cookingItemNames}</p>
            {customer.generatedOrder && (
            <details className="text-xs bg-sky-50 p-2 rounded-md mb-2">
                <summary className="cursor-pointer font-medium text-sky-700">View Generated Order Details</summary>
                <div className="mt-2 space-y-1">
                <p className="font-semibold">Ingredients Needed:</p>
                {customer.generatedOrder.cumulativeIngredients.length > 0 ?
                    customer.generatedOrder.cumulativeIngredients.map((ing, idx) => (
                    <p key={idx}>- {ing.name}: {ing.totalQuantity.toFixed(2)} {ing.unit}</p>
                    )) : <p>(None)</p>}
                <p className="font-semibold mt-1">Cooking Items Added:</p>
                {customer.generatedOrder.selectedCookingItems.length > 0 ?
                    customer.generatedOrder.selectedCookingItems.map((item, idx) => (
                    <p key={idx}>- {item.name}: {item.quantity} {item.unit}</p>
                    )) : <p>(None)</p>}
                </div>
            </details>
            )}
        </div>
        <div className="flex flex-col space-y-2 mt-auto pt-3">
             <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={() => openModal('customer', customer)}
                    className={`bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors ${!canEditThisCustomer ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!canEditThisCustomer}
                    aria-disabled={!canEditThisCustomer}
                >
                    <PencilIcon className="w-4 h-4 mr-1" /> Edit
                </button>
                <button
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className={`bg-red-500 hover:bg-red-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors ${!canDeleteThisCustomer ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!canDeleteThisCustomer}
                    aria-disabled={!canDeleteThisCustomer}
                >
                    <TrashIcon className="w-4 h-4 mr-1" /> Delete
                </button>
            </div>
            <button onClick={() => handleGenerateOrder(customer.id)} className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                <CalculatorIcon className="w-4 h-4 mr-1" /> {customer.generatedOrder ? 'Re-Generate' : 'Generate'} Order
            </button>
            {customer.generatedOrder && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button onClick={() => handleViewHtmlOrder(customer)} title={getUIText(UITranslationKeys.HTML_VIEW_ORDER_BUTTON, userLang)} className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                        <DocumentTextIcon className="w-4 h-4 mr-1" /> {getUIText(UITranslationKeys.HTML_VIEW_ORDER_BUTTON, userLang)}
                    </button>
                     <button onClick={() => handlePrintOrder(customer)} title={getUIText(UITranslationKeys.PRINT_ORDER_BUTTON, userLang)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                        <PrinterIcon className="w-4 h-4 mr-1" /> {getUIText(UITranslationKeys.PRINT_ORDER_BUTTON, userLang)}
                    </button>
                    <button onClick={() => handleViewPdfOrder(customer)} title="View PDF Order" className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                        <DocumentArrowDownIcon className="w-4 h-4 mr-1" /> View PDF
                    </button>
                </div>
            )}
        </div>
        </div>
    );
    };

    const renderModalContent = () => {
        if (!currentUser && modalType !== null && modalType !== 'profile') {
            if (modalType !== null) {
                 closeModal();
            }
            return null;
        }
        if (modalType && (!currentUser && (modalType === 'profile' || modalType === 'customer' || modalType === 'dish' || modalType === 'ingredient' || modalType === 'cookingItem'))){
             closeModal();
             return null;
        }


        switch(modalType) {
            case 'ingredient':
                return <IngredientForm
                            onSave={handleSaveIngredient}
                            onCancel={closeModal}
                            existingIngredient={editingItem as Ingredient | null}
                            units={IngredientUnits}
                            generateId={generateId}
                            currentUserPreferredLanguage={currentUser!.preferredLanguage}
                        />;
            case 'dish':
                return <DishForm
                            onSave={handleSaveDish}
                            onCancel={closeModal}
                            existingDish={editingItem as Dish | null}
                            ingredients={ingredients}
                            generateId={generateId}
                            currentUserPreferredLanguage={currentUser!.preferredLanguage}
                        />;
            case 'cookingItem':
                return <CookingItemForm
                            onSave={handleSaveCookingItem}
                            onCancel={closeModal}
                            existingCookingItem={editingItem as CookingItem | null}
                            units={CookingItemUnits}
                            generateId={generateId}
                            currentUserPreferredLanguage={currentUser!.preferredLanguage}
                        />;
            case 'customer':
                return <CustomerForm
                    onSave={handleSaveCustomer}
                    onCancel={closeModal}
                    existingCustomer={editingItem as Customer | null}
                    dishes={dishes}
                    cookingItems={cookingItems}
                    ingredients={ingredients}
                    currentUserId={currentUser?.id}
                    userRole={currentUser?.role}
                    generateId={generateId}
                    currentUserPreferredLanguage={currentUser!.preferredLanguage}
                />;
            case 'profile':
                 if (!currentUser) return null;
                 return <CustomerForm
                    isProfileForm={true}
                    onSave={(profileData) => handleSaveProfile(profileData as Customer)}
                    onCancel={closeModal}
                    existingCustomer={editingItem as Customer | null}
                    dishes={[]}
                    cookingItems={[]}
                    ingredients={[]}
                    currentUserId={currentUser.id}
                    userRole={currentUser.role}
                    generateId={generateId}
                    currentUserPreferredLanguage={currentUser.preferredLanguage}
                />;
            default: return null;
        }
    };

  const renderPageContent = () => {
    if (!currentUser && currentPage !== Page.PublicHome && currentPage !== Page.Login && currentPage !== Page.Signup) {
        setCurrentPage(Page.PublicHome);
        return null;
    }

    let pageTitle = '';
    let extraCrudHeaderContent: React.ReactNode = null;

    if (currentUser) {
        switch(currentPage) {
            case Page.Ingredients:
                pageTitle = getUIText(UITranslationKeys.INGREDIENTS_PAGE_TITLE, currentUser.preferredLanguage);
                if (currentUser.role === UserRole.SUPREM || currentUser.role === UserRole.ADMIN) { // Admin can still export/import
                    extraCrudHeaderContent = (
                        <div className="flex space-x-2">
                             <input
                                type="file"
                                accept=".xlsx"
                                onChange={handleImportIngredientsExcel}
                                className="hidden"
                                id="excel-import-input"
                                ref={importIngredientsInputRef}
                            />
                            <label
                                htmlFor="excel-import-input"
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg shadow hover:shadow-md transition-all text-sm flex items-center cursor-pointer"
                            >
                                <ArrowUpTrayIcon className="w-4 h-4 mr-1" /> {getUIText(UITranslationKeys.EXCEL_IMPORT_INGREDIENTS_BUTTON, currentUser.preferredLanguage)}
                            </label>
                            <button
                                onClick={handleExportIngredientsExcel}
                                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-3 rounded-lg shadow hover:shadow-md transition-all text-sm flex items-center"
                            >
                               <ArrowDownTrayIcon className="w-4 h-4 mr-1" /> {getUIText(UITranslationKeys.EXCEL_EXPORT_INGREDIENTS_BUTTON, currentUser.preferredLanguage)}
                            </button>
                        </div>
                    );
                }
                break;
            case Page.CookingItems:
                pageTitle = getUIText(UITranslationKeys.COOKING_ITEMS_PAGE_TITLE, currentUser.preferredLanguage);
                break;
            case Page.Dishes: pageTitle = 'Dishes'; break;
            case Page.Customers: pageTitle = 'Customer Orders'; break;
        }
    }


    switch(currentPage) {
        case Page.PublicHome:
            return <PublicHomePage onNavigate={setCurrentPage} />;
        case Page.Login:
            return (
                <div className="max-w-md mx-auto pt-10 sm:pt-16">
                     <LoginForm users={users} onLogin={handleLogin} onSwitchToSignup={() => setCurrentPage(Page.Signup)} />
                </div>
            );
        case Page.Signup:
            return (
                <div className="max-w-md mx-auto pt-10 sm:pt-16">
                    <SignupForm
                        onSignup={handleSignup}
                        onSwitchToLogin={() => setCurrentPage(Page.Login)}
                        supportedLanguages={SupportedLanguages}
                        languageLabels={LanguageLabelMapping}
                    />
                </div>
            );
        case Page.Home:
            if (!currentUser) return null;
            return (
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Welcome, {currentUser.username}!</h1>
                    <p className="text-slate-600 mb-1">Your Catering Name: <span className="font-semibold">{currentUser.cateringName}</span></p>
                    <p className="text-slate-600 mb-1">Your Role: <span className="font-semibold text-blue-600">{currentUser.role}</span></p>
                    <p className="text-slate-600 mb-1">Preferred Language: <span className="font-semibold text-green-600">{LanguageLabelMapping[currentUser.preferredLanguage]}</span></p>
                    <p className="text-slate-600 mb-6">
                        Your Credits: <span className="font-bold text-blue-600">{currentUser.role === UserRole.SUPREM ? 'Unlimited' : currentUser.credits}</span>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <button
                            onClick={handleEditProfile}
                            className="bg-slate-100 hover:bg-slate-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-all text-left flex items-center"
                        >
                            <UserCircleIcon className="w-10 h-10 text-blue-600 mr-4"/>
                            <div>
                                <h3 className="text-xl font-semibold text-slate-700">Edit My Profile</h3>
                                <p className="text-sm text-slate-500">Update your personal information.</p>
                            </div>
                        </button>

                        {currentUser.role === UserRole.SUPREM && (
                             <button
                                onClick={() => setCurrentPage(Page.UserManagement)}
                                className="bg-slate-100 hover:bg-slate-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-all text-left flex items-center"
                            >
                                <ShieldCheckIcon className="w-10 h-10 text-green-600 mr-4"/>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-700">Users</h3>
                                    <p className="text-sm text-slate-500">Manage users and approvals.</p>
                                </div>
                            </button>
                        )}

                        {canPerformAction('add', 'customer') && (
                            <button
                                onClick={() => openModal('customer', null)}
                                className="bg-slate-100 hover:bg-slate-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-all text-left flex items-center"
                            >
                                <UserPlusIcon className="w-10 h-10 text-purple-600 mr-4"/>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-700">Add New Customer</h3>
                                    <p className="text-sm text-slate-500">Create a new customer order.</p>
                                </div>
                            </button>
                        )}
                    </div>
                     <p className="text-sm text-slate-500 text-center">Current time: {currentTime.toLocaleTimeString()}</p>
                </div>
            );
        case Page.Ingredients:
            if (!currentUser) return <p className="text-center text-red-500">You do not have access to this page.</p>;
            if (currentUser.role !== UserRole.SUPREM && currentUser.role !== UserRole.ADMIN) return <p className="text-center text-red-500">You do not have access to this page.</p>;

            const filteredIngredients = ingredients.filter(item => getTranslatedText(item.name, currentUser.preferredLanguage).toLowerCase().includes(searchTerm.toLowerCase()));
            return <CrudSection
                        title={pageTitle}
                        items={filteredIngredients}
                        renderItem={renderIngredientItem}
                        onAdd={() => openModal('ingredient')}
                        entityType="ingredient"
                        canAdd={canPerformAction('add', 'ingredient')}
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                        currentUserPreferredLanguage={currentUser.preferredLanguage}
                        hasItems={ingredients.length > 0}
                        extraHeaderContent={extraCrudHeaderContent}
                    />;
        case Page.Dishes:
            if (!currentUser || (currentUser.role !== UserRole.SUPREM && currentUser.role !== UserRole.ADMIN)) return <p className="text-center text-red-500">You do not have access to this page.</p>;
            const filteredDishes = dishes.filter(item => getTranslatedText(item.name, currentUser.preferredLanguage).toLowerCase().includes(searchTerm.toLowerCase()));
            return <CrudSection
                        title="Dishes"
                        items={filteredDishes}
                        renderItem={renderDishItem}
                        onAdd={() => openModal('dish')}
                        entityType="dish"
                        canAdd={canPerformAction('add', 'dish')}
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                        currentUserPreferredLanguage={currentUser.preferredLanguage}
                        hasItems={dishes.length > 0}
                    />;
        case Page.CookingItems:
             if (!currentUser || (currentUser.role !== UserRole.SUPREM && currentUser.role !== UserRole.ADMIN)) return <p className="text-center text-red-500">You do not have access to this page.</p>;
            const filteredCookingItems = cookingItems.filter(item =>
                getTranslatedText(item.name, currentUser.preferredLanguage).toLowerCase().includes(searchTerm.toLowerCase()) ||
                getTranslatedText(item.summary, currentUser.preferredLanguage).toLowerCase().includes(searchTerm.toLowerCase())
            );
            return <CrudSection
                        title={pageTitle}
                        items={filteredCookingItems}
                        renderItem={renderCookingItem}
                        onAdd={() => openModal('cookingItem')}
                        entityType="cookingItem"
                        canAdd={canPerformAction('add', 'cookingItem')}
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                        currentUserPreferredLanguage={currentUser.preferredLanguage}
                        hasItems={cookingItems.length > 0}
                    />;
        case Page.Customers:
            if(!currentUser) return null;
            let customersToDisplay = customers;
            if (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.USER) {
                customersToDisplay = customers.filter(c => c.userId === currentUser.id);
            }
            const searchedCustomers = customersToDisplay.filter(customer =>
                customer.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            return <CrudSection
                        title="Customer Orders"
                        items={searchedCustomers}
                        renderItem={renderCustomerItem}
                        onAdd={() => openModal('customer')}
                        entityType="customer"
                        canAdd={canPerformAction('add', 'customer')}
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                        currentUserPreferredLanguage={currentUser.preferredLanguage}
                        hasItems={customersToDisplay.length > 0}
                    />;
        case Page.UserManagement:
            if (!currentUser || currentUser.role !== UserRole.SUPREM) return <p className="text-center text-red-500">Access Denied.</p>;
            return <UserManagementPage
                        users={users}
                        currentUser={currentUser}
                        onApproveUser={handleApproveUser}
                        onSetUserCredits={handleSetUserCredits}
                        onViewUser={handleViewUserDetails}
                        languageLabels={LanguageLabelMapping}
                        supportedLanguages={SupportedLanguages}
                        onUpdateUserLanguage={handleUpdateUserLanguage}
                    />;
        case Page.UserDetailsView:
            if (!currentUser || currentUser.role !== UserRole.SUPREM) return <p className="text-center text-red-500">Access Denied.</p>;
            return <UserDetailsViewComponent
                        user={selectedUserForView}
                        onBack={() => setCurrentPage(previousPageBeforeUserDetails || Page.UserManagement)}
                        onSetUserCredits={handleSetUserCredits}
                        languageLabels={LanguageLabelMapping}
                        supportedLanguages={SupportedLanguages}
                        onUpdateUserLanguage={handleUpdateUserLanguage}
                        onUpdateUserDetailsBySuprem={handleUpdateUserDetailsBySuprem}
                    />;
        default:
            setSearchTerm('');
            return <p>Page not found.</p>;
    }
  };

  useEffect(() => {
    if (currentPage !== Page.UserDetailsView && currentPage !== Page.UserManagement) {
        if (!modalOpen) {
           setSearchTerm('');
        }
    }
  }, [currentPage, modalOpen]);

  const mainContentPadding = currentUser && currentPage !== Page.PublicHome ? 'pt-0' : 'pt-0';


  return (
    <div className={`min-h-screen ${currentPage === Page.PublicHome ? 'bg-transparent' : 'bg-gradient-to-br from-slate-100 to-sky-100'} text-slate-800 flex flex-col items-center justify-start selection:bg-blue-200`}>
      {currentUser && currentPage !== Page.PublicHome && (
         <header className="w-full max-w-6xl mx-auto bg-white/80 backdrop-blur-md shadow-lg rounded-xl p-4 my-4 sticky top-4 z-50">
            <div className="flex flex-col sm:flex-row justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-700" style={{fontFamily: "'Playfair Display', serif"}}>{APP_TITLE}</h1>
                <div className='flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0'>
                     <div className="text-sm text-right">
                        <p className="font-semibold text-slate-700">{currentUser.username} ({currentUser.cateringName})</p>
                        <p className="text-xs text-blue-600">Role: {currentUser.role} | Credits: {currentUser.role === UserRole.SUPREM ? '∞' : currentUser.credits}</p>
                        <p className="text-xs text-green-600">Lang: {LanguageLabelMapping[currentUser.preferredLanguage]}</p>
                    </div>
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg shadow hover:shadow-md transition-all text-sm flex items-center" aria-label="Logout">
                       <ArrowLeftOnRectangleIcon className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
            <nav className="mt-3 border-t border-slate-200 pt-3">
                <ul className="flex flex-wrap justify-center sm:justify-start gap-x-3 gap-y-2">
                {getVisibleNavItems().map(({ label, page }) => (
                    <li key={page}>
                    <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150
                                    ${currentPage === page
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-slate-600 hover:bg-blue-100 hover:text-blue-700'}`}
                        aria-current={currentPage === page ? "page" : undefined}
                    >
                        {label === 'UserManagement' && currentUser.role === UserRole.SUPREM ? 'Users' : label}
                    </button>
                    </li>
                ))}
                </ul>
            </nav>
        </header>
      )}
      <main className={`w-full ${currentPage !== Page.PublicHome ? 'max-w-6xl mx-auto px-4 pb-8' : ''} ${mainContentPadding}`}>
        {renderPageContent()}
      </main>
      {modalOpen && (
        <Modal onClose={closeModal}>
          {renderModalContent()}
        </Modal>
      )}
      {!currentUser && currentPage !== Page.PublicHome && (
         <footer className="w-full max-w-6xl mx-auto text-center text-xs text-slate-500 py-6 mt-auto">
            &copy; {new Date().getFullYear()} {APP_TITLE}. Culinary adventures await!
        </footer>
      )}
    </div>
  );
};

export default App;