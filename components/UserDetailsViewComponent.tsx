
import React, { useState, useEffect } from 'react';
import { AuthUser, Language, LanguageLabels } from '../types'; // Adjust path as necessary
import { placeholderImage } from '../constants'; // Adjust path as necessary
import { UserCircleIcon, ArrowLeftIcon, PencilIcon } from './icons'; // Adjust path as necessary

interface UserDetailsViewProps {
    user: AuthUser | null;
    onBack: () => void;
    onSetUserCredits: (userId: string, credits: number) => void;
    languageLabels: { [key in Language]: string };
    supportedLanguages: Language[];
    onUpdateUserLanguage: (userId: string, language: Language) => void;
    onUpdateUserDetailsBySuprem: (userId: string, updatedDetails: Partial<Pick<AuthUser, 'username' | 'cateringName' | 'phone' | 'address' | 'email'>>) => void;
}

const UserDetailsViewComponent: React.FC<UserDetailsViewProps> = ({ 
    user, 
    onBack, 
    onSetUserCredits,
    languageLabels,
    supportedLanguages,
    onUpdateUserLanguage,
    onUpdateUserDetailsBySuprem
}) => {
    const [editableUsername, setEditableUsername] = useState('');
    const [editableCateringName, setEditableCateringName] = useState('');
    const [editablePhone, setEditablePhone] = useState('');
    const [editableAddress, setEditableAddress] = useState('');
    const [editableEmail, setEditableEmail] = useState('');
    
    const [creditsInput, setCreditsInput] = useState<string>('');
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.EN);

    useEffect(() => {
        if (user) {
            setEditableUsername(user.username);
            setEditableCateringName(user.cateringName);
            setEditablePhone(user.phone);
            setEditableAddress(user.address);
            setEditableEmail(user.email);
            setCreditsInput(user.credits.toString());
            setSelectedLanguage(user.preferredLanguage);
        }
    }, [user]);

    if (!user) return <p className="text-center text-slate-500">User not found.</p>;

    const handleSaveChanges = () => {
        // Basic validation (can be expanded)
        if (!editableUsername.trim() || !editableCateringName.trim() || !editableEmail.trim()) {
            alert("Username, Catering Name, and Email cannot be empty.");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(editableEmail)) {
            alert("Invalid email format.");
            return;
        }

        onUpdateUserDetailsBySuprem(user.id, {
            username: editableUsername,
            cateringName: editableCateringName,
            phone: editablePhone,
            address: editableAddress,
            email: editableEmail,
        });
    };

    const handleSetCredits = () => {
        const numCredits = parseInt(creditsInput, 10);
        if (!isNaN(numCredits) && numCredits >= 0) {
            onSetUserCredits(user.id, numCredits);
        } else {
            alert("Please enter a valid non-negative number for credits.");
        }
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value as Language;
        setSelectedLanguage(newLang); 
        onUpdateUserLanguage(user.id, newLang); 
    };
    
    const FormField: React.FC<{ label: string, children: React.ReactNode, id: string }> = ({ label, children, id }) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-0.5">{label}</label>
            {children}
        </div>
    );

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-slate-800 flex items-center">
                    <UserCircleIcon className="w-8 h-8 mr-3 text-blue-600"/>
                    User Details
                </h2>
                <button
                    onClick={onBack}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-1" /> Back to User List
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-1 flex justify-center md:justify-start items-center">
                    <img 
                        src={user.imageUrl || placeholderImage(150, 150, user.username)} 
                        alt={user.username} 
                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shadow-lg border-4 border-slate-200"
                    />
                </div>
                <div className="md:col-span-2 space-y-3">
                     <FormField label="Username" id="udetail-username">
                        <input type="text" id="udetail-username" value={editableUsername} onChange={(e) => setEditableUsername(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </FormField>
                     <FormField label="Catering Name" id="udetail-cateringname">
                        <input type="text" id="udetail-cateringname" value={editableCateringName} onChange={(e) => setEditableCateringName(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </FormField>
                </div>
            </div>
            
            <div className="space-y-4 border-t border-slate-200 pt-6">
                <FormField label="Email" id="udetail-email">
                    <input type="email" id="udetail-email" value={editableEmail} onChange={(e) => setEditableEmail(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </FormField>
                <FormField label="Phone" id="udetail-phone">
                    <input type="tel" id="udetail-phone" value={editablePhone} onChange={(e) => setEditablePhone(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </FormField>
                <FormField label="Address" id="udetail-address">
                    <textarea id="udetail-address" value={editableAddress} onChange={(e) => setEditableAddress(e.target.value)} rows={3} className="w-full p-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </FormField>

                <p><strong>Role:</strong> <span className="font-semibold text-blue-600">{user.role}</span></p>
                <p><strong>Status:</strong> 
                    <span className={`ml-1 font-medium px-2 py-0.5 rounded-full text-xs ${user.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {user.isApproved ? 'Approved' : 'Pending Approval'}
                    </span>
                </p>
                <div className="flex items-center gap-2 pt-2">
                    <label htmlFor="user-detail-credits" className="font-medium text-slate-700">Credits:</label>
                    <input 
                        type="number"
                        id="user-detail-credits"
                        value={creditsInput}
                        onChange={(e) => setCreditsInput(e.target.value)}
                        className="w-24 p-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                    />
                    <button 
                        onClick={handleSetCredits}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md text-sm transition-colors"
                    >
                        Set Credits
                    </button>
                </div>
                 <div className="flex items-center gap-2 pt-2">
                    <label htmlFor="user-pref-lang" className="font-medium text-slate-700">Preferred Language:</label>
                    <select 
                        id="user-pref-lang"
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                        className="p-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        {supportedLanguages.map(lang => (
                            <option key={lang} value={lang}>{languageLabels[lang]}</option>
                        ))}
                    </select>
                </div>
                <div className="pt-4 text-right">
                    <button 
                        onClick={handleSaveChanges}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center ml-auto"
                    >
                        <PencilIcon className="w-4 h-4 mr-2" /> Save User Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsViewComponent;