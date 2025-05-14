'use client'; // Required for Reown AppKit components

import Link from 'next/link';
// Removed Reown's ConnectButton import as it's used as a web component

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 bg-brand-charcoal/80 backdrop-blur-md shadow-md md:px-6">
      <Link href="/" className="flex items-center">
        {/* Placeholder for SVG Logo */}
        <div className="w-8 h-8 mr-2 bg-brand-teal rounded-full"></div>
        <span className="text-xl font-semibold text-white">Schnell</span>
      </Link>
      <nav className="hidden space-x-4 md:flex">
        <Link href="/bridge" className="text-sm font-medium text-gray-300 hover:text-brand-teal">
          Bridge
        </Link>
        <Link href="/#" className="text-sm font-medium text-gray-300 hover:text-brand-teal">
          Pool
        </Link>
        <Link href="/#" className="text-sm font-medium text-gray-300 hover:text-brand-teal">
          Rewards
        </Link>
        <Link href="/#" className="text-sm font-medium text-gray-300 hover:text-brand-teal">
          Transactions
        </Link>
      </nav>
      <div className="hidden md:block">
        <w3m-button />
      </div>
      <div className="md:hidden">
        {/* Placeholder for Hamburger Menu Icon */}
        <button className="p-2 text-gray-300 rounded-md hover:text-brand-teal hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;