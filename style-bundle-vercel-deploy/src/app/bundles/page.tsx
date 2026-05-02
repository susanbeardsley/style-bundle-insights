'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import BundleCard from '@/components/BundleCard';
import { DataProvider, useData } from '@/components/DataProvider';
import { Package, Filter } from 'lucide-react';

function BundlesContent() {
  const data = useData();
  const [priceTierFilter, setPriceTierFilter] = useState<string>('all');
  const [personaFilter, setPersonaFilter] = useState<string>('all');

  // Get unique price tiers
  const priceTiers = useMemo(() => {
    return [...new Set(data.bundles.map(b => b.price_tier))].sort();
  }, [data.bundles]);

  // Filter bundles
  const filteredBundles = useMemo(() => {
    return data.bundles
      .filter(b => priceTierFilter === 'all' || b.price_tier === priceTierFilter)
      .filter(b => personaFilter === 'all' || b.persona_fit_ids.includes(personaFilter))
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [data.bundles, priceTierFilter, personaFilter]);

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
            <div className="w-10 h-10 bg-kraft-100 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-kraft-600" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-charcoal-600">
              Bundle Archetypes
            </h1>
          </div>
          <p className="text-charcoal-400 max-w-2xl">
            Explore {data.bundles.length} curated gift bundle concepts designed for the Australian market, 
            each mapped to specific occasions, sentiments, and buyer personas.
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

            {/* Persona Filter */}
            <select
              value={personaFilter}
              onChange={(e) => setPersonaFilter(e.target.value)}
              className="form-input py-1.5 text-sm w-auto"
            >
              <option value="all">All Personas</option>
              {data.personas.map(persona => (
                <option key={persona.persona_id} value={persona.persona_id}>
                  {persona.name.split('–')[0].trim()}
                </option>
              ))}
            </select>

            {/* Results Count */}
            <span className="text-sm text-charcoal-400 ml-auto">
              Showing {filteredBundles.length} of {data.bundles.length}
            </span>
          </div>
        </div>
      </section>

      {/* Bundles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredBundles.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-charcoal-200 mx-auto mb-4" />
            <p className="text-charcoal-400">No bundles match your filters.</p>
            <button
              onClick={() => {
                setPriceTierFilter('all');
                setPersonaFilter('all');
              }}
              className="btn-ghost mt-4"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBundles.map(bundle => (
              <BundleCard key={bundle.bundle_id} bundle={bundle} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function BundlesPage() {
  return (
    <DataProvider>
      <BundlesContent />
    </DataProvider>
  );
}
