import React from 'react';
import { Menu } from 'lucide-react';

const FloatingMenu = () => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <button className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
        <Menu className="w-6 h-6 text-gray-700" />
      </button>
      <nav className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl hidden group-hover:block">
        <ul className="py-2">
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Home</li>
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">About</li>
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
        </ul>
      </nav>
    </div>
  );
};

export default FloatingMenu;