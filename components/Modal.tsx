
import React, { useEffect, useState } from 'react';
import { XMarkIcon } from './icons';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Component has mounted, set to visible to trigger transition
    // A small timeout can sometimes help ensure the transition is smooth,
    // but often setting it directly in useEffect works well.
    const timerId = setTimeout(() => setIsVisible(true), 10); // Slight delay for styles to apply
    return () => clearTimeout(timerId);
  }, []); 

  // Handle Escape key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-[100] p-4"
      onClick={onClose} // Close on backdrop click
    >
      <div 
        className={`
          bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] 
          overflow-y-auto relative transform transition-all duration-300 ease-out
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal content
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 transition-colors p-1 rounded-full hover:bg-slate-100"
          aria-label="Close modal"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        {children}
      </div>
      {/* 
        The <style jsx global> block and .animate-modalShow class have been removed.
        The animation is now handled by Tailwind's transition utilities 
        (transition-all, duration-300, ease-out) and the conditional classes 
        for opacity and scale based on the 'isVisible' state.
      */}
    </div>
  );
};

export default Modal;
