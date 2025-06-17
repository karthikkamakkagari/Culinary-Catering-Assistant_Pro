
import React, { useState } from 'react';
import { AuthUser, UserRole, Language, LanguageLabels } from '../types'; 
import { CheckCircleIcon, InformationCircleIcon } from './icons'; 

interface UserManagementPageProps {
    users: AuthUser[];
    currentUser: AuthUser; 
    onApproveUser: (userId: string, role: UserRole) => void;
    onSetUserCredits: (userId: string, credits: number) => void;
    onViewUser: (user: AuthUser) => void;
    languageLabels: { [key in Language]: string };
    supportedLanguages: Language[]; // Added
    onUpdateUserLanguage: (userId: string, language: Language) => void; // Added
}

const UserManagementPage: React.FC<UserManagementPageProps> = ({ 
    users: allUsers, 
    currentUser, 
    onApproveUser, 
    onSetUserCredits, 
    onViewUser,
    languageLabels,
    // supportedLanguages, // Not directly used here, but passed to UserDetailsView if needed there
    // onUpdateUserLanguage // Not directly used here, but passed to UserDetailsView
}) => {
    const [roleToAssign, setRoleToAssign] = useState<{ [userId: string]: UserRole }>({});
    const [creditsToSet, setCreditsToSet] = useState<{ [userId: string]: string }>({}); 
    
    const otherUsers = allUsers.filter(u => u.id !== currentUser.id);

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        setRoleToAssign(prev => ({ ...prev, [userId]: newRole }));
    };
    const handleCreditInputChange = (userId: string, value: string) => {
        setCreditsToSet(prev => ({ ...prev, [userId]: value }));
    };
    const submitCredits = (userId: string) => {
        const creditStringValue = creditsToSet[userId] !== undefined 
            ? creditsToSet[userId] 
            : (allUsers.find(u => u.id === userId)?.credits.toString() || '0');

        const creditsValue = parseInt(creditStringValue, 10);
        
        if (!isNaN(creditsValue) && creditsValue >= 0) {
            onSetUserCredits(userId, creditsValue);
        } else {
            alert("Please enter a valid non-negative number for credits.");
        }
    };

    if (otherUsers.length === 0) {
        return <p className="text-center text-slate-500 py-8 text-lg">No other users registered yet.</p>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">User Management</h2>
        <div className="space-y-4">
            {otherUsers.map(user => (
            <div key={user.id} className="p-4 border border-slate-200 rounded-lg shadow-sm bg-slate-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-slate-700">
                            {user.username} 
                            <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${user.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {user.isApproved ? `Approved (${user.role})` : 'Pending Approval'}
                            </span>
                        </h3>
                        <p className="text-sm text-slate-600">Catering: {user.cateringName}</p>
                        <p className="text-sm text-slate-500">Email: {user.email}</p>
                        <p className="text-sm text-slate-500">Current Credits: {user.credits}</p>
                        <p className="text-sm text-slate-500">Language: {languageLabels[user.preferredLanguage]}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                        {!user.isApproved && (
                            <div className="flex items-center gap-2">
                                <select 
                                    value={roleToAssign[user.id] || UserRole.USER} 
                                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                    className="p-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                                    aria-label={`Assign role to ${user.username}`}
                                >
                                    <option value={UserRole.USER}>User</option>
                                    <option value={UserRole.ADMIN}>Admin</option>
                                    <option value={UserRole.SUPREM}>Suprem</option>
                                </select>
                                <button 
                                    onClick={() => onApproveUser(user.id, roleToAssign[user.id] || UserRole.USER)} 
                                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors"
                                >
                                    <CheckCircleIcon className="w-4 h-4 mr-1" /> Approve & Set Role
                                </button>
                            </div>
                        )}
                         <button 
                            onClick={() => onViewUser(user)} 
                            className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-md text-sm flex items-center justify-center transition-colors"
                            title="View User Details"
                        >
                            <InformationCircleIcon className="w-4 h-4 mr-1" /> View Details
                        </button>
                    </div>
                </div>
                 <div className="mt-3 flex items-center gap-2 border-t border-slate-200 pt-3">
                    <label htmlFor={`credits-${user.id}`} className="text-sm font-medium text-slate-700 whitespace-nowrap">Set Credits:</label>
                    <input 
                        type="number"
                        id={`credits-${user.id}`}
                        value={creditsToSet[user.id] === undefined ? user.credits.toString() : creditsToSet[user.id]}
                        onChange={(e) => handleCreditInputChange(user.id, e.target.value)}
                        className="w-24 p-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                    />
                    <button 
                        onClick={() => submitCredits(user.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md text-sm transition-colors"
                    >
                        Set
                    </button>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
};

export default UserManagementPage;