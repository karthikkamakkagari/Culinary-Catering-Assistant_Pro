
import React from 'react';
import { Page } from '../types.ts';
import { APP_TITLE, placeholderImage } from '../constants.ts'; 
import { ArrowLeftOnRectangleIcon, UserPlusIcon, AcademicCapIcon, PhoneIcon, SparklesIcon } from './icons.tsx';

interface PublicHomePageProps {
  onNavigate: (page: Page) => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1">
    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm">{description}</p>
  </div>
);

const PublicHomePage: React.FC<PublicHomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-100 text-slate-800 selection:bg-blue-200">
      {/* Header */}
      <header className="py-6 px-4 sm:px-8 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-700" style={{ fontFamily: "'Playfair Display', serif" }}>
            {APP_TITLE}
          </h1>
          <div className="space-x-3">
            <button
              onClick={() => onNavigate(Page.Login)}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors flex items-center"
            >
              <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-2" /> Login
            </button>
            <button
              onClick={() => onNavigate(Page.Signup)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center"
            >
              <UserPlusIcon className="w-4 h-4 mr-2" /> Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
            Effortless Catering Management
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            From ingredients to invoices, manage your entire catering business in one powerful, intuitive platform.
          </p>
          <button
            onClick={() => onNavigate(Page.Signup)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all text-lg transform hover:scale-105"
          >
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Why You'll Love It</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<SparklesIcon className="w-6 h-6" />}
              title="Streamlined Workflow"
              description="Manage ingredients, create complex dishes, and handle customer orders with ease. Everything is connected."
            />
            <FeatureCard
              icon={<AcademicCapIcon className="w-6 h-6" />}
              title="Smart Calculations"
              description="Automatically calculate total ingredient needs and costs for any order size. No more manual spreadsheets."
            />
            <FeatureCard
              icon={<PhoneIcon className="w-6 h-6" />}
              title="Professional Output"
              description="Generate beautiful, professional-looking order summaries and invoices as PDFs to impress your clients."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 px-4">
        <div className="container mx-auto text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {APP_TITLE}. All Rights Reserved.</p>
          <p className="mt-2 opacity-70">A professional tool to elevate your catering services.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicHomePage;