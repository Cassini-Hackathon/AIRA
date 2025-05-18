import React from "react";
import Logo from "./Logo";
import { 
  Home, 
  Map, 
  AlertCircle, 
  Clipboard, 
  Users, 
  Settings 
} from "lucide-react";
import { Link, useLocation } from "wouter";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/maps", label: "Mappe", icon: Map },
    { href: "/emergencies", label: "Emergenze", icon: AlertCircle },
    { href: "/vehicles", label: "Mezzi", icon: Clipboard },
    { href: "/personnel", label: "Personale", icon: Users },
    { href: "/settings", label: "Impostazioni", icon: Settings },
  ];

  if (!isOpen) return null;

  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-secondary-200">
        <div className="flex items-center justify-center h-16 px-4 border-b border-secondary-200">
          <Logo />
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          {links.map((link) => {
            const isActive = location === link.href;
            const Icon = link.icon;
            
            return (
              <Link key={link.href} href={link.href}>
                <a
                  className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "text-white bg-primary-800"
                      : "text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900"
                  }`}
                >
                  <Icon className="w-6 h-6 mr-3" />
                  {link.label}
                </a>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
