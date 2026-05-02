'use client';

import { Occasion, Sentiment, Persona, BundleArchetype } from '@/types';
import OccasionCard from './OccasionCard';
import SentimentCard from './SentimentCard';
import PersonaCard from './PersonaCard';
import BundleCard from './BundleCard';
import { Gift, Heart, Users, Package, Search } from 'lucide-react';

interface SearchResultsProps {
  query: string;
  results: {
    occasions: Occasion[];
    sentiments: Sentiment[];
    personas: Persona[];
    bundles: BundleArchetype[];
  };
  onClose: () => void;
}

export default function SearchResults({ query, results, onClose }: SearchResultsProps) {
  const totalResults = 
    results.occasions.length + 
    results.sentiments.length + 
    results.personas.length + 
    results.bundles.length;

  if (totalResults === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-charcoal-600/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-semibold text-charcoal-600">
              Search Results for "{query}"
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-charcoal-400 hover:text-charcoal-600 hover:bg-ivory-100 rounded-lg"
            >
              ✕
            </button>
          </div>
          
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-charcoal-200 mx-auto mb-4" />
            <p className="text-charcoal-400">No results found for your search.</p>
            <p className="text-sm text-charcoal-300 mt-1">Try different keywords or browse the categories.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-600/50 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-full flex items-start justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full animate-fadeIn">
          {/* Header */}
          <div className="sticky top-0 bg-white rounded-t-2xl p-6 border-b border-ivory-200 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-semibold text-charcoal-600">
                  Search Results for "{query}"
                </h2>
                <p className="text-sm text-charcoal-400 mt-1">
                  Found {totalResults} result{totalResults !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-charcoal-400 hover:text-charcoal-600 hover:bg-ivory-100 rounded-lg"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="p-6 space-y-8">
            {/* Occasions */}
            {results.occasions.length > 0 && (
              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-charcoal-500 mb-4">
                  <Gift className="w-4 h-4 text-gold-500" />
                  Occasions ({results.occasions.length})
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {results.occasions.map(occasion => (
                    <div key={occasion.occasion_id} onClick={onClose}>
                      <OccasionCard occasion={occasion} compact />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Sentiments */}
            {results.sentiments.length > 0 && (
              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-charcoal-500 mb-4">
                  <Heart className="w-4 h-4 text-blush" />
                  Sentiments ({results.sentiments.length})
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {results.sentiments.map(sentiment => (
                    <div key={sentiment.sentiment_id} onClick={onClose}>
                      <SentimentCard sentiment={sentiment} compact />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Personas */}
            {results.personas.length > 0 && (
              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-charcoal-500 mb-4">
                  <Users className="w-4 h-4 text-sage-500" />
                  Personas ({results.personas.length})
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {results.personas.map(persona => (
                    <div key={persona.persona_id} onClick={onClose}>
                      <PersonaCard persona={persona} compact />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Bundles */}
            {results.bundles.length > 0 && (
              <section>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-charcoal-500 mb-4">
                  <Package className="w-4 h-4 text-kraft-500" />
                  Bundles ({results.bundles.length})
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {results.bundles.map(bundle => (
                    <div key={bundle.bundle_id} onClick={onClose}>
                      <BundleCard bundle={bundle} compact />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
