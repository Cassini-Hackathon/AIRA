import React from "react";
import Logo from "./Logo";
import { Menu, Bell } from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-secondary-200">
      <div className="flex items-center md:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-secondary-500 hover:text-secondary-600"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center ml-4">
          <Logo showText={false} />
        </div>
      </div>
      
      <div className="flex-1 px-4 mx-auto max-w-7xl"></div>
      
      <div className="flex items-center">
        <button className="p-1 text-secondary-500 hover:text-secondary-600">
          <Bell className="w-6 h-6" />
        </button>
        
        <div className="ml-3 relative">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 border border-red-300">
              <span className="font-medium text-sm">DB</span>
            </div>
            <div className="ml-2 hidden md:block">
              <div className="text-sm font-medium text-secondary-700">
                Dott. Bianchi
              </div>
              <div className="text-xs text-red-600">
                Direttore Emergenze
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
