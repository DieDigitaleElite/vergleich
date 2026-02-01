
import React from 'react';
import { ShoppingBag, Search, Menu, Heart } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Menu className="w-6 h-6 lg:hidden cursor-pointer" />
          <h1 className="text-2xl font-serif tracking-tighter">VOGUE AI</h1>
          <div className="hidden lg:flex space-x-6 text-sm font-medium">
            <a href="#" className="hover:text-gray-500">Damen</a>
            <a href="#" className="hover:text-gray-500">Herren</a>
            <a href="#" className="hover:text-gray-500">Trends</a>
            <a href="#" className="hover:text-gray-500">Sale</a>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Search className="w-5 h-5 cursor-pointer text-gray-600" />
          <Heart className="w-5 h-5 cursor-pointer text-gray-600" />
          <div className="relative cursor-pointer">
            <ShoppingBag className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">2</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
