import React from 'react';
import { Page } from '../types';
import { APP_TITLE, placeholderImage } from '../constants'; // Added placeholderImage import
import { ArrowLeftOnRectangleIcon, UserPlusIcon, AcademicCapIcon, PhoneIcon, SparklesIcon } from './icons';

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
      <section className="py-20 px-4 text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto">
          <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Effortless Catering Management
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Streamline your culinary operations from ingredients to customer orders.
            Join us and elevate your catering business today!
          </p>
          {/* "Get Started Free" button removed from here */}
        </div>
      </section>

      {/* Featured Dishes Visual Section - ADDED */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto text-center">
            <h3 className="text-3xl font-bold text-slate-800 mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>Taste Our Creations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <div className="rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 group">
                    <img src={placeholderImage(400, 300, 'delicious-pasta')} alt="Delicious Pasta Dish" className="w-full h-72 object-cover"/>
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                        <p className="text-white text-2xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">Hearty Pasta</p>
                    </div>
                </div>
                <div className="rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 group">
                    <img src={placeholderImage(400, 300, 'fresh-salad')} alt="Fresh Salad Bowl" className="w-full h-72 object-cover"/>
                     <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                        <p className="text-white text-2xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">Vibrant Salads</p>
                    </div>
                </div>
                <div className="rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 group">
                    <img src={placeholderImage(400, 300, 'gourmet-dessert')} alt="Gourmet Dessert" className="w-full h-72 object-cover"/>
                     <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                        <p className="text-white text-2xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">Exquisite Desserts</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose Us?</h2>
          <p className="text-slate-600 mb-12 max-w-xl mx-auto">
            Our platform provides all the tools you need to manage your catering business efficiently and professionally.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<SparklesIcon className="w-6 h-6" />}
              title="Ingredient & Dish Management"
              description="Keep track of all your ingredients and easily create complex dishes with precise measurements and preparation steps."
            />
            <FeatureCard
              icon={<SparklesIcon className="w-6 h-6" />}
              title="Customer Order Tracking"
              description="Manage customer orders, generate ingredient lists, and prepare shareable summaries with your branding."
            />
            <FeatureCard
              icon={<SparklesIcon className="w-6 h-6" />}
              title="Role-Based Access"
              description="Securely manage your team with distinct roles for Suprem Admins, Admins, and Users, controlling access to features."
            />
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
            <AcademicCapIcon className="w-16 h-16 text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">About {APP_TITLE}</h2>
            <p className="text-slate-600 mb-4">
              {APP_TITLE} was born from a passion for culinary excellence and a need for smarter catering solutions.
              We aim to empower caterers of all sizes with intuitive tools to manage their operations, reduce waste,
              and delight their customers.
            </p>
            <p className="text-slate-600">
              Our platform is constantly evolving, driven by user feedback and the latest industry trends.
              We believe in simplicity, efficiency, and the power of good food to bring people together.
            </p>
          </div>
          <div className="md:w-1/2">
            <img src={placeholderImage(600, 400, 'catering-team')} alt="Catering Team" className="rounded-lg shadow-xl w-full" />
          </div>
        </div>
      </section>
      
      {/* Contact Us Section */}
      <section id="contact" className="py-16 px-4 bg-slate-200">
        <div className="container mx-auto text-center">
          <PhoneIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Get In Touch</h2>
          <p className="text-slate-600 mb-8 max-w-lg mx-auto">
            Have questions or need support? We're here to help!
            <br />
            (Contact form functionality is a future enhancement.)
          </p>
          <div className="bg-white p-8 rounded-lg shadow-xl inline-block">
            <p className="text-slate-700 font-medium">Email: <a href="mailto:support@culinaryassistant.pro" className="text-blue-600 hover:underline">support@culinaryassistant.pro</a></p>
            <p className="text-slate-700 font-medium mt-2">Phone: <span className="text-blue-600">(123) 456-7890</span> (Placeholder)</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-slate-600 border-t border-slate-200">
        <p>&copy; {new Date().getFullYear()} {APP_TITLE}. All rights reserved.</p>
        <p className="text-xs mt-1">Culinary adventures simplified.</p>
      </footer>
    </div>
  );
};

export default PublicHomePage;