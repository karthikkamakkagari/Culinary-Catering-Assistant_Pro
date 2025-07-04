
// App.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Page, Ingredient, Dish, CookingItem, Customer, ModalType, IngredientUnits, CookingItemUnits, DishIngredient, CustomerDishSelection, CustomerCookingItemSelection, GeneratedOrder, CumulativeIngredient, AuthUser, UserRole, Language, LocalizedText, LanguageLabels, UITranslationKeys, SelectedCookingItemDetail, CustomerTableCreatePayload, CustomerTableUpdatePayload } from './types';
import { APP_TITLE, placeholderImage, DEFAULT_IMAGE_SIZE, baseNavigationItems, DEFAULT_SUPREM_USER, SupportedLanguages, LanguageLabelMapping, IngredientBaseUnits, UnitConversionFactors } from './constants';
import { API_BASE_URL, NOCODB_API_TOKEN, USERS_TABLE_PATH } from './apiConstants'; // Corrected path
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
} from './data.service'; // Corrected path


const AUTH_USER_STORAGE_KEY = 'culinaryCateringAppUser';

const App: React.FC = () => {
  if (!NOCODB_API_TOKEN || NOCODB_API_TOKEN === 'YOUR_NOCODB_API_TOKEN_HERE') {
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
  const [initialAuthDataLoaded, setInitialAuthDataLoaded] = useState(false); // New state

  const [users, setUsers] = useState<AuthUser[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [cookingItems, setCookingItems] = useState<CookingItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [apiError, setApiError] = useState<string | null>(null);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);

  const clearApiError = () => setApiError(null);

  const handleApiError = (genericMessage: string, error?: any) => {
    console.error(genericMessage, error);
    let detailedMessage = genericMessage;
    const errorSource = error?.cause || error;
    if (errorSource && errorSource.status) detailedMessage += ` (Status: ${errorSource.status})`;
    let extractedApiMessage = "";
    if (errorSource && errorSource.data) {
        const data = errorSource.data;
        if (typeof data.msg === 'string') extractedApiMessage = data.msg;
        else if (typeof data.message === 'string') extractedApiMessage = data.message;
        else if (Array.isArray(data.details) && data.details.length > 0) extractedApiMessage = data.details.map((detail: any) => typeof detail.message === 'string' && typeof detail.field === 'string' ? `${detail.field}: ${detail.message}` : (typeof detail.message === 'string' ? detail.message : JSON.stringify(detail))).join('; ');
        else if (typeof data.errors === 'object' && data.errors !== null) extractedApiMessage = Object.entries(data.errors).map(([field, messages]) => `${field}: ${(Array.isArray(messages) ? messages.join(', ') : messages)}`).join('; ');
    } else if (errorSource && typeof errorSource.message === 'string' && errorSource.message !== genericMessage) extractedApiMessage = errorSource.message;
    if (extractedApiMessage) detailedMessage += ` Server: ${extractedApiMessage}`;
    if (errorSource && errorSource.data) {
        try {
            const dataStr = JSON.stringify(errorSource.data);
            if (dataStr && extractedApiMessage !== dataStr && (!extractedApiMessage || !dataStr.includes(extractedApiMessage))) detailedMessage += ` FullResponse: ${dataStr}`;
            else if (dataStr && !extractedApiMessage && genericMessage !== dataStr) detailedMessage += ` FullResponse: ${dataStr}`;
        } catch (e) {/*ignore*/}
    }
    if (errorSource && errorSource.url) detailedMessage += ` (URL: ${errorSource.url})`;
    setApiError(detailedMessage);
  };

  // Effect for loading core user data (for auth)
  useEffect(() => {
    async function loadCoreData() {
        setIsLoadingUsers(true);
        setApiError(null);
        try {
            let fetchedUsers = await getAllUsersAPI();
            
            // Check for suprem user and create if not exists
            const supremUserExists = fetchedUsers.some(u => u.username === DEFAULT_SUPREM_USER.username);
            if (!supremUserExists && USERS_TABLE_PATH) { // Ensure USERS_TABLE_PATH is defined
                try {
                    console.log(`Default suprem user '${DEFAULT_SUPREM_USER.username}' not found. Attempting to create...`);
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { id, ...supremDataForCreation } = DEFAULT_SUPREM_USER; // Exclude ID for creation
                    const createdSupremUser = await addUserAPI(supremDataForCreation);
                    console.log("Default suprem user created:", createdSupremUser);
                    fetchedUsers.push(createdSupremUser); // Add to the list for current session
                } catch (creationError: any) {
                    console.error("Failed to create default suprem user:", creationError);
                    // If creation fails specifically due to 'username already exists' (e.g., NocoDB specific error code/message)
                    // then it's not a critical failure, just means it was created by another instance/race condition.
                    // Otherwise, it might be a more significant issue.
                    // For now, we log and continue. If 'suprem' login still fails, it points to other issues.
                    if (creationError?.data?.message?.includes('Validation failed') && creationError?.data?.details?.[0]?.message?.includes('unique constraint')) {
                        console.warn("Suprem user creation conflict (likely already exists or race condition). Fetching users again.");
                        fetchedUsers = await getAllUsersAPI(); // Re-fetch to ensure we have the latest list
                    } else {
                       //  handleApiError("Failed to initialize default admin user.", creationError); // Optional: make this a visible error
                    }
                }
            }
            setUsers(fetchedUsers);

        } catch (error: any) {
            let customErrorMessage = "Failed to load critical user data.";
            const usersTableIdentifier = USERS_TABLE_PATH.split('/')[3]; // Extract table ID part
            if (error.status === 404 && error.message && error.message.toLowerCase().includes('table') && error.message.toLowerCase().includes('not found') && error.url && error.url.includes(usersTableIdentifier)) {
                customErrorMessage = `The USERS table ('${usersTableIdentifier}') was not found (404). Please verify USERS_TABLE_PATH in src/apiConstants.ts. Error: "${error.message}". URL: ${error.url}`;
            } else if (error.status === 404 && error.message && error.message.toLowerCase().includes('view') && error.message.toLowerCase().includes('not found') && error.url && error.url.includes(usersTableIdentifier)) {
                customErrorMessage = `A view for the USERS table ('${usersTableIdentifier}') was not found (404). Please verify USERS_VIEW_ID in src/apiConstants.ts or set it to an empty string. Error: "${error.message}". URL: ${error.url}`;
            }
            handleApiError(customErrorMessage, error);
        } finally {
            setIsLoadingUsers(false);
            setInitialAuthDataLoaded(true);
        }
    }
    loadCoreData();
  }, []);

  // Effect for loading other non-critical data after core data is attempted
  useEffect(() => {
    if (!initialAuthDataLoaded) return;

    async function loadRemainingData() {
        setIsLoadingIngredients(true);
        setIsLoadingDishes(true);
        setIsLoadingCookingItems(true);
        setIsLoadingCustomers(true);
        try {
            const [fetchedIngredients, fetchedDishes, fetchedCookingItems, fetchedCustomers] = await Promise.all([
                getAllIngredientsAPI(),
                getAllDishesAPI(),
                getAllCookingItemsAPI(),
                getAllCustomersAPI()
            ]);
            setIngredients(fetchedIngredients);
            setDishes(fetchedDishes);
            setCookingItems(fetchedCookingItems);
            setCustomers(fetchedCustomers);
        } catch (error: any) {
            let customErrorMessage = "Failed to load non-critical application data.";
            const entity = error.message && error.message.split("'")[1];
            const isTableError = error.message && error.message.toLowerCase().includes('table') && error.message.toLowerCase().includes('not found');
            const isViewError = error.message && error.message.toLowerCase().includes('view') && error.message.toLowerCase().includes('not found');
            if (error.status === 404) {
                if (isTableError) customErrorMessage = `A table ('${entity || 'unknown'}') was not found (404). Please verify its TABLE_PATH in src/apiConstants.ts. Error: "${error.message}". URL: ${error.url}`;
                else if (isViewError) customErrorMessage = `A view for table ('${entity || 'unknown'}') was not found (404). Please verify its VIEW_ID in src/apiConstants.ts or set it to an empty string. Error: "${error.message}". URL: ${error.url}`;
            }
            handleApiError(customErrorMessage, error);
        } finally {
            setIsLoadingIngredients(false);
            setIsLoadingDishes(false);
            setIsLoadingCookingItems(false);
            setIsLoadingCustomers(false);
        }
    }
    loadRemainingData();
  }, [initialAuthDataLoaded]);

  // Auth check useEffect
  useEffect(() => {
    if (initialAuthDataLoaded) {
        const attemptAutoLogin = async () => {
            const storedUserString = localStorage.getItem(AUTH_USER_STORAGE_KEY);
            if (storedUserString) {
                try {
                    const storedUser: AuthUser = JSON.parse(storedUserString);
                    const userFromAPI = await getUserAPI(storedUser.id);
                    if (userFromAPI && userFromAPI.is_approved) {
                        setCurrentUser(userFromAPI);
                        setCurrentPage(Page.Home);
                    } else {
                        localStorage.removeItem(AUTH_USER_STORAGE_KEY);
                        setCurrentUser(null);
                        setCurrentPage(Page.PublicHome);
                        if(userFromAPI && !userFromAPI.is_approved) handleApiError("Your account is pending approval or has been deactivated.");
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
  }, [initialAuthDataLoaded]);

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
    setIsLoggingIn(true);
    setApiError(null);
    const lowercaseUsername = loginAttemptUser.username.trim().toLowerCase();
    console.log(`Attempting to log in with username: ${lowercaseUsername}`);
    try {
        const userFromApi = await getUserByUsernameAPI(lowercaseUsername);
        console.log("Fetched user for login attempt from API:", userFromApi);

        if (userFromApi) {
            console.log("Password hash from API:", userFromApi.password_hash);
            console.log("Password entered:", loginAttemptUser.password);
            const passwordsMatch = userFromApi.password_hash === loginAttemptUser.password;
            console.log("Passwords match:", passwordsMatch);
            console.log("Is approved status from API:", userFromApi.is_approved);

            if (passwordsMatch) {
                if (userFromApi.is_approved) {
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
            handleApiError(`Invalid username or password. User '${lowercaseUsername}' not found.`);
        }
    } catch(error) {
        handleApiError('Login failed during API call.', error);
    } finally {
        setIsLoggingIn(false);
    }
  };

  const handleSignup = async (newUserData: Omit<AuthUser, 'id' | 'role' | 'is_approved' | 'credits'>) => {
    setIsSigningUp(true);
    setApiError(null);
    const lowercaseUsername = newUserData.username.trim().toLowerCase();
    const apiUserData: Omit<AuthUser, 'id'> = {
      username: lowercaseUsername,
      password_hash: newUserData.password_hash,
      catering_name: newUserData.catering_name,
      phone: newUserData.phone,
      address: newUserData.address,
      email: newUserData.email,
      is_approved: false,
      role: UserRole.USER,
      credits: 0,
      image_url: newUserData.image_url || placeholderImage(DEFAULT_IMAGE_SIZE,DEFAULT_IMAGE_SIZE, lowercaseUsername),
      preferred_language: newUserData.preferred_language || Language.EN,
    };
    console.log("Attempting to signup with payload:", JSON.stringify(apiUserData, null, 2)); // DIAGNOSTIC LOG
    try {
        const newUser = await addUserAPI(apiUserData);
        setUsers(await getAllUsersAPI());
        alert(getUIText(UITranslationKeys.ALERT_SIGNUP_SUCCESS_PENDING_APPROVAL, newUser.preferred_language));
        setCurrentPage(Page.Login);
    } catch (error) {
        handleApiError('Signup failed.', error);
    } finally {
        setIsSigningUp(false);
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
    setIsModalSubmitting(true);
    setApiError(null);
    try {
        const updatedUser = await updateUserAPI(userId, { is_approved: true, role: roleToAssign });
        setUsers(await getAllUsersAPI());
        alert(getUIText(UITranslationKeys.ALERT_USER_APPROVED_EMAIL_SIMULATION, currentUser.preferred_language, Language.EN, {
            userName: updatedUser.username,
            roleAssigned: roleToAssign,
            userEmail: updatedUser?.email || 'N/A'
        }));
    } catch(error) {
        handleApiError(`Failed to approve user ${userId}.`, error);
    } finally {
        setIsModalSubmitting(false);
    }
  };

  const handleSetUserCredits = async (userId: string, newCredits: number) => {
    if (currentUser?.role !== UserRole.SUPREM) return;
    setIsModalSubmitting(true);
    setApiError(null);
    if (isNaN(newCredits) || newCredits < 0) {
        alert("Invalid credit amount. Please enter a non-negative number.");
        setIsModalSubmitting(false);
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
        if (selectedUserForView && selectedUserForView.id === userId) setSelectedUserForView(updatedUser);
        alert('User credits updated!');
    } catch (error) {
        handleApiError(`Failed to update credits for user ${userId}.`, error);
    } finally {
        setIsModalSubmitting(false);
    }
  };

  const handleUpdateUserLanguage = async (userId: string, language: Language) => {
    if (currentUser?.role !== UserRole.SUPREM && currentUser?.id !== userId) {
        alert("Permission denied to change language preference.");
        return;
    }
    setIsModalSubmitting(true);
    setApiError(null);
    try {
        const updatedUser = await updateUserAPI(userId, { preferred_language: language });
        setUsers(await getAllUsersAPI());
        if (currentUser?.id === userId) {
            setCurrentUser(updatedUser);
            localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updatedUser));
        }
        if (selectedUserForView?.id === userId) setSelectedUserForView(updatedUser);
        alert(`User language preference updated to ${LanguageLabelMapping[language]}.`);
    } catch (error) {
        handleApiError(`Failed to update language for user ${userId}.`, error);
    } finally {
        setIsModalSubmitting(false);
    }
  };

  const handleUpdateUserDetailsBySuprem = async (userId: string, updatedDetails: Partial<Pick<AuthUser, 'username' | 'catering_name' | 'phone' | 'address' | 'email' | 'image_url'>>) => {
    if (currentUser?.role !== UserRole.SUPREM) {
        alert("Permission denied.");
        return;
    }
    setIsModalSubmitting(true);
    setApiError(null);
    try {
        const lowercaseUsernameDetails = updatedDetails.username 
            ? { ...updatedDetails, username: updatedDetails.username.trim().toLowerCase() }
            : updatedDetails;
        const updatedUser = await updateUserAPI(userId, lowercaseUsernameDetails);
        setUsers(await getAllUsersAPI());
        if (selectedUserForView?.id === userId) setSelectedUserForView(updatedUser);
        if (currentUser?.id === userId) {
            setCurrentUser(updatedUser);
            localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updatedUser));
        }
        alert('User details updated successfully by Suprem.');
    } catch (error) {
        handleApiError(`Failed to update details for user ${userId}.`, error);
    } finally {
        setIsModalSubmitting(false);
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
    if (currentUser.role === UserRole.ADMIN) return true;
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

  const handleSaveIngredient = async (ingredientData: Omit<Ingredient, 'id'> & {id?: string}) => {
    if (!currentUser || !canPerformAction(ingredientData.id ? 'edit' : 'add', 'ingredient')) {
        handleApiError("Permission denied to save ingredient.");
        return;
    }
    setIsModalSubmitting(true);
    setApiError(null);
    
    const idToSave = ingredientData.id || generateId();
    const existing = ingredients.find(i => i.id === idToSave);
    const newNameLocalized: LocalizedText = existing?.name_localized ? {...existing.name_localized} : {};
    
    // Assuming ingredientData.name_localized is the direct input from the form
    if (typeof ingredientData.name_localized === 'string') newNameLocalized[currentUser.preferred_language] = ingredientData.name_localized;
    else newNameLocalized[currentUser.preferred_language] = getTranslatedText(ingredientData.name_localized, currentUser.preferred_language);
    
    if (!newNameLocalized[Language.EN] && currentUser.preferred_language !== Language.EN) {
      newNameLocalized[Language.EN] = typeof ingredientData.name_localized === 'string' ? ingredientData.name_localized : getTranslatedText(ingredientData.name_localized, Language.EN);
    }

    const apiIngredientData: Ingredient = {
        id: idToSave, 
        name_localized: newNameLocalized,
        image_url: ingredientData.image_url || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, getTranslatedText(newNameLocalized, currentUser.preferred_language)),
        quantity: ingredientData.quantity, 
        unit: ingredientData.unit, 
        price: ingredientData.price,
    };
    try {
        if (existing) await updateIngredientAPI(apiIngredientData.id, apiIngredientData);
        else await addIngredientAPI(apiIngredientData);
        setIngredients(await getAllIngredientsAPI());
        closeModal();
    } catch (error) { handleApiError('Failed to save ingredient.', error); }
    finally { setIsModalSubmitting(false); }
  };

  const handleDeleteIngredient = async (id: string) => {
    if (!currentUser || !canPerformAction('delete', 'ingredient')) {
        handleApiError("Permission denied to delete ingredient.");
        return;
    }
    setIsModalSubmitting(true);
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
    } catch (error) { handleApiError(`Failed to delete ingredient ${id}.`, error); }
    finally { setIsModalSubmitting(false); }
  };

  const handleSaveDish = async (dishData: Omit<Dish, 'id'> & {id?: string}) => {
     if (!currentUser || !canPerformAction(dishData.id ? 'edit' : 'add', 'dish')) {
        handleApiError("Permission denied to save dish.");
        return;
    }
    setIsModalSubmitting(true);
    setApiError(null);
    const idToSave = dishData.id || generateId();
    const existing = dishes.find(d => d.id === idToSave);

    const newNameLocalized: LocalizedText = existing?.name_localized ? {...existing.name_localized} : {};
    if (typeof dishData.name_localized === 'string') newNameLocalized[currentUser.preferred_language] = dishData.name_localized;
    else newNameLocalized[currentUser.preferred_language] = getTranslatedText(dishData.name_localized, currentUser.preferred_language);
    if (!newNameLocalized[Language.EN] && currentUser.preferred_language !== Language.EN) newNameLocalized[Language.EN] = typeof dishData.name_localized === 'string' ? dishData.name_localized : getTranslatedText(dishData.name_localized, Language.EN);
    
    const newPrepStepsLocalized: LocalizedText = existing?.preparation_steps_localized ? {...existing.preparation_steps_localized} : {};
    if (typeof dishData.preparation_steps_localized === 'string') newPrepStepsLocalized[currentUser.preferred_language] = dishData.preparation_steps_localized;
    else newPrepStepsLocalized[currentUser.preferred_language] = getTranslatedText(dishData.preparation_steps_localized, currentUser.preferred_language);
    if (!newPrepStepsLocalized[Language.EN] && currentUser.preferred_language !== Language.EN) newPrepStepsLocalized[Language.EN] = typeof dishData.preparation_steps_localized === 'string' ? dishData.preparation_steps_localized : getTranslatedText(dishData.preparation_steps_localized, Language.EN);
    
    const apiDishData: Dish = {
        id: idToSave, 
        name_localized: newNameLocalized,
        image_url: dishData.image_url || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, getTranslatedText(newNameLocalized, currentUser.preferred_language)),
        ingredients: dishData.ingredients, 
        preparation_steps_localized: newPrepStepsLocalized,
    };
    try {
        if (existing) await updateDishAPI(apiDishData.id, apiDishData);
        else await addDishAPI(apiDishData);
        setDishes(await getAllDishesAPI());
        closeModal();
    } catch (error) { handleApiError('Failed to save dish.', error); }
    finally { setIsModalSubmitting(false); }
  };

  const handleDeleteDish = async (id: string) => {
    if (!currentUser || !canPerformAction('delete', 'dish')) {
        handleApiError("Permission denied to delete dish.");
        return;
    }
    setIsModalSubmitting(true);
    setApiError(null);
    try {
        await deleteDishAPI(id);
        setDishes(await getAllDishesAPI());
        alert('Dish deleted. Customer orders might need to be refreshed or updated if they contained this dish.');
        setCustomers(await getAllCustomersAPI());
    } catch (error) { handleApiError(`Failed to delete dish ${id}.`, error); }
    finally { setIsModalSubmitting(false); }
  };

  const handleSaveCookingItem = async (itemData: Omit<CookingItem, 'id'> & {id?: string}) => {
    if (!currentUser || !canPerformAction(itemData.id ? 'edit' : 'add', 'cookingItem')) {
        handleApiError("Permission denied to save cooking item.");
        return;
    }
    setIsModalSubmitting(true);
    setApiError(null);
    const idToSave = itemData.id || generateId();
    const existing = cookingItems.find(ci => ci.id === idToSave);

    const newNameLocalized: LocalizedText = existing?.name_localized ? {...existing.name_localized} : {};
    if (typeof itemData.name_localized === 'string') newNameLocalized[currentUser.preferred_language] = itemData.name_localized;
    else newNameLocalized[currentUser.preferred_language] = getTranslatedText(itemData.name_localized, currentUser.preferred_language);
    if (!newNameLocalized[Language.EN] && currentUser.preferred_language !== Language.EN) newNameLocalized[Language.EN] = typeof itemData.name_localized === 'string' ? itemData.name_localized : getTranslatedText(itemData.name_localized, Language.EN);

    const newSummaryLocalized: LocalizedText = existing?.summary_localized ? {...existing.summary_localized} : {};
    if (typeof itemData.summary_localized === 'string') newSummaryLocalized[currentUser.preferred_language] = itemData.summary_localized;
    else newSummaryLocalized[currentUser.preferred_language] = getTranslatedText(itemData.summary_localized, currentUser.preferred_language);
    if (!newSummaryLocalized[Language.EN] && currentUser.preferred_language !== Language.EN) newSummaryLocalized[Language.EN] = typeof itemData.summary_localized === 'string' ? itemData.summary_localized : getTranslatedText(itemData.summary_localized, Language.EN);
    
    const apiCookingItemData: CookingItem = {
        id: idToSave, 
        name_localized: newNameLocalized,
        image_url: itemData.image_url || placeholderImage(DEFAULT_IMAGE_SIZE,DEFAULT_IMAGE_SIZE, getTranslatedText(newNameLocalized, currentUser.preferred_language)),
        summary_localized: newSummaryLocalized, 
        unit: itemData.unit, 
        price: itemData.price,
    };
    try {
        if (existing) await updateCookingItemAPI(apiCookingItemData.id, apiCookingItemData);
        else await addCookingItemAPI(apiCookingItemData);
        setCookingItems(await getAllCookingItemsAPI());
        closeModal();
    } catch (error) { handleApiError('Failed to save cooking item.', error); }
    finally { setIsModalSubmitting(false); }
  };

  const handleDeleteCookingItem = async (id: string) => {
     if (!currentUser || !canPerformAction('delete', 'cookingItem')) {
        handleApiError("Permission denied to delete cooking item.");
        return;
    }
    setIsModalSubmitting(true);
    setApiError(null);
    try {
        await deleteCookingItemAPI(id);
        setCookingItems(await getAllCookingItemsAPI());
        alert('Cooking item deleted. Customer orders might need to be refreshed or updated.');
        setCustomers(await getAllCustomersAPI());
    } catch (error) { handleApiError(`Failed to delete cooking item ${id}.`, error); }
    finally { setIsModalSubmitting(false); }
  };

  const handleSaveCustomer = async (submittedCustomerData: Customer) => {
    if (!currentUser || !canPerformAction(editingItem?.id ? 'edit' : 'add', 'customer', editingItem)) {
         handleApiError("Permission denied or insufficient credits to save customer.");
        return;
    }
    setIsModalSubmitting(true);
    setApiError(null);
    const customerPayload: Omit<Customer, 'generated_order_details'> & { id: string } = {
        id: submittedCustomerData.id, name: submittedCustomerData.name,
        image_url: submittedCustomerData.image_url || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, submittedCustomerData.name),
        phone: submittedCustomerData.phone, address: submittedCustomerData.address,
        number_of_persons: submittedCustomerData.number_of_persons,
        userId: submittedCustomerData.userId || ( (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.USER) && !editingItem?.userId ? currentUser.id : editingItem?.userId),
        selectedDishes: submittedCustomerData.selectedDishes, selectedCookingItems: submittedCustomerData.selectedCookingItems,
        email: submittedCustomerData.email, credits: submittedCustomerData.credits, catering_name: submittedCustomerData.catering_name,
    };
    const customerTableData: CustomerTableCreatePayload = {
        id: customerPayload.id, name: customerPayload.name, image_url: customerPayload.image_url, phone: customerPayload.phone,
        address: customerPayload.address, number_of_persons: customerPayload.number_of_persons, userId: customerPayload.userId,
    };
    const customerUpdatePayload: CustomerTableUpdatePayload = {
        name: customerPayload.name, image_url: customerPayload.image_url, phone: customerPayload.phone,
        address: customerPayload.address, number_of_persons: customerPayload.number_of_persons, userId: customerPayload.userId,
    };
    try {
        let savedCustomerRecord: Customer;
        if (editingItem && editingItem.id) savedCustomerRecord = await updateCustomerAPI(editingItem.id, customerUpdatePayload);
        else {
            savedCustomerRecord = await addCustomerAPI(customerTableData);
            if (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.USER) {
                 await updateUserAPI(currentUser.id, { credits: Math.max(0, currentUser.credits - 1) });
                 const refreshedUser = await getUserAPI(currentUser.id);
                 if(refreshedUser) {
                     setCurrentUser(refreshedUser);
                     localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(refreshedUser));
                 }
            }
        }
        const existingSelectedDishes = editingItem?.id ? await getCustomerSelectedDishesAPI(editingItem.id) : [];
        const dishIdsToKeep = new Set<string>();
        for (const newSelection of customerPayload.selectedDishes) {
            const existingRecord = existingSelectedDishes.find(esd => esd.dish_id === newSelection.dishId);
            if (!existingRecord) {
                await addCustomerSelectedDishAPI({ customer_id: savedCustomerRecord.id, dish_id: newSelection.dishId });
            }
            dishIdsToKeep.add(newSelection.dishId);
        }
        for (const oldSelection of existingSelectedDishes) {
            if (!dishIdsToKeep.has(oldSelection.dish_id)) {
                await deleteCustomerSelectedDishAPI(oldSelection.id);
            }
        }
        const existingSelectedCookingItems = editingItem?.id ? await getCustomerSelectedCookingItemsAPI(editingItem.id) : [];
        const cookingItemIdsToKeep = new Set<string>();
        for (const newSelection of customerPayload.selectedCookingItems) {
            const existingRecord = existingSelectedCookingItems.find(esci => esci.cooking_item_id === newSelection.cookingItemId);
            if (existingRecord) {
                if (existingRecord.quantity !== newSelection.quantity) {
                    await updateCustomerSelectedCookingItemAPI(existingRecord.id, { quantity: newSelection.quantity });
                }
            } else {
                await addCustomerSelectedCookingItemAPI({ customer_id: savedCustomerRecord.id, cooking_item_id: newSelection.cookingItemId, quantity: newSelection.quantity });
            }
            cookingItemIdsToKeep.add(newSelection.cookingItemId);
        }
        for (const oldSelection of existingSelectedCookingItems) {
            if (!cookingItemIdsToKeep.has(oldSelection.cooking_item_id)) {
                await deleteCustomerSelectedCookingItemAPI(oldSelection.id);
            }
        }
        setCustomers(await getAllCustomersAPI());
        closeModal();
    } catch (error) {
        handleApiError('Failed to save customer data.', error);
    } finally {
        setIsModalSubmitting(false);
    }
  };


  const handleDeleteCustomer = async (id: string) => {
    if (!currentUser || !canPerformAction('delete', 'customer', customers.find(c => c.id === id))) {
        handleApiError("Permission denied to delete customer.");
        return;
    }
    setIsModalSubmitting(true);
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
    } catch (error) {
        handleApiError(`Failed to delete customer ${id}.`, error);
    } finally {
        setIsModalSubmitting(false);
    }
  };

  const handleUpdateProfile = async (profileData: Customer) => {
    if (!currentUser) {
        handleApiError("No user logged in to update profile.");
        return;
    }
    setIsModalSubmitting(true);
    setApiError(null);
    const updates: Partial<AuthUser> = {
        username: profileData.name.trim().toLowerCase(),
        phone: profileData.phone,
        address: profileData.address,
        email: profileData.email,
        catering_name: profileData.catering_name,
        image_url: profileData.image_url,
    };
    if (profileData.newPassword) {
        updates.password_hash = profileData.newPassword;
    }
    try {
        const updatedUser = await updateUserAPI(currentUser.id, updates);
        setCurrentUser(updatedUser);
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updatedUser));
        setUsers(await getAllUsersAPI()); 
        closeModal();
        alert("Profile updated successfully!");
    } catch (error) {
        handleApiError('Failed to update profile.', error);
    } finally {
        setIsModalSubmitting(false);
    }
  };
  
   // Smart Calculations and Order Generation
  const convertToBaseUnit = (quantity: number, unit: string): { quantity: number; unit: string } => {
    const conversion = UnitConversionFactors[unit.toLowerCase()];
    if (conversion) {
      return { quantity: quantity * conversion.toBase, unit: conversion.baseUnit };
    }
    const baseUnitKeys = Object.keys(IngredientBaseUnits).map(k => IngredientBaseUnits[k as keyof typeof IngredientBaseUnits]);
    for (const base of baseUnitKeys) {
        if (unit.toLowerCase().startsWith(base)) {
            return { quantity, unit: base }; 
        }
    }
    return { quantity, unit };
  };

  const calculateTotalIngredientsForCustomer = (customer: Customer): CumulativeIngredient[] => {
    const aggregatedIngredients: { [ingredientId: string]: { totalQuantity: number; unit: string; masterIngredientId: string; name_localized: LocalizedText; pricePerBaseUnit: number; baseUnitQuantity: number; } } = {};
    if (!customer.selectedDishes) return [];

    customer.selectedDishes.forEach(selection => {
        const dish = dishes.find(d => d.id === selection.dishId);
        if (dish) {
            dish.ingredients.forEach(dishIngredient => {
                const masterIngredient = ingredients.find(i => i.id === dishIngredient.ingredientId);
                if (masterIngredient) {
                    const { quantity: convertedQuantity, unit: baseUnit } = convertToBaseUnit(dishIngredient.quantity, masterIngredient.unit);
                    const { quantity: masterConvertedQuantity, unit: masterBaseUnit } = convertToBaseUnit(masterIngredient.quantity, masterIngredient.unit);
                    
                    if (baseUnit !== masterBaseUnit) {
                         console.warn(`Unit mismatch for ingredient ${getTranslatedText(masterIngredient.name_localized, currentUser?.preferred_language || Language.EN)}: dish uses ${dishIngredient.quantity} ${masterIngredient.unit} (base ${baseUnit}), but master is ${masterIngredient.quantity} ${masterIngredient.unit} (base ${masterBaseUnit}). Calculations might be inaccurate if units are not compatible without further context (e.g. density for weight/volume).`);
                    }
                    const pricePerMasterBaseUnit = masterConvertedQuantity > 0 ? masterIngredient.price / masterConvertedQuantity : 0;
                    const requiredQuantityForDish = convertedQuantity * customer.number_of_persons;

                    if (!aggregatedIngredients[masterIngredient.id]) {
                        aggregatedIngredients[masterIngredient.id] = { totalQuantity: 0, unit: masterBaseUnit, masterIngredientId: masterIngredient.id, name_localized: masterIngredient.name_localized, pricePerBaseUnit: pricePerMasterBaseUnit, baseUnitQuantity: masterConvertedQuantity };
                    }
                    aggregatedIngredients[masterIngredient.id].totalQuantity += requiredQuantityForDish;
                }
            });
        }
    });
    return Object.values(aggregatedIngredients).map(agg => ({
        id: `cumulative-${agg.masterIngredientId}`,
        masterIngredientId: agg.masterIngredientId,
        name: getTranslatedText(agg.name_localized, currentUser?.preferred_language || Language.EN),
        totalQuantity: parseFloat(agg.totalQuantity.toFixed(3)), 
        unit: agg.unit,
        totalPrice: parseFloat((agg.totalQuantity * agg.pricePerBaseUnit).toFixed(2))
    }));
  };

  const calculateSelectedCookingItems = (customer: Customer): SelectedCookingItemDetail[] => {
    if (!customer.selectedCookingItems) return [];
    return customer.selectedCookingItems.map(selection => {
        const masterItem = cookingItems.find(ci => ci.id === selection.cookingItemId);
        if (masterItem) {
            return {
                id: `selected-ci-${masterItem.id}`,
                masterCookingItemId: masterItem.id,
                name: getTranslatedText(masterItem.name_localized, currentUser?.preferred_language || Language.EN),
                quantity: selection.quantity,
                unit: masterItem.unit,
                price: masterItem.price,
                totalPrice: parseFloat((selection.quantity * masterItem.price).toFixed(2))
            };
        }
        return null; 
    }).filter(item => item !== null) as SelectedCookingItemDetail[];
  };

  const handleGenerateOrder = async (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    setIsModalSubmitting(true);
    setApiError(null);
    try {
        const cumulativeIngredients = calculateTotalIngredientsForCustomer(customer);
        const selectedCookingItemsDetails = calculateSelectedCookingItems(customer);
        const totalIngredientCost = cumulativeIngredients.reduce((sum, item) => sum + item.totalPrice, 0);
        const totalCookingItemCost = selectedCookingItemsDetails.reduce((sum, item) => sum + item.totalPrice, 0);
        const totalOrderCost = parseFloat((totalIngredientCost + totalCookingItemCost).toFixed(2));

        const generatedOrder: GeneratedOrder = {
            cumulativeIngredients,
            selectedCookingItems: selectedCookingItemsDetails,
            totalOrderCost
        };
        const updatedCustomer = { ...customer, generated_order_details: generatedOrder };
        await updateCustomerAPI(customerId, { generated_order_details: generatedOrder }); 
        setCustomers(customers.map(c => c.id === customerId ? updatedCustomer : c));
    } catch (error) {
        handleApiError(`Failed to generate order for customer ${customer.name}.`, error);
    } finally {
        setIsModalSubmitting(false);
    }
  };

  const handleEditOrderIngredient = (
    customerId: string, 
    ingredientId: string, 
    isAdding: boolean, 
    existingOrderItemData?: { name: string; quantity: number; unit: string; masterIngredientId: string }
  ) => {
    setEditingOrderContext({ customerId, orderLineItemId: ingredientId, isAdding, existingOrderItemData });
    openModal('orderIngredient');
  };

  const handleSaveOrderIngredient = async (data: {
    customerId: string;
    orderLineItemId?: string;
    masterIngredientId?: string;
    quantity: number;
    unit: string;
    isAdding: boolean;
  }) => {
    const customer = customers.find(c => c.id === data.customerId);
    if (!customer || !customer.generated_order_details) {
        handleApiError("Customer or order not found for saving ingredient.");
        return;
    }
    setIsModalSubmitting(true);
    setApiError(null);
    try {
        let newCumulativeIngredients = [...customer.generated_order_details.cumulativeIngredients];
        if (data.isAdding && data.masterIngredientId) {
            const masterIng = ingredients.find(i => i.id === data.masterIngredientId);
            if (!masterIng) { handleApiError("Master ingredient not found."); setIsModalSubmitting(false); return; }
            const { quantity: masterBaseQuantity, unit: masterBaseUnit } = convertToBaseUnit(masterIng.quantity, masterIng.unit);
            const pricePerBase = masterBaseQuantity > 0 ? masterIng.price / masterBaseQuantity : 0;
            
            const existingCumulative = newCumulativeIngredients.find(ci => ci.masterIngredientId === data.masterIngredientId);
            if(existingCumulative) {
                 handleApiError(`Ingredient ${getTranslatedText(masterIng.name_localized, currentUser?.preferred_language || Language.EN)} already exists in the order. Please edit it instead of adding duplicates.`);
                 setIsModalSubmitting(false);
                 return;
            }

            newCumulativeIngredients.push({
                id: `cumulative-${data.masterIngredientId}`,
                masterIngredientId: data.masterIngredientId,
                name: getTranslatedText(masterIng.name_localized, currentUser?.preferred_language || Language.EN),
                totalQuantity: data.quantity, 
                unit: data.unit, 
                totalPrice: parseFloat((data.quantity * pricePerBase * (convertToBaseUnit(1, data.unit).quantity / convertToBaseUnit(1, masterBaseUnit).quantity)).toFixed(2)) 
            });
        } else if (!data.isAdding && data.orderLineItemId) { 
            const index = newCumulativeIngredients.findIndex(item => item.id === data.orderLineItemId);
            if (index !== -1) {
                const masterIng = ingredients.find(i => i.id === newCumulativeIngredients[index].masterIngredientId);
                 if (!masterIng) { handleApiError("Master ingredient for editing not found."); setIsModalSubmitting(false); return; }
                const { quantity: masterBaseQuantity, unit: masterBaseUnit } = convertToBaseUnit(masterIng.quantity, masterIng.unit);
                const pricePerBase = masterBaseQuantity > 0 ? masterIng.price / masterBaseQuantity : 0;
                newCumulativeIngredients[index] = {
                    ...newCumulativeIngredients[index],
                    totalQuantity: data.quantity,
                    unit: data.unit,
                    totalPrice: parseFloat((data.quantity * pricePerBase * (convertToBaseUnit(1, data.unit).quantity / convertToBaseUnit(1, masterBaseUnit).quantity)).toFixed(2))
                };
            }
        }
        const totalIngredientCost = newCumulativeIngredients.reduce((sum, item) => sum + item.totalPrice, 0);
        const totalCookingItemCost = customer.generated_order_details.selectedCookingItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const totalOrderCost = parseFloat((totalIngredientCost + totalCookingItemCost).toFixed(2));
        const updatedGeneratedOrder: GeneratedOrder = {
            ...customer.generated_order_details,
            cumulativeIngredients: newCumulativeIngredients,
            totalOrderCost
        };
        await updateCustomerAPI(data.customerId, { generated_order_details: updatedGeneratedOrder });
        setCustomers(customers.map(c => c.id === data.customerId ? { ...c, generated_order_details: updatedGeneratedOrder } : c));
        closeModal();
    } catch (error) {
        handleApiError("Failed to save order ingredient.", error);
    } finally {
        setIsModalSubmitting(false);
    }
  };
  
  const handleDeleteOrderIngredient = async (customerId: string, orderLineItemId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer || !customer.generated_order_details) {
        handleApiError("Customer or order not found for deleting ingredient.");
        return;
    }
    if (!canPerformAction('delete', 'orderIngredient', { customerUserId: customer.userId })){
        handleApiError("Permission denied to delete order ingredient.");
        return;
    }
    setIsModalSubmitting(true);
    setApiError(null);
    try {
        const newCumulativeIngredients = customer.generated_order_details.cumulativeIngredients.filter(item => item.id !== orderLineItemId);
        const totalIngredientCost = newCumulativeIngredients.reduce((sum, item) => sum + item.totalPrice, 0);
        const totalCookingItemCost = customer.generated_order_details.selectedCookingItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const totalOrderCost = parseFloat((totalIngredientCost + totalCookingItemCost).toFixed(2));

        const updatedGeneratedOrder: GeneratedOrder = {
            ...customer.generated_order_details,
            cumulativeIngredients: newCumulativeIngredients,
            totalOrderCost
        };
        await updateCustomerAPI(customerId, { generated_order_details: updatedGeneratedOrder });
        setCustomers(customers.map(c => c.id === customerId ? { ...c, generated_order_details: updatedGeneratedOrder } : c));
    } catch (error) {
        handleApiError("Failed to delete order ingredient.", error);
    } finally {
        setIsModalSubmitting(false);
    }
  };

  const handleEditOrderCookingItem = (
    customerId: string, 
    orderLineItemId: string, 
    isAdding: boolean, 
    existingOrderItemData?: { masterCookingItemId: string; name: string; quantity: number; unit: string; price: number;}
  ) => {
    setEditingOrderCookingItemContext({ customerId, orderLineItemId, isAdding, existingOrderItemData });
    openModal('orderCookingItem');
  };

  const handleSaveOrderCookingItem = async (data: {
    customerId: string;
    orderLineItemId?: string; 
    masterCookingItemId?: string; 
    quantity: number;
    isAdding: boolean;
  }) => {
    const customer = customers.find(c => c.id === data.customerId);
    if (!customer || !customer.generated_order_details) {
        handleApiError("Customer or order not found for saving cooking item.");
        return;
    }
    setIsModalSubmitting(true);
    setApiError(null);
    try {
        let newSelectedCookingItems = [...customer.generated_order_details.selectedCookingItems];
        if (data.isAdding && data.masterCookingItemId) {
            const masterItem = cookingItems.find(ci => ci.id === data.masterCookingItemId);
            if (!masterItem) { handleApiError("Master cooking item not found."); setIsModalSubmitting(false); return; }
            
            const existingSelectedItem = newSelectedCookingItems.find(sci => sci.masterCookingItemId === data.masterCookingItemId);
            if(existingSelectedItem) {
                handleApiError(`Cooking item ${getTranslatedText(masterItem.name_localized, currentUser?.preferred_language || Language.EN)} already exists. Please edit it.`);
                setIsModalSubmitting(false);
                return;
            }
            newSelectedCookingItems.push({
                id: `selected-ci-${data.masterCookingItemId}`,
                masterCookingItemId: data.masterCookingItemId,
                name: getTranslatedText(masterItem.name_localized, currentUser?.preferred_language || Language.EN),
                quantity: data.quantity,
                unit: masterItem.unit,
                price: masterItem.price,
                totalPrice: parseFloat((data.quantity * masterItem.price).toFixed(2))
            });
        } else if (!data.isAdding && data.orderLineItemId) { 
            const index = newSelectedCookingItems.findIndex(item => item.id === data.orderLineItemId);
            if (index !== -1) {
                const masterItem = cookingItems.find(ci => ci.id === newSelectedCookingItems[index].masterCookingItemId);
                if (!masterItem) { handleApiError("Master cooking item for editing not found."); setIsModalSubmitting(false); return; }
                newSelectedCookingItems[index] = {
                    ...newSelectedCookingItems[index],
                    quantity: data.quantity,
                    totalPrice: parseFloat((data.quantity * masterItem.price).toFixed(2))
                };
            }
        }

        const totalIngredientCost = customer.generated_order_details.cumulativeIngredients.reduce((sum, item) => sum + item.totalPrice, 0);
        const totalCookingItemCost = newSelectedCookingItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const totalOrderCost = parseFloat((totalIngredientCost + totalCookingItemCost).toFixed(2));

        const updatedGeneratedOrder: GeneratedOrder = {
            ...customer.generated_order_details,
            selectedCookingItems: newSelectedCookingItems,
            totalOrderCost
        };
        await updateCustomerAPI(data.customerId, { generated_order_details: updatedGeneratedOrder });
        setCustomers(customers.map(c => c.id === data.customerId ? { ...c, generated_order_details: updatedGeneratedOrder } : c));
        closeModal();
    } catch (error) {
        handleApiError("Failed to save order cooking item.", error);
    } finally {
        setIsModalSubmitting(false);
    }
  };

  const handleDeleteOrderCookingItem = async (customerId: string, orderLineItemId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer || !customer.generated_order_details) {
        handleApiError("Customer or order not found for deleting cooking item.");
        return;
    }
    if (!canPerformAction('delete', 'orderCookingItem', { customerUserId: customer.userId })){
        handleApiError("Permission denied to delete order cooking item.");
        return;
    }
    setIsModalSubmitting(true);
    setApiError(null);
    try {
        const newSelectedCookingItems = customer.generated_order_details.selectedCookingItems.filter(item => item.id !== orderLineItemId);
        const totalIngredientCost = customer.generated_order_details.cumulativeIngredients.reduce((sum, item) => sum + item.totalPrice, 0);
        const totalCookingItemCost = newSelectedCookingItems.reduce((sum, item) => sum + item.totalPrice, 0);
        const totalOrderCost = parseFloat((totalIngredientCost + totalCookingItemCost).toFixed(2));

        const updatedGeneratedOrder: GeneratedOrder = {
            ...customer.generated_order_details,
            selectedCookingItems: newSelectedCookingItems,
            totalOrderCost
        };
        await updateCustomerAPI(customerId, { generated_order_details: updatedGeneratedOrder });
        setCustomers(customers.map(c => c.id === customerId ? { ...c, generated_order_details: updatedGeneratedOrder } : c));
    } catch (error) {
        handleApiError("Failed to delete order cooking item.", error);
    } finally {
        setIsModalSubmitting(false);
    }
  };

  const generateId = (): string => `id_${new Date().getTime()}_${Math.random().toString(36).substring(2, 9)}`;

  const handleLanguageChange = async (newLang: Language) => {
    if (currentUser) {
        setIsModalSubmitting(true);
        setApiError(null);
        try {
            const updatedUser = await updateUserAPI(currentUser.id, { preferred_language: newLang });
            setCurrentUser(updatedUser);
            localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(updatedUser));
        } catch (error) {
            handleApiError(`Failed to update your language preference.`, error);
        } finally {
            setIsModalSubmitting(false);
        }
    }
  };

  const exportToExcel = (data: any[], fileName: string, sheetName: string, headers: string[]) => {
    const ws = XLSX.utils.json_to_sheet(data, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportIngredients = () => {
    if (!currentUser || !canPerformAction('add', 'ingredient')) { 
        handleApiError(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser?.preferred_language || Language.EN)); return;
    }
    const lang = currentUser.preferred_language;
    const dataToExport = ingredients.map(ing => ({
        ID: ing.id,
        Name_EN: ing.name_localized[Language.EN] || getTranslatedText(ing.name_localized, Language.EN), 
        Name_Native: getTranslatedText(ing.name_localized, lang, Language.EN), 
        Quantity: ing.quantity,
        Unit: ing.unit,
        Price_Rupees: ing.price,
        Image_URL: ing.image_url,
        ...((lang !== Language.EN) ? 
            Object.fromEntries(SupportedLanguages.filter(l => l !== Language.EN && l !== lang).map(l => [`Name_${l.toUpperCase()}`, ing.name_localized[l] || '']))
            : {})
    }));
    const headers = ["ID", `Name_EN`, `Name_Native`, "Quantity", "Unit", "Price_Rupees", "Image_URL"];
    if (lang !== Language.EN) {
        SupportedLanguages.filter(l => l !== Language.EN && l !== lang).forEach(l => headers.push(`Name_${l.toUpperCase()}`));
    }
    exportToExcel(dataToExport, 'Ingredients_Export', 'Ingredients', headers);
    alert(getUIText(UITranslationKeys.ALERT_INGREDIENTS_EXPORTED_SUCCESS, lang));
  };
  
  const handleImportIngredients = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser || !canPerformAction('add', 'ingredient')) {
        handleApiError(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser?.preferred_language || Language.EN)); return;
    }
    const file = event.target.files?.[0];
    if (!file) { alert(getUIText(UITranslationKeys.EXCEL_NO_FILE_SELECTED_ALERT, currentUser.preferred_language)); return; }
    if (!file.name.endsWith('.xlsx')) { alert(getUIText(UITranslationKeys.EXCEL_INVALID_FILE_FORMAT_ALERT, currentUser.preferred_language)); return; }
    
    setIsModalSubmitting(true);
    setApiError(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

            if (jsonData.length === 0) { throw new Error("Excel sheet is empty or headers are missing."); }
            const actualHeaders = Object.keys(jsonData[0]);
            const expectedHeaders = ["ID", "Name_EN", "Name_Native", "Quantity", "Unit", "Price_Rupees"]; 
             if (!expectedHeaders.every(header => actualHeaders.includes(header))) {
                throw new Error(getUIText(UITranslationKeys.EXCEL_HEADER_MISMATCH_ALERT, currentUser.preferred_language, Language.EN, {expectedHeaders: expectedHeaders.join(', '), actualHeaders: actualHeaders.join(', ')}));
            }

            const ingredientsToUpdate: Partial<Ingredient>[] = [];
            const ingredientsToAdd: Ingredient[] = [];

            for (const row of jsonData) {
                const nameLocalized: LocalizedText = { [Language.EN]: row.Name_EN || row.Name_Native }; 
                nameLocalized[currentUser.preferred_language] = row.Name_Native || row.Name_EN; 
                SupportedLanguages.forEach(lang => {
                    if (row[`Name_${lang.toUpperCase()}`]) nameLocalized[lang] = row[`Name_${lang.toUpperCase()}`];
                });
                if (!nameLocalized[Language.EN] && currentUser.preferred_language !== Language.EN) nameLocalized[Language.EN] = nameLocalized[currentUser.preferred_language]; 

                const ingredientData = {
                    name_localized: nameLocalized,
                    quantity: parseFloat(row.Quantity),
                    unit: row.Unit,
                    price: parseFloat(row.Price_Rupees),
                    image_url: row.Image_URL || null,
                };

                if (isNaN(ingredientData.quantity) || ingredientData.quantity <=0 || isNaN(ingredientData.price) || ingredientData.price < 0) {
                    console.warn(`Skipping row due to invalid data (Name: ${getTranslatedText(ingredientData.name_localized, Language.EN)}, Qty: ${row.Quantity}, Price: ${row.Price_Rupees})`);
                    continue;
                }

                if (row.ID && ingredients.some(ing => ing.id === row.ID)) { 
                    ingredientsToUpdate.push({ id: row.ID, ...ingredientData });
                } else {
                    ingredientsToAdd.push({ id: generateId(), ...ingredientData } as Ingredient); 
                }
            }
            if (ingredientsToUpdate.length > 0) await Promise.all(ingredientsToUpdate.map(ing => updateIngredientAPI(ing.id!, ing)));
            if (ingredientsToAdd.length > 0) await Promise.all(ingredientsToAdd.map(ing => addIngredientAPI(ing)));
            setIngredients(await getAllIngredientsAPI());
            alert(getUIText(UITranslationKeys.EXCEL_IMPORT_SUCCESS_ALERT, currentUser.preferred_language));
        } catch (error: any) {
            handleApiError(getUIText(UITranslationKeys.EXCEL_IMPORT_FAILURE_ALERT, currentUser.preferred_language) + " " + error.message, error);
        } finally {
            setIsModalSubmitting(false);
            if (importIngredientsInputRef.current) importIngredientsInputRef.current.value = ""; 
        }
    };
    reader.readAsArrayBuffer(file);
  };
  
  const handleExportDishes = () => {
    if (!currentUser || !canPerformAction('add', 'dish')) {
        handleApiError(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser?.preferred_language || Language.EN)); return;
    }
    const lang = currentUser.preferred_language;
    const dataToExport = dishes.map(dish => ({
        ID: dish.id,
        Name_EN: dish.name_localized[Language.EN] || getTranslatedText(dish.name_localized, Language.EN),
        Name_Native: getTranslatedText(dish.name_localized, lang, Language.EN),
        Image_URL: dish.image_url,
        Preparation_Steps_EN: dish.preparation_steps_localized[Language.EN] || getTranslatedText(dish.preparation_steps_localized, Language.EN),
        Preparation_Steps_Native: getTranslatedText(dish.preparation_steps_localized, lang, Language.EN),
        Ingredients_JSON: JSON.stringify(dish.ingredients.map(di => ({ ingredientId: di.ingredientId, quantity: di.quantity }))),
        ...((lang !== Language.EN) ? 
            Object.fromEntries(
                SupportedLanguages.filter(l => l !== Language.EN && l !== lang).flatMap(l => [
                    [`Name_${l.toUpperCase()}`, dish.name_localized[l] || ''],
                    [`Preparation_Steps_${l.toUpperCase()}`, dish.preparation_steps_localized[l] || '']
                ])
            ) 
            : {})
    }));
    const headers = ["ID", "Name_EN", "Name_Native", "Image_URL", "Preparation_Steps_EN", "Preparation_Steps_Native", "Ingredients_JSON"];
    if (lang !== Language.EN) {
        SupportedLanguages.filter(l => l !== Language.EN && l !== lang).forEach(l => {
            headers.push(`Name_${l.toUpperCase()}`);
            headers.push(`Preparation_Steps_${l.toUpperCase()}`);
        });
    }
    exportToExcel(dataToExport, 'Dishes_Export', 'Dishes', headers);
    alert(getUIText(UITranslationKeys.ALERT_DISHES_EXPORTED_SUCCESS, lang));
  };

  const handleImportDishes = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser || !canPerformAction('add', 'dish')) {
        handleApiError(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser?.preferred_language || Language.EN)); return;
    }
    const file = event.target.files?.[0];
    if (!file) { alert(getUIText(UITranslationKeys.EXCEL_NO_FILE_SELECTED_ALERT, currentUser.preferred_language)); return; }
    if (!file.name.endsWith('.xlsx')) { alert(getUIText(UITranslationKeys.EXCEL_INVALID_FILE_FORMAT_ALERT, currentUser.preferred_language)); return; }

    setIsModalSubmitting(true);
    setApiError(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

            if (jsonData.length === 0) { throw new Error("Excel sheet is empty or headers are missing."); }
            const actualHeaders = Object.keys(jsonData[0]);
            const expectedHeaders = ["ID", "Name_EN", "Name_Native", "Preparation_Steps_EN", "Preparation_Steps_Native", "Ingredients_JSON"];
            if (!expectedHeaders.every(header => actualHeaders.includes(header))) {
                throw new Error(getUIText(UITranslationKeys.EXCEL_HEADER_MISMATCH_ALERT, currentUser.preferred_language, Language.EN, {expectedHeaders: expectedHeaders.join(', '), actualHeaders: actualHeaders.join(', ')}));
            }

            const dishesToUpdate: Partial<Dish>[] = [];
            const dishesToAdd: Dish[] = [];

            for (const row of jsonData) {
                const nameLocalized: LocalizedText = { [Language.EN]: row.Name_EN || row.Name_Native };
                nameLocalized[currentUser.preferred_language] = row.Name_Native || row.Name_EN;
                const prepStepsLocalized: LocalizedText = { [Language.EN]: row.Preparation_Steps_EN || row.Preparation_Steps_Native };
                prepStepsLocalized[currentUser.preferred_language] = row.Preparation_Steps_Native || row.Preparation_Steps_EN;
                
                SupportedLanguages.forEach(lang => {
                    if (row[`Name_${lang.toUpperCase()}`]) nameLocalized[lang] = row[`Name_${lang.toUpperCase()}`];
                    if (row[`Preparation_Steps_${lang.toUpperCase()}`]) prepStepsLocalized[lang] = row[`Preparation_Steps_${lang.toUpperCase()}`];
                });
                if (!nameLocalized[Language.EN] && currentUser.preferred_language !== Language.EN) nameLocalized[Language.EN] = nameLocalized[currentUser.preferred_language];
                if (!prepStepsLocalized[Language.EN] && currentUser.preferred_language !== Language.EN) prepStepsLocalized[Language.EN] = prepStepsLocalized[currentUser.preferred_language];


                let dishIngredients: DishIngredient[];
                try {
                    const parsedIngredients = JSON.parse(row.Ingredients_JSON || '[]');
                    if (!Array.isArray(parsedIngredients)) throw new Error("Ingredients_JSON is not an array.");
                    dishIngredients = parsedIngredients.map((item: any) => {
                        if (!item.ingredientId || typeof item.ingredientId !== 'string' || !ingredients.some(ing => ing.id === item.ingredientId)) {
                            throw new Error(getUIText(UITranslationKeys.EXCEL_DISH_IMPORT_INVALID_INGREDIENT_ID, currentUser.preferred_language, Language.EN, {ingredientId: item.ingredientId, dishName: getTranslatedText(nameLocalized, Language.EN)}));
                        }
                        const quantity = parseFloat(item.quantity);
                        if (isNaN(quantity) || quantity <= 0) {
                            throw new Error(getUIText(UITranslationKeys.EXCEL_DISH_IMPORT_INVALID_INGREDIENT_QUANTITY, currentUser.preferred_language, Language.EN, {ingredientId: item.ingredientId, dishName: getTranslatedText(nameLocalized, Language.EN)}));
                        }
                        return { ingredientId: item.ingredientId, quantity };
                    });
                } catch (jsonError: any) {
                     throw new Error(getUIText(UITranslationKeys.EXCEL_DISH_IMPORT_INVALID_INGREDIENTS_JSON, currentUser.preferred_language, Language.EN, {dishName: getTranslatedText(nameLocalized, Language.EN), error: jsonError.message}));
                }
                
                const dishData = {
                    name_localized: nameLocalized,
                    image_url: row.Image_URL || null,
                    preparation_steps_localized: prepStepsLocalized,
                    ingredients: dishIngredients
                };
                 if (!getTranslatedText(dishData.name_localized, Language.EN).trim()) {
                    console.warn(`Skipping row due to empty Dish Name.`);
                    continue;
                }

                if (row.ID && dishes.some(d => d.id === row.ID)) {
                    dishesToUpdate.push({ id: row.ID, ...dishData });
                } else {
                    dishesToAdd.push({ id: generateId(), ...dishData } as Dish);
                }
            }

            if (dishesToUpdate.length > 0) await Promise.all(dishesToUpdate.map(d => updateDishAPI(d.id!, d)));
            if (dishesToAdd.length > 0) await Promise.all(dishesToAdd.map(d => addDishAPI(d)));
            setDishes(await getAllDishesAPI());
            alert(getUIText(UITranslationKeys.ALERT_DISHES_IMPORTED_SUCCESS, currentUser.preferred_language));
        } catch (error: any) {
            handleApiError(getUIText(UITranslationKeys.EXCEL_IMPORT_FAILURE_ALERT, currentUser.preferred_language) + " " + error.message, error);
        } finally {
            setIsModalSubmitting(false);
             if (importDishesInputRef.current) importDishesInputRef.current.value = "";
        }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExportCookingItems = () => {
    if (!currentUser || !canPerformAction('add', 'cookingItem')) {
        handleApiError(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser?.preferred_language || Language.EN)); return;
    }
    const lang = currentUser.preferred_language;
    const dataToExport = cookingItems.map(item => ({
        ID: item.id,
        Name_EN: item.name_localized[Language.EN] || getTranslatedText(item.name_localized, Language.EN),
        Name_Native: getTranslatedText(item.name_localized, lang, Language.EN),
        Summary_EN: item.summary_localized[Language.EN] || getTranslatedText(item.summary_localized, Language.EN),
        Summary_Native: getTranslatedText(item.summary_localized, lang, Language.EN),
        Unit: item.unit,
        Price_Rupees: item.price,
        Image_URL: item.image_url,
        ...((lang !== Language.EN) ? 
            Object.fromEntries(
                SupportedLanguages.filter(l => l !== Language.EN && l !== lang).flatMap(l => [
                    [`Name_${l.toUpperCase()}`, item.name_localized[l] || ''],
                    [`Summary_${l.toUpperCase()}`, item.summary_localized[l] || '']
                ])
            )
            : {})
    }));
     const headers = ["ID", "Name_EN", "Name_Native", "Summary_EN", "Summary_Native", "Unit", "Price_Rupees", "Image_URL"];
    if (lang !== Language.EN) {
        SupportedLanguages.filter(l => l !== Language.EN && l !== lang).forEach(l => {
            headers.push(`Name_${l.toUpperCase()}`);
            headers.push(`Summary_${l.toUpperCase()}`);
        });
    }
    exportToExcel(dataToExport, 'CookingItems_Export', 'CookingItems', headers);
    alert(getUIText(UITranslationKeys.ALERT_COOKING_ITEMS_EXPORTED_SUCCESS, lang));
  };
  
  const handleImportCookingItems = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser || !canPerformAction('add', 'cookingItem')) {
        handleApiError(getUIText(UITranslationKeys.ALERT_PERMISSION_DENIED, currentUser?.preferred_language || Language.EN)); return;
    }
    const file = event.target.files?.[0];
    if (!file) { alert(getUIText(UITranslationKeys.EXCEL_NO_FILE_SELECTED_ALERT, currentUser.preferred_language)); return; }
    if (!file.name.endsWith('.xlsx')) { alert(getUIText(UITranslationKeys.EXCEL_INVALID_FILE_FORMAT_ALERT, currentUser.preferred_language)); return; }

    setIsModalSubmitting(true);
    setApiError(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

            if (jsonData.length === 0) { throw new Error("Excel sheet is empty or headers are missing."); }
            const actualHeaders = Object.keys(jsonData[0]);
            const expectedHeaders = ["ID", "Name_EN", "Name_Native", "Summary_EN", "Summary_Native", "Unit", "Price_Rupees"];
            if (!expectedHeaders.every(header => actualHeaders.includes(header))) {
                 throw new Error(getUIText(UITranslationKeys.EXCEL_HEADER_MISMATCH_ALERT, currentUser.preferred_language, Language.EN, {expectedHeaders: expectedHeaders.join(', '), actualHeaders: actualHeaders.join(', ')}));
            }

            const itemsToUpdate: Partial<CookingItem>[] = [];
            const itemsToAdd: CookingItem[] = [];

            for (const row of jsonData) {
                const nameLocalized: LocalizedText = { [Language.EN]: row.Name_EN || row.Name_Native };
                nameLocalized[currentUser.preferred_language] = row.Name_Native || row.Name_EN;
                const summaryLocalized: LocalizedText = { [Language.EN]: row.Summary_EN || row.Summary_Native };
                summaryLocalized[currentUser.preferred_language] = row.Summary_Native || row.Summary_EN;
                
                SupportedLanguages.forEach(lang => {
                    if (row[`Name_${lang.toUpperCase()}`]) nameLocalized[lang] = row[`Name_${lang.toUpperCase()}`];
                    if (row[`Summary_${lang.toUpperCase()}`]) summaryLocalized[lang] = row[`Summary_${lang.toUpperCase()}`];
                });
                if (!nameLocalized[Language.EN] && currentUser.preferred_language !== Language.EN) nameLocalized[Language.EN] = nameLocalized[currentUser.preferred_language];
                if (!summaryLocalized[Language.EN] && currentUser.preferred_language !== Language.EN) summaryLocalized[Language.EN] = summaryLocalized[currentUser.preferred_language];


                const itemData = {
                    name_localized: nameLocalized,
                    summary_localized: summaryLocalized,
                    unit: row.Unit,
                    price: parseFloat(row.Price_Rupees),
                    image_url: row.Image_URL || null,
                };
                 if (!getTranslatedText(itemData.name_localized, Language.EN).trim() || isNaN(itemData.price) || itemData.price < 0) {
                    console.warn(`Skipping row due to invalid data (Name: ${getTranslatedText(itemData.name_localized, Language.EN)}, Price: ${row.Price_Rupees})`);
                    continue;
                }

                if (row.ID && cookingItems.some(item => item.id === row.ID)) {
                    itemsToUpdate.push({ id: row.ID, ...itemData });
                } else {
                    itemsToAdd.push({ id: generateId(), ...itemData } as CookingItem);
                }
            }
            if (itemsToUpdate.length > 0) await Promise.all(itemsToUpdate.map(item => updateCookingItemAPI(item.id!, item)));
            if (itemsToAdd.length > 0) await Promise.all(itemsToAdd.map(item => addCookingItemAPI(item)));
            setCookingItems(await getAllCookingItemsAPI());
            alert(getUIText(UITranslationKeys.ALERT_COOKING_ITEMS_IMPORTED_SUCCESS, currentUser.preferred_language));
        } catch (error:any) {
            handleApiError(getUIText(UITranslationKeys.EXCEL_IMPORT_FAILURE_ALERT, currentUser.preferred_language) + " " + error.message, error);
        } finally {
            setIsModalSubmitting(false);
            if (importCookingItemsInputRef.current) importCookingItemsInputRef.current.value = "";
        }
    };
    reader.readAsArrayBuffer(file);
  };

  const currentLanguage = currentUser?.preferred_language || Language.EN;
  const navigationItems = baseNavigationItems.filter(item => item.roles.includes(currentUser?.role || UserRole.USER));

  if (!isAuthCheckComplete || (currentUser && (isLoadingUsers || isLoadingIngredients || isLoadingDishes || isLoadingCookingItems || isLoadingCustomers) && currentPage !== Page.PublicHome && currentPage !== Page.Login && currentPage !== Page.Signup) ) {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-slate-100 p-4">
            <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-700 text-lg">Loading Application Data...</p>
            { apiError && <p className="text-red-500 mt-2 text-sm">{apiError}</p> }
        </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
        case Page.PublicHome: return <PublicHomePage onNavigate={setCurrentPage} />;
        case Page.Login: return <LoginForm onLogin={handleLogin} users={users} onSwitchToSignup={() => setCurrentPage(Page.Signup)} isLoggingIn={isLoggingIn} />;
        case Page.Signup: return <SignupForm onSignup={handleSignup} onSwitchToLogin={() => setCurrentPage(Page.Login)} supportedLanguages={SupportedLanguages} languageLabels={LanguageLabelMapping} isSigningUp={isSigningUp} />;
        case Page.Home: return <div className="text-center p-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Welcome back, {currentUser?.username || 'User'}!</h2>
                <p className="text-slate-600">Your catering empire awaits.</p>
                { currentUser?.credits !== undefined && currentUser.role !== UserRole.SUPREM &&
                    <p className="text-slate-600 mt-2">You have <span className="font-bold text-blue-600">{currentUser.credits}</span> credit(s) remaining for adding new customer orders.</p>
                }
            </div>;
        case Page.UserManagement: return currentUser?.role === UserRole.SUPREM ? <UserManagementPage users={users} currentUser={currentUser} onApproveUser={handleApproveUser} onSetUserCredits={handleSetUserCredits} onViewUser={handleViewUserDetails} languageLabels={LanguageLabelMapping} supportedLanguages={SupportedLanguages} onUpdateUserLanguage={handleUpdateUserLanguage}/> : <p>Access Denied.</p>;
        case Page.UserDetailsView: return selectedUserForView && currentUser?.role === UserRole.SUPREM ? <UserDetailsViewComponent user={selectedUserForView} onBack={() => setCurrentPage(previousPageBeforeUserDetails || Page.UserManagement)} onSetUserCredits={handleSetUserCredits} languageLabels={LanguageLabelMapping} supportedLanguages={SupportedLanguages} onUpdateUserLanguage={handleUpdateUserLanguage} onUpdateUserDetailsBySuprem={handleUpdateUserDetailsBySuprem} /> : <p>User not found or access denied.</p>;
        case Page.Profile: return currentUser ? <Modal onClose={() => setCurrentPage(Page.Home)}><CustomerForm onSave={handleUpdateProfile} onCancel={() => setCurrentPage(Page.Home)} existingCustomer={{...currentUser, name: currentUser.username, image_url: currentUser.image_url, number_of_persons:0, selectedDishes: [], selectedCookingItems: [], generated_order_details: null}} isProfileForm={true} dishes={[]} cookingItems={[]} ingredients={[]} generateId={generateId} currentUserPreferredLanguage={currentLanguage} isSubmitting={isModalSubmitting}/></Modal> : <p>Not logged in.</p>;
        case Page.Ingredients: {
            const filteredIngredients = ingredients.filter(ing => getTranslatedText(ing.name_localized, currentLanguage).toLowerCase().includes(searchTerm.toLowerCase()));
            const importIngredientsButtonLabel = getUIText(UITranslationKeys.EXCEL_IMPORT_INGREDIENTS_BUTTON, currentLanguage);
            const exportIngredientsButtonLabel = getUIText(UITranslationKeys.EXCEL_EXPORT_INGREDIENTS_BUTTON, currentLanguage);
            return <CrudSection
                title={getUIText(UITranslationKeys.INGREDIENTS_PAGE_TITLE, currentLanguage)}
                items={filteredIngredients}
                renderItem={(item: Ingredient) => (
                    <div key={item.id} className="bg-slate-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <img src={item.image_url || placeholderImage(DEFAULT_IMAGE_SIZE, DEFAULT_IMAGE_SIZE, getTranslatedText(item.name_localized, currentLanguage))} alt={getTranslatedText(item.name_localized, currentLanguage)} className="w-full h-40 object-cover rounded-md mb-3" />
                        <h3 className="text-lg font-semibold text-slate-700">{getTranslatedText(item.name_localized, currentLanguage)}</h3>
                        <p className="text-sm text-slate-500">{item.quantity} {item.unit}</p>
                        <p className="text-sm text-slate-600 font-medium">{getUIText(UITranslationKeys.PRICE_LABEL, currentLanguage)}: {item.price.toFixed(2)}</p>
                         {canPerformAction('edit', 'ingredient', item) && (
                            <div className="mt-3 flex space-x-2">
                                <button onClick={() => openModal('ingredient', item)} className="p-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-800 rounded-md shadow hover:shadow-md transition-all text-xs" aria-label={`Edit ${getTranslatedText(item.name_localized, currentLanguage)}`}><PencilIcon className="w-4 h-4"/></button>
                                {canPerformAction('delete', 'ingredient', item) && <button onClick={() => handleDeleteIngredient(item.id)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow hover:shadow-md transition-all text-xs" aria-label={`Delete ${getTranslatedText(item.name_localized, currentLanguage)}`} disabled={isModalSubmitting}><TrashIcon className="w-4 h-4"/></button>}
                            </div>
                        )}
                    </div>
                )}
                onAdd={() => openModal('ingredient')}
                entityType="ingredient"
                canAdd={canPerformAction('add', 'ingredient')}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                currentUserPreferredLanguage={currentLanguage}
                hasItems={ingredients.length > 0}
                extraHeaderContent={
                  <>
                    <input type="file" ref={importIngredientsInputRef} onChange={handleImportIngredients} accept=".xlsx" style={{ display: 'none' }} id="import-ingredients-excel" />
                    <button onClick={() => importIngredientsInputRef.current?.click()} className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center text-sm" aria-label={importIngredientsButtonLabel}>
                        <ArrowUpTrayIcon className="w-4 h-4 mr-2" /> {importIngredientsButtonLabel}
                    </button>
                    <button onClick={handleExportIngredients} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center text-sm" aria-label={exportIngredientsButtonLabel}>
                        <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> {exportIngredientsButtonLabel}
                    </button>
                  </>
                }
            />;
        }
        case Page.Dishes: {
            const filteredDishes = dishes.filter(dish => getTranslatedText(dish.name_localized, currentLanguage).toLowerCase().includes(searchTerm.toLowerCase()));
            const importDishesButtonLabel = getUIText(UITranslationKeys.EXCEL_IMPORT_DISHES_BUTTON, currentLanguage);
            const exportDishesButtonLabel = getUIText(UITranslationKeys.EXCEL_EXPORT_DISHES_BUTTON, currentLanguage);
            return <CrudSection
                title={getUIText(UITranslationKeys.DISHES_PAGE_TITLE, currentLanguage)}
                items={filteredDishes}
                renderItem={(item: Dish) => {
                    const dishCost = item.ingredients.reduce((acc, dishIng) => {
                        const masterIng = ingredients.find(i => i.id === dishIng.ingredientId);
                        if(masterIng) {
                            const { quantity: convertedDishIngQty } = convertToBaseUnit(dishIng.quantity, masterIng.unit);
                            const { quantity: convertedMasterIngQty } = convertToBaseUnit(masterIng.quantity, masterIng.unit);
                            if(convertedMasterIngQty > 0) return acc + (convertedDishIngQty * (masterIng.price / convertedMasterIngQty));
                        }
                        return acc;
                    },0);
                    return (
                        <div key={item.id} className="bg-slate-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <img src={item.image_url || placeholderImage(DEFAULT_IMAGE_SIZE,DEFAULT_IMAGE_SIZE, getTranslatedText(item.name_localized, currentLanguage))} alt={getTranslatedText(item.name_localized, currentLanguage)} className="w-full h-40 object-cover rounded-md mb-3" />
                            <h3 className="text-lg font-semibold text-slate-700">{getTranslatedText(item.name_localized, currentLanguage)}</h3>
                            <p className="text-xs text-slate-500 mb-1 line-clamp-2" title={getTranslatedText(item.preparation_steps_localized, currentLanguage)}>Steps: {getTranslatedText(item.preparation_steps_localized, currentLanguage)}</p>
                            <p className="text-sm text-slate-600 font-medium">{getUIText(UITranslationKeys.DISH_COST_LABEL, currentLanguage, Language.EN, {cost: dishCost.toFixed(2)})}</p>
                            {canPerformAction('edit', 'dish', item) && (
                                <div className="mt-3 flex space-x-2">
                                    <button onClick={() => openModal('dish', item)} className="p-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-800 rounded-md shadow hover:shadow-md transition-all text-xs" aria-label={`Edit ${getTranslatedText(item.name_localized, currentLanguage)}`}><PencilIcon className="w-4 h-4"/></button>
                                    {canPerformAction('delete', 'dish', item) && <button onClick={() => handleDeleteDish(item.id)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow hover:shadow-md transition-all text-xs" aria-label={`Delete ${getTranslatedText(item.name_localized, currentLanguage)}`} disabled={isModalSubmitting}><TrashIcon className="w-4 h-4"/></button>}
                                </div>
                            )}
                        </div>
                    );
                }}
                onAdd={() => openModal('dish')}
                entityType="dish"
                canAdd={canPerformAction('add', 'dish')}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                currentUserPreferredLanguage={currentLanguage}
                hasItems={dishes.length > 0}
                extraHeaderContent={
                  <>
                    <input type="file" ref={importDishesInputRef} onChange={handleImportDishes} accept=".xlsx" style={{ display: 'none' }} id="import-dishes-excel" />
                    <button onClick={() => importDishesInputRef.current?.click()} className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center text-sm" aria-label={importDishesButtonLabel}>
                        <ArrowUpTrayIcon className="w-4 h-4 mr-2" /> {importDishesButtonLabel}
                    </button>
                    <button onClick={handleExportDishes} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center text-sm" aria-label={exportDishesButtonLabel}>
                        <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> {exportDishesButtonLabel}
                    </button>
                  </>
                }
            />;
        }
        case Page.CookingItems: {
            const filteredCookingItems = cookingItems.filter(ci => getTranslatedText(ci.name_localized, currentLanguage).toLowerCase().includes(searchTerm.toLowerCase()));
            const importCookingItemsButtonLabel = getUIText(UITranslationKeys.EXCEL_IMPORT_COOKING_ITEMS_BUTTON, currentLanguage);
            const exportCookingItemsButtonLabel = getUIText(UITranslationKeys.EXCEL_EXPORT_COOKING_ITEMS_BUTTON, currentLanguage);
            return <CrudSection
                title={getUIText(UITranslationKeys.COOKING_ITEMS_PAGE_TITLE, currentLanguage)}
                items={filteredCookingItems}
                renderItem={(item: CookingItem) => (
                    <div key={item.id} className="bg-slate-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <img src={item.image_url || placeholderImage(DEFAULT_IMAGE_SIZE,DEFAULT_IMAGE_SIZE, getTranslatedText(item.name_localized, currentLanguage))} alt={getTranslatedText(item.name_localized, currentLanguage)} className="w-full h-40 object-cover rounded-md mb-3" />
                        <h3 className="text-lg font-semibold text-slate-700">{getTranslatedText(item.name_localized, currentLanguage)}</h3>
                        <p className="text-xs text-slate-500 mb-1 line-clamp-2" title={getTranslatedText(item.summary_localized, currentLanguage)}>{getTranslatedText(item.summary_localized, currentLanguage)}</p>
                        <p className="text-sm text-slate-500">Unit: {item.unit}</p>
                        <p className="text-sm text-slate-600 font-medium">{getUIText(UITranslationKeys.PRICE_LABEL, currentLanguage)}: {item.price.toFixed(2)}</p>
                        {canPerformAction('edit', 'cookingItem', item) && (
                            <div className="mt-3 flex space-x-2">
                                <button onClick={() => openModal('cookingItem', item)} className="p-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-800 rounded-md shadow hover:shadow-md transition-all text-xs" aria-label={`Edit ${getTranslatedText(item.name_localized, currentLanguage)}`}><PencilIcon className="w-4 h-4"/></button>
                                {canPerformAction('delete', 'cookingItem', item) && <button onClick={() => handleDeleteCookingItem(item.id)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow hover:shadow-md transition-all text-xs" aria-label={`Delete ${getTranslatedText(item.name_localized, currentLanguage)}`} disabled={isModalSubmitting}><TrashIcon className="w-4 h-4"/></button>}
                            </div>
                        )}
                    </div>
                )}
                onAdd={() => openModal('cookingItem')}
                entityType="cookingItem"
                canAdd={canPerformAction('add', 'cookingItem')}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                currentUserPreferredLanguage={currentLanguage}
                hasItems={cookingItems.length > 0}
                extraHeaderContent={
                  <>
                    <input type="file" ref={importCookingItemsInputRef} onChange={handleImportCookingItems} accept=".xlsx" style={{ display: 'none' }} id="import-cooking-items-excel" />
                    <button onClick={() => importCookingItemsInputRef.current?.click()} className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center text-sm" aria-label={importCookingItemsButtonLabel}>
                        <ArrowUpTrayIcon className="w-4 h-4 mr-2" /> {importCookingItemsButtonLabel}
                    </button>
                    <button onClick={handleExportCookingItems} className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center text-sm" aria-label={exportCookingItemsButtonLabel}>
                        <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> {exportCookingItemsButtonLabel}
                    </button>
                  </>
                }
            />;
        }
        case Page.Customers:
            const customersToDisplay = currentUser?.role === UserRole.SUPREM ? customers : customers.filter(c => c.userId === currentUser?.id);
            const filteredCustomers = customersToDisplay.filter(cust => cust.name.toLowerCase().includes(searchTerm.toLowerCase()));
            return <CrudSection
                title="Customer Orders"
                items={filteredCustomers}
                renderItem={(item: Customer) => {
                    const orderCostText = item.generated_order_details ? getUIText(UITranslationKeys.ORDER_TOTAL_COST_LABEL, currentLanguage, Language.EN, {cost: item.generated_order_details.totalOrderCost.toFixed(2)}) : "Order not generated yet.";
                    const htmlOrderUrl = item.generated_order_details ? `/customer-order/${item.id}.html` : '#'; 
                    const whatsAppText = item.generated_order_details ? encodeURIComponent(`Order Summary for ${item.name}:\nTotal Cost: ₹${item.generated_order_details.totalOrderCost.toFixed(2)}\nView details: ${window.location.origin}${window.location.pathname}#/view-order/${item.id}`) : ''; 
                    return (
                        <div key={item.id} className="bg-slate-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <img src={item.image_url || placeholderImage(DEFAULT_IMAGE_SIZE,DEFAULT_IMAGE_SIZE, item.name)} alt={item.name} className="w-full h-40 object-cover rounded-md mb-3" />
                            <h3 className="text-lg font-semibold text-slate-700">{item.name}</h3>
                            <p className="text-sm text-slate-500">Persons: {item.number_of_persons}</p>
                            <p className="text-sm text-slate-500">Contact: {item.phone}</p>
                            <p className="text-sm text-slate-600 font-medium">{orderCostText}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {canPerformAction('edit', 'customer', item) && <button onClick={() => openModal('customer', item)} className="p-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-800 rounded-md shadow hover:shadow-md transition-all text-xs" aria-label={`Edit ${item.name}`}><PencilIcon className="w-4 h-4"/></button>}
                                {canPerformAction('delete', 'customer', item) && <button onClick={() => handleDeleteCustomer(item.id)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow hover:shadow-md transition-all text-xs" aria-label={`Delete ${item.name}`} disabled={isModalSubmitting}><TrashIcon className="w-4 h-4"/></button>}
                                <button onClick={() => handleGenerateOrder(item.id)} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow hover:shadow-md transition-all text-xs" aria-label={`Calculate Order for ${item.name}`} disabled={isModalSubmitting || !item.selectedDishes?.length}><CalculatorIcon className="w-4 h-4"/></button>
                                {item.generated_order_details && (
                                    <>
                                        <a href={htmlOrderUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-md shadow hover:shadow-md transition-all text-xs inline-flex items-center" aria-label={`View HTML Order for ${item.name}`} title={getUIText(UITranslationKeys.HTML_VIEW_ORDER_BUTTON, currentLanguage)}><DocumentTextIcon className="w-4 h-4"/></a>
                                        <button onClick={() => window.print()} className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md shadow hover:shadow-md transition-all text-xs" aria-label={`Print Order for ${item.name}`} title={getUIText(UITranslationKeys.PRINT_ORDER_BUTTON, currentLanguage)}><PrinterIcon className="w-4 h-4"/></button>
                                        <a href={`https://api.whatsapp.com/send?text=${whatsAppText}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-400 hover:bg-green-500 text-white rounded-md shadow hover:shadow-md transition-all text-xs inline-flex items-center" aria-label={`Share order for ${item.name} to WhatsApp`} title={getUIText(UITranslationKeys.SHARE_ORDER_WHATSAPP_BUTTON, currentLanguage)}><ShareIcon className="w-4 h-4"/></a>
                                    </>
                                )}
                            </div>
                            {item.generated_order_details && (
                                <div className="mt-4 pt-3 border-t border-slate-200">
                                    <h4 className="text-sm font-semibold text-slate-600 mb-1">Order Ingredients:</h4>
                                    {item.generated_order_details.cumulativeIngredients.length > 0 ? (
                                        <ul className="text-xs list-disc list-inside pl-2 space-y-0.5 max-h-24 overflow-y-auto">
                                        {item.generated_order_details.cumulativeIngredients.map(ci => (
                                            <li key={ci.id} className="flex justify-between items-center group">
                                                <span>{ci.name}: {ci.totalQuantity.toLocaleString()} {ci.unit} (₹{ci.totalPrice.toFixed(2)})</span>
                                                {canPerformAction('edit', 'orderIngredient', { customerUserId: item.userId }) &&
                                                    <button onClick={() => handleEditOrderIngredient(item.id, ci.id, false, {name: ci.name, quantity: ci.totalQuantity, unit: ci.unit, masterIngredientId: ci.masterIngredientId })} className="ml-2 p-0.5 bg-yellow-300 hover:bg-yellow-400 text-yellow-700 rounded opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Edit ${ci.name}`}><PencilIcon className="w-3 h-3"/></button>}
                                                {canPerformAction('delete', 'orderIngredient', { customerUserId: item.userId }) &&
                                                    <button onClick={() => handleDeleteOrderIngredient(item.id, ci.id)} className="ml-1 p-0.5 bg-red-400 hover:bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Delete ${ci.name}`} disabled={isModalSubmitting}><TrashIcon className="w-3 h-3"/></button>}
                                            </li>
                                        ))}
                                        </ul>
                                    ) : <p className="text-xs text-slate-400">No ingredients.</p>}
                                     {canPerformAction('add', 'orderIngredient', { customerUserId: item.userId }) && <button onClick={() => handleEditOrderIngredient(item.id, '', true)} className="mt-1 text-xs text-blue-500 hover:text-blue-700 flex items-center"><PlusIcon className="w-3 h-3 mr-1"/>{getUIText(UITranslationKeys.ADD_INGREDIENT_TO_ORDER_BUTTON, currentLanguage)}</button>}


                                    <h4 className="text-sm font-semibold text-slate-600 mt-2 mb-1">Order Cooking Items:</h4>
                                    {item.generated_order_details.selectedCookingItems.length > 0 ? (
                                        <ul className="text-xs list-disc list-inside pl-2 space-y-0.5 max-h-24 overflow-y-auto">
                                        {item.generated_order_details.selectedCookingItems.map(sci => (
                                             <li key={sci.id} className="flex justify-between items-center group">
                                                <span>{sci.name}: {sci.quantity} {sci.unit} (₹{sci.totalPrice.toFixed(2)})</span>
                                                {canPerformAction('edit', 'orderCookingItem', { customerUserId: item.userId }) &&
                                                    <button onClick={() => handleEditOrderCookingItem(item.id, sci.id, false, {masterCookingItemId: sci.masterCookingItemId, name: sci.name, quantity: sci.quantity, unit: sci.unit, price: sci.price })} className="ml-2 p-0.5 bg-yellow-300 hover:bg-yellow-400 text-yellow-700 rounded opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Edit ${sci.name}`}><PencilIcon className="w-3 h-3"/></button>}
                                                {canPerformAction('delete', 'orderCookingItem', { customerUserId: item.userId }) &&
                                                    <button onClick={() => handleDeleteOrderCookingItem(item.id, sci.id)} className="ml-1 p-0.5 bg-red-400 hover:bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Delete ${sci.name}`} disabled={isModalSubmitting}><TrashIcon className="w-3 h-3"/></button>}
                                            </li>
                                        ))}
                                        </ul>
                                    ) : <p className="text-xs text-slate-400">No cooking items.</p>}
                                    {canPerformAction('add', 'orderCookingItem', { customerUserId: item.userId }) && <button onClick={() => handleEditOrderCookingItem(item.id, '', true)} className="mt-1 text-xs text-blue-500 hover:text-blue-700 flex items-center"><PlusIcon className="w-3 h-3 mr-1"/>{getUIText(UITranslationKeys.ADD_COOKING_ITEM_TO_ORDER_BUTTON, currentLanguage)}</button>}
                                </div>
                            )}
                        </div>
                    );
                }}
                onAdd={() => openModal('customer')}
                entityType="customer"
                canAdd={canPerformAction('add', 'customer')}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                currentUserPreferredLanguage={currentLanguage}
                hasItems={customersToDisplay.length > 0}
            />;
        default: return <p>Page not found.</p>;
    }
  };


  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {currentUser && (
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-700 cursor-pointer" onClick={() => setCurrentPage(Page.Home)} style={{ fontFamily: "'Playfair Display', serif" }}>
              {currentUser.catering_name || APP_TITLE}
            </h1>
            <nav className="flex items-center space-x-3 sm:space-x-4 text-sm sm:text-base">
              {navigationItems.map(nav => (
                <button
                  key={nav.page}
                  onClick={() => setCurrentPage(nav.page)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors
                    ${currentPage === nav.page
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-blue-100 hover:text-blue-700'
                    }`}
                >
                  {nav.label}
                </button>
              ))}
              <div className="relative group">
                <button className="p-1.5 rounded-md text-slate-600 hover:bg-blue-100 hover:text-blue-700 transition-colors">
                  <CogIcon className="w-5 h-5" />
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl overflow-hidden z-20 hidden group-hover:block ring-1 ring-slate-200">
                    <button
                        onClick={() => setCurrentPage(Page.Profile)}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 transition-colors flex items-center"
                    >
                        <UserCircleIcon className="w-5 h-5 mr-2 text-slate-500"/> Edit Profile
                    </button>
                    <div className="px-4 py-2.5 border-t border-slate-200">
                        <label htmlFor="language-select-header" className="block text-xs text-slate-500 mb-1">Language</label>
                        <select 
                            id="language-select-header"
                            value={currentLanguage}
                            onChange={(e) => handleLanguageChange(e.target.value as Language)}
                            className="w-full p-2 text-sm border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            disabled={isModalSubmitting}
                        >
                            {SupportedLanguages.map(lang => (
                                <option key={lang} value={lang}>{LanguageLabelMapping[lang]}</option>
                            ))}
                        </select>
                    </div>
                     {currentUser.role === UserRole.SUPREM && (
                        <button
                            onClick={() => setCurrentPage(Page.UserManagement)}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 transition-colors flex items-center border-t border-slate-200"
                        >
                            <ShieldCheckIcon className="w-5 h-5 mr-2 text-slate-500"/> User Management
                        </button>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center border-t border-slate-200"
                    >
                        <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2"/> Logout
                    </button>
                </div>
              </div>
            </nav>
          </div>
        </header>
      )}

      {apiError && (
          <div className="fixed top-5 right-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-lg z-[150] max-w-md" role="alert">
              <div className="flex">
                  <InformationCircleIcon className="w-6 h-6 mr-2 text-red-600"/>
                  <div>
                      <strong className="font-bold">Error!</strong>
                      <span className="block sm:inline ml-1 text-sm">{apiError}</span>
                  </div>
                  <button onClick={clearApiError} className="ml-auto -mx-1.5 -my-1.5 bg-red-100 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8" aria-label="Dismiss error">
                      <XMarkIcon className="w-5 h-5"/>
                  </button>
              </div>
          </div>
      )}

      <main className={`p-4 sm:p-6 lg:p-8 ${!currentUser ? 'pt-0' : ''}`}>
        {renderPage()}
      </main>

      {modalOpen && modalType && (
        <Modal onClose={closeModal}>
          {modalType === 'ingredient' && <IngredientForm onSave={handleSaveIngredient} onCancel={closeModal} existingIngredient={editingItem as Ingredient | null} units={IngredientUnits} generateId={generateId} currentUserPreferredLanguage={currentLanguage} isSubmitting={isModalSubmitting}/>}
          {modalType === 'dish' && <DishForm onSave={handleSaveDish} onCancel={closeModal} existingDish={editingItem as Dish | null} ingredients={ingredients} generateId={generateId} currentUserPreferredLanguage={currentLanguage} isSubmitting={isModalSubmitting}/>}
          {modalType === 'cookingItem' && <CookingItemForm onSave={handleSaveCookingItem} onCancel={closeModal} existingCookingItem={editingItem as CookingItem | null} units={CookingItemUnits} generateId={generateId} currentUserPreferredLanguage={currentLanguage} isSubmitting={isModalSubmitting}/>}
          {modalType === 'customer' && <CustomerForm onSave={handleSaveCustomer} onCancel={closeModal} existingCustomer={editingItem as Customer | null} dishes={dishes} cookingItems={cookingItems} ingredients={ingredients} currentUserId={currentUser?.id} userRole={currentUser?.role} generateId={generateId} currentUserPreferredLanguage={currentLanguage} isSubmitting={isModalSubmitting}/>}
          {modalType === 'orderIngredient' && editingOrderContext && <OrderIngredientForm onSave={handleSaveOrderIngredient} onCancel={closeModal} context={editingOrderContext} masterIngredients={ingredients} ingredientUnits={IngredientUnits} currentUserPreferredLanguage={currentLanguage} isSubmitting={isModalSubmitting}/>}
          {modalType === 'orderCookingItem' && editingOrderCookingItemContext && <OrderCookingItemForm onSave={handleSaveOrderCookingItem} onCancel={closeModal} context={editingOrderCookingItemContext} masterCookingItems={cookingItems} currentUserPreferredLanguage={currentLanguage} isSubmitting={isModalSubmitting}/>}
        </Modal>
      )}
      
      {!currentUser && currentPage !== Page.PublicHome && currentPage !== Page.Login && currentPage !== Page.Signup && (
         <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg text-sm">
            <p>Debug: Not logged in, current page: {currentPage}</p>
            <button onClick={() => setCurrentPage(Page.PublicHome)} className="text-blue-500 hover:underline">Go to Public Home</button>
        </div>
      )}
    </div>
  );
};

export default App;