'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import SentimentCard from '@/components/SentimentCard';
import { DataProvider, useData } from '@/components/DataProvider';
import { Heart, Filter } from 'lucide-react';

function SentimentsContent() {
  const data = useData();
  const [familyFilter, setFamilyFilter] = useState<string>('all');

  // Get unique families
  const families = useMemo(() => {
    return [...new Set(data.sentiments.map(s => s.family))].sort();
  }, [data.sentiments]);

  // Filter sentiments
  const filteredSentiments = useMemo(() => {
    return data.sentiments
      .filter(s => familyFilter === 'all' || s.family === familyFilter)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [data.sentiments, familyFilter]);

  if (!data.loaded) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-100">
      <Header />

      {/* Page Header */}
      <section className="bg-white border-b border-ivory-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blush-light rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-500" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-charcoal-600">
              Emotional Sentiments
            </h1>
          </div>
          <p className="text-charcoal-400 max-w-2xl">
            Explore {data.sentiments.length} emotional intentions that drive gifting decisions in Australia, 
            grouped by sentiment families with visual cues and messaging conventions.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-ivory-50 border-b border-ivory-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-charcoal-500">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filter by Family:</span>
            </div>

            {/* Family Filter Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFamilyFilter('all')}
                className={`pill text-xs transition-colors ${
                  familyFilter === 'all' 
                    ? 'bg-gold-500 text-white' 
                    : 'bg-white text-charcoal-500 border border-ivory-300 hover:border-gold-300'
                }`}
              >
                All ({data.sentiments.length})
              </button>
              {families.map(family => {
                const count = data.sentiments.filter(s => s.family === family).length;
                return (
                  <button
                    key={family}
                    onClick={() => setFamilyFilter(family)}
                    className={`pill text-xs capitalize transition-colors ${
                      familyFilter === family 
                        ? 'bg-gold-500 text-white' 
                        : 'bg-white text-charcoal-500 border border-ivory-300 hover:border-gold-300'
                    }`}
                  >
                    {family} ({count})
                  </button>
                );
              })}
            </div>

            {/* Results Count */}
            <span className="text-sm text-charcoal-400 ml-auto">
              Showing {filteredSentiments.length} of {data.sentiments.length}
            </span>
          </div>
        </div>
      </section>

      {/* Sentiments Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredSentiments.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-charcoal-200 mx-auto mb-4" />
            <p className="text-charcoal-400">No sentiments match your filter.</p>
            <button
              onClick={() => setFamilyFilter('all')}
              className="btn-ghost mt-4"
            >
              Clear Filter
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSentiments.map(sentiment => (
              <SentimentCard key={sentiment.sentiment_id} sentiment={sentiment} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function SentimentsPage() {
  return (
    <DataProvider>
      <SentimentsContent />
    </DataProvider>
  );
}
