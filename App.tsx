

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Page, Ingredient, Dish, CookingItem, Customer, ModalType, IngredientUnits, CookingItemUnits, DishIngredient, CustomerDishSelection, CustomerCookingItemSelection, GeneratedOrder, CumulativeIngredient, AuthUser, UserRole, Language, LocalizedText, LanguageLabels, UITranslationKeys, SelectedCookingItemDetail } from './types';
import { APP_TITLE, placeholderImage, DEFAULT_IMAGE_SIZE, baseNavigationItems, DEFAULT_SUPREM_USER, SupportedLanguages, LanguageLabelMapping, IngredientBaseUnits, UnitConversionFactors } from './constants';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon, DocumentTextIcon, CalculatorIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon, UserCircleIcon, EyeIcon, EyeSlashIcon, UserPlusIcon, ArrowLeftOnRectangleIcon, CogIcon, CheckCircleIcon, ShieldCheckIcon, InformationCircleIcon, ArrowLeftIcon, PrinterIcon, DocumentArrowDownIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, ShareIcon } from './components/icons';
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
import OrderIngredientForm from './components/OrderIngredientForm'; 
import OrderCookingItemForm from './components/OrderCookingItemForm';
import { getUIText } from './translations';
import { getTranslatedText } from './localization'; 
import * as XLSX from 'xlsx';
import { 
    initializeDefaultData,
    getAllUsersDB, addUserDB, putUserDB, getUserDB, 
    getAllIngredientsDB, addIngredientDB, putIngredientDB, deleteIngredientDB, getIngredientDB,
    getAllDishesDB, addDishDB, putDishDB, deleteDishDB, getDishDB,
    getAllCookingItemsDB, addCookingItemDB, putCookingItemDB, deleteCookingItemDB, getCookingItemDB, 
    getAllCustomersDB, addCustomerDB, putCustomerDB, deleteCustomerDB, getCustomerDB, getCustomersByUserIdDB
} from './db';


const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
const AUTH_USER_STORAGE_KEY = 'culinaryCateringAppUser';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.PublicHome);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoadingDB, setIsLoadingDB] = useState(true);
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);


  const [users, setUsers] = useState<AuthUser[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [cookingItems, setCookingItems] = useState<CookingItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    async function loadInitialData() {
        setIsLoadingDB(true);
        try {
            await initializeDefaultData(); 

            setUsers(await getAllUsersDB());
            setIngredients(await getAllIngredientsDB());
            setDishes(await getAllDishesDB());
            setCookingItems(await getAllCookingItemsDB());
            setCustomers(await getAllCustomersDB());

        } catch (error) {
            console.error("Failed to load initial data from DB:", error);
        } finally {
            setIsLoadingDB(false);
        }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!isLoadingDB) { 
        const attemptAutoLogin = async () => {
            const storedUserString = localStorage.getItem(AUTH_USER_STORAGE_KEY);
            if (storedUserString) {
                try {
                    const storedUser: AuthUser = JSON.parse(storedUserString);
                    const userFromDB = await getUserDB(storedUser.id);
                    if (userFromDB && userFromDB.isApproved) {
                        setCurrentUser(userFromDB);
                        setCurrentPage(Page.Home);
                    } else {
                        localStorage.removeItem(AUTH_USER_STORAGE_KEY);
                        setCurrentUser(null);
                        setCurrentPage(Page.PublicHome);
                    }
                } catch (error) {
                    console.error("Error parsing stored user or fetching from DB:", error);
                    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
                    setCurrentUser(null);
                    setCurrentPage(Page.PublicHome);
                }
            }
            setIsAuthCheckComplete(true); 
        };
        attemptAutoLogin();
    }
  }, [isLoadingDB]);


  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  const [editingOrderContext, setEditingOrderContext] = useState<{
    customerId: string;
    orderLineItemId?: string; 
    isAdding: boolean;
    existingOrderItemData?: { name: string; quantity: number; unit: string; masterIngredientId: string; };
  } | null>(null);

  const [editingOrderCookingItemContext, setEditingOrderCookingItemContext] = useState<{
    customerId: string;
    orderLineItemId?: string; 
    isAdding: boolean;
    existingOrderItemData?: { masterCookingItemId: string; name: string; quantity: number; unit: string; price: number;};
  } | null>(null);


  const [searchTerm, setSearchTerm] = useState('');

  const [selectedUserForView, setSelectedUserForView] = useState<AuthUser | null>(null);
  const [previousPageBeforeUserDetails, setPreviousPageBeforeUserDetails] = useState<Page | null>(null);

  const importIngredientsInputRef = useRef<HTMLInputElement>(null);
  const importDishesInputRef = useRef<HTMLInputElement>(null); 
  const importCookingItemsInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auth Handlers
  const handleLogin = (loggedInUser: AuthUser) => {
    setCurrentUser(loggedInUser);
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(loggedInUser));
    setCurrentPage(Page.Home);
  };

  const handleSignup = async (newUserData: Omit<AuthUser, 'id' | 'isApproved' | 'role' | 'credits'> & {email: string, preferredLanguage: Language, imageUrl?: string | null}) => {
    const newUser: AuthUser = {
      ...newUserData,
      id: generateId(),
      isApproved: false,
      role: UserRole.USER,
      credits: 0,
      imageUrl: newUserData.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE,DEFAULT_IMAGE_SIZE, newUserData.username),
      preferredLanguage: newUserData.preferredLanguage || Language.EN,
    };
    await addUserDB(newUser);
    setUsers(await getAllUsersDB());
    alert(getUIText(UITranslationKeys.ALERT_SIGNUP_SUCCESS_PENDING_APPROVAL, newUser.preferredLanguage));
    setCurrentPage(Page.Login);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    setCurrentPage(Page.PublicHome);
    setSelectedUserForView(null);
    setPreviousPageBeforeUserDetails(null);
  };

  const handleApproveUser = async (userId: string, roleToAssign: UserRole) => {
    if (currentUser?.role !== UserRole.SUPREM) return;
    
    const userToUpdate = users.find(u => u.id === userId); 
    if (userToUpdate) {
        const updatedUser = { ...userToUpdate, isApproved: true, role: roleToAssign };
        await putUserDB(updatedUser);
        setUsers(await getAllUsersDB());
        alert(getUIText(UITranslationKeys.ALERT_USER_APPROVED_EMAIL_SIMULATION, currentUser.preferredLanguage, Language.EN, {
            userName: userToUpdate.username,
            roleAssigned: roleToAssign,
            userEmail: userToUpdate?.email || 'N/A'
        }));
    }
  };

  const handleSetUserCredits = async (userId: string, newCredits: number) => {
    if (currentUser?.role !== UserRole.SUPREM) return;
    if (isNaN(newCredits) || newCredits < 0) {
        alert("Invalid credit amount. Please enter a non-negative number.");
        return;
    }
    const userToUpdate = users.find(u => u.id === userId);
    if (userToUpdate) {
        const updatedUser = { ...userToUpdate, credits: newCredits };
        await putUserDB(updatedUser);
        const allCurrentUsers = await getAllUsersDB();
        setUsers(allCurrentUsers);

        if (currentUser?.id === userId) {
            setCurrentUser(updatedUser);
            localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updatedUser));
        }
        if (selectedUserForView && selectedUserForView.id === userId) {
            setSelectedUserForView(updatedUser);
        }
        alert('User credits updated!');
    }
  };

  const handleUpdateUserLanguage = async (userId: string, language: Language) => {
    if (currentUser?.role !== UserRole.SUPREM && currentUser?.id !== userId) {
        alert("Permission denied to change language preference.");
        return;
    }
    const userToUpdate = users.find(u => u.id === userId);
    if (userToUpdate) {
        const updatedUser = { ...userToUpdate, preferredLanguage: language };
        await putUserDB(updatedUser);
        setUsers(await getAllUsersDB());
        if (currentUser?.id === userId) {
            setCurrentUser(updatedUser);
            localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updatedUser));
        }
        if (selectedUserForView?.id === userId) {
            setSelectedUserForView(updatedUser);
        }
        alert(`User language preference updated to ${LanguageLabelMapping[language]}.`);
    }
  };

  const handleUpdateUserDetailsBySuprem = async (userId: string, updatedDetails: Partial<Pick<AuthUser, 'username' | 'cateringName' | 'phone' | 'address' | 'email'>>) => {
    if (currentUser?.role !== UserRole.SUPREM) {
        alert("Permission denied.");
        return;
    }
    const userToUpdate = users.find(u => u.id === userId);
    if (userToUpdate) {
        const updatedUser = { ...userToUpdate, ...updatedDetails };
        await putUserDB(updatedUser);
        setUsers(await getAllUsersDB());

        if (selectedUserForView?.id === userId) {
            setSelectedUserForView(updatedUser);
        }
        if (currentUser?.id === userId) { 
            setCurrentUser(updatedUser);
            localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updatedUser));
        }
        alert('User details updated successfully by Suprem.');
    }
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
    setEditingOrderContext(null);
    setEditingOrderCookingItemContext(null); 
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setModalType(null);
    setEditingOrderContext(null);
    setEditingOrderCookingItemContext(null);
  };
  

  const canPerformAction = (action: 'add' | 'edit' | 'delete', entity: 'ingredient' | 'dish' | 'cookingItem' | 'customer' | 'orderIngredient' | 'orderCookingItem', item?: any): boolean => {
    if (!currentUser) return false;
    const { role, credits, id: currentUserId } = currentUser;

    if (role === UserRole.SUPREM) return true;
    
    if (entity === 'orderIngredient' || entity === 'orderCookingItem') {
        if (role === UserRole.ADMIN) return true; 
        // For USER role, item should contain customerUserId to check ownership
        if (role === UserRole.USER && item && item.customerUserId === currentUserId) return true; 
        return false;
    }

    if (entity === 'ingredient') {
        if (role === UserRole.ADMIN) {
            if (action === 'add') return false; 
            return true; 
        }
        return false; 
    }

    if (entity === 'dish' || entity === 'cookingItem') { 
        if (role === UserRole.ADMIN) return true; 
        return false; 
    }
    
    if (entity === 'customer') {
        if (role === UserRole.ADMIN) {
            if (action === 'add') return credits > 0;
            if (action === 'edit' || action === 'delete') {
                // For ADMIN, they can edit/delete their own customers or unassigned ones.
                return item && (item.userId === currentUserId || !item.userId) && credits >=0 ;
            }
        }
        if (role === UserRole.USER) {
            if (action === 'add') return credits > 0;
            if (action === 'edit' || action === 'delete') {
                // For USER, they can only edit/delete their own customers.
                return item && item.userId === currentUserId && credits >= 0;
            }
        }
        return false;
    }
    return false;
  };

  const handleSaveIngredient = async (ingredientData: {name: string, imageUrl:string | null, quantity: number, unit: string, price: number, id?: string}) => {
    if (!canPerformAction(editingItem ? 'edit' : 'add', 'ingredient', editingItem) || !currentUser) {
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
        price: ingredientData.price,
    };

    if (editingItem) {
        await putIngredientDB(ingredient);
    } else {
        await addIngredientDB(ingredient);
    }
    setIngredients(await getAllIngredientsDB());
    closeModal();
  };

  const handleDeleteIngredient = async (id: string) => {
     if (!canPerformAction('delete', 'ingredient', ingredients.find(i => i.id === id)) || !currentUser) {
      alert(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser.preferredLanguage));
      return;
    }
    await deleteIngredientDB(id);
    setIngredients(await getAllIngredientsDB());

    const currentDishes = await getAllDishesDB();
    const updatedDishesPromises: Promise<any>[] = [];
    const dishesToSetState: Dish[] = [];

    for (const dish of currentDishes) {
        const originalIngredientsCount = dish.ingredients.length;
        const newDishIngredients = dish.ingredients.filter(di => di.ingredientId !== id);
        if (newDishIngredients.length !== originalIngredientsCount) {
            const updatedDish = { ...dish, ingredients: newDishIngredients };
            updatedDishesPromises.push(putDishDB(updatedDish));
            dishesToSetState.push(updatedDish);
        } else {
            dishesToSetState.push(dish);
        }
    }
    if (updatedDishesPromises.length > 0) {
        await Promise.all(updatedDishesPromises);
        setDishes(dishesToSetState); 
    }
  };

  const handleSaveDish = async (dishData: {name: string, imageUrl:string | null, ingredients: DishIngredient[], id?:string, preparationSteps: string}) => {
    if (!canPerformAction(editingItem ? 'edit' : 'add', 'dish', editingItem) || !currentUser) {
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
    if (editingItem) {
        await putDishDB(dish);
    } else {
        await addDishDB(dish);
    }
    setDishes(await getAllDishesDB());
    closeModal();
  };

  const handleDeleteDish = async (id: string) => {
    if (!canPerformAction('delete', 'dish', dishes.find(d => d.id === id)) || !currentUser) {
      alert(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser.preferredLanguage));
      return;
    }
    await deleteDishDB(id);
    setDishes(await getAllDishesDB());
    
    const currentCustomers = await getAllCustomersDB();
    const updatedCustomersPromises: Promise<any>[] = [];
    const customersToSetState: Customer[] = [];

    for (const customer of currentCustomers) {
        const originalSelectedDishesCount = customer.selectedDishes.length;
        const newSelectedDishes = customer.selectedDishes.filter(sd => sd.dishId !== id);
        if (newSelectedDishes.length !== originalSelectedDishesCount) {
            const updatedCustomer = { ...customer, selectedDishes: newSelectedDishes };
            updatedCustomersPromises.push(putCustomerDB(updatedCustomer));
            customersToSetState.push(updatedCustomer);
        } else {
            customersToSetState.push(customer);
        }
    }
    if (updatedCustomersPromises.length > 0) {
        await Promise.all(updatedCustomersPromises);
        setCustomers(customersToSetState); 
    }
  };

  const handleSaveCookingItem = async (itemData: {name: string, imageUrl:string | null, summary: string, unit: string, price: number, id?: string}) => {
     if (!canPerformAction(editingItem ? 'edit' : 'add', 'cookingItem', editingItem) || !currentUser) {
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
        price: itemData.price,
    };
    if (editingItem) {
        await putCookingItemDB(item);
    } else {
        await addCookingItemDB(item);
    }
    setCookingItems(await getAllCookingItemsDB());
    closeModal();
  };

  const handleDeleteCookingItem = async (id: string) => {
    if (!canPerformAction('delete', 'cookingItem', cookingItems.find(ci => ci.id === id)) || !currentUser) {
      alert(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser.preferredLanguage));
      return;
    }
    await deleteCookingItemDB(id);
    setCookingItems(await getAllCookingItemsDB());

    const currentCustomers = await getAllCustomersDB();
    const updatedCustomersPromises: Promise<any>[] = [];
    const customersToSetState: Customer[] = [];

    for (const customer of currentCustomers) {
        const originalSelectedItemsCount = customer.selectedCookingItems.length;
        const newSelectedItems = customer.selectedCookingItems.filter(sci => sci.cookingItemId !== id);
        if (newSelectedItems.length !== originalSelectedItemsCount) {
            const updatedCustomer = { ...customer, selectedCookingItems: newSelectedItems };
            // Also, if the item was in a generated order, it needs to be removed there too
            if (updatedCustomer.generatedOrder && updatedCustomer.generatedOrder.selectedCookingItems) {
                updatedCustomer.generatedOrder.selectedCookingItems = updatedCustomer.generatedOrder.selectedCookingItems.filter(
                    orderCi => orderCi.masterCookingItemId !== id
                );
            }
            updatedCustomersPromises.push(putCustomerDB(updatedCustomer));
            customersToSetState.push(updatedCustomer);
        } else {
            customersToSetState.push(customer);
        }
    }
     if (updatedCustomersPromises.length > 0) {
        await Promise.all(updatedCustomersPromises);
        setCustomers(customersToSetState); 
    }
  };

  const handleSaveCustomer = async (submittedCustomerData: Customer) => {
    if (!currentUser) return;

    const finalImageUrl = submittedCustomerData.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, submittedCustomerData.name);
    let customerToSave: Customer;

    if (editingItem) {
        const originalCustomer = editingItem as Customer;
        if (!canPerformAction('edit', 'customer', originalCustomer)) {
             alert(`Permission denied or insufficient credits to modify this customer.`);
             closeModal();
             return;
        }
        customerToSave = {
            ...originalCustomer,
            ...submittedCustomerData,
            id: originalCustomer.id,
            imageUrl: finalImageUrl,
            generatedOrder: originalCustomer.generatedOrder ? { ...originalCustomer.generatedOrder } : null, 
        };
        await putCustomerDB(customerToSave);
        // If selections changed, or persons changed, or if it's the first time generating, force regeneration.
        const selectionsChanged = JSON.stringify(originalCustomer.selectedDishes) !== JSON.stringify(customerToSave.selectedDishes) ||
                                JSON.stringify(originalCustomer.selectedCookingItems) !== JSON.stringify(customerToSave.selectedCookingItems);
        const personsChanged = originalCustomer.numberOfPersons !== customerToSave.numberOfPersons;

        if (selectionsChanged || personsChanged || !customerToSave.generatedOrder) {
            await handleGenerateOrder(customerToSave.id, true); 
        } else {
             // If only minor details changed (name, phone, address), just update local state
             setCustomers(await getAllCustomersDB());
        }
        alert('Customer details updated!');
    } else { // Adding a new customer
        if (!canPerformAction('add', 'customer')) {
            alert(`Insufficient credits to add a new customer.`);
            closeModal();
            return;
        }
        customerToSave = {
            ...submittedCustomerData,
            id: generateId(), 
            imageUrl: finalImageUrl,
            userId: (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.USER) ? currentUser.id : undefined,
            generatedOrder: null, // New customer, no generated order initially
        };
        await addCustomerDB(customerToSave);
        
        if (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.USER) {
            const newCreditCount = currentUser.credits - 1;
            const updatedUser = { ...currentUser, credits: newCreditCount };
            await putUserDB(updatedUser);
            setCurrentUser(updatedUser);
            localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updatedUser));
            setUsers(await getAllUsersDB()); 
            alert('Customer added! 1 credit used.');
        } else {
            alert('Customer added!');
        }
        // Always generate order for new customer if selections made, ensures generatedOrder is populated
        if (customerToSave.selectedDishes.length > 0 || customerToSave.selectedCookingItems.length > 0) {
            await handleGenerateOrder(customerToSave.id, true); 
        } else {
            setCustomers(await getAllCustomersDB()); // Update customer list even if no order to generate
        }
    }
    closeModal();
  };

  const handleSaveProfile = async (profileData: Customer) => { 
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

    await putUserDB(updatedUser);
    setUsers(await getAllUsersDB()); 
    setCurrentUser(updatedUser); 
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updatedUser));
    alert('Profile updated successfully!');
    closeModal();
};

  const handleDeleteCustomer = async (id: string) => {
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

    await deleteCustomerDB(id);
    setCustomers(await getAllCustomersDB());
    alert('Customer record deleted.');
  };

  const convertToBaseUnit = (quantity: number, unit: string): { quantityInBase: number; baseUnit: string } => {
    const unitLower = unit.toLowerCase();
    const conversion = UnitConversionFactors[unitLower];

    if (conversion) {
        return { quantityInBase: quantity * conversion.toBase, baseUnit: conversion.baseUnit };
    }
    // Handle units not in conversion table but defined as base units themselves
    if (Object.values(IngredientBaseUnits).includes(unitLower as any)) {
        return { quantityInBase: quantity, baseUnit: unitLower };
    }
    // Default for unknown units: return as is, this might lead to calculation issues if not careful
    return { quantityInBase: quantity, baseUnit: unitLower };
  };

  const formatDisplayQuantity = (quantityInBase: number, baseUnit: string): { displayQuantity: number; displayUnit: string } => {
    if (baseUnit === IngredientBaseUnits.WEIGHT) {
        if (quantityInBase >= 1000) {
            return { displayQuantity: parseFloat((quantityInBase / 1000).toFixed(3)), displayUnit: 'kg' };
        }
        return { displayQuantity: parseFloat(quantityInBase.toFixed(3)), displayUnit: 'gram' };
    }
    if (baseUnit === IngredientBaseUnits.VOLUME) {
        if (quantityInBase >= 1000) {
            return { displayQuantity: parseFloat((quantityInBase / 1000).toFixed(3)), displayUnit: 'liters' };
        }
        return { displayQuantity: parseFloat(quantityInBase.toFixed(3)), displayUnit: 'ml' };
    }
    return { displayQuantity: parseFloat(quantityInBase.toFixed(3)), displayUnit: baseUnit };
  };

  const calculateDishCost = (dish: Dish, allIngredients: Ingredient[]): number => {
    if (!dish || !allIngredients) return 0;
    let totalCost = 0;
    dish.ingredients.forEach(dishIng => {
        const masterIng = allIngredients.find(i => i.id === dishIng.ingredientId);
        if (masterIng && masterIng.quantity > 0 && masterIng.price >= 0) {
            // Convert dishIng.quantity to masterIng.unit for correct price calculation
            const { quantityInBase: dishIngBaseQty, baseUnit: dishIngBaseUnit } = convertToBaseUnit(dishIng.quantity, masterIng.unit); // Assume dishIng.quantity is meant for masterIng.unit
            const { quantityInBase: masterIngBaseQtyForPrice, baseUnit: masterIngBaseUnitForPrice } = convertToBaseUnit(masterIng.quantity, masterIng.unit);

            if (dishIngBaseUnit === masterIngBaseUnitForPrice && masterIngBaseQtyForPrice > 0) {
                 const pricePerMasterBaseUnit = masterIng.price / masterIngBaseQtyForPrice;
                 totalCost += dishIngBaseQty * pricePerMasterBaseUnit;
            } else {
                console.warn(`Cannot calculate cost for ingredient ${masterIng.id} in dish ${dish.id} due to unit mismatch or zero master quantity.`);
            }
        }
    });
    return totalCost;
  };

  const handleGenerateOrder = async (customerId: string, forceRegenerateFromFormSelections = false) => {
    const customer = await getCustomerDB(customerId); // Fetch latest customer data
    if (!customer || !currentUser) return;

    let cumulativeIngredientsResult: CumulativeIngredient[] = [];
    let totalIngredientCost = 0;

    if (!forceRegenerateFromFormSelections && customer.generatedOrder && customer.generatedOrder.cumulativeIngredients.length > 0) {
        // Recalculate prices for existing order ingredients
        cumulativeIngredientsResult = customer.generatedOrder.cumulativeIngredients.map(orderIng => {
            const masterIngredient = ingredients.find(i => i.id === orderIng.masterIngredientId);
            let ingredientTotalPrice = orderIng.totalPrice; // Default to old price
            let name = orderIng.name;

            if (masterIngredient && masterIngredient.quantity > 0 && masterIngredient.price >= 0) {
                name = getTranslatedText(masterIngredient.name, currentUser.preferredLanguage);
                const { quantityInBase: orderItemBaseQty, baseUnit: orderItemBaseU } = convertToBaseUnit(orderIng.totalQuantity, orderIng.unit);
                const { quantityInBase: masterItemBaseQtyForItsPrice, baseUnit: masterItemBaseUForItsPrice } = convertToBaseUnit(masterIngredient.quantity, masterIngredient.unit);

                if (masterItemBaseQtyForItsPrice > 0 && orderItemBaseU === masterItemBaseUForItsPrice) {
                    const pricePerBaseMasterUnit = masterIngredient.price / masterItemBaseQtyForItsPrice;
                    ingredientTotalPrice = orderItemBaseQty * pricePerBaseMasterUnit;
                } else {
                    console.warn(`Could not calculate price for ordered ingredient ${orderIng.id} (master: ${masterIngredient.id}) due to unit mismatch or zero master quantity for price.`);
                    ingredientTotalPrice = 0; // Or keep old price if preferred, but 0 makes unpriceable items clear
                }
            } else if (!masterIngredient) {
                 console.warn(`Master ingredient ${orderIng.masterIngredientId} not found for ordered item ${orderIng.id}. Price may be stale or zero.`);
                 ingredientTotalPrice = 0; // If master is gone, price becomes 0
            }
            totalIngredientCost += ingredientTotalPrice;
            return { ...orderIng, name, totalPrice: ingredientTotalPrice };
        });
    } else { // Regenerate ingredients from selected dishes (forceRegenerateFromFormSelections = true)
        const cumulativeIngredientsMap = new Map<string, { totalQuantityInMasterUnit: number; masterIngredientRef: Ingredient }>();
        customer.selectedDishes.forEach(sd => {
            const dish = dishes.find(d => d.id === sd.dishId);
            if (dish) {
                dish.ingredients.forEach(di => {
                    const masterIngredient = ingredients.find(i => i.id === di.ingredientId);
                    if (masterIngredient) {
                        // di.quantity is in masterIngredient.unit (or should be interpreted as such from dish definition)
                        const quantityNeededForOrderInMasterUnit = di.quantity * customer.numberOfPersons;
                        const current = cumulativeIngredientsMap.get(masterIngredient.id) || { totalQuantityInMasterUnit: 0, masterIngredientRef: masterIngredient };
                        current.totalQuantityInMasterUnit += quantityNeededForOrderInMasterUnit;
                        cumulativeIngredientsMap.set(masterIngredient.id, current);
                    }
                });
            }
        });

        cumulativeIngredientsResult = Array.from(cumulativeIngredientsMap.entries()).map(([masterIngredientId, entry]) => {
            const masterIng = entry.masterIngredientRef;
            let ingredientTotalPrice = 0;

            if (masterIng.quantity > 0 && masterIng.price >= 0) {
                // entry.totalQuantityInMasterUnit is already in masterIng.unit
                const { quantityInBase: totalOrderBaseQty, baseUnit: totalOrderBaseUnit } = convertToBaseUnit(entry.totalQuantityInMasterUnit, masterIng.unit);
                const { quantityInBase: masterBaseQtyForPrice, baseUnit: masterBaseUnitForPrice } = convertToBaseUnit(masterIng.quantity, masterIng.unit);

                if (masterBaseQtyForPrice > 0 && totalOrderBaseUnit === masterBaseUnitForPrice) {
                    const pricePerBaseMasterUnit = masterIng.price / masterBaseQtyForPrice;
                    ingredientTotalPrice = totalOrderBaseQty * pricePerBaseMasterUnit;
                } else {
                     console.warn(`Could not calculate price for master ingredient ${masterIng.id} when generating from dishes.`);
                }
            }
            
            totalIngredientCost += ingredientTotalPrice;
            // Format for display
            const { quantityInBase: finalBaseQty, baseUnit: finalBaseUnit } = convertToBaseUnit(entry.totalQuantityInMasterUnit, masterIng.unit);
            const { displayQuantity, displayUnit } = formatDisplayQuantity(finalBaseQty, finalBaseUnit);
            
            return { 
                id: generateId(), 
                masterIngredientId, 
                name: getTranslatedText(masterIng.name, currentUser.preferredLanguage), 
                totalQuantity: displayQuantity, 
                unit: displayUnit, 
                totalPrice: ingredientTotalPrice 
            };
        });
    }

    let selectedCookingItemsDetails: SelectedCookingItemDetail[] = [];
    let totalCookingItemCost = 0;

    const sourceCookingItems = (forceRegenerateFromFormSelections || !customer.generatedOrder?.selectedCookingItems)
        ? customer.selectedCookingItems // from customer form selections
        : customer.generatedOrder.selectedCookingItems; // from existing generated order

    sourceCookingItems.forEach(sci => {
        const masterItemId = (forceRegenerateFromFormSelections || !customer.generatedOrder?.selectedCookingItems)
            ? (sci as CustomerCookingItemSelection).cookingItemId // from CustomerCookingItemSelection
            : (sci as SelectedCookingItemDetail).masterCookingItemId; // from SelectedCookingItemDetail

        const quantity = sci.quantity;
        const masterItem = cookingItems.find(ci => ci.id === masterItemId);

        if (masterItem) {
            const itemTotalPrice = quantity * masterItem.price;
            totalCookingItemCost += itemTotalPrice;
            selectedCookingItemsDetails.push({
                id: (sci as SelectedCookingItemDetail).id || generateId(), // Keep existing ID if it's from generatedOrder
                masterCookingItemId: masterItem.id,
                name: getTranslatedText(masterItem.name, currentUser.preferredLanguage),
                quantity: quantity,
                unit: masterItem.unit,
                price: masterItem.price,
                totalPrice: itemTotalPrice
            });
        } else {
             console.warn(`Master cooking item ${masterItemId} not found. It will be excluded from the order.`);
             // If sci came from an existing generatedOrder, we might want to preserve it with a warning or zero price
             if (!forceRegenerateFromFormSelections && customer.generatedOrder?.selectedCookingItems && (sci as SelectedCookingItemDetail).name) {
                 selectedCookingItemsDetails.push({
                     ...(sci as SelectedCookingItemDetail),
                     totalPrice: 0, // Mark as unpriceable
                     name: `${(sci as SelectedCookingItemDetail).name} (Master Item Missing)`
                 });
             }
        }
    });
    
    const totalOrderCost = totalIngredientCost + totalCookingItemCost;

    const generatedOrder: GeneratedOrder = {
        cumulativeIngredients: cumulativeIngredientsResult,
        selectedCookingItems: selectedCookingItemsDetails,
        totalOrderCost: totalOrderCost
    };
    
    const updatedCustomer = { ...customer, generatedOrder };
    await putCustomerDB(updatedCustomer);
    setCustomers(await getAllCustomersDB()); 
    // alert(`Order generated/updated for ${customer.name}! Check customer details for costs.`);
  };


    const handleOpenAddOrderIngredientModal = (customerId: string) => {
        setEditingOrderContext({ customerId, isAdding: true });
        setModalType('orderIngredient');
        setModalOpen(true);
    };

    const handleOpenEditOrderIngredientModal = (customerId: string, orderLineItemId: string) => {
        const customer = customers.find(c => c.id === customerId);
        if (!customer || !customer.generatedOrder) return;
        const orderItem = customer.generatedOrder.cumulativeIngredients.find(item => item.id === orderLineItemId);
        if (!orderItem) return;

        setEditingOrderContext({
            customerId,
            orderLineItemId,
            isAdding: false,
            existingOrderItemData: {
                name: orderItem.name,
                quantity: orderItem.totalQuantity,
                unit: orderItem.unit,
                masterIngredientId: orderItem.masterIngredientId,
            },
        });
        setModalType('orderIngredient');
        setModalOpen(true);
    };
    
    const handleSaveOrderIngredient = async (data: {
        customerId: string;
        orderLineItemId?: string;
        masterIngredientId?: string;
        quantity: number;
        unit: string; 
        isAdding: boolean;
    }) => {
        if (!currentUser) return;
        const customerToUpdate = await getCustomerDB(data.customerId); 
        if (!customerToUpdate) {
            alert("Customer not found to update order ingredient.");
            closeModal();
            return;
        }
    
        let tempGeneratedOrder = customerToUpdate.generatedOrder 
            ? { ...customerToUpdate.generatedOrder, cumulativeIngredients: [...customerToUpdate.generatedOrder.cumulativeIngredients] }
            : { cumulativeIngredients: [], selectedCookingItems: [], totalOrderCost: 0 };

        if (data.isAdding && data.masterIngredientId) {
            const masterIngredient = ingredients.find(ing => ing.id === data.masterIngredientId);
            if (masterIngredient) {
                const { quantityInBase: newlyAddedBaseQuantity, baseUnit: newlyAddedBaseUnit } = convertToBaseUnit(data.quantity, data.unit);
                
                const existingItemIndex = tempGeneratedOrder.cumulativeIngredients.findIndex(
                    item => item.masterIngredientId === data.masterIngredientId
                );

                if (existingItemIndex > -1) { // Item exists, update quantity
                    const existingOrderItem = tempGeneratedOrder.cumulativeIngredients[existingItemIndex];
                    const { quantityInBase: currentOrderBaseQuantity, baseUnit: currentOrderBaseUnit } = convertToBaseUnit(existingOrderItem.totalQuantity, existingOrderItem.unit);
                    
                    if (newlyAddedBaseUnit === currentOrderBaseUnit) { // Ensure units are compatible for summation
                        const totalBaseQuantity = newlyAddedBaseQuantity + currentOrderBaseQuantity;
                        const { displayQuantity: newTotalDisplayQuantity, displayUnit: newTotalDisplayUnit } = formatDisplayQuantity(totalBaseQuantity, newlyAddedBaseUnit);
                        
                        tempGeneratedOrder.cumulativeIngredients[existingItemIndex] = {
                            ...existingOrderItem,
                            totalQuantity: newTotalDisplayQuantity,
                            unit: newTotalDisplayUnit,
                            totalPrice: 0, // To be recalculated
                        };
                    } else {
                        alert(`Cannot aggregate ingredient: unit types mismatch (${newlyAddedBaseUnit} vs ${currentOrderBaseUnit}). Please add as a new line item if units are fundamentally different or adjust existing item.`);
                        closeModal();
                        return;
                    }
                } else { // Item does not exist, add new
                    const { displayQuantity: actualDisplayQuantity, displayUnit: actualDisplayUnit } = formatDisplayQuantity(newlyAddedBaseQuantity, newlyAddedBaseUnit);
                    const newOrderItem: CumulativeIngredient = {
                        id: generateId(), 
                        masterIngredientId: data.masterIngredientId,
                        name: getTranslatedText(masterIngredient.name, currentUser.preferredLanguage),
                        totalQuantity: actualDisplayQuantity, 
                        unit: actualDisplayUnit, 
                        totalPrice: 0, 
                    };
                    tempGeneratedOrder.cumulativeIngredients.push(newOrderItem);
                }
            }
        } else if (!data.isAdding && data.orderLineItemId) { // Editing existing
            tempGeneratedOrder.cumulativeIngredients = tempGeneratedOrder.cumulativeIngredients.map(item => {
                if (item.id === data.orderLineItemId) {
                     const { quantityInBase, baseUnit } = convertToBaseUnit(data.quantity, data.unit);
                     const { displayQuantity: actualDisplayQuantity, displayUnit: actualDisplayUnit } = formatDisplayQuantity(quantityInBase, baseUnit);
                    return { ...item, totalQuantity: actualDisplayQuantity, unit: actualDisplayUnit, totalPrice: 0 }; // Recalc price
                }
                return item;
            });
        }
        
        const tempUpdatedCustomer: Customer = { ...customerToUpdate, generatedOrder: tempGeneratedOrder };
        await putCustomerDB(tempUpdatedCustomer); 
        await handleGenerateOrder(data.customerId, false); // Pass false to make it re-evaluate existing items with new quantities
        closeModal();
    };

    const handleDeleteOrderIngredient = async (customerId: string, orderLineItemId: string) => {
         if (!currentUser) return;
         const customer = await getCustomerDB(customerId); 
         if (!customer || !customer.generatedOrder) {
            alert("Customer or order not found to delete ingredient.");
            return;
         }

         const itemPermissionContext = { customerUserId: customer.userId };
         if (!canPerformAction('delete', 'orderIngredient', itemPermissionContext)) {
             alert(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser.preferredLanguage));
             return;
         }
        
        const updatedIngredients = customer.generatedOrder.cumulativeIngredients.filter(
            item => item.id !== orderLineItemId
        );
        const tempUpdatedCustomer: Customer = {
            ...customer,
            generatedOrder: {
                ...customer.generatedOrder,
                cumulativeIngredients: updatedIngredients,
            },
        };
        await putCustomerDB(tempUpdatedCustomer);
        await handleGenerateOrder(customerId, false); 
        alert('Ingredient removed from order.');
    };

    const handleOpenAddOrderCookingItemModal = (customerId: string) => {
        setEditingOrderCookingItemContext({ customerId, isAdding: true });
        setModalType('orderCookingItem');
        setModalOpen(true);
    };

    const handleOpenEditOrderCookingItemModal = (customerId: string, orderLineItemId: string) => {
        const customer = customers.find(c => c.id === customerId);
        if (!customer || !customer.generatedOrder || !currentUser) return;
        const orderItem = customer.generatedOrder.selectedCookingItems.find(item => item.id === orderLineItemId);
        if (!orderItem) return;
        
        setEditingOrderCookingItemContext({
            customerId,
            orderLineItemId,
            isAdding: false,
            existingOrderItemData: {
                masterCookingItemId: orderItem.masterCookingItemId,
                name: orderItem.name,
                quantity: orderItem.quantity,
                unit: orderItem.unit,
                price: orderItem.price,
            },
        });
        setModalType('orderCookingItem');
        setModalOpen(true);
    };

    const handleSaveOrderCookingItem = async (data: {
        customerId: string;
        orderLineItemId?: string; 
        masterCookingItemId?: string; 
        quantity: number;
        isAdding: boolean;
    }) => {
        if (!currentUser) return;
        const customerToUpdate = await getCustomerDB(data.customerId); 
        if (!customerToUpdate) {
            alert("Customer not found to update order cooking item.");
            closeModal();
            return;
        }

        let tempGeneratedOrder = customerToUpdate.generatedOrder
            ? { ...customerToUpdate.generatedOrder, selectedCookingItems: [...customerToUpdate.generatedOrder.selectedCookingItems] }
            : { cumulativeIngredients: [], selectedCookingItems: [], totalOrderCost: 0 };
        
        if (data.isAdding && data.masterCookingItemId) {
            const masterItem = cookingItems.find(ci => ci.id === data.masterCookingItemId);
            if (masterItem) {
                const existingItemIndex = tempGeneratedOrder.selectedCookingItems.findIndex(
                    item => item.masterCookingItemId === data.masterCookingItemId
                );

                if (existingItemIndex > -1) { 
                    tempGeneratedOrder.selectedCookingItems[existingItemIndex].quantity += data.quantity;
                    tempGeneratedOrder.selectedCookingItems[existingItemIndex].totalPrice = 0; // Recalc
                } else { 
                    const newOrderItem: SelectedCookingItemDetail = {
                        id: generateId(),
                        masterCookingItemId: data.masterCookingItemId,
                        name: getTranslatedText(masterItem.name, currentUser.preferredLanguage),
                        quantity: data.quantity,
                        unit: masterItem.unit,
                        price: masterItem.price, // Price per unit
                        totalPrice: 0, // To be recalculated
                    };
                    tempGeneratedOrder.selectedCookingItems.push(newOrderItem);
                }
            }
        } else if (!data.isAdding && data.orderLineItemId) { // Editing existing
            tempGeneratedOrder.selectedCookingItems = tempGeneratedOrder.selectedCookingItems.map(item => {
                if (item.id === data.orderLineItemId) {
                    // If masterCookingItemId could change via edit, it needs to be handled. Assume only quantity changes for now.
                    return { ...item, quantity: data.quantity, totalPrice: 0 }; // Recalc price
                }
                return item;
            });
        }

        const tempUpdatedCustomer: Customer = { ...customerToUpdate, generatedOrder: tempGeneratedOrder };
        await putCustomerDB(tempUpdatedCustomer);
        await handleGenerateOrder(data.customerId, false); // Pass false to re-evaluate existing items
        closeModal();
    };

    const handleDeleteOrderCookingItem = async (customerId: string, orderLineItemId: string) => {
        if (!currentUser) return;
        const customer = await getCustomerDB(customerId); 
        if (!customer || !customer.generatedOrder) {
            alert("Customer or order not found to delete cooking item.");
            return;
        }

        const itemPermissionContext = { customerUserId: customer.userId };
        if (!canPerformAction('delete', 'orderCookingItem', itemPermissionContext)) {
             alert(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser.preferredLanguage));
            return;
        }

        const updatedCookingItems = customer.generatedOrder.selectedCookingItems.filter(
            item => item.id !== orderLineItemId
        );
        const tempUpdatedCustomer: Customer = {
            ...customer,
            generatedOrder: {
                ...customer.generatedOrder,
                selectedCookingItems: updatedCookingItems,
            },
        };
        await putCustomerDB(tempUpdatedCustomer);
        await handleGenerateOrder(customerId, false); 
        alert('Cooking item removed from order.');
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
          hr.section-separator { border: 0; height: 1px; background-color: #eee; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          ul { padding-left: 20px; }
          .footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #777; }
          .total-cost { font-size: 1.2em; font-weight: bold; text-align: right; margin-top: 10px;}
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
    html += `<hr class="section-separator">`;
    html += `<div class="section"><h2>${getUIText(UITranslationKeys.PDF_PREPARED_BY_LABEL, userLang)}</h2>`;
    html += `<p><strong>${getUIText(UITranslationKeys.NAME_LABEL, userLang)}</strong> ${forUser.username}</p>`;
    html += `<p><strong>${getUIText(UITranslationKeys.PDF_USER_CATERING_NAME_LABEL, userLang)}</strong> ${forUser.cateringName}</p>`;
    html += `<p><strong>${getUIText(UITranslationKeys.PDF_USER_PHONE_LABEL, userLang)}</strong> ${forUser.phone}</p>`;
    html += `<p><strong>${getUIText(UITranslationKeys.PDF_USER_ADDRESS_LABEL, userLang)}</strong> ${forUser.address}</p></div>`;
    html += `<hr class="section-separator">`;
    html += `<div class="section"><h2>${getUIText(UITranslationKeys.PDF_CUSTOMER_LABEL, userLang)} ${name}</h2>`;
    html += `<p><strong>${getUIText(UITranslationKeys.PDF_CUSTOMER_PHONE_LABEL, userLang)}</strong> ${phone}</p>`;
    html += `<p><strong>${getUIText(UITranslationKeys.PDF_CUSTOMER_ADDRESS_LABEL, userLang)}</strong> ${address}</p>`;
    html += `<p><strong>${getUIText(UITranslationKeys.PDF_NUM_PERSONS_LABEL, userLang)}</strong> ${numberOfPersons}</p></div>`;
    html += `<hr class="section-separator">`;
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
        html += `<table><thead><tr>
          <th>${getUIText(UITranslationKeys.PDF_INGREDIENTS_TABLE_HEADER_NAME, userLang)}</th>
          <th>${getUIText(UITranslationKeys.PDF_INGREDIENTS_TABLE_HEADER_QUANTITY, userLang)}</th>
          <th>${getUIText(UITranslationKeys.PDF_INGREDIENTS_TABLE_HEADER_UNIT, userLang)}</th>
          <th>${getUIText(UITranslationKeys.PDF_INGREDIENTS_TABLE_HEADER_PRICE, userLang)}</th>
        </tr></thead><tbody>`;
        generatedOrder.cumulativeIngredients.forEach(ing => {
            html += `<tr><td>${ing.name}</td><td>${ing.totalQuantity.toFixed(3)}</td><td>${ing.unit}</td><td>₹${ing.totalPrice.toFixed(3)}</td></tr>`;
        });
        html += `</tbody></table>`;
    } else {
        html += `<p>${getUIText(UITranslationKeys.PDF_NO_INGREDIENTS_CALCULATED, userLang)}</p>`;
    }
    html += `</div>`;

    html += `<div class="section"><h2>${getUIText(UITranslationKeys.PDF_SELECTED_COOKING_ITEMS_TITLE, userLang)}</h2>`;
    if (generatedOrder.selectedCookingItems.length > 0) {
        html += `<table><thead><tr>
            <th>${getUIText(UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_NAME, userLang)}</th>
            <th>${getUIText(UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_QUANTITY, userLang)}</th>
            <th>${getUIText(UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_UNIT, userLang)}</th>
            <th>${getUIText(UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_PRICE_PER_UNIT, userLang)}</th>
            <th>${getUIText(UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_TOTAL_PRICE, userLang)}</th>
        </tr></thead><tbody>`;
        generatedOrder.selectedCookingItems.forEach(item => {
            html += `<tr><td>${item.name}</td><td>${item.quantity}</td><td>${item.unit}</td><td>₹${item.price.toFixed(3)}</td><td>₹${item.totalPrice.toFixed(3)}</td></tr>`;
        });
        html += `</tbody></table>`;
    } else {
        html += `<p>${getUIText(UITranslationKeys.PDF_NO_COOKING_ITEMS_SELECTED, userLang)}</p>`;
    }
    html += `</div>`;

    html += `<div class="total-cost">${getUIText(UITranslationKeys.PDF_TOTAL_ORDER_COST_LABEL, userLang, Language.EN, {totalCost: generatedOrder.totalOrderCost.toFixed(3)})}</div>`;

    html += `<hr class="section-separator">`;
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
    const printWindow = window.open("", "_blank", "height=600,width=800");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close(); // Important for some browsers
      printWindow.onload = () => { // Wait for content to load
        printWindow.focus(); // Focus on the new window
        printWindow.print();
        // printWindow.close(); // Optionally close after printing attempt
      };
    } else {
      alert("Could not open new window for printing. Please check your pop-up blocker settings and try again.");
    }
  };

const handleShareToWhatsApp = (customer: Customer) => {
    if (!customer.generatedOrder || !currentUser) {
        alert("Please generate the order first to share details.");
        return;
    }
    const userLang = currentUser.preferredLanguage;

    const dishNames = customer.selectedDishes
        .map(sd => {
            const dish = dishes.find(d => d.id === sd.dishId);
            return dish ? getTranslatedText(dish.name, userLang) : null;
        })
        .filter(Boolean)
        .join(', ');

    const cookingItemSummaries = customer.generatedOrder.selectedCookingItems
        .map(item => `${item.name} (Qty: ${item.quantity} ${item.unit})`)
        .join('\n - ');

    let message = `*Order Confirmation for ${customer.name}*\n\n`;
    message += `Number of Persons: ${customer.numberOfPersons}\n\n`;
    if (dishNames) {
      message += `*Selected Dishes:*\n - ${dishNames.replace(/, /g, '\n - ')}\n\n`;
    }
    if (customer.generatedOrder.selectedCookingItems.length > 0) {
      message += `*Selected Cooking Items:*\n - ${cookingItemSummaries}\n\n`;
    }
    message += `*Total Estimated Cost:* ₹${customer.generatedOrder.totalOrderCost.toFixed(3)}\n\n`;
    message += `Prepared by: ${currentUser.cateringName}\n`;
    message += `Contact: ${currentUser.phone}\n\n`;
    message += `Please review and confirm your order details.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `whatsapp://send?text=${encodedMessage}`;

    const newWindow = window.open(whatsappUrl, '_blank');
    if (!newWindow) {
        // Fallback for browsers that block window.open or if whatsapp:// is not handled
        alert("Could not open WhatsApp directly. Please ensure WhatsApp is installed or try sharing manually.\n\nHere's the message you can copy:\n\n" + message);
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
                img.onload = () => {
                    const logoHeight = 15;
                    const logoWidth = (img.width * logoHeight) / img.height;
                    doc.addImage(imgData, imageFormat, pageMargin, yPos, logoWidth, logoHeight);
                    yPos += logoHeight + 5;
                    resolve(true);
                };
                img.onerror = (err) => {
                     console.error("Failed to load image for PDF:", err);
                     doc.setFontSize(8);
                     doc.text(`(${getUIText(UITranslationKeys.PDF_USER_LOGO_ALT, userLang)} - ${getUIText(UITranslationKeys.IMAGE_LABEL, userLang)} error loading)`, pageMargin, yPos + 5);
                     yPos += 10;
                     resolve(false); 
                };
            });
        } catch (e) { 
            console.error("Error processing image for PDF:", e);
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
            getUIText(UITranslationKeys.PDF_INGREDIENTS_TABLE_HEADER_UNIT, userLang),
            getUIText(UITranslationKeys.PDF_INGREDIENTS_TABLE_HEADER_PRICE, userLang)
        ]],
        body: customer.generatedOrder.cumulativeIngredients.map(ing => [
            ing.name, 
            ing.totalQuantity.toFixed(3), 
            ing.unit,
            `₹${ing.totalPrice.toFixed(3)}`
        ]),
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
            getUIText(UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_UNIT, userLang),
            getUIText(UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_PRICE_PER_UNIT, userLang),
            getUIText(UITranslationKeys.PDF_COOKING_ITEMS_TABLE_HEADER_TOTAL_PRICE, userLang)
        ]],
        body: customer.generatedOrder.selectedCookingItems.map(item => [
            item.name, 
            item.quantity, 
            item.unit,
            `₹${item.price.toFixed(3)}`,
            `₹${item.totalPrice.toFixed(3)}`
        ]),
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
    
    doc.setFontSize(12);
    doc.text(getUIText(UITranslationKeys.PDF_TOTAL_ORDER_COST_LABEL, userLang, Language.EN, {totalCost: customer.generatedOrder.totalOrderCost.toFixed(3)}), pageWidth - pageMargin, yPos, { align: 'right' });
    yPos += 10;


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
    doc.setPage(pageCount); // Ensure last page is active for final text

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

    const handleExportIngredientsExcel = async () => {
        if (!currentUser || (currentUser.role !== UserRole.SUPREM)) {
            alert(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser.preferredLanguage));
            return;
        }
        const ingredientsFromDB = await getAllIngredientsDB();
        const dataToExport = ingredientsFromDB.map(ing => {
            const row: any = {
                id: ing.id,
                imageUrl: ing.imageUrl,
                quantity: ing.quantity,
                unit: ing.unit,
                price: ing.price, 
            };
            SupportedLanguages.forEach(lang => {
                row[`name_${lang}`] = ing.name[lang] || '';
            });
            return row;
        });

        const headers = ["id", ...SupportedLanguages.map(lang => `name_${lang}`), "imageUrl", "quantity", "unit", "price"]; 
        const worksheet = XLSX.utils.json_to_sheet(dataToExport, { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ingredients");
        XLSX.writeFile(workbook, "ingredients_export.xlsx");

        alert(getUIText(UITranslationKeys.ALERT_INGREDIENTS_EXPORTED_SUCCESS, currentUser.preferredLanguage));
    };

    const handleImportIngredientsExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!currentUser || (currentUser.role !== UserRole.SUPREM)) {
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
        reader.onload = async (e) => {
            const data = e.target?.result;
            if (!data) {
                alert(getUIText(UITranslationKeys.EXCEL_IMPORT_FAILURE_ALERT, currentUser.preferredLanguage));
                return;
            }
            try {
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]; 

                if (jsonData.length < 2) { 
                    alert(getUIText(UITranslationKeys.EXCEL_IMPORT_FAILURE_ALERT, currentUser.preferredLanguage) + " (Empty or header-only file)");
                    return;
                }

                const rawHeaders = jsonData[0].map(h => String(h).trim());
                const expectedBaseHeaders = ["id", "imageUrl", "quantity", "unit", "price"]; 
                const expectedNameHeaders = SupportedLanguages.map(lang => `name_${lang}`);
                const expectedHeaders = [...expectedBaseHeaders.slice(0,1), ...expectedNameHeaders, ...expectedBaseHeaders.slice(1)];

                if (rawHeaders.length !== expectedHeaders.length || !expectedHeaders.every(eh => rawHeaders.includes(eh))) {
                     alert(getUIText(UITranslationKeys.EXCEL_HEADER_MISMATCH_ALERT, currentUser.preferredLanguage, Language.EN, {
                        expectedHeaders: expectedHeaders.join(', '),
                        actualHeaders: rawHeaders.join(', ')
                     }));
                    return;
                }
                const headerMap: { [key: string]: number } = {};
                rawHeaders.forEach((header, index) => {
                    headerMap[header] = index;
                });

                const ingredientsToAdd: Ingredient[] = [];
                const ingredientsToUpdate: Ingredient[] = [];
                let importedCount = 0;
                let updatedCount = 0;

                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i];
                    if (!row || row.every(cell => cell === null || cell === undefined || String(cell).trim() === '')) continue; 

                    const nameLocalized: LocalizedText = {};
                    SupportedLanguages.forEach(lang => {
                        const langKey = `name_${lang}`;
                        if (row[headerMap[langKey]] !== undefined && String(row[headerMap[langKey]]).trim() !== '') {
                             nameLocalized[lang] = String(row[headerMap[langKey]]).trim();
                        }
                    });

                    const quantityVal = row[headerMap.quantity];
                    const quantity = parseFloat(String(quantityVal));
                     const priceVal = row[headerMap.price]; 
                    const price = parseFloat(String(priceVal)); 

                    if (isNaN(quantity) || isNaN(price) || price < 0) { 
                        console.warn(`Skipping row ${i+1} due to invalid quantity or price: Q=${quantityVal}, P=${priceVal}`);
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
                        price: price, 
                    };
                    
                    const existingDBIngredient = await getIngredientDB(ingredientEntry.id);
                    if (existingDBIngredient) {
                        ingredientsToUpdate.push(ingredientEntry);
                        updatedCount++;
                    } else {
                        ingredientsToAdd.push(ingredientEntry);
                        importedCount++;
                    }
                }

                await Promise.all(ingredientsToUpdate.map(ing => putIngredientDB(ing)));
                await Promise.all(ingredientsToAdd.map(ing => addIngredientDB(ing)));
                
                setIngredients(await getAllIngredientsDB());
                alert(`${getUIText(UITranslationKeys.EXCEL_IMPORT_SUCCESS_ALERT, currentUser.preferredLanguage)} Imported: ${importedCount}, Updated: ${updatedCount}`);

            } catch (error) {
                console.error("Error parsing Excel:", error);
                alert(`${getUIText(UITranslationKeys.EXCEL_IMPORT_FAILURE_ALERT, currentUser.preferredLanguage)} See console for details.`);
            } finally {
                if(importIngredientsInputRef.current) importIngredientsInputRef.current.value = ""; 
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleExportDishesExcel = async () => {
        if (!currentUser || (currentUser.role !== UserRole.SUPREM)) {
            alert(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser.preferredLanguage));
            return;
        }
        const dishesFromDB = await getAllDishesDB();
        const dataToExport = dishesFromDB.map(dish => {
            const row: any = {
                id: dish.id,
                imageUrl: dish.imageUrl,
                ingredients_json: JSON.stringify(dish.ingredients)
            };
            SupportedLanguages.forEach(lang => {
                row[`name_${lang}`] = dish.name[lang] || '';
                row[`preparationSteps_${lang}`] = dish.preparationSteps[lang] || '';
            });
            return row;
        });

        const headers = ["id", ...SupportedLanguages.map(lang => `name_${lang}`), "imageUrl", ...SupportedLanguages.map(lang => `preparationSteps_${lang}`), "ingredients_json"];
        const worksheet = XLSX.utils.json_to_sheet(dataToExport, { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dishes");
        XLSX.writeFile(workbook, "dishes_export.xlsx");

        alert(getUIText(UITranslationKeys.ALERT_DISHES_EXPORTED_SUCCESS, currentUser.preferredLanguage));
    };

    const handleImportDishesExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!currentUser || (currentUser.role !== UserRole.SUPREM)) {
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
        reader.onload = async (e) => {
            const data = e.target?.result;
            if (!data) {
                alert(getUIText(UITranslationKeys.EXCEL_IMPORT_FAILURE_ALERT, currentUser.preferredLanguage));
                return;
            }
            try {
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]; 

                if (jsonData.length < 2) { 
                    alert(getUIText(UITranslationKeys.EXCEL_IMPORT_FAILURE_ALERT, currentUser.preferredLanguage) + " (Empty or header-only file)");
                    return;
                }

                const rawHeaders = jsonData[0].map(h => String(h).trim());
                const expectedBaseHeaders = ["id", "imageUrl", "ingredients_json"];
                const expectedNameHeaders = SupportedLanguages.map(lang => `name_${lang}`);
                const expectedPrepStepsHeaders = SupportedLanguages.map(lang => `preparationSteps_${lang}`);
                const expectedHeaders = [
                    expectedBaseHeaders[0], 
                    ...expectedNameHeaders, 
                    expectedBaseHeaders[1], 
                    ...expectedPrepStepsHeaders, 
                    expectedBaseHeaders[2]
                ];


                if (rawHeaders.length !== expectedHeaders.length || !expectedHeaders.every(eh => rawHeaders.includes(eh))) {
                     alert(getUIText(UITranslationKeys.EXCEL_HEADER_MISMATCH_ALERT, currentUser.preferredLanguage, Language.EN, {
                        expectedHeaders: expectedHeaders.join(', '),
                        actualHeaders: rawHeaders.join(', ')
                     }));
                    return;
                }
                const headerMap: { [key: string]: number } = {};
                rawHeaders.forEach((header, index) => {
                    headerMap[header] = index;
                });

                const dishesToAdd: Dish[] = [];
                const dishesToUpdate: Dish[] = [];
                let importedCount = 0;
                let updatedCount = 0;
                let errorOccurred = false;
                const masterIngredientsList = await getAllIngredientsDB(); 

                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i];
                    if (!row || row.every(cell => cell === null || cell === undefined || String(cell).trim() === '')) continue; 

                    const nameLocalized: LocalizedText = {};
                    SupportedLanguages.forEach(lang => {
                        const langKey = `name_${lang}`;
                        if (row[headerMap[langKey]] !== undefined && String(row[headerMap[langKey]]).trim() !== '') {
                             nameLocalized[lang] = String(row[headerMap[langKey]]).trim();
                        }
                    });

                    const prepStepsLocalized: LocalizedText = {};
                    SupportedLanguages.forEach(lang => {
                        const langKey = `preparationSteps_${lang}`;
                        if (row[headerMap[langKey]] !== undefined && String(row[headerMap[langKey]]).trim() !== '') {
                             prepStepsLocalized[lang] = String(row[headerMap[langKey]]).trim();
                        }
                    });
                    
                    if (Object.keys(nameLocalized).length === 0) {
                        console.warn(`Skipping dish in row ${i+1} as no name provided in any language.`);
                        continue;
                    }
                    
                    const dishNameForAlert = getTranslatedText(nameLocalized, Language.EN) || `Row ${i+1}`;

                    let dishIngredients: DishIngredient[] = [];
                    const ingredientsJsonString = String(row[headerMap.ingredients_json] || '[]').trim();
                    try {
                        const parsedIngredients = JSON.parse(ingredientsJsonString);
                        if (Array.isArray(parsedIngredients)) {
                            for (const ing of parsedIngredients) {
                                if (typeof ing.ingredientId !== 'string' || !masterIngredientsList.find(masterIng => masterIng.id === ing.ingredientId)) {
                                    alert(getUIText(UITranslationKeys.EXCEL_DISH_IMPORT_INVALID_INGREDIENT_ID, currentUser.preferredLanguage, Language.EN, { ingredientId: ing.ingredientId || 'N/A', dishName: dishNameForAlert }));
                                    throw new Error("Invalid ingredient ID");
                                }
                                const quantity = parseFloat(ing.quantity);
                                if (isNaN(quantity) || quantity <= 0) {
                                     alert(getUIText(UITranslationKeys.EXCEL_DISH_IMPORT_INVALID_INGREDIENT_QUANTITY, currentUser.preferredLanguage, Language.EN, { ingredientId: ing.ingredientId, dishName: dishNameForAlert }));
                                    throw new Error("Invalid ingredient quantity");
                                }
                                dishIngredients.push({ ingredientId: ing.ingredientId, quantity });
                            }
                        } else {
                            throw new Error("Ingredients JSON is not an array");
                        }
                    } catch (jsonError: any) {
                         alert(getUIText(UITranslationKeys.EXCEL_DISH_IMPORT_INVALID_INGREDIENTS_JSON, currentUser.preferredLanguage, Language.EN, { dishName: dishNameForAlert, error: jsonError.message }));
                        console.error(`Error parsing ingredients JSON for dish "${dishNameForAlert}" (Row ${i+1}):`, jsonError);
                        errorOccurred = true;
                        continue; 
                    }


                    const idVal = row[headerMap.id] !== undefined ? String(row[headerMap.id]).trim() : generateId();
                    const imageUrlVal = row[headerMap.imageUrl] !== undefined ? String(row[headerMap.imageUrl]).trim() : '';

                    const dishEntry: Dish = {
                        id: idVal,
                        name: nameLocalized,
                        imageUrl: imageUrlVal || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, getTranslatedText(nameLocalized, Language.EN) || 'imported_dish'),
                        ingredients: dishIngredients,
                        preparationSteps: prepStepsLocalized,
                    };

                    const existingDBDish = await getDishDB(dishEntry.id);
                    if (existingDBDish) {
                        dishesToUpdate.push(dishEntry);
                        updatedCount++;
                    } else {
                        dishesToAdd.push(dishEntry);
                        importedCount++;
                    }
                }
                
                await Promise.all(dishesToUpdate.map(d => putDishDB(d)));
                await Promise.all(dishesToAdd.map(d => addDishDB(d)));
                
                setDishes(await getAllDishesDB());
                 if (!errorOccurred) {
                    alert(`${getUIText(UITranslationKeys.ALERT_DISHES_IMPORTED_SUCCESS, currentUser.preferredLanguage)} Imported: ${importedCount}, Updated: ${updatedCount}`);
                } else {
                    alert(`Dishes import process completed with some errors. Imported: ${importedCount}, Updated: ${updatedCount}. Please check console for details of skipped rows.`);
                }

            } catch (error) {
                console.error("Error parsing Dishes Excel:", error);
                alert(`${getUIText(UITranslationKeys.EXCEL_IMPORT_FAILURE_ALERT, currentUser.preferredLanguage)} See console for details.`);
            } finally {
                if(importDishesInputRef.current) importDishesInputRef.current.value = ""; 
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleExportCookingItemsExcel = async () => {
        if (!currentUser || currentUser.role !== UserRole.SUPREM) {
            alert(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser.preferredLanguage));
            return;
        }
        const itemsFromDB = await getAllCookingItemsDB();
        const dataToExport = itemsFromDB.map(item => {
            const row: any = {
                id: item.id,
                imageUrl: item.imageUrl,
                unit: item.unit,
                price: item.price, 
            };
            SupportedLanguages.forEach(lang => {
                row[`name_${lang}`] = item.name[lang] || '';
                row[`summary_${lang}`] = item.summary[lang] || '';
            });
            return row;
        });

        const headers = ["id", ...SupportedLanguages.map(lang => `name_${lang}`), "imageUrl", ...SupportedLanguages.map(lang => `summary_${lang}`), "unit", "price"]; 
        const worksheet = XLSX.utils.json_to_sheet(dataToExport, { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "CookingItems");
        XLSX.writeFile(workbook, "cooking_items_export.xlsx");
        alert(getUIText(UITranslationKeys.ALERT_COOKING_ITEMS_EXPORTED_SUCCESS, currentUser.preferredLanguage));
    };

    const handleImportCookingItemsExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!currentUser || currentUser.role !== UserRole.SUPREM) {
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
        reader.onload = async (e) => {
            const data = e.target?.result;
            if (!data) {
                 alert(getUIText(UITranslationKeys.EXCEL_IMPORT_FAILURE_ALERT, currentUser.preferredLanguage));
                return;
            }
            try {
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

                if (jsonData.length < 2) {
                    alert(getUIText(UITranslationKeys.EXCEL_IMPORT_FAILURE_ALERT, currentUser.preferredLanguage) + " (Empty or header-only file)");
                    return;
                }

                const rawHeaders = jsonData[0].map(h => String(h).trim());
                const expectedBaseHeaders = ["id", "imageUrl", "unit", "price"]; 
                const expectedNameHeaders = SupportedLanguages.map(lang => `name_${lang}`);
                const expectedSummaryHeaders = SupportedLanguages.map(lang => `summary_${lang}`);
                const expectedHeaders = [
                    expectedBaseHeaders[0], 
                    ...expectedNameHeaders, 
                    expectedBaseHeaders[1], 
                    ...expectedSummaryHeaders, 
                    expectedBaseHeaders[2],
                    expectedBaseHeaders[3] 
                ];

                if (rawHeaders.length !== expectedHeaders.length || !expectedHeaders.every(eh => rawHeaders.includes(eh))) {
                    alert(getUIText(UITranslationKeys.EXCEL_HEADER_MISMATCH_ALERT, currentUser.preferredLanguage, Language.EN, {
                        expectedHeaders: expectedHeaders.join(', '),
                        actualHeaders: rawHeaders.join(', ')
                    }));
                    return;
                }
                const headerMap: { [key: string]: number } = {};
                rawHeaders.forEach((header, index) => headerMap[header] = index);

                const itemsToAdd: CookingItem[] = [];
                const itemsToUpdate: CookingItem[] = [];
                let importedCount = 0;
                let updatedCount = 0;

                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i];
                    if (!row || row.every(cell => cell === null || cell === undefined || String(cell).trim() === '')) continue;

                    const nameLocalized: LocalizedText = {};
                    SupportedLanguages.forEach(lang => {
                        const langKey = `name_${lang}`;
                        if (row[headerMap[langKey]] !== undefined && String(row[headerMap[langKey]]).trim() !== '') {
                            nameLocalized[lang] = String(row[headerMap[langKey]]).trim();
                        }
                    });

                    const summaryLocalized: LocalizedText = {};
                    SupportedLanguages.forEach(lang => {
                        const langKey = `summary_${lang}`;
                        if (row[headerMap[langKey]] !== undefined && String(row[headerMap[langKey]]).trim() !== '') {
                            summaryLocalized[lang] = String(row[headerMap[langKey]]).trim();
                        }
                    });

                    if (Object.keys(nameLocalized).length === 0) {
                        console.warn(`Skipping cooking item in row ${i+1} as no name provided in any language.`);
                        continue;
                    }
                    
                    const unitVal = String(row[headerMap.unit]).trim();
                     if (!unitVal || !CookingItemUnits.includes(unitVal)) {
                        console.warn(`Skipping cooking item in row ${i+1} due to invalid unit: ${unitVal}`);
                        continue;
                    }
                    const priceVal = row[headerMap.price];
                    const price = parseFloat(String(priceVal));
                    if(isNaN(price) || price < 0) {
                        console.warn(`Skipping cooking item in row ${i+1} due to invalid price: ${priceVal}`);
                        continue;
                    }


                    const idVal = row[headerMap.id] !== undefined ? String(row[headerMap.id]).trim() : generateId();
                    const imageUrlVal = row[headerMap.imageUrl] !== undefined ? String(row[headerMap.imageUrl]).trim() : '';
                    
                    const itemEntry: CookingItem = {
                        id: idVal,
                        name: nameLocalized,
                        imageUrl: imageUrlVal || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, getTranslatedText(nameLocalized, Language.EN) || 'imported_cooking_item'),
                        summary: summaryLocalized,
                        unit: unitVal,
                        price: price, 
                    };

                    const existingDBItem = await getCookingItemDB(itemEntry.id);
                    if (existingDBItem) {
                        itemsToUpdate.push(itemEntry);
                        updatedCount++;
                    } else {
                        itemsToAdd.push(itemEntry);
                        importedCount++;
                    }
                }

                await Promise.all(itemsToUpdate.map(item => putCookingItemDB(item)));
                await Promise.all(itemsToAdd.map(item => addCookingItemDB(item)));
                
                setCookingItems(await getAllCookingItemsDB());
                alert(`${getUIText(UITranslationKeys.ALERT_COOKING_ITEMS_IMPORTED_SUCCESS, currentUser.preferredLanguage)} Imported: ${importedCount}, Updated: ${updatedCount}`);

            } catch (error) {
                console.error("Error parsing Cooking Items Excel:", error);
                alert(`${getUIText(UITranslationKeys.EXCEL_IMPORT_FAILURE_ALERT, currentUser.preferredLanguage)} See console for details.`);
            } finally {
                if(importCookingItemsInputRef.current) importCookingItemsInputRef.current.value = "";
            }
        };
        reader.readAsArrayBuffer(file);
    };


  const renderIngredientItem = (ingredient: Ingredient) => (
    <div key={ingredient.id} className="bg-slate-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200">
      <img src={ingredient.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, getTranslatedText(ingredient.name, currentUser!.preferredLanguage))} alt={getTranslatedText(ingredient.name, currentUser!.preferredLanguage)} className="w-full h-32 object-cover rounded-md mb-3" />
      <h3 className="text-xl font-semibold text-slate-700 mb-1">{getTranslatedText(ingredient.name, currentUser!.preferredLanguage)}</h3>
      <p className="text-sm text-slate-600">Quantity: {ingredient.quantity} {ingredient.unit}</p>
      <p className="text-sm text-slate-600 mb-3">Price: ₹{ingredient.price.toFixed(3)}</p>
      { (canPerformAction('edit', 'ingredient', ingredient) || canPerformAction('delete', 'ingredient', ingredient)) && (
        <div className="flex space-x-2">
            {canPerformAction('edit', 'ingredient', ingredient) &&
              <button onClick={() => openModal('ingredient', ingredient)} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                  <PencilIcon className="w-4 h-4 mr-1" /> Edit
              </button>
            }
            {canPerformAction('delete', 'ingredient', ingredient) &&
              <button onClick={() => handleDeleteIngredient(ingredient.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                  <TrashIcon className="w-4 h-4 mr-1" /> Delete
              </button>
            }
        </div>
      )}
    </div>
  );

  const renderDishItem = (dish: Dish) => {
    const dishCost = calculateDishCost(dish, ingredients);
    return (
        <div key={dish.id} className="bg-slate-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200">
        <img src={dish.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, getTranslatedText(dish.name, currentUser!.preferredLanguage))} alt={getTranslatedText(dish.name, currentUser!.preferredLanguage)} className="w-full h-32 object-cover rounded-md mb-3" />
        <h3 className="text-xl font-semibold text-slate-700 mb-1">{getTranslatedText(dish.name, currentUser!.preferredLanguage)}</h3>
        <p className="text-sm text-slate-600 mb-1">{getUIText(UITranslationKeys.DISH_COST_LABEL, currentUser!.preferredLanguage, Language.EN, {cost: dishCost.toFixed(3)})}</p>
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
        { (canPerformAction('edit', 'dish', dish) || canPerformAction('delete', 'dish', dish)) && (
            <div className="flex space-x-2">
                {canPerformAction('edit', 'dish', dish) &&
                <button onClick={() => openModal('dish', dish)} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                    <PencilIcon className="w-4 h-4 mr-1" /> Edit
                </button>
                }
                {canPerformAction('delete', 'dish', dish) &&
                <button onClick={() => handleDeleteDish(dish.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                    <TrashIcon className="w-4 h-4 mr-1" /> Delete
                </button>
                }
            </div>
        )}
        </div>
    );
  };

  const renderCookingItem = (item: CookingItem) => (
    <div key={item.id} className="bg-slate-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200">
      <img src={item.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, getTranslatedText(item.name, currentUser!.preferredLanguage))} alt={getTranslatedText(item.name, currentUser!.preferredLanguage)} className="w-full h-32 object-cover rounded-md mb-3" />
      <h3 className="text-xl font-semibold text-slate-700 mb-1">{getTranslatedText(item.name, currentUser!.preferredLanguage)}</h3>
      <p className="text-sm text-slate-600">Unit: {item.unit}</p>
      <p className="text-sm text-slate-600 mb-1">Price: ₹{item.price.toFixed(3)} / {item.unit}</p>
      <p className="text-xs text-slate-500 mb-2 truncate" title={getTranslatedText(item.summary, currentUser!.preferredLanguage)}>Summary: {getTranslatedText(item.summary, currentUser!.preferredLanguage)}</p>
      { (canPerformAction('edit', 'cookingItem', item) || canPerformAction('delete', 'cookingItem', item)) && (
        <div className="flex space-x-2">
            {canPerformAction('edit', 'cookingItem', item) &&
              <button onClick={() => openModal('cookingItem', item)} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                  <PencilIcon className="w-4 h-4 mr-1" /> Edit
              </button>
            }
            {canPerformAction('delete', 'cookingItem', item) &&
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
    const itemPermissionContext = { customerUserId: customer.userId }; 

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
                <div className="mt-2 space-y-2">
                    <p className="font-semibold">Ingredients Needed:</p>
                    {customer.generatedOrder.cumulativeIngredients.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 pl-1">
                            {customer.generatedOrder.cumulativeIngredients.map((ing) => (
                                <li key={ing.id} className="flex justify-between items-center">
                                    <span>{ing.name}: {ing.totalQuantity.toFixed(3)} {ing.unit} (₹{ing.totalPrice.toFixed(3)})</span>
                                    { (canPerformAction('edit', 'orderIngredient', itemPermissionContext) || canPerformAction('delete', 'orderIngredient', itemPermissionContext)) && (
                                        <div className="space-x-1">
                                            {canPerformAction('edit', 'orderIngredient', itemPermissionContext) &&
                                              <button onClick={() => handleOpenEditOrderIngredientModal(customer.id, ing.id)} className="p-1 text-yellow-600 hover:text-yellow-700" title="Edit Ingredient">
                                                  <PencilIcon className="w-3.5 h-3.5" />
                                              </button>
                                            }
                                            {canPerformAction('delete', 'orderIngredient', itemPermissionContext) &&
                                              <button onClick={() => handleDeleteOrderIngredient(customer.id, ing.id)} className="p-1 text-red-600 hover:text-red-700" title="Delete Ingredient">
                                                  <TrashIcon className="w-3.5 h-3.5" />
                                              </button>
                                            }
                                        </div>
                                     )}
                                </li>
                            ))}
                        </ul>
                    ) : <p className="pl-1">(None)</p>}

                    {canPerformAction('add', 'orderIngredient', itemPermissionContext) && (
                        <button
                            onClick={() => handleOpenAddOrderIngredientModal(customer.id)}
                            className="mt-2 text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded flex items-center"
                        >
                            <PlusIcon className="w-3 h-3 mr-1" /> {getUIText(UITranslationKeys.ADD_INGREDIENT_TO_ORDER_BUTTON, userLang)}
                        </button>
                    )}

                    <p className="font-semibold mt-1">Cooking Items Added:</p>
                    {customer.generatedOrder.selectedCookingItems.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 pl-1">
                            {customer.generatedOrder.selectedCookingItems.map((item) => (
                               <li key={item.id} className="flex justify-between items-center">
                                    <span>{item.name}: {item.quantity} {item.unit} (₹{item.totalPrice.toFixed(3)})</span>
                                    { (canPerformAction('edit', 'orderCookingItem', itemPermissionContext) || canPerformAction('delete', 'orderCookingItem', itemPermissionContext)) && (
                                        <div className="space-x-1">
                                            {canPerformAction('edit', 'orderCookingItem', itemPermissionContext) &&
                                              <button onClick={() => handleOpenEditOrderCookingItemModal(customer.id, item.id)} className="p-1 text-yellow-600 hover:text-yellow-700" title="Edit Cooking Item">
                                                  <PencilIcon className="w-3.5 h-3.5" />
                                              </button>
                                            }
                                            {canPerformAction('delete', 'orderCookingItem', itemPermissionContext) &&
                                              <button onClick={() => handleDeleteOrderCookingItem(customer.id, item.id)} className="p-1 text-red-600 hover:text-red-700" title="Delete Cooking Item">
                                                  <TrashIcon className="w-3.5 h-3.5" />
                                              </button>
                                            }
                                        </div>
                                     )}
                                </li>
                            ))}
                        </ul>
                    ) : <p className="pl-1">(None)</p>}
                     {canPerformAction('add', 'orderCookingItem', itemPermissionContext) && (
                        <button
                            onClick={() => handleOpenAddOrderCookingItemModal(customer.id)}
                            className="mt-2 text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded flex items-center"
                        >
                            <PlusIcon className="w-3 h-3 mr-1" /> {getUIText(UITranslationKeys.ADD_COOKING_ITEM_TO_ORDER_BUTTON, userLang)}
                        </button>
                    )}
                     <p className="font-bold mt-2 text-sm text-slate-700">
                        {getUIText(UITranslationKeys.ORDER_TOTAL_COST_LABEL, userLang, Language.EN, {cost: customer.generatedOrder.totalOrderCost.toFixed(3)})}
                    </p>
                </div>
            </details>
            )}
        </div>
        <div className="flex flex-col space-y-2 mt-auto pt-3">
             <button
                onClick={() => openModal('customer', customer)}
                className={`w-full bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors ${!canEditThisCustomer ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!canEditThisCustomer}
                aria-disabled={!canEditThisCustomer}
            >
                <PencilIcon className="w-4 h-4 mr-1" /> Edit Customer Details
            </button>
            <button onClick={() => handleGenerateOrder(customer.id, !customer.generatedOrder)} className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                 <CalculatorIcon className="w-4 h-4 mr-1" /> {customer.generatedOrder ? 'Recalculate Order & Costs' : 'Generate Order & Costs'}
            </button>
            {customer.generatedOrder && (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    <button onClick={() => handleViewHtmlOrder(customer)} title={getUIText(UITranslationKeys.HTML_VIEW_ORDER_BUTTON, userLang)} className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                        <DocumentTextIcon className="w-4 h-4 mr-1" /> {getUIText(UITranslationKeys.HTML_VIEW_ORDER_BUTTON, userLang)}
                    </button>
                     <button onClick={() => handlePrintOrder(customer)} title={getUIText(UITranslationKeys.PRINT_ORDER_BUTTON, userLang)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                        <PrinterIcon className="w-4 h-4 mr-1" /> {getUIText(UITranslationKeys.PRINT_ORDER_BUTTON, userLang)}
                    </button>
                    <button onClick={() => handleViewPdfOrder(customer)} title="View PDF Order" className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                        <DocumentArrowDownIcon className="w-4 h-4 mr-1" /> View PDF
                    </button>
                     <button onClick={() => handleShareToWhatsApp(customer)} title={getUIText(UITranslationKeys.SHARE_ORDER_WHATSAPP_BUTTON, userLang)} className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors">
                        <ShareIcon className="w-4 h-4 mr-1" /> {getUIText(UITranslationKeys.SHARE_ORDER_WHATSAPP_BUTTON, userLang)}
                    </button>
                </div>
            )}
             <button
                onClick={() => handleDeleteCustomer(customer.id)}
                className={`w-full bg-red-500 hover:bg-red-600 text-white p-2 mt-2 rounded-md text-sm flex items-center justify-center transition-colors ${!canDeleteThisCustomer ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!canDeleteThisCustomer}
                aria-disabled={!canDeleteThisCustomer}
            >
                <TrashIcon className="w-4 h-4 mr-1" /> Delete Customer
            </button>
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
        if (modalType && (!currentUser && (modalType === 'profile' || modalType === 'customer' || modalType === 'dish' || modalType === 'ingredient' || modalType === 'cookingItem' || modalType === 'orderIngredient' || modalType === 'orderCookingItem'))){
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
            case 'orderIngredient':
                if (!editingOrderContext || !currentUser) return null;
                return <OrderIngredientForm
                            onSave={handleSaveOrderIngredient}
                            onCancel={closeModal}
                            context={editingOrderContext}
                            masterIngredients={ingredients} 
                            ingredientUnits={IngredientUnits}
                            currentUserPreferredLanguage={currentUser.preferredLanguage}
                        />;
            case 'orderCookingItem':
                if (!editingOrderCookingItemContext || !currentUser) return null;
                return <OrderCookingItemForm
                            onSave={handleSaveOrderCookingItem}
                            onCancel={closeModal}
                            context={editingOrderCookingItemContext}
                            masterCookingItems={cookingItems}
                            currentUserPreferredLanguage={currentUser.preferredLanguage}
                        />;
            default: return null;
        }
    };

  const renderPageContent = () => {
    if (isLoadingDB || !isAuthCheckComplete) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl text-slate-700">Loading application data...</div>
            </div>
        );
    }

    if (!currentUser && currentPage !== Page.PublicHome && currentPage !== Page.Login && currentPage !== Page.Signup) {
        setCurrentPage(Page.PublicHome); 
        return <PublicHomePage onNavigate={setCurrentPage} />;
    }

    let pageTitle = '';
    let extraCrudHeaderContent: React.ReactNode = null;

    if (currentUser) {
        switch(currentPage) {
            case Page.Ingredients:
                pageTitle = getUIText(UITranslationKeys.INGREDIENTS_PAGE_TITLE, currentUser.preferredLanguage);
                if (currentUser.role === UserRole.SUPREM) { 
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
            case Page.Dishes: 
                pageTitle = getUIText(UITranslationKeys.DISHES_PAGE_TITLE, currentUser.preferredLanguage);
                if (currentUser.role === UserRole.SUPREM) { 
                    extraCrudHeaderContent = (
                        <div className="flex space-x-2">
                             <input
                                type="file"
                                accept=".xlsx"
                                onChange={handleImportDishesExcel}
                                className="hidden"
                                id="excel-dish-import-input"
                                ref={importDishesInputRef}
                            />
                            <label
                                htmlFor="excel-dish-import-input"
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg shadow hover:shadow-md transition-all text-sm flex items-center cursor-pointer"
                            >
                                <ArrowUpTrayIcon className="w-4 h-4 mr-1" /> {getUIText(UITranslationKeys.EXCEL_IMPORT_DISHES_BUTTON, currentUser.preferredLanguage)}
                            </label>
                            <button
                                onClick={handleExportDishesExcel}
                                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-3 rounded-lg shadow hover:shadow-md transition-all text-sm flex items-center"
                            >
                               <ArrowDownTrayIcon className="w-4 h-4 mr-1" /> {getUIText(UITranslationKeys.EXCEL_EXPORT_DISHES_BUTTON, currentUser.preferredLanguage)}
                            </button>
                        </div>
                    );
                }
                break;
            case Page.CookingItems:
                pageTitle = getUIText(UITranslationKeys.COOKING_ITEMS_PAGE_TITLE, currentUser.preferredLanguage);
                 if (currentUser.role === UserRole.SUPREM) { 
                    extraCrudHeaderContent = (
                        <div className="flex space-x-2">
                             <input
                                type="file"
                                accept=".xlsx"
                                onChange={handleImportCookingItemsExcel}
                                className="hidden"
                                id="excel-cookingitem-import-input"
                                ref={importCookingItemsInputRef}
                            />
                            <label
                                htmlFor="excel-cookingitem-import-input"
                                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg shadow hover:shadow-md transition-all text-sm flex items-center cursor-pointer"
                            >
                                <ArrowUpTrayIcon className="w-4 h-4 mr-1" /> {getUIText(UITranslationKeys.EXCEL_IMPORT_COOKING_ITEMS_BUTTON, currentUser.preferredLanguage)}
                            </label>
                            <button
                                onClick={handleExportCookingItemsExcel}
                                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-3 rounded-lg shadow hover:shadow-md transition-all text-sm flex items-center"
                            >
                               <ArrowDownTrayIcon className="w-4 h-4 mr-1" /> {getUIText(UITranslationKeys.EXCEL_EXPORT_COOKING_ITEMS_BUTTON, currentUser.preferredLanguage)}
                            </button>
                        </div>
                    );
                }
                break;
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
            const customersCreatedByUser = (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.USER)
                ? customers.filter(c => c.userId === currentUser.id).length
                : 0;
            return (
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Welcome, {currentUser.username}!</h1>
                    <p className="text-slate-600 mb-1">Your Catering Name: <span className="font-semibold">{currentUser.cateringName}</span></p>
                    <p className="text-slate-600 mb-1">Your Role: <span className="font-semibold text-blue-600">{currentUser.role}</span></p>
                    <p className="text-slate-600 mb-1">Preferred Language: <span className="font-semibold text-green-600">{LanguageLabelMapping[currentUser.preferredLanguage]}</span></p>
                    <p className="text-slate-600 mb-2">
                        Your Available Credits: <span className="font-bold text-blue-600">{currentUser.role === UserRole.SUPREM ? 'Unlimited' : currentUser.credits}</span>
                    </p>
                    {(currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.USER) && (
                        <p className="text-slate-600 mb-6">
                            Customers Added (Credits Used): <span className="font-bold text-orange-600">{customersCreatedByUser}</span>
                        </p>
                    )}

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

                        {canPerformAction('add', 'customer', null) && (
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
                        canAdd={canPerformAction('add', 'ingredient', null)}
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
                        title={pageTitle}
                        items={filteredDishes}
                        renderItem={renderDishItem}
                        onAdd={() => openModal('dish')}
                        entityType="dish"
                        canAdd={canPerformAction('add', 'dish', null)}
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                        currentUserPreferredLanguage={currentUser.preferredLanguage}
                        hasItems={dishes.length > 0}
                        extraHeaderContent={extraCrudHeaderContent}
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
                        canAdd={canPerformAction('add', 'cookingItem', null)}
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                        currentUserPreferredLanguage={currentUser.preferredLanguage}
                        hasItems={cookingItems.length > 0}
                        extraHeaderContent={extraCrudHeaderContent}
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
                        canAdd={canPerformAction('add', 'customer', null)}
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