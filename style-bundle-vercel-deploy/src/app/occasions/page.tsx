'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import OccasionCard from '@/components/OccasionCard';
import { DataProvider, useData } from '@/components/DataProvider';
import { formatCategory } from '@/lib/utils';
import { Gift, Filter, Grid, List } from 'lucide-react';

function OccasionsContent() {
  const data = useData();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [seasonFilter, setSeasonFilter] = useState<string>('all');
  const [priceTierFilter, setPriceTierFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique filter values
  const categories = useMemo(() => {
    return [...new Set(data.occasions.map(o => o.category))].sort();
  }, [data.occasions]);

  const seasons = useMemo(() => {
    return [...new Set(data.occasions.map(o => o.season))].filter(Boolean).sort();
  }, [data.occasions]);

  const priceTiers = useMemo(() => {
    return [...new Set(data.occasions.map(o => o.price_tier_label))].filter(Boolean).sort();
  }, [data.occasions]);

  // Filter occasions
  const filteredOccasions = useMemo(() => {
    return data.occasions
      .filter(o => categoryFilter === 'all' || o.category === categoryFilter)
      .filter(o => seasonFilter === 'all' || o.season === seasonFilter)
      .filter(o => priceTierFilter === 'all' || o.price_tier_label === priceTierFilter)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [data.occasions, categoryFilter, seasonFilter, priceTierFilter]);

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
            <div className="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center">
              <Gift className="w-5 h-5 text-gold-600" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-charcoal-600">
              Gifting Occasions
            </h1>
          </div>
          <p className="text-charcoal-400 max-w-2xl">
            Browse all {data.occasions.length} Australian gifting occasions across life milestones, 
            calendar events, cultural celebrations, professional moments, and more.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-ivory-50 border-b border-ivory-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-charcoal-500">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters:</span>
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-input py-1.5 text-sm w-auto"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{formatCategory(cat)}</option>
              ))}
            </select>

            {/* Season Filter */}
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="form-input py-1.5 text-sm w-auto"
            >
              <option value="all">All Seasons</option>
              {seasons.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>

            {/* Price Tier Filter */}
            <select
              value={priceTierFilter}
              onChange={(e) => setPriceTierFilter(e.target.value)}
              className="form-input py-1.5 text-sm w-auto"
            >
              <option value="all">All Price Tiers</option>
              {priceTiers.map(tier => (
                <option key={tier} value={tier}>{tier}</option>
              ))}
            </select>

            {/* Results Count */}
            <span className="text-sm text-charcoal-400 ml-auto">
              Showing {filteredOccasions.length} of {data.occasions.length}
            </span>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-white rounded-lg border border-ivory-300 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gold-100 text-gold-600' : 'text-charcoal-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gold-100 text-gold-600' : 'text-charcoal-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredOccasions.length === 0 ? (
          <div className="text-center py-12">
            <Gift className="w-12 h-12 text-charcoal-200 mx-auto mb-4" />
            <p className="text-charcoal-400">No occasions match your filters.</p>
            <button
              onClick={() => {
                setCategoryFilter('all');
                setSeasonFilter('all');
                setPriceTierFilter('all');
              }}
              className="btn-ghost mt-4"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "flex flex-col gap-4"
          }>
            {filteredOccasions.map(occasion => (
              <OccasionCard 
                key={occasion.occasion_id} 
                occasion={occasion}
                compact={viewMode === 'list'}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function OccasionsPage() {
  return (
    <DataProvider>
      <OccasionsContent />
    </DataProvider>
  );
}
