import { Bell, User } from "lucide-react";

const Header = () => {
  console.log("Header module loaded");

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <h1 className="text-xl font-semibold text-gray-900">Security Operations Center</h1>

      <div className="flex items-center space-x-4">
        <Bell className="w-5 h-5 text-gray-600" />
        <User className="w-5 h-5 text-gray-700" />
      </div>
    </header>
  );
};

export default Header;
