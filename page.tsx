'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import OccasionSentimentMatrix from '@/components/OccasionSentimentMatrix';
import SearchResults from '@/components/SearchResults';
import LoginForm from '@/components/LoginForm';
import { DataProvider, useData } from '@/components/DataProvider';
import { globalSearch } from '@/lib/data-loader';
import { validatePassword, createSessionCookie, getSessionFromCookie, AuthSession } from '@/lib/auth';
import { Sparkles, TrendingUp, Gift, Heart, Users, Package } from 'lucide-react';

function HomeContent() {
  const router = useRouter();
  const data = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof globalSearch> | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session
  useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('sb_session='))
      ?.split('=')[1];
    
    const existingSession = getSessionFromCookie(cookieValue);
    if (existingSession) {
      setSession(existingSession);
    }
    setLoading(false);
  }, []);

  const handleLogin = async (password: string): Promise<boolean> => {
    const newSession = validatePassword(password);
    if (newSession) {
      const cookie = createSessionCookie(newSession);
      document.cookie = `sb_session=${cookie}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
      setSession(newSession);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    document.cookie = 'sb_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setSession(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = globalSearch(query);
      setSearchResults(results);
    }
  };

  const handleOccasionClick = (occasion: any) => {
    router.push(`/occasions/${occasion.slug}`);
  };

  const handleSentimentClick = (sentiment: any) => {
    router.push(`/sentiments/${sentiment.slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-charcoal-400">Loading Gifting Insights Engine...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (!data.loaded) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-charcoal-400">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-100">
      <Header 
        onSearch={handleSearch} 
        isAdmin={session.role === 'admin'}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ivory-50 via-white to-kraft-50 border-b border-ivory-300">
        {/* Wave Pattern Background */}
        <div className="absolute inset-0 opacity-30">
          <svg className="absolute bottom-0 w-full h-32" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L48 65C96 70 192 80 288 75C384 70 480 50 576 45C672 40 768 50 864 60C960 70 1056 80 1152 75C1248 70 1344 50 1392 40L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V60Z" fill="#D4AF37" fillOpacity="0.1"/>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-gold-500" />
              <span className="text-sm font-medium text-gold-600 uppercase tracking-wider">
                Internal Tool
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-charcoal-600 mb-4">
              Gifting Insights Engine
            </h1>
            <p className="text-lg text-charcoal-400 leading-relaxed">
              Your source of truth for navigating Australian gifting occasions, emotional sentiments, 
              buyer personas, and curated bundle archetypes. Click any matrix cell to explore.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-ivory-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                  <Gift className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-charcoal-600">{data.occasions.length}</p>
                  <p className="text-xs text-charcoal-400">Occasions</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-ivory-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blush-light rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-charcoal-600">{data.sentiments.length}</p>
                  <p className="text-xs text-charcoal-400">Sentiments</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-ivory-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-sage-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-charcoal-600">{data.personas.length}</p>
                  <p className="text-xs text-charcoal-400">Personas</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-ivory-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-kraft-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-kraft-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-charcoal-600">{data.bundles.length}</p>
                  <p className="text-xs text-charcoal-400">Bundles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matrix Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-serif font-semibold text-charcoal-600 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gold-500" />
            Occasion × Sentiment Matrix
          </h2>
          <p className="text-sm text-charcoal-400 mt-1">
            Click any cell to explore matching bundles, personas, and Australian cultural insights.
          </p>
        </div>

        <OccasionSentimentMatrix
          occasions={data.occasions}
          sentiments={data.sentiments}
          relationships={data.relationships}
          bundles={data.bundles}
          personas={data.personas}
          onOccasionClick={handleOccasionClick}
          onSentimentClick={handleSentimentClick}
        />
      </section>

      {/* Search Results Modal */}
      {searchResults && searchQuery && (
        <SearchResults
          query={searchQuery}
          results={searchResults}
          onClose={() => {
            setSearchResults(null);
            setSearchQuery('');
          }}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-ivory-300 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-charcoal-400">
              © {new Date().getFullYear()} Style Bundle — Internal Use Only
            </p>
            <div className="flex items-center gap-4 text-sm text-charcoal-400">
              <span>Logged in as: {session.displayName}</span>
              <span className="pill text-xs bg-gold-100 text-gold-700 capitalize">
                {session.role}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <DataProvider>
      <HomeContent />
    </DataProvider>
  );
}
