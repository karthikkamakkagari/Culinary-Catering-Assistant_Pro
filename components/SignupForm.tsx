
import React, { useState } from 'react';
import { AuthUser, Language, LanguageLabels } from '../types.ts'; 
import { EyeIcon, EyeSlashIcon, UserPlusIcon } from './icons.tsx';
import ImageInput from './ImageInput.tsx';

interface SignupFormProps {
  onSignup: (userData: Omit<AuthUser, 'id' | 'role' | 'is_approved' | 'credits'>) => void; // Uses updated AuthUser
  onSwitchToLogin: () => void;
  supportedLanguages: Language[];
  languageLabels: { [key in Language]: string };
  isSigningUp: boolean; 
}

const FormField: React.FC<{ label: string; children: React.ReactNode; error?: string; id?: string }> = ({ label, children, error, id }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1" role="alert">{error}</p>}
  </div>
);

const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onSwitchToLogin, supportedLanguages, languageLabels, isSigningUp }) => {
  const [username, setUsername] = useState('');
  const [password_hash, setPasswordHash] = useState(''); // Updated: password to password_hash
  const [confirmPassword, setConfirmPassword] = useState('');
  const [catering_name, setCateringName] = useState(''); // Updated: cateringName to catering_name
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [image_url, setImageUrl] = useState<string | null>(null); // Updated: imageUrl to image_url
  const [preferred_language, setPreferredLanguage] = useState<Language>(Language.EN); // Updated: preferredLanguage to preferred_language
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!username.trim()) newErrors.username = "Username is required.";
    if (username.length < 3 && username.trim()) newErrors.username = "Username must be at least 3 characters.";
    if (!password_hash) newErrors.password_hash = "Password is required."; // Updated
    else if (password_hash.length < 6) newErrors.password_hash = "Password must be at least 6 characters."; // Updated
    if (password_hash !== confirmPassword) newErrors.confirmPassword = "Passwords do not match."; // Updated
    if (!catering_name.trim()) newErrors.catering_name = "Catering name is required."; // Updated
    if(!email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format.";
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^\+?[0-9\s-]{7,15}$/.test(phone)) newErrors.phone = "Invalid phone number format.";
    if (!address.trim()) newErrors.address = "Address is required.";
    if (!preferred_language) newErrors.preferred_language = "Preferred language is required."; // Updated
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSignup({ 
        username, 
        password_hash,  // Updated
        catering_name, // Updated
        phone, 
        address, 
        email, 
        image_url: image_url || undefined, // Updated
        preferred_language // Updated
      });
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex justify-center mb-6">
        <UserPlusIcon className="w-16 h-16 text-blue-600" />
      </div>
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Username" id="signup-username" error={errors.username}>
          <input id="signup-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" required disabled={isSigningUp} />
        </FormField>

        <FormField label="Password" id="signup-password" error={errors.password_hash}> {/* Updated */}
          <div className="relative">
            <input id="signup-password" type={showPassword ? 'text' : 'password'} value={password_hash} onChange={(e) => setPasswordHash(e.target.value)} // Updated
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10" required disabled={isSigningUp}/>
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-blue-600" aria-label={showPassword ? "Hide password" : "Show password"} disabled={isSigningUp}>
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </FormField>

        <FormField label="Confirm Password" id="signup-confirm-password" error={errors.confirmPassword}>
          <div className="relative">
          <input id="signup-confirm-password" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10" required disabled={isSigningUp}/>
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-blue-600" aria-label={showConfirmPassword ? "Hide password" : "Show password"} disabled={isSigningUp}>
              {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </FormField>
        
        <FormField label="Catering Name" id="signup-cateringname" error={errors.catering_name}> {/* Updated */}
          <input id="signup-cateringname" type="text" value={catering_name} onChange={(e) => setCateringName(e.target.value)} // Updated
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" required disabled={isSigningUp}/>
        </FormField>

        <FormField label="Email Address" id="signup-email" error={errors.email}>
          <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" required disabled={isSigningUp}/>
        </FormField>

        <FormField label="Phone Number" id="signup-phone" error={errors.phone}>
          <input id="signup-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" required disabled={isSigningUp}/>
        </FormField>

        <FormField label="Address" id="signup-address" error={errors.address}>
          <textarea id="signup-address" value={address} onChange={(e) => setAddress(e.target.value)} rows={3}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" required disabled={isSigningUp}/>
        </FormField>

        <ImageInput 
            label="Profile Image (Optional)"
            idPrefix="signup-profile"
            currentImageUrl={image_url} // Updated
            onImageUrlChange={setImageUrl} // Updated
        />

        <FormField label="Preferred Language" id="signup-language" error={errors.preferred_language}> {/* Updated */}
            <select 
                id="signup-language"
                value={preferred_language} // Updated
                onChange={(e) => setPreferredLanguage(e.target.value as Language)} // Updated
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                disabled={isSigningUp}
            >
                {supportedLanguages.map(lang => (
                    <option key={lang} value={lang}>{languageLabels[lang]}</option>
                ))}
            </select>
        </FormField>

        <button type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center text-base disabled:opacity-75 disabled:cursor-not-allowed"
          disabled={isSigningUp}
        >
          <UserPlusIcon className="w-5 h-5 mr-2" /> 
          {isSigningUp ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center text-sm text-slate-600 mt-8">
        Already have an account?{' '}
        <button 
            onClick={onSwitchToLogin} 
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline disabled:text-slate-400 disabled:no-underline"
            disabled={isSigningUp}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default SignupForm;