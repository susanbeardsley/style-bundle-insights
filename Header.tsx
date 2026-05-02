'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Menu, 
  X, 
  Gift, 
  Heart, 
  Users, 
  Package, 
  Grid3X3,
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onSearch?: (query: string) => void;
  isAdmin?: boolean;
  onLogout?: () => void;
}

const navigation = [
  { name: 'Matrix', href: '/', icon: Grid3X3 },
  { name: 'Occasions', href: '/occasions', icon: Gift },
  { name: 'Sentiments', href: '/sentiments', icon: Heart },
  { name: 'Personas', href: '/personas', icon: Users },
  { name: 'Bundles', href: '/bundles', icon: Package },
];

export default function Header({ onSearch, isAdmin = false, onLogout }: HeaderProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-ivory-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-kraft-500 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-serif font-semibold text-charcoal-600">Style Bundle</h1>
              <p className="text-xs text-charcoal-400">Gifting Insights Engine</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'nav-link flex items-center gap-2',
                    isActive && 'nav-link-active'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Search className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                searchFocused ? "text-gold-500" : "text-charcoal-300"
              )} />
              <input
                type="text"
                placeholder="Search occasions, sentiments, bundles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-64 lg:w-80 pl-10 pr-4 py-2 bg-ivory-100 border border-ivory-300 rounded-lg text-sm text-charcoal-500 placeholder-charcoal-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent focus:bg-white transition-all"
              />
            </form>

            {/* Admin Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  'nav-link flex items-center gap-2',
                  pathname.startsWith('/admin') && 'nav-link-active'
                )}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden lg:inline">Admin</span>
              </Link>
            )}

            {/* Logout */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="nav-link flex items-center gap-2 text-charcoal-400 hover:text-red-500"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-charcoal-500 hover:bg-ivory-200 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-ivory-200 animate-fadeIn">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input pl-10"
              />
            </form>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'nav-link flex items-center gap-3 py-3',
                      isActive && 'nav-link-active'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'nav-link flex items-center gap-3 py-3',
                    pathname.startsWith('/admin') && 'nav-link-active'
                  )}
                >
                  <Settings className="w-5 h-5" />
                  Admin Panel
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
