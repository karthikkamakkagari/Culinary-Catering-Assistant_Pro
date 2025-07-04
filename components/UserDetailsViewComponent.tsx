
import React, { useState, useEffect } from 'react';
import { AuthUser, Language, LanguageLabels } from '../types.ts'; 
import { placeholderImage } from '../constants.ts'; 
import { UserCircleIcon, ArrowLeftIcon, PencilIcon } from './icons.tsx'; 
import ImageInput from './ImageInput.tsx';

interface UserDetailsViewProps {
    user: AuthUser | null;
    onBack: () => void;
    onSetUserCredits: (userId: string, credits: number) => void;
    languageLabels: { [key in Language]: string };
    supportedLanguages: Language[];
    onUpdateUserLanguage: (userId: string, language: Language) => void;
    onUpdateUserDetailsBySuprem: (userId: string, updatedDetails: Partial<Pick<AuthUser, 'username' | 'catering_name' | 'phone' | 'address' | 'email' | 'image_url'>>) => void;
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
    const [editable_catering_name, setEditableCateringName] = useState('');
    const [editablePhone, setEditablePhone] = useState('');
    const [editableAddress, setEditableAddress] = useState('');
    const [editableEmail, setEditableEmail] = useState('');
    const [editableImageUrl, setEditableImageUrl] = useState<string | null>('');
    
    const [creditsInput, setCreditsInput] = useState<string>('');
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.EN);

    useEffect(() => {
        if (user) {
            setEditableUsername(user.username);
            setEditableCateringName(user.catering_name);
            setEditablePhone(user.phone);
            setEditableAddress(user.address);
            setEditableEmail(user.email);
            setEditableImageUrl(user.image_url || null);
            setCreditsInput(user.credits.toString());
            setSelectedLanguage(user.preferred_language);
        }
    }, [user]);

    if (!user) {
        return (
            <div>
                <button onClick={onBack} className="flex items-center text-blue-600 hover:underline mb-4">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" /> Back
                </button>
                <p>No user selected.</p>
            </div>
        );
    }

    const handleDetailsSave = () => {
        const updatedDetails: Partial<Pick<AuthUser, 'username' | 'catering_name' | 'phone' | 'address' | 'email' | 'image_url'>> = {
            username: editableUsername,
            catering_name: editable_catering_name,
            phone: editablePhone,
            address: editableAddress,
            email: editableEmail,
            image_url: editableImageUrl || undefined
        };
        onUpdateUserDetailsBySuprem(user.id, updatedDetails);
    };

    const handleCreditsSet = () => {
        const creditsValue = parseInt(creditsInput, 10);
        if (!isNaN(creditsValue) && creditsValue >= 0) {
            onSetUserCredits(user.id, creditsValue);
        } else {
            alert("Please enter a valid non-negative number for credits.");
        }
    };

    const handleLanguageUpdate = () => {
        onUpdateUserLanguage(user.id, selectedLanguage);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl">
            <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-6 group">
                <ArrowLeftIcon className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to User Management
            </button>
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <img src={editableImageUrl || placeholderImage(100, 100, user.username)} alt={user.username} className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-200" />
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">{user.username}</h2>
                    <p className="text-slate-500">{user.role}</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* User Details Editing */}
                <div className="p-4 border border-slate-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Edit User Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="detail-username" className="block text-sm font-medium text-slate-600">Username</label>
                            <input id="detail-username" type="text" value={editableUsername} onChange={e => setEditableUsername(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="detail-catering" className="block text-sm font-medium text-slate-600">Catering Name</label>
                            <input id="detail-catering" type="text" value={editable_catering_name} onChange={e => setEditableCateringName(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-md"/>
                        </div>
                        <div>
                            <label htmlFor="detail-email" className="block text-sm font-medium text-slate-600">Email</label>
                            <input id="detail-email" type="email" value={editableEmail} onChange={e => setEditableEmail(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-md"/>
                        </div>
                         <div>
                            <label htmlFor="detail-phone" className="block text-sm font-medium text-slate-600">Phone</label>
                            <input id="detail-phone" type="tel" value={editablePhone} onChange={e => setEditablePhone(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-md"/>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="detail-address" className="block text-sm font-medium text-slate-600">Address</label>
                            <textarea id="detail-address" value={editableAddress} onChange={e => setEditableAddress(e.target.value)} rows={2} className="mt-1 w-full p-2 border border-slate-300 rounded-md"/>
                        </div>
                        <div className="md:col-span-2">
                            <ImageInput label="User Image" idPrefix="user-details" currentImageUrl={editableImageUrl} onImageUrlChange={setEditableImageUrl} />
                        </div>
                    </div>
                    <button onClick={handleDetailsSave} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center">
                        <PencilIcon className="w-4 h-4 mr-2"/> Save Details
                    </button>
                </div>

                {/* Credits Management */}
                <div className="p-4 border border-slate-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Manage Credits</h3>
                     <div className="flex items-center gap-2">
                        <label htmlFor={`credits-${user.id}`} className="text-sm font-medium text-slate-700 whitespace-nowrap">Set Credits:</label>
                        <input type="number" id={`credits-${user.id}`} value={creditsInput} onChange={e => setCreditsInput(e.target.value)} className="w-24 p-2 border border-slate-300 rounded-md text-sm" min="0"/>
                        <button onClick={handleCreditsSet} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md text-sm transition-colors">Set</button>
                    </div>
                </div>
                
                {/* Language Management */}
                <div className="p-4 border border-slate-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Manage Language</h3>
                     <div className="flex items-center gap-2">
                        <label htmlFor={`language-${user.id}`} className="text-sm font-medium text-slate-700 whitespace-nowrap">Preferred Language:</label>
                        <select id={`language-${user.id}`} value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value as Language)} className="p-2 border border-slate-300 rounded-md text-sm">
                            {supportedLanguages.map(lang => (
                                <option key={lang} value={lang}>{languageLabels[lang]}</option>
                            ))}
                        </select>
                        <button onClick={handleLanguageUpdate} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md text-sm transition-colors">Update Language</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsViewComponent;