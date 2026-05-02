'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import PersonaCard from '@/components/PersonaCard';
import { DataProvider, useData } from '@/components/DataProvider';
import { Users, Filter } from 'lucide-react';

function PersonasContent() {
  const data = useData();
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Filter personas
  const filteredPersonas = useMemo(() => {
    return data.personas
      .filter(p => priorityFilter === 'all' || p.commercial_priority === priorityFilter)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [data.personas, priorityFilter]);

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
            <div className="w-10 h-10 bg-sage-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-sage-600" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-charcoal-600">
              Buyer Personas
            </h1>
          </div>
          <p className="text-charcoal-400 max-w-2xl">
            Meet the {data.personas.length} key buyer personas that represent Style Bundle's target 
            audience segments, with their motivations, preferences, and strategic insights.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-ivory-50 border-b border-ivory-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-charcoal-500">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Priority:</span>
            </div>

            {/* Priority Filter Pills */}
            <div className="flex gap-2">
              {['all', 'high', 'medium', 'low'].map(priority => (
                <button
                  key={priority}
                  onClick={() => setPriorityFilter(priority)}
                  className={`pill text-xs capitalize transition-colors ${
                    priorityFilter === priority 
                      ? 'bg-gold-500 text-white' 
                      : 'bg-white text-charcoal-500 border border-ivory-300 hover:border-gold-300'
                  }`}
                >
                  {priority === 'all' ? 'All' : priority}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <span className="text-sm text-charcoal-400 ml-auto">
              Showing {filteredPersonas.length} of {data.personas.length}
            </span>
          </div>
        </div>
      </section>

      {/* Personas Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredPersonas.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-charcoal-200 mx-auto mb-4" />
            <p className="text-charcoal-400">No personas match your filter.</p>
            <button
              onClick={() => setPriorityFilter('all')}
              className="btn-ghost mt-4"
            >
              Clear Filter
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredPersonas.map(persona => (
              <PersonaCard key={persona.persona_id} persona={persona} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function PersonasPage() {
  return (
    <DataProvider>
      <PersonasContent />
    </DataProvider>
  );
}
