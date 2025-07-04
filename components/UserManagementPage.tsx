
import React, { useState } from 'react';
import { AuthUser, UserRole, Language, LanguageLabels } from '../types.ts'; 
import { CheckCircleIcon, InformationCircleIcon } from './icons.tsx'; 

interface UserManagementPageProps {
    users: AuthUser[];
    currentUser: AuthUser; 
    onApproveUser: (userId: string, role: UserRole) => void;
    onSetUserCredits: (userId: string, credits: number) => void;
    onViewUser: (user: AuthUser) => void;
    languageLabels: { [key in Language]: string };
    supportedLanguages: Language[]; 
    onUpdateUserLanguage: (userId: string, language: Language) => void; 
}

const UserManagementPage: React.FC<UserManagementPageProps> = ({ 
    users: allUsers, 
    currentUser, 
    onApproveUser, 
    onSetUserCredits, 
    onViewUser,
    languageLabels,
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
                    <div key={user.id} className="p-4 border border-slate-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                            <button onClick={() => onViewUser(user)} className="text-lg font-semibold text-blue-600 hover:underline">{user.username}</button>
                            <p className="text-sm text-slate-500">{user.email}</p>
                            <p className="text-sm text-slate-600">Role: <span className="font-medium">{user.role}</span></p>
                            <p className="text-sm text-slate-600">Credits: <span className="font-medium">{user.credits}</span></p>
                            <p className="text-sm text-slate-600">Language: <span className="font-medium">{languageLabels[user.preferred_language]}</span></p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                            {!user.is_approved ? (
                                <div className="flex items-center gap-2 w-full">
                                    <select
                                        value={roleToAssign[user.id] || UserRole.USER}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                                        className="p-2 border border-slate-300 rounded-md text-sm w-full sm:w-auto"
                                    >
                                        <option value={UserRole.USER}>User</option>
                                        <option value={UserRole.ADMIN}>Admin</option>
                                    </select>
                                    <button
                                        onClick={() => onApproveUser(user.id, roleToAssign[user.id] || UserRole.USER)}
                                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg shadow-md flex items-center justify-center"
                                    >
                                        <CheckCircleIcon className="w-5 h-5" />
                                        <span className="ml-2 hidden sm:inline">Approve</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <InformationCircleIcon className="w-5 h-5 text-green-600" />
                                    <span className="text-sm text-green-700 font-medium">Approved</span>
                                </div>
                            )}
                             <div className="flex items-center gap-2 w-full">
                                <input
                                    type="number"
                                    id={`credits-${user.id}`}
                                    value={creditsToSet[user.id] !== undefined ? creditsToSet[user.id] : user.credits}
                                    onChange={(e) => handleCreditInputChange(user.id, e.target.value)}
                                    className="w-24 p-2 border border-slate-300 rounded-md text-sm"
                                    placeholder="Credits"
                                    min="0"
                                />
                                <button
                                    onClick={() => submitCredits(user.id)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md text-sm"
                                >
                                    Set Credits
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserManagementPage;