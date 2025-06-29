// App.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Page, Ingredient, Dish, CookingItem, Customer, ModalType, IngredientUnits, CookingItemUnits, DishIngredient, CustomerDishSelection, CustomerCookingItemSelection, GeneratedOrder, CumulativeIngredient, AuthUser, UserRole, Language, LocalizedText, LanguageLabels, UITranslationKeys, SelectedCookingItemDetail } from './types';
import { APP_TITLE, placeholderImage, DEFAULT_IMAGE_SIZE, baseNavigationItems, DEFAULT_SUPREM_USER, SupportedLanguages, LanguageLabelMapping, IngredientBaseUnits, UnitConversionFactors } from './constants';
import { API_BASE_URL, NOCODB_API_TOKEN } from './src/apiConstants'; // Corrected path
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
    getAllUsersAPI, addUserAPI, updateUserAPI, getUserAPI, getUserByUsernameAPI,
    getAllIngredientsAPI, addIngredientAPI, updateIngredientAPI, deleteIngredientAPI, getIngredientAPI,
    getAllDishesAPI, addDishAPI, updateDishAPI, deleteDishAPI, getDishAPI,
    getAllCookingItemsAPI, addCookingItemAPI, updateCookingItemAPI, deleteCookingItemAPI, getCookingItemAPI, 
    getAllCustomersAPI, addCustomerAPI, updateCustomerAPI, deleteCustomerAPI, getCustomerAPI, getCustomersByUserIdAPI,
    getCustomerSelectedDishesAPI, addCustomerSelectedDishAPI, deleteCustomerSelectedDishAPI, CustomerSelectedDishRecord,
    getCustomerSelectedCookingItemsAPI, addCustomerSelectedCookingItemAPI, updateCustomerSelectedCookingItemAPI, deleteCustomerSelectedCookingItemAPI, CustomerSelectedCookingItemRecord
} from './src/data.service'; // Corrected path


const AUTH_USER_STORAGE_KEY = 'culinaryCateringAppUser';

const App: React.FC = () => {
  if (!NOCODB_API_TOKEN || NOCODB_API_TOKEN === 'YOUR_NOCODB_API_TOKEN_HERE') { // This check remains valid
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-red-50 p-4">
            <InformationCircleIcon className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-red-700 mb-2">Critical Configuration Missing: API Token!</h1>
            <p className="text-red-600 text-center mb-4">
                The NocoDB API Token is not configured. This application cannot connect to the backend without it.
            </p>
            <p className="text-sm text-slate-700 text-center">
                Please open the file <code className="bg-red-200 text-red-800 px-1 rounded">src/apiConstants.ts</code> and set the <code className="bg-red-200 text-red-800 px-1 rounded">NOCODB_API_TOKEN</code> constant with your actual API token from NocoDB.
            </p>
        </div>
    );
  }


  const [currentPage, setCurrentPage] = useState<Page>(Page.PublicHome);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(true);
  const [isLoadingDishes, setIsLoadingDishes] = useState(true);
  const [isLoadingCookingItems, setIsLoadingCookingItems] = useState(true);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);


  const [users, setUsers] = useState<AuthUser[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [cookingItems, setCookingItems] = useState<CookingItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  const [apiError, setApiError] = useState<string | null>(null);

  const clearApiError = () => setApiError(null);
  const handleApiError = (message: string, error?: any) => {
    console.error(message, error);
    let detailedMessage = message;
    if (error && error.message) {
        detailedMessage += ` Details: ${error.message}`;
    }
    if (error && error.status) {
        detailedMessage += ` (Status: ${error.status})`;
    }
    if (error && error.url) {
        detailedMessage += ` (URL: ${error.url})`;
    }
    setApiError(detailedMessage);
  };


  useEffect(() => {
    async function loadInitialData() {
        setIsLoadingUsers(true);
        setIsLoadingIngredients(true);
        setIsLoadingDishes(true);
        setIsLoadingCookingItems(true);
        setIsLoadingCustomers(true);
        setApiError(null);

        try {
            const [fetchedUsers, fetchedIngredients, fetchedDishes, fetchedCookingItems, fetchedCustomers] = await Promise.all([
                getAllUsersAPI(),
                getAllIngredientsAPI(),
                getAllDishesAPI(),
                getAllCookingItemsAPI(),
                getAllCustomersAPI()
            ]);
            setUsers(fetchedUsers);
            setIngredients(fetchedIngredients);
            setDishes(fetchedDishes);
            setCookingItems(fetchedCookingItems);
            setCustomers(fetchedCustomers);

        } catch (error: any) {
             let customErrorMessage = "Failed to load initial application data.";
            if (error.status === 404 && error.message && error.message.toLowerCase().includes('table') && error.message.toLowerCase().includes('not found')) {
                customErrorMessage = `A crucial table was not found (404). Please verify the specific TABLE_PATH ID for the missing table (e.g., for '${error.message.split("'")[1]}') in src/apiConstants.ts. Ensure API_BASE_URL and NOCODB_API_TOKEN are also correct. Error: "${error.message}". URL: ${error.url}`;
            }
            handleApiError(customErrorMessage, error);
        } finally {
            setIsLoadingUsers(false);
            setIsLoadingIngredients(false);
            setIsLoadingDishes(false);
            setIsLoadingCookingItems(false);
            setIsLoadingCustomers(false);
        }
    }
    loadInitialData();
  }, []);

  const overallInitialLoading = isLoadingUsers || isLoadingIngredients || isLoadingDishes || isLoadingCookingItems || isLoadingCustomers;

  useEffect(() => {
    if (!overallInitialLoading) { 
        const attemptAutoLogin = async () => {
            const storedUserString = localStorage.getItem(AUTH_USER_STORAGE_KEY);
            if (storedUserString) {
                try {
                    const storedUser: AuthUser = JSON.parse(storedUserString);
                    const userFromAPI = await getUserAPI(storedUser.id);
                    if (userFromAPI && userFromAPI.isApproved) {
                        setCurrentUser(userFromAPI);
                        setCurrentPage(Page.Home);
                    } else {
                        localStorage.removeItem(AUTH_USER_STORAGE_KEY);
                        setCurrentUser(null);
                        setCurrentPage(Page.PublicHome);
                        if(userFromAPI && !userFromAPI.isApproved) handleApiError("Your account is pending approval or has been deactivated.");
                        else if (!userFromAPI) handleApiError("User session invalid or user not found.");
                    }
                } catch (error) {
                    handleApiError("Error during auto-login.", error);
                    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
                    setCurrentUser(null);
                    setCurrentPage(Page.PublicHome);
                }
            }
            setIsAuthCheckComplete(true); 
        };
        attemptAutoLogin();
    }
  }, [overallInitialLoading]);


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

  const handleLogin = async (loginAttemptUser: {username: string, password?: string}) => {
    setApiError(null);
    console.log(`Attempting to log in with username: ${loginAttemptUser.username}`);
    try {
        const userFromApi = await getUserByUsernameAPI(loginAttemptUser.username); 
        console.log("Fetched user for login attempt from API:", userFromApi);
        
        if (userFromApi) {
            console.log("Password from API:", userFromApi.password);
            console.log("Password entered:", loginAttemptUser.password);
            const passwordsMatch = userFromApi.password === loginAttemptUser.password;
            console.log("Passwords match:", passwordsMatch);
            console.log("Is approved status from API:", userFromApi.isApproved);

            if (passwordsMatch) {
                if (userFromApi.isApproved) {
                    setCurrentUser(userFromApi);
                    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(userFromApi)); 
                    setCurrentPage(Page.Home);
                } else {
                    handleApiError('Your account is pending approval.');
                }
            } else {
                handleApiError('Invalid username or password.');
            }
        } else {
            handleApiError('Invalid username or password (user not found by username).');
        }
    } catch(error) {
        handleApiError('Login failed during API call.', error);
    }
  };

  const handleSignup = async (newUserData: Omit<AuthUser, 'id' | 'isApproved' | 'role' | 'credits'> & {email: string, preferredLanguage: Language, imageUrl?: string | null}) => {
    setApiError(null);
    const apiUserData: AuthUser = { 
      id: generateUniqueId(), 
      ...newUserData,
      isApproved: false, 
      role: UserRole.USER, 
      credits: 0, 
      imageUrl: newUserData.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE,DEFAULT_IMAGE_SIZE, newUserData.username),
      preferredLanguage: newUserData.preferredLanguage || Language.EN,
    };
    try {
        const newUser = await addUserAPI(apiUserData as Omit<AuthUser, 'id'>); 
        setUsers(await getAllUsersAPI()); 
        alert(getUIText(UITranslationKeys.ALERT_SIGNUP_SUCCESS_PENDING_APPROVAL, newUser.preferredLanguage));
        setCurrentPage(Page.Login);
    } catch (error) {
        handleApiError('Signup failed.', error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_USER_STORAGE_KEY); 
    setCurrentPage(Page.PublicHome);
    setSelectedUserForView(null);
    setPreviousPageBeforeUserDetails(null);
    setApiError(null);
  };

  const handleApproveUser = async (userId: string, roleToAssign: UserRole) => {
    if (currentUser?.role !== UserRole.SUPREM) return;
    setApiError(null);
    try {
        const updatedUser = await updateUserAPI(userId, { isApproved: true, role: roleToAssign });
        setUsers(await getAllUsersAPI()); 
        alert(getUIText(UITranslationKeys.ALERT_USER_APPROVED_EMAIL_SIMULATION, currentUser.preferredLanguage, Language.EN, {
            userName: updatedUser.username,
            roleAssigned: roleToAssign,
            userEmail: updatedUser?.email || 'N/A'
        }));
    } catch(error) {
        handleApiError(`Failed to approve user ${userId}.`, error);
    }
  };

  const handleSetUserCredits = async (userId: string, newCredits: number) => {
    if (currentUser?.role !== UserRole.SUPREM) return;
    setApiError(null);
    if (isNaN(newCredits) || newCredits < 0) {
        alert("Invalid credit amount. Please enter a non-negative number.");
        return;
    }
    try {
        const updatedUser = await updateUserAPI(userId, { credits: newCredits });
        const allCurrentUsers = await getAllUsersAPI();
        setUsers(allCurrentUsers);

        if (currentUser?.id === userId) {
            setCurrentUser(updatedUser);
            localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updatedUser));
        }
        if (selectedUserForView && selectedUserForView.id === userId) {
            setSelectedUserForView(updatedUser);
        }
        alert('User credits updated!');
    } catch (error) {
        handleApiError(`Failed to update credits for user ${userId}.`, error);
    }
  };

  const handleUpdateUserLanguage = async (userId: string, language: Language) => {
    if (currentUser?.role !== UserRole.SUPREM && currentUser?.id !== userId) {
        alert("Permission denied to change language preference.");
        return;
    }
    setApiError(null);
    try {
        const updatedUser = await updateUserAPI(userId, { preferredLanguage: language });
        setUsers(await getAllUsersAPI()); 
        if (currentUser?.id === userId) {
            setCurrentUser(updatedUser);
            localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updatedUser));
        }
        if (selectedUserForView?.id === userId) {
            setSelectedUserForView(updatedUser);
        }
        alert(`User language preference updated to ${LanguageLabelMapping[language]}.`);
    } catch (error) {
        handleApiError(`Failed to update language for user ${userId}.`, error);
    }
  };

  const handleUpdateUserDetailsBySuprem = async (userId: string, updatedDetails: Partial<Pick<AuthUser, 'username' | 'cateringName' | 'phone' | 'address' | 'email'>>) => {
    if (currentUser?.role !== UserRole.SUPREM) {
        alert("Permission denied.");
        return;
    }
    setApiError(null);
    try {
        const updatedUser = await updateUserAPI(userId, updatedDetails);
        setUsers(await getAllUsersAPI()); 

        if (selectedUserForView?.id === userId) {
            setSelectedUserForView(updatedUser);
        }
        if (currentUser?.id === userId) { 
            setCurrentUser(updatedUser);
            localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updatedUser));
        }
        alert('User details updated successfully by Suprem.');
    } catch (error) {
        handleApiError(`Failed to update details for user ${userId}.`, error);
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
    setApiError(null); 
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
    if (currentUser.role === UserRole.SUPREM) return true;

    if (currentUser.role === UserRole.ADMIN) {
        return true; 
    }
    
    if (currentUser.role === UserRole.USER) {
        if (entity === 'customer') {
            if (action === 'add') return currentUser.credits > 0;
            if (item && item.userId === currentUser.id) return true; 
            return false;
        }
        if (entity === 'orderIngredient' || entity === 'orderCookingItem') {
            if (item && item.customerUserId === currentUser.id) return true;
            return false;
        }
        return false; 
    }
    return false;
  };

  const handleSaveIngredient = async (ingredientData: {name: string, imageUrl:string | null, quantity: number, unit: string, price: number, id?: string}) => {
    if (!currentUser || !canPerformAction(ingredientData.id ? 'edit' : 'add', 'ingredient')) {
        handleApiError("Permission denied to save ingredient.");
        return;
    }
    setApiError(null);
    
    const existing = ingredients.find(i => i.id === ingredientData.id); 
    const newNameLocalized: LocalizedText = existing?.name ? {...existing.name} : {};
    newNameLocalized[currentUser.preferredLanguage] = ingredientData.name;
    if (!newNameLocalized[Language.EN] && currentUser.preferredLanguage !== Language.EN) newNameLocalized[Language.EN] = ingredientData.name;

    const apiIngredientData: Partial<Ingredient> = { 
        name: newNameLocalized,
        imageUrl: ingredientData.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, getTranslatedText(newNameLocalized, currentUser.preferredLanguage)),
        quantity: ingredientData.quantity,
        unit: ingredientData.unit,
        price: ingredientData.price,
    };

    try {
        if (ingredientData.id) { 
            await updateIngredientAPI(ingredientData.id, apiIngredientData);
        } else { 
             const fullIngredientData: Omit<Ingredient, 'id'> = {
                ...apiIngredientData,
                name: apiIngredientData.name!, 
                imageUrl: apiIngredientData.imageUrl!,
                quantity: apiIngredientData.quantity!,
                unit: apiIngredientData.unit!,
                price: apiIngredientData.price!,
             };
            await addIngredientAPI(fullIngredientData);
        }
        setIngredients(await getAllIngredientsAPI());
        closeModal();
    } catch (error) {
        handleApiError('Failed to save ingredient.', error);
    }
  };

  const handleDeleteIngredient = async (id: string) => {
    if (!currentUser || !canPerformAction('delete', 'ingredient')) {
        handleApiError("Permission denied to delete ingredient.");
        return;
    }
    setApiError(null);
    try {
        await deleteIngredientAPI(id);
        setIngredients(await getAllIngredientsAPI());

        const currentDishes = await getAllDishesAPI();
        const updatedDishesPromises: Promise<any>[] = [];

        for (const dish of currentDishes) {
            const originalIngredientsCount = dish.ingredients.length;
            const newDishIngredients = dish.ingredients.filter(di => di.ingredientId !== id);
            if (newDishIngredients.length !== originalIngredientsCount) {
                const updatedDishPayload = { ...dish, ingredients: newDishIngredients }; 
                updatedDishesPromises.push(updateDishAPI(dish.id, updatedDishPayload)); 
            }
        }
        if (updatedDishesPromises.length > 0) {
            await Promise.all(updatedDishesPromises);
            setDishes(await getAllDishesAPI()); 
        }
        alert('Ingredient deleted. Affected dishes may have been updated.');
    } catch (error) {
        handleApiError(`Failed to delete ingredient ${id}.`, error);
    }
  };


  const handleSaveDish = async (dishData: {name: string, imageUrl:string | null, ingredients: DishIngredient[], id?:string, preparationSteps: string}) => {
     if (!currentUser || !canPerformAction(dishData.id ? 'edit' : 'add', 'dish')) {
        handleApiError("Permission denied to save dish.");
        return;
    }
    setApiError(null);
    
    const existing = dishes.find(d => d.id === dishData.id);
    const newNameLocalized: LocalizedText = existing?.name ? {...existing.name} : {};
    newNameLocalized[currentUser.preferredLanguage] = dishData.name;
    if (!newNameLocalized[Language.EN] && currentUser.preferredLanguage !== Language.EN) newNameLocalized[Language.EN] = dishData.name;

    const newPrepStepsLocalized: LocalizedText = existing?.preparationSteps ? {...existing.preparationSteps} : {};
    newPrepStepsLocalized[currentUser.preferredLanguage] = dishData.preparationSteps;
    if (!newPrepStepsLocalized[Language.EN] && currentUser.preferredLanguage !== Language.EN) {
        newPrepStepsLocalized[Language.EN] = dishData.preparationSteps;
    }

    const apiDishData: Partial<Dish> = {
        name: newNameLocalized,
        imageUrl: dishData.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, getTranslatedText(newNameLocalized, currentUser.preferredLanguage)),
        ingredients: dishData.ingredients,
        preparationSteps: newPrepStepsLocalized,
    };

    try {
        if (dishData.id) {
            await updateDishAPI(dishData.id, apiDishData);
        } else {
             const fullDishData: Omit<Dish, 'id'> = {
                ...apiDishData,
                name: apiDishData.name!,
                imageUrl: apiDishData.imageUrl!,
                ingredients: apiDishData.ingredients!,
                preparationSteps: apiDishData.preparationSteps!,
             };
            await addDishAPI(fullDishData);
        }
        setDishes(await getAllDishesAPI());
        closeModal();
    } catch (error) {
        handleApiError('Failed to save dish.', error);
    }
  };

  const handleDeleteDish = async (id: string) => {
    if (!currentUser || !canPerformAction('delete', 'dish')) {
        handleApiError("Permission denied to delete dish.");
        return;
    }
    setApiError(null);
    try {
        await deleteDishAPI(id);
        setDishes(await getAllDishesAPI());
        alert('Dish deleted. Customer orders might need to be refreshed or updated if they contained this dish.');
        setCustomers(await getAllCustomersAPI()); 
    } catch (error) {
        handleApiError(`Failed to delete dish ${id}.`, error);
    }
  };
  
  const handleSaveCookingItem = async (itemData: {name: string, imageUrl:string | null, summary: string, unit: string, price: number, id?: string}) => {
    if (!currentUser || !canPerformAction(itemData.id ? 'edit' : 'add', 'cookingItem')) {
        handleApiError("Permission denied to save cooking item.");
        return;
    }
    setApiError(null);

    const existing = cookingItems.find(ci => ci.id === itemData.id);
    const newNameLocalized: LocalizedText = existing?.name ? {...existing.name} : {};
    const newSummaryLocalized: LocalizedText = existing?.summary ? {...existing.summary} : {};

    newNameLocalized[currentUser.preferredLanguage] = itemData.name;
    if (!newNameLocalized[Language.EN] && currentUser.preferredLanguage !== Language.EN) newNameLocalized[Language.EN] = itemData.name;
    newSummaryLocalized[currentUser.preferredLanguage] = itemData.summary;
    if (!newSummaryLocalized[Language.EN] && currentUser.preferredLanguage !== Language.EN) newSummaryLocalized[Language.EN] = itemData.summary;

    const apiCookingItemData: Partial<CookingItem> = {
        name: newNameLocalized,
        imageUrl: itemData.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE,DEFAULT_IMAGE_SIZE, getTranslatedText(newNameLocalized, currentUser.preferredLanguage)),
        summary: newSummaryLocalized,
        unit: itemData.unit,
        price: itemData.price,
    };
    try {
        if (itemData.id) {
            await updateCookingItemAPI(itemData.id, apiCookingItemData);
        } else {
             const fullCookingItemData: Omit<CookingItem, 'id'> = {
                ...apiCookingItemData,
                name: apiCookingItemData.name!,
                imageUrl: apiCookingItemData.imageUrl!,
                summary: apiCookingItemData.summary!,
                unit: apiCookingItemData.unit!,
                price: apiCookingItemData.price!,
             };
            await addCookingItemAPI(fullCookingItemData);
        }
        setCookingItems(await getAllCookingItemsAPI());
        closeModal();
    } catch (error) {
        handleApiError('Failed to save cooking item.', error);
    }
  };

  const handleDeleteCookingItem = async (id: string) => {
     if (!currentUser || !canPerformAction('delete', 'cookingItem')) {
        handleApiError("Permission denied to delete cooking item.");
        return;
    }
    setApiError(null);
    try {
        await deleteCookingItemAPI(id);
        setCookingItems(await getAllCookingItemsAPI());
        alert('Cooking item deleted. Customer orders might need to be refreshed or updated.');
        setCustomers(await getAllCustomersAPI()); 
    } catch (error) {
        handleApiError(`Failed to delete cooking item ${id}.`, error);
    }
  };


  const handleSaveCustomer = async (submittedCustomerData: Customer) => {
    if (!currentUser || !canPerformAction(editingItem?.id ? 'edit' : 'add', 'customer', editingItem)) {
         handleApiError("Permission denied or insufficient credits to save customer.");
        return;
    }
    setApiError(null);

    const customerPayload: Partial<Customer> & {id: string} = { 
        id: submittedCustomerData.id, 
        name: submittedCustomerData.name,
        imageUrl: submittedCustomerData.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, submittedCustomerData.name),
        phone: submittedCustomerData.phone,
        address: submittedCustomerData.address,
        numberOfPersons: submittedCustomerData.numberOfPersons,
        userId: submittedCustomerData.userId || ( (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.USER) && !editingItem?.userId ? currentUser.id : editingItem?.userId),
    };

    try {
        let savedCustomer: Customer;
        if (editingItem && editingItem.id) { 
            savedCustomer = await updateCustomerAPI(editingItem.id, customerPayload);
        } else { 
            savedCustomer = await addCustomerAPI(customerPayload as Omit<Customer, 'id' | 'generatedOrder'>); 
            if (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.USER) {
                const newCreditCount = currentUser.credits - 1;
                const updatedUser = await updateUserAPI(currentUser.id, { credits: newCreditCount });
                setCurrentUser(updatedUser);
                localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updatedUser));
                setUsers(await getAllUsersAPI()); 
                alert('Customer added! 1 credit used.');
            } else {
                alert('Customer added!');
            }
        }

        const currentSelectedDishRecords = editingItem ? await getCustomerSelectedDishesAPI(savedCustomer.id) : [];
        const newDishIds = submittedCustomerData.selectedDishes.map(sd => sd.dishId);

        for (const record of currentSelectedDishRecords) {
            if (!newDishIds.includes(record.dish_id)) {
                await deleteCustomerSelectedDishAPI(record.id);
            }
        }
        for (const dishId of newDishIds) {
            if (!currentSelectedDishRecords.find(r => r.dish_id === dishId)) {
                await addCustomerSelectedDishAPI({ 
                    customer_id: savedCustomer.id, 
                    dish_id: dishId 
                });
            }
        }

        const currentSelectedCookingItemRecords = editingItem ? await getCustomerSelectedCookingItemsAPI(savedCustomer.id) : [];
        const newCookingItemSelectionsMap = new Map(submittedCustomerData.selectedCookingItems.map(sci => [sci.cookingItemId, sci.quantity]));

        for (const record of currentSelectedCookingItemRecords) {
            if (!newCookingItemSelectionsMap.has(record.cooking_item_id)) { 
                await deleteCustomerSelectedCookingItemAPI(record.id);
            } else { 
                const newQuantity = newCookingItemSelectionsMap.get(record.cooking_item_id)!;
                if (record.quantity !== newQuantity) {
                    await updateCustomerSelectedCookingItemAPI(record.id, { quantity: newQuantity });
                }
                newCookingItemSelectionsMap.delete(record.cooking_item_id); 
            }
        }
        for (const [cookingItemId, quantity] of newCookingItemSelectionsMap) {
            await addCustomerSelectedCookingItemAPI({ 
                customer_id: savedCustomer.id, 
                cooking_item_id: cookingItemId, 
                quantity 
            });
        }
        
        await handleGenerateOrder(savedCustomer.id, true); 
        
        setCustomers(await getAllCustomersAPI()); 
        closeModal();

    } catch (error) {
        handleApiError('Failed to save customer data.', error);
    }
  };


  const handleSaveProfile = async (profileData: Customer) => { 
    if (!currentUser) return;
    setApiError(null);

    const updatedUserDetails: Partial<AuthUser> = {
        username: profileData.name, 
        imageUrl: profileData.imageUrl || currentUser.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE,DEFAULT_IMAGE_SIZE, profileData.name),
        phone: profileData.phone,
        address: profileData.address,
        email: profileData.email || currentUser.email,
        cateringName: profileData.cateringName || currentUser.cateringName, 
    };
    if(profileData.newPassword && profileData.newPassword.length > 0) {
        updatedUserDetails.password = profileData.newPassword; 
    }

    try {
        const updatedUser = await updateUserAPI(currentUser.id, updatedUserDetails);
        setUsers(await getAllUsersAPI()); 
        setCurrentUser(updatedUser); 
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updatedUser));
        alert('Profile updated successfully!');
        closeModal();
    } catch (error) {
        handleApiError('Failed to update profile.', error);
    }
};

  const handleDeleteCustomer = async (id: string) => {
    if(!currentUser || !canPerformAction('delete', 'customer', customers.find(c => c.id === id) )) {
        handleApiError("Permission denied to delete customer.");
        return;
    }
    setApiError(null);
    try {
        const selectedDishes = await getCustomerSelectedDishesAPI(id);
        for (const record of selectedDishes) {
            await deleteCustomerSelectedDishAPI(record.id);
        }
        const selectedCookingItems = await getCustomerSelectedCookingItemsAPI(id);
        for (const record of selectedCookingItems) {
            await deleteCustomerSelectedCookingItemAPI(record.id);
        }

        await deleteCustomerAPI(id);
        setCustomers(await getAllCustomersAPI());
        alert('Customer record deleted.');
    } catch (error) {
        handleApiError(`Failed to delete customer ${id}.`, error);
    }
  };

  const convertToBaseUnit = (quantity: number, unit: string): { quantityInBase: number; baseUnit: string } => {
    const unitLower = unit.toLowerCase();
    const conversion = UnitConversionFactors[unitLower];

    if (conversion) {
        return { quantityInBase: quantity * conversion.toBase, baseUnit: conversion.baseUnit };
    }
    if (Object.values(IngredientBaseUnits).includes(unitLower as any)) {
        return { quantityInBase: quantity, baseUnit: unitLower };
    }
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
            const { quantityInBase: dishIngBaseQty, baseUnit: dishIngBaseUnit } = convertToBaseUnit(dishIng.quantity, masterIng.unit); 
            const { quantityInBase: masterIngBaseQtyForPrice, baseUnit: masterIngBaseUnitForPrice } = convertToBaseUnit(masterIng.quantity, masterIng.unit);

            if (dishIngBaseUnit === masterIngBaseUnitForPrice && masterIngBaseQtyForPrice > 0) { 
                 const pricePerMasterBaseUnit = masterIng.price / masterIngBaseQtyForPrice;
                 totalCost += dishIngBaseQty * pricePerMasterBaseUnit;
            } else {
                console.warn(`Cannot calculate cost for ingredient ${getTranslatedText(masterIng.name, currentUser?.preferredLanguage || Language.EN)} in dish ${getTranslatedText(dish.name, currentUser?.preferredLanguage || Language.EN)}. Unit mismatch or zero quantity for price.`);
            }
        }
    });
    return totalCost;
  };

  const handleGenerateOrder = async (customerId: string, forceRegenerateFromFormSelections = false) => {
    const customer = await getCustomerAPI(customerId); 
    if (!customer || !currentUser) return;
    setApiError(null);

    try {
        let cumulativeIngredientsResult: CumulativeIngredient[] = [];
        let totalIngredientCost = 0;

        const customerDishSelectionRecords = await getCustomerSelectedDishesAPI(customerId);
        const customerCookingItemSelectionRecords = await getCustomerSelectedCookingItemsAPI(customerId);

        const effectiveSelectedDishes: CustomerDishSelection[] = customerDishSelectionRecords.map(record => ({ dishId: record.dish_id }));
        const effectiveSelectedCookingItems: CustomerCookingItemSelection[] = customerCookingItemSelectionRecords.map(record => ({
            cookingItemId: record.cooking_item_id,
            quantity: record.quantity 
        }));


        if (!forceRegenerateFromFormSelections && customer.generatedOrder && customer.generatedOrder.cumulativeIngredients.length > 0) {
            cumulativeIngredientsResult = customer.generatedOrder.cumulativeIngredients.map(orderIng => {
                const masterIngredient = ingredients.find(i => i.id === orderIng.masterIngredientId);
                let ingredientTotalPrice = orderIng.totalPrice; 
                let name = orderIng.name; 

                if (masterIngredient && masterIngredient.quantity > 0 && masterIngredient.price >= 0) {
                    name = getTranslatedText(masterIngredient.name, currentUser.preferredLanguage); 
                    const { quantityInBase: orderItemBaseQty, baseUnit: orderItemBaseU } = convertToBaseUnit(orderIng.totalQuantity, orderIng.unit);
                    const { quantityInBase: masterItemBaseQtyForItsPrice, baseUnit: masterItemBaseUForItsPrice } = convertToBaseUnit(masterIngredient.quantity, masterIngredient.unit);

                    if (masterItemBaseQtyForItsPrice > 0 && orderItemBaseU === masterItemBaseUForItsPrice) {
                        const pricePerBaseMasterUnit = masterIngredient.price / masterItemBaseQtyForItsPrice;
                        ingredientTotalPrice = orderItemBaseQty * pricePerBaseMasterUnit; 
                    } else {
                        ingredientTotalPrice = 0; 
                    }
                } else if (!masterIngredient) {
                     ingredientTotalPrice = 0; 
                }
                totalIngredientCost += ingredientTotalPrice;
                return { ...orderIng, name, totalPrice: ingredientTotalPrice };
            });
        } else { 
            const cumulativeIngredientsMap = new Map<string, { totalQuantityInMasterUnit: number; masterIngredientRef: Ingredient }>();
            effectiveSelectedDishes.forEach(sd => {
                const dish = dishes.find(d => d.id === sd.dishId);
                if (dish) {
                    dish.ingredients.forEach(di => {
                        const masterIngredient = ingredients.find(i => i.id === di.ingredientId);
                        if (masterIngredient) {
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
                    const { quantityInBase: totalOrderBaseQty, baseUnit: totalOrderBaseUnit } = convertToBaseUnit(entry.totalQuantityInMasterUnit, masterIng.unit);
                    const { quantityInBase: masterBaseQtyForPrice, baseUnit: masterBaseUnitForPrice } = convertToBaseUnit(masterIng.quantity, masterIng.unit);

                    if (masterBaseQtyForPrice > 0 && totalOrderBaseUnit === masterBaseUnitForPrice) {
                        const pricePerBaseMasterUnit = masterIng.price / masterBaseQtyForPrice;
                        ingredientTotalPrice = totalOrderBaseQty * pricePerBaseMasterUnit;
                    }
                }
                
                totalIngredientCost += ingredientTotalPrice;
                const { quantityInBase: finalBaseQty, baseUnit: finalBaseUnit } = convertToBaseUnit(entry.totalQuantityInMasterUnit, masterIng.unit);
                const { displayQuantity, displayUnit } = formatDisplayQuantity(finalBaseQty, finalBaseUnit);
                
                return { 
                    id: generateUniqueId(), 
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

        const sourceCookingItemsForOrder = (forceRegenerateFromFormSelections || !customer.generatedOrder?.selectedCookingItems)
            ? effectiveSelectedCookingItems 
            : customer.generatedOrder.selectedCookingItems; 

        sourceCookingItemsForOrder.forEach(sci => {
            const masterItemId = (sci as CustomerCookingItemSelection).cookingItemId || (sci as SelectedCookingItemDetail).masterCookingItemId;
            const quantity = sci.quantity;
            const masterItem = cookingItems.find(ci => ci.id === masterItemId);

            if (masterItem) {
                const itemTotalPrice = quantity * masterItem.price;
                totalCookingItemCost += itemTotalPrice;
                selectedCookingItemsDetails.push({
                    id: (sci as SelectedCookingItemDetail).id || generateUniqueId(), 
                    masterCookingItemId: masterItem.id,
                    name: getTranslatedText(masterItem.name, currentUser.preferredLanguage),
                    quantity: quantity,
                    unit: masterItem.unit,
                    price: masterItem.price, 
                    totalPrice: itemTotalPrice
                });
            } else {
                 if (!forceRegenerateFromFormSelections && customer.generatedOrder?.selectedCookingItems && (sci as SelectedCookingItemDetail).name) {
                     selectedCookingItemsDetails.push({
                         ...(sci as SelectedCookingItemDetail),
                         totalPrice: 0, 
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
        
        const updatedCustomer = await updateCustomerAPI(customer.id, { generatedOrder });
        setCustomers(await getAllCustomersAPI()); 
        
    } catch (error) {
        handleApiError(`Failed to generate order for customer ${customerId}.`, error);
    }
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
        setApiError(null);
        const customerToUpdate = await getCustomerAPI(data.customerId); 
        if (!customerToUpdate) {
            handleApiError("Customer not found to update order ingredient.");
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

                if (existingItemIndex > -1) { 
                    const existingOrderItem = tempGeneratedOrder.cumulativeIngredients[existingItemIndex];
                    const { quantityInBase: currentOrderBaseQuantity, baseUnit: currentOrderBaseUnit } = convertToBaseUnit(existingOrderItem.totalQuantity, existingOrderItem.unit);
                    
                    if (newlyAddedBaseUnit === currentOrderBaseUnit) { 
                        const totalBaseQuantity = newlyAddedBaseQuantity + currentOrderBaseQuantity;
                        const { displayQuantity: newTotalDisplayQuantity, displayUnit: newTotalDisplayUnit } = formatDisplayQuantity(totalBaseQuantity, newlyAddedBaseUnit);
                        
                        tempGeneratedOrder.cumulativeIngredients[existingItemIndex] = {
                            ...existingOrderItem,
                            totalQuantity: newTotalDisplayQuantity,
                            unit: newTotalDisplayUnit,
                        };
                    } else {
                        handleApiError(`Cannot aggregate ingredient: unit types mismatch (${newlyAddedBaseUnit} vs ${currentOrderBaseUnit}). Add as a new line if intended or ensure units are compatible.`);
                        closeModal(); 
                        return;
                    }
                } else { 
                    const { displayQuantity: actualDisplayQuantity, displayUnit: actualDisplayUnit } = formatDisplayQuantity(newlyAddedBaseQuantity, newlyAddedBaseUnit);
                    const newOrderItem: CumulativeIngredient = {
                        id: generateUniqueId(), 
                        masterIngredientId: data.masterIngredientId,
                        name: getTranslatedText(masterIngredient.name, currentUser.preferredLanguage),
                        totalQuantity: actualDisplayQuantity, 
                        unit: actualDisplayUnit, 
                        totalPrice: 0, 
                    };
                    tempGeneratedOrder.cumulativeIngredients.push(newOrderItem);
                }
            }
        } else if (!data.isAdding && data.orderLineItemId) { 
            tempGeneratedOrder.cumulativeIngredients = tempGeneratedOrder.cumulativeIngredients.map(item => {
                if (item.id === data.orderLineItemId) {
                     const { quantityInBase, baseUnit } = convertToBaseUnit(data.quantity, data.unit);
                     const { displayQuantity: actualDisplayQuantity, displayUnit: actualDisplayUnit } = formatDisplayQuantity(quantityInBase, baseUnit);
                    return { ...item, totalQuantity: actualDisplayQuantity, unit: actualDisplayUnit }; 
                }
                return item;
            });
        }
        
        try {
            await updateCustomerAPI(data.customerId, { generatedOrder: tempGeneratedOrder }); 
            await handleGenerateOrder(data.customerId, false); 
            closeModal();
        } catch (error) {
            handleApiError("Failed to save order ingredient.", error);
        }
    };

    const handleDeleteOrderIngredient = async (customerId: string, orderLineItemId: string) => {
         if (!currentUser) return;
         setApiError(null);
         const customer = await getCustomerAPI(customerId); 
         if (!customer || !customer.generatedOrder) {
            handleApiError("Customer or order not found to delete ingredient.");
            return;
         }
        
        const updatedIngredients = customer.generatedOrder.cumulativeIngredients.filter(
            item => item.id !== orderLineItemId
        );
        const tempGeneratedOrder: GeneratedOrder = {
            ...customer.generatedOrder,
            cumulativeIngredients: updatedIngredients,
        };
        try {
            await updateCustomerAPI(customerId, {generatedOrder: tempGeneratedOrder});
            await handleGenerateOrder(customerId, false); 
            alert('Ingredient removed from order.');
        } catch (error) {
            handleApiError("Failed to delete order ingredient.", error);
        }
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
        setApiError(null);
        const customerToUpdate = await getCustomerAPI(data.customerId); 
        if (!customerToUpdate) {
            handleApiError("Customer not found to update order cooking item.");
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
                } else { 
                    const newOrderItem: SelectedCookingItemDetail = {
                        id: generateUniqueId(), 
                        masterCookingItemId: data.masterCookingItemId,
                        name: getTranslatedText(masterItem.name, currentUser.preferredLanguage),
                        quantity: data.quantity,
                        unit: masterItem.unit,
                        price: masterItem.price, 
                        totalPrice: 0, 
                    };
                    tempGeneratedOrder.selectedCookingItems.push(newOrderItem);
                }
            }
        } else if (!data.isAdding && data.orderLineItemId) { 
            tempGeneratedOrder.selectedCookingItems = tempGeneratedOrder.selectedCookingItems.map(item => {
                if (item.id === data.orderLineItemId) {
                    return { ...item, quantity: data.quantity }; 
                }
                return item;
            });
        }
        try {
            await updateCustomerAPI(data.customerId, { generatedOrder: tempGeneratedOrder });
            await handleGenerateOrder(data.customerId, false); 
            closeModal();
        } catch (error) {
            handleApiError("Failed to save order cooking item.", error);
        }
    };

    const handleDeleteOrderCookingItem = async (customerId: string, orderLineItemId: string) => {
        if (!currentUser) return;
        setApiError(null);
        const customer = await getCustomerAPI(customerId); 
        if (!customer || !customer.generatedOrder) {
            handleApiError("Customer or order not found to delete cooking item.");
            return;
        }

        const updatedCookingItems = customer.generatedOrder.selectedCookingItems.filter(
            item => item.id !== orderLineItemId
        );
        const tempGeneratedOrder: GeneratedOrder = {
            ...customer.generatedOrder,
            selectedCookingItems: updatedCookingItems,
        };
        try {
            await updateCustomerAPI(customerId, {generatedOrder: tempGeneratedOrder});
            await handleGenerateOrder(customerId, false); 
            alert('Cooking item removed from order.');
        } catch (error) {
            handleApiError("Failed to delete order cooking item.", error);
        }
    };

    const handleExportIngredientsExcel = async () => {
        if (!currentUser || (currentUser.role !== UserRole.SUPREM)) {
            alert(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser.preferredLanguage));
            return;
        }
        setApiError(null);
        try {
            const ingredientsFromAPI = await getAllIngredientsAPI();
            const dataToExport = ingredientsFromAPI.map(ing => {
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
        } catch(error) {
            handleApiError("Failed to export ingredients.", error);
        }
    };
    
    const handleImportIngredientsExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!currentUser || (currentUser.role !== UserRole.SUPREM)) {
            alert(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser.preferredLanguage));
            return;
        }
        setApiError(null);
        const file = event.target.files?.[0];
        if (!file) {
            alert(getUIText(UITranslationKeys.EXCEL_NO_FILE_SELECTED_ALERT, currentUser.preferredLanguage));
            return;
        }

        if (!file.name.endsWith('.xlsx')) {
            alert(getUIText(UITranslationKeys.EXCEL_INVALID_FILE_FORMAT_ALERT, currentUser.preferredLanguage));
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = e.target?.result;
                if (!data) {
                    throw new Error("Failed to read file data.");
                }
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

                if (jsonData.length === 0) {
                    alert("The Excel file is empty or has no data in the first sheet.");
                    return;
                }

                const actualHeaders = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
                const coreHeaders = [`name_${Language.EN}`, "quantity", "unit", "price"]; 
                const missingCoreHeaders = coreHeaders.filter(header => !actualHeaders.includes(header));

                if (missingCoreHeaders.length > 0) {
                    alert(getUIText(UITranslationKeys.EXCEL_HEADER_MISMATCH_ALERT, currentUser.preferredLanguage, Language.EN, {
                        expectedHeaders: coreHeaders.join(', '),
                        actualHeaders: actualHeaders.join(', ') 
                    }));
                    return;
                }
                
                setIsLoadingIngredients(true);
                let importedCount = 0;
                let updatedCount = 0;
                let errorCount = 0;
                const errorMessages: string[] = [];

                for (const row of jsonData) {
                    const nameLocalized: LocalizedText = {};
                    SupportedLanguages.forEach(lang => {
                        if (row[`name_${lang}`]) nameLocalized[lang] = String(row[`name_${lang}`]).trim();
                    });

                    if (Object.keys(nameLocalized).length === 0) {
                        errorCount++;
                        errorMessages.push(`Skipped row: Name is missing. Row: ${JSON.stringify(row)}`);
                        console.warn("Skipping row due to missing name:", row);
                        continue;
                    }
                     if (!nameLocalized[Language.EN] && nameLocalized[currentUser.preferredLanguage]) {
                        nameLocalized[Language.EN] = nameLocalized[currentUser.preferredLanguage]; 
                    } else if (!nameLocalized[Language.EN] && Object.keys(nameLocalized).length > 0) {
                         nameLocalized[Language.EN] = Object.values(nameLocalized)[0];
                    }


                    const quantity = Number(row.quantity);
                    const unit = String(row.unit).trim();
                    const price = Number(row.price);

                    if (isNaN(quantity) || quantity <= 0 || !unit || isNaN(price) || price < 0) {
                        errorCount++;
                        errorMessages.push(`Skipped row: Invalid data (quantity, unit, or price). Row: ${JSON.stringify(row)}`);
                        console.warn("Skipping row due to invalid data:", row);
                        continue;
                    }

                    const ingredientPayload: Partial<Ingredient> & {id?: string} = { 
                        id: row.id ? String(row.id) : undefined, 
                        name: nameLocalized,
                        imageUrl: row.imageUrl || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, getTranslatedText(nameLocalized, currentUser.preferredLanguage)),
                        quantity,
                        unit,
                        price,
                    };

                    try {
                        if (ingredientPayload.id) { 
                            const existing = await getIngredientAPI(ingredientPayload.id); 
                            if (existing) {
                                await updateIngredientAPI(ingredientPayload.id, ingredientPayload);
                                updatedCount++;
                            } else { 
                                delete ingredientPayload.id; 
                                await addIngredientAPI(ingredientPayload as Omit<Ingredient, 'id'>);
                                importedCount++;
                            }
                        } else { 
                            await addIngredientAPI(ingredientPayload as Omit<Ingredient, 'id'>);
                            importedCount++;
                        }
                    } catch (apiErr: any) {
                        errorCount++;
                        errorMessages.push(`Error processing row: ${JSON.stringify(row)}. API Error: ${apiErr.message || apiErr}`);
                        console.error("Error processing row via API:", row, apiErr);
                    }
                }
                
                setIngredients(await getAllIngredientsAPI()); 
                setIsLoadingIngredients(false);
                let summaryMessage = `Import complete. Added: ${importedCount}, Updated: ${updatedCount}.`;
                if (errorCount > 0) {
                    summaryMessage += ` Errors: ${errorCount}. Some rows may have been skipped or failed. Check console for details.`;
                    console.error("Import errors:", errorMessages);
                }
                alert(summaryMessage);

            } catch (err: any) {
                console.error("Error importing ingredients:", err);
                alert(`${getUIText(UITranslationKeys.EXCEL_IMPORT_FAILURE_ALERT, currentUser.preferredLanguage)} Details: ${err.message}`);
                setIsLoadingIngredients(false);
            } finally {
                if (importIngredientsInputRef.current) {
                    importIngredientsInputRef.current.value = "";
                }
            }
        };
        reader.readAsArrayBuffer(file);
    };

  const getFilteredItems = (items: any[], type: 'ingredient' | 'dish' | 'cookingItem' | 'customer') => {
    if (!searchTerm) return items;
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return items.filter(item => {
        let nameToSearch = '';
        if (type === 'ingredient' || type === 'dish' || type === 'cookingItem') {
            nameToSearch = getTranslatedText(item.name, currentUser?.preferredLanguage || Language.EN).toLowerCase();
        } else if (type === 'customer') {
            nameToSearch = item.name.toLowerCase();
        }
        
        if (nameToSearch.includes(lowerSearchTerm)) return true;

        if (type === 'customer') {
          if (item.phone?.toLowerCase().includes(lowerSearchTerm)) return true;
          if (item.address?.toLowerCase().includes(lowerSearchTerm)) return true;
        }
        return false;
    });
  };

  const navigationItems = [
    ...baseNavigationItems,
    ...(currentUser?.role === UserRole.SUPREM ? [{ label: 'User Management', page: Page.UserManagement, roles: [UserRole.SUPREM] }] : []),
    { label: 'Profile', page: Page.Profile, roles: [UserRole.SUPREM, UserRole.ADMIN, UserRole.USER] },
  ];

  const availableNavItems = navigationItems.filter(navItem => 
    currentUser && navItem.roles.includes(currentUser.role)
  );

  const renderHeader = () => (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <UserCircleIcon className="h-10 w-10 text-sky-300 mr-3 hidden sm:block" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{APP_TITLE}</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {currentUser && (
              <div className="text-sm sm:text-base text-right hidden md:block">
                <span className="font-medium">{currentUser.username}</span>
                <span className="block text-xs text-sky-200">{currentUser.cateringName}</span>
              </div>
            )}
            <button 
                onClick={handleLogout} 
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 sm:px-4 rounded-lg shadow hover:shadow-md transition-all text-sm sm:text-base flex items-center"
                title="Logout"
            >
                <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
        <nav className="py-2">
          <ul className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2">
            {availableNavItems.map(nav => (
              <li key={nav.page}>
                <button
                  onClick={() => setCurrentPage(nav.page)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                    ${currentPage === nav.page 
                      ? 'bg-sky-400 text-white shadow-inner' 
                      : 'text-sky-100 hover:bg-sky-600 hover:text-white'
                    }`}
                >
                  {nav.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
       {apiError && (
            <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-[150] max-w-md" role="alert">
                <div className="flex">
                    <InformationCircleIcon className="h-6 w-6 text-red-500 mr-3"/>
                    <div>
                        <strong className="font-bold">API Error!</strong>
                        <span className="block sm:inline ml-1">{apiError}</span>
                    </div>
                     <button onClick={clearApiError} className="ml-auto -mx-1.5 -my-1.5 bg-red-100 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8" aria-label="Dismiss">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        )}
    </header>
  );

  const renderPageContent = () => {
    if (!isAuthCheckComplete || overallInitialLoading && !apiError) { 
      return <div className="flex justify-center items-center h-screen"><p className="text-xl text-slate-600">Loading application data...</p></div>;
    }
    
    if (overallInitialLoading && apiError) { 
        return (
            <div className="flex flex-col justify-center items-center h-[calc(100vh-10rem)] bg-red-50 p-4 rounded-lg shadow">
                <InformationCircleIcon className="w-12 h-12 text-red-500 mb-3" />
                <h2 className="text-xl font-bold text-red-700 mb-2">Failed to Load Application</h2>
                <p className="text-red-600 text-center text-sm mb-3">
                    The application could not start correctly due to an API error. Please check the error message below or in the header.
                </p>
                <p className="text-xs text-slate-600 bg-red-100 p-2 rounded max-w-lg overflow-auto">{apiError}</p>
                 <p className="text-sm text-slate-700 text-center mt-4">
                    Ensure <code className="bg-red-200 text-red-800 px-1 rounded">API_BASE_URL</code>, table paths (especially the specific table ID mentioned in the error), and <code className="bg-red-200 text-red-800 px-1 rounded">NOCODB_API_TOKEN</code> in <code className="bg-red-200 text-red-800 px-1 rounded">src/apiConstants.ts</code> are correct.
                </p>
            </div>
        );
    }

    if (currentPage === Page.PublicHome && !currentUser) {
        return <PublicHomePage onNavigate={setCurrentPage} />;
    }
    if (currentPage === Page.Login && !currentUser) {
        return <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 to-sky-100"><LoginForm onLogin={handleLogin} users={users} onSwitchToSignup={() => setCurrentPage(Page.Signup)} /></div>;
    }
    if (currentPage === Page.Signup && !currentUser) {
        return <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 to-sky-100"><SignupForm onSignup={handleSignup} onSwitchToLogin={() => setCurrentPage(Page.Login)} supportedLanguages={SupportedLanguages} languageLabels={LanguageLabels}/></div>;
    }

    if (!currentUser) {
         setCurrentPage(Page.PublicHome); 
         return <PublicHomePage onNavigate={setCurrentPage} />;
    }

    const currentLang = currentUser.preferredLanguage;

    switch (currentPage) {
      case Page.Home:
        return (
          <div className="text-center p-8 bg-white rounded-lg shadow-xl">
            <h2 className="text-4xl font-bold text-slate-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Welcome, {currentUser.username}!</h2>
            <p className="text-lg text-slate-600 mb-2">Catering Service: {currentUser.cateringName}</p>
            <p className="text-md text-slate-500 mb-6">Current Time: {currentTime.toLocaleTimeString()}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableNavItems.filter(item => item.page !== Page.Home && item.page !== Page.Profile).map(item => (
                <button
                  key={item.page}
                  onClick={() => setCurrentPage(item.page)}
                  className="p-6 bg-sky-50 hover:bg-sky-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 text-blue-700 font-semibold text-lg"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        );
      case Page.Ingredients:
        const ingredientCrudTitle = getUIText(UITranslationKeys.INGREDIENTS_PAGE_TITLE, currentLang);
        return (
            <CrudSection
                title={ingredientCrudTitle}
                items={getFilteredItems(ingredients, 'ingredient')}
                hasItems={ingredients.length > 0}
                renderItem={(item: Ingredient) => (
                    <div key={item.id} className="bg-slate-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <img src={item.imageUrl || placeholderImage(100,100,item.id)} alt={getTranslatedText(item.name, currentLang)} className="w-full h-32 object-cover rounded-md mb-3" />
                        <h3 className="text-lg font-semibold text-slate-700 truncate" title={getTranslatedText(item.name, currentLang)}>{getTranslatedText(item.name, currentLang)}</h3>
                        <p className="text-sm text-slate-500">Qty: {item.quantity} {item.unit}</p>
                        <p className="text-sm text-slate-500">{getUIText(UITranslationKeys.PRICE_LABEL, currentLang)}: {item.price.toFixed(2)}</p>
                        {(canPerformAction('edit', 'ingredient') || canPerformAction('delete', 'ingredient')) && (
                            <div className="mt-3 flex space-x-2">
                                {canPerformAction('edit', 'ingredient') && <button onClick={() => openModal('ingredient', item)} className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md text-xs flex items-center"><PencilIcon className="w-4 h-4 mr-1"/> Edit</button>}
                                {canPerformAction('delete', 'ingredient') && <button onClick={() => handleDeleteIngredient(item.id)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs flex items-center"><TrashIcon className="w-4 h-4 mr-1"/> Delete</button>}
                            </div>
                        )}
                    </div>
                )}
                onAdd={() => openModal('ingredient')}
                entityType="ingredient"
                canAdd={canPerformAction('add', 'ingredient')}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                currentUserPreferredLanguage={currentLang}
                extraHeaderContent={
                   currentUser.role === UserRole.SUPREM && (
                    <>
                        <button onClick={handleExportIngredientsExcel} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg shadow hover:shadow-md transition-all text-sm flex items-center">
                            <DocumentArrowDownIcon className="w-4 h-4 mr-1" /> Export
                        </button>
                        <input type="file" ref={importIngredientsInputRef} onChange={handleImportIngredientsExcel} accept=".xlsx" style={{ display: 'none' }} id="import-ingredients-excel-input" />
                        <button onClick={() => importIngredientsInputRef.current?.click()} className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-3 rounded-lg shadow hover:shadow-md transition-all text-sm flex items-center">
                            <ArrowUpTrayIcon className="w-4 h-4 mr-1" /> Import
                        </button>
                    </>
                   )
                }
            />
        );
      case Page.Dishes:
        const dishCrudTitle = getUIText(UITranslationKeys.DISHES_PAGE_TITLE, currentLang);
        return (
          <CrudSection
            title={dishCrudTitle}
            items={getFilteredItems(dishes, 'dish')}
            hasItems={dishes.length > 0}
            renderItem={(item: Dish) => (
                <div key={item.id} className="bg-slate-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <img src={item.imageUrl || placeholderImage(100,100,item.id)} alt={getTranslatedText(item.name, currentLang)} className="w-full h-32 object-cover rounded-md mb-3" />
                    <h3 className="text-lg font-semibold text-slate-700 truncate" title={getTranslatedText(item.name, currentLang)}>{getTranslatedText(item.name, currentLang)}</h3>
                    <p className="text-xs text-slate-500 mb-1">Steps: {getTranslatedText(item.preparationSteps, currentLang, Language.EN).substring(0,50)}...</p>
                    <p className="text-sm text-slate-600 font-medium">{getUIText(UITranslationKeys.DISH_COST_LABEL, currentLang, Language.EN, { cost: calculateDishCost(item, ingredients).toFixed(2) })}</p>
                    {(canPerformAction('edit', 'dish') || canPerformAction('delete', 'dish')) && (
                        <div className="mt-3 flex space-x-2">
                            {canPerformAction('edit', 'dish') && <button onClick={() => openModal('dish', item)} className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md text-xs flex items-center"><PencilIcon className="w-4 h-4 mr-1"/> Edit</button>}
                            {canPerformAction('delete', 'dish') && <button onClick={() => handleDeleteDish(item.id)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs flex items-center"><TrashIcon className="w-4 h-4 mr-1"/> Delete</button>}
                        </div>
                    )}
                </div>
            )}
            onAdd={() => openModal('dish')}
            entityType="dish"
            canAdd={canPerformAction('add', 'dish')}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            currentUserPreferredLanguage={currentLang}
          />
        );
      case Page.CookingItems:
         const cookingItemCrudTitle = getUIText(UITranslationKeys.COOKING_ITEMS_PAGE_TITLE, currentLang);
        return (
          <CrudSection
            title={cookingItemCrudTitle}
            items={getFilteredItems(cookingItems, 'cookingItem')}
            hasItems={cookingItems.length > 0}
            renderItem={(item: CookingItem) => (
                <div key={item.id} className="bg-slate-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <img src={item.imageUrl || placeholderImage(100,100,item.id)} alt={getTranslatedText(item.name, currentLang)} className="w-full h-32 object-cover rounded-md mb-3" />
                    <h3 className="text-lg font-semibold text-slate-700 truncate" title={getTranslatedText(item.name, currentLang)}>{getTranslatedText(item.name, currentLang)}</h3>
                    <p className="text-xs text-slate-500 mb-1 truncate" title={getTranslatedText(item.summary, currentLang)}>{getTranslatedText(item.summary, currentLang)}</p>
                    <p className="text-sm text-slate-500">Unit: {item.unit}</p>
                    <p className="text-sm text-slate-500">{getUIText(UITranslationKeys.PRICE_LABEL, currentLang)}: {item.price.toFixed(2)}</p>
                    {(canPerformAction('edit', 'cookingItem') || canPerformAction('delete', 'cookingItem')) && (
                        <div className="mt-3 flex space-x-2">
                            {canPerformAction('edit', 'cookingItem') && <button onClick={() => openModal('cookingItem', item)} className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md text-xs flex items-center"><PencilIcon className="w-4 h-4 mr-1"/> Edit</button>}
                            {canPerformAction('delete', 'cookingItem') && <button onClick={() => handleDeleteCookingItem(item.id)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs flex items-center"><TrashIcon className="w-4 h-4 mr-1"/> Delete</button>}
                        </div>
                    )}
                </div>
            )}
            onAdd={() => openModal('cookingItem')}
            entityType="cookingItem"
            canAdd={canPerformAction('add', 'cookingItem')}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            currentUserPreferredLanguage={currentLang}
          />
        );
      case Page.Customers:
         const filteredCustomers = getFilteredItems(
            currentUser.role === UserRole.USER ? customers.filter(c => c.userId === currentUser.id) : customers, 
            'customer'
        );
        return (
          <CrudSection
            title="Customer Orders"
            items={filteredCustomers}
            hasItems={customers.length > 0}
            renderItem={(item: Customer) => {
                 const orderTotal = item.generatedOrder?.totalOrderCost || 0;
                 return (
                    <div key={item.id} className="bg-slate-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between">
                        <div>
                            <img src={item.imageUrl || placeholderImage(100,100,item.id)} alt={item.name} className="w-full h-32 object-cover rounded-md mb-3" />
                            <h3 className="text-lg font-semibold text-slate-700 truncate" title={item.name}>{item.name}</h3>
                            <p className="text-sm text-slate-500">Phone: {item.phone}</p>
                            <p className="text-xs text-slate-500 truncate" title={item.address}>Address: {item.address}</p>
                            <p className="text-sm text-slate-500">Persons: {item.numberOfPersons}</p>
                            <p className="text-sm text-slate-600 font-medium">
                                {getUIText(UITranslationKeys.ORDER_TOTAL_COST_LABEL, currentLang, Language.EN, { cost: orderTotal.toFixed(2) })}
                            </p>
                        </div>
                        <div className="mt-3 space-y-2">
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => handleGenerateOrder(item.id, false)} className="flex-1 min-w-[120px] p-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md text-xs flex items-center justify-center"><CalculatorIcon className="w-4 h-4 mr-1"/> Recalculate</button>
                                <button onClick={() => openModal('customer', item)} className="flex-1 min-w-[120px] p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md text-xs flex items-center justify-center"><PencilIcon className="w-4 h-4 mr-1"/> Edit Order</button>
                            </div>
                           {(canPerformAction('delete', 'customer', item)) && (
                                <button onClick={() => handleDeleteCustomer(item.id)} className="w-full p-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs flex items-center justify-center"><TrashIcon className="w-4 h-4 mr-1"/> Delete Customer</button>
                           )}
                           {item.generatedOrder && (
                            <div className="border-t pt-2 mt-2">
                                <h4 className="text-xs font-semibold text-slate-600 mb-1">Manage Finalized Order:</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => handleOpenAddOrderIngredientModal(item.id)} className="p-1.5 bg-sky-200 hover:bg-sky-300 text-sky-700 rounded text-xs">Add Ing.</button>
                                    <button onClick={() => handleOpenAddOrderCookingItemModal(item.id)} className="p-1.5 bg-indigo-200 hover:bg-indigo-300 text-indigo-700 rounded text-xs">Add Item</button>
                                </div>
                            </div>
                           )}
                        </div>
                    </div>
                );
            }}
            onAdd={() => openModal('customer')}
            entityType="customer"
            canAdd={canPerformAction('add', 'customer')}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            currentUserPreferredLanguage={currentLang}
          />
        );
        case Page.UserManagement:
            if (currentUser.role !== UserRole.SUPREM) return <p>Access Denied.</p>;
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
            if (currentUser.role !== UserRole.SUPREM || !selectedUserForView) {
                return <p>Access Denied or no user selected.</p>;
            }
            return <UserDetailsViewComponent 
                        user={selectedUserForView}
                        onBack={() => setCurrentPage(previousPageBeforeUserDetails || Page.UserManagement)}
                        onSetUserCredits={handleSetUserCredits}
                        languageLabels={LanguageLabelMapping}
                        supportedLanguages={SupportedLanguages}
                        onUpdateUserLanguage={handleUpdateUserLanguage}
                        onUpdateUserDetailsBySuprem={handleUpdateUserDetailsBySuprem}
                    />;
         case Page.Profile:
            const profileDataForForm: Customer = { 
                id: currentUser.id,
                name: currentUser.username,
                imageUrl: currentUser.imageUrl || '',
                phone: currentUser.phone,
                address: currentUser.address,
                email: currentUser.email,
                cateringName: currentUser.cateringName,
                credits: currentUser.credits,
                numberOfPersons: 1, 
                selectedDishes: [],
                selectedCookingItems: [],
            };
            return (
                <div className="max-w-2xl mx-auto">
                    <CustomerForm
                        onSave={handleSaveProfile}
                        onCancel={() => setCurrentPage(Page.Home)}
                        existingCustomer={profileDataForForm}
                        dishes={[]} 
                        cookingItems={[]}
                        ingredients={[]} 
                        isProfileForm={true}
                        generateId={() => currentUser.id} 
                        currentUserPreferredLanguage={currentLang}
                        userRole={currentUser.role}
                    />
                </div>
            );
      default:
        return <p className="text-center text-slate-500 py-8">Page not found.</p>;
    }
  };

  const generateUniqueId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  };

  return (
    <div className={`min-h-screen ${!currentUser ? 'bg-gradient-to-br from-slate-50 to-sky-100' : 'bg-slate-100'}`}>
      {(currentPage !== Page.PublicHome && currentPage !== Page.Login && currentPage !== Page.Signup) && renderHeader()}
      <main className={`p-4 sm:p-6 lg:p-8 ${(currentPage !== Page.PublicHome && currentPage !== Page.Login && currentPage !== Page.Signup) ? 'container mx-auto' : ''}`}>
        {renderPageContent()}
      </main>
      {modalOpen && modalType && (
        <Modal onClose={closeModal}>
          {modalType === 'ingredient' && <IngredientForm onSave={handleSaveIngredient} onCancel={closeModal} existingIngredient={editingItem} units={IngredientUnits} generateId={generateUniqueId} currentUserPreferredLanguage={currentUser!.preferredLanguage} />}
          {modalType === 'dish' && <DishForm onSave={handleSaveDish} onCancel={closeModal} existingDish={editingItem} ingredients={ingredients} generateId={generateUniqueId} currentUserPreferredLanguage={currentUser!.preferredLanguage} />}
          {modalType === 'cookingItem' && <CookingItemForm onSave={handleSaveCookingItem} onCancel={closeModal} existingCookingItem={editingItem} units={CookingItemUnits} generateId={generateUniqueId} currentUserPreferredLanguage={currentUser!.preferredLanguage} />}
          {modalType === 'customer' && <CustomerForm onSave={handleSaveCustomer} onCancel={closeModal} existingCustomer={editingItem} dishes={dishes} cookingItems={cookingItems} ingredients={ingredients} currentUserId={currentUser?.id} userRole={currentUser?.role} generateId={generateUniqueId} currentUserPreferredLanguage={currentUser!.preferredLanguage}/>}
          {modalType === 'profile' && currentUser && (
            <CustomerForm
                onSave={handleSaveProfile}
                onCancel={closeModal}
                existingCustomer={{ 
                    id: currentUser.id,
                    name: currentUser.username, 
                    imageUrl: currentUser.imageUrl || '',
                    phone: currentUser.phone,
                    address: currentUser.address,
                    email: currentUser.email,
                    cateringName: currentUser.cateringName,
                    credits: currentUser.credits,
                    numberOfPersons: 1, selectedDishes: [], selectedCookingItems: []
                }}
                dishes={[]} cookingItems={[]} ingredients={[]}
                isProfileForm={true}
                generateId={() => currentUser.id}
                currentUserPreferredLanguage={currentUser.preferredLanguage}
                userRole={currentUser.role}
            />
           )}
           {modalType === 'orderIngredient' && editingOrderContext && currentUser && (
              <OrderIngredientForm
                onSave={handleSaveOrderIngredient}
                onCancel={closeModal}
                context={editingOrderContext}
                masterIngredients={ingredients}
                ingredientUnits={IngredientUnits}
                currentUserPreferredLanguage={currentUser.preferredLanguage}
              />
           )}
            {modalType === 'orderCookingItem' && editingOrderCookingItemContext && currentUser && (
                <OrderCookingItemForm
                    onSave={handleSaveOrderCookingItem}
                    onCancel={closeModal}
                    context={editingOrderCookingItemContext}
                    masterCookingItems={cookingItems}
                    currentUserPreferredLanguage={currentUser.preferredLanguage}
                />
            )}
        </Modal>
      )}
    </div>
  );
};

export default App;