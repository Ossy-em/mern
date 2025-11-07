import React from "react";
import { Home, Plus, ShoppingBag } from "lucide-react";

export type ViewType = "home" | "create";

interface NavbarProps {
  currentView: ViewType;
  setCurrentView: React.Dispatch<React.SetStateAction<ViewType>>;
}

export default function Navbar({ currentView, setCurrentView }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">

          <button
            onClick={() => setCurrentView("home")}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-sky-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              StoreHub
            </span>
          </button>


          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView("home")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                currentView === "home"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <button
              onClick={() => setCurrentView("create")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                currentView === "create"
                  ? "bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
