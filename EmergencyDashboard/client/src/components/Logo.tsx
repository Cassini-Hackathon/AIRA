import React from "react";

interface LogoProps {
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ showText = true }) => {
  return (
    <div className="flex items-center">
      <div className="w-8 h-8 bg-primary-800 rounded-md flex items-center justify-center">
        <span className="text-white text-lg font-bold">ER</span>
      </div>
      {showText && (
        <span className="ml-2 text-lg font-semibold text-secondary-800">
          EmergencyResponse
        </span>
      )}
    </div>
  );
};

export default Logo;
