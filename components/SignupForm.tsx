import React, { useState } from 'react';
import { AuthUser, Language, LanguageLabels } from '../types'; 
import { EyeIcon, EyeSlashIcon, UserPlusIcon } from './icons';
import ImageInput from './ImageInput'; // Added

interface SignupFormProps {
  onSignup: (userData: Omit<AuthUser, 'id' | 'role' | 'isApproved' | 'credits'> & { email: string; preferredLanguage: Language }) => void;
  onSwitchToLogin: () => void;
  supportedLanguages: Language[];
  languageLabels: { [key in Language]: string };
}

const FormField: React.FC<{ label: string; children: React.ReactNode; error?: string; id?: string }> = ({ label, children, error, id }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1" role="alert">{error}</p>}
  </div>
);

const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onSwitchToLogin, supportedLanguages, languageLabels }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cateringName, setCateringName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Changed to string | null
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(Language.EN);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!username.trim()) newErrors.username = "Username is required.";
    if (username.length < 3 && username.trim()) newErrors.username = "Username must be at least 3 characters.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (!cateringName.trim()) newErrors.cateringName = "Catering name is required.";
    
    if(!email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format.";

    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\+?[0-9\s-]{7,15}$/.test(phone)) newErrors.phone = "Invalid phone number format.";
    if (!address.trim()) newErrors.address = "Address is required.";
    if (!preferredLanguage) newErrors.preferredLanguage = "Preferred language is required.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSignup({ username, password, cateringName, phone, address, email, imageUrl: imageUrl || undefined, preferredLanguage });
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-center mb-6">
        <UserPlusIcon className="w-16 h-16 text-blue-600" />
      </div>
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Username" id="signup-username" error={errors.username}>
          <input id="signup-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" required />
        </FormField>

        <FormField label="Password" id="signup-password" error={errors.password}>
          <div className="relative">
            <input id="signup-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-blue-600" aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </FormField>

        <FormField label="Confirm Password" id="signup-confirm-password" error={errors.confirmPassword}>
          <div className="relative">
          <input id="signup-confirm-password" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10" required />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-blue-600" aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
              {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </FormField>
        
        <FormField label="Catering Name" id="signup-cateringname" error={errors.cateringName}>
          <input id="signup-cateringname" type="text" value={cateringName} onChange={(e) => setCateringName(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" required />
        </FormField>

        <FormField label="Email Address" id="signup-email" error={errors.email}>
          <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" required />
        </FormField>

        <FormField label="Phone Number" id="signup-phone" error={errors.phone}>
          <input id="signup-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" required />
        </FormField>

        <FormField label="Address" id="signup-address" error={errors.address}>
          <textarea id="signup-address" value={address} onChange={(e) => setAddress(e.target.value)} rows={3}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" required />
        </FormField>

        <ImageInput 
            label="Profile Image (Optional)"
            idPrefix="signup-profile"
            currentImageUrl={imageUrl}
            onImageUrlChange={setImageUrl}
        />

        <FormField label="Preferred Language" id="signup-language" error={errors.preferredLanguage}>
            <select 
                id="signup-language"
                value={preferredLanguage} 
                onChange={(e) => setPreferredLanguage(e.target.value as Language)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
            >
                {supportedLanguages.map(lang => (
                    <option key={lang} value={lang}>{languageLabels[lang]}</option>
                ))}
            </select>
        </FormField>

        <button type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center text-base">
          <UserPlusIcon className="w-5 h-5 mr-2" /> Sign Up
        </button>
      </form>
      <p className="text-center text-sm text-slate-600 mt-8">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
          Login
        </button>
      </p>
    </div>
  );
};

export default SignupForm;
