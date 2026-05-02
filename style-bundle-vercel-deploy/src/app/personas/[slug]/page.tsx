'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import OccasionCard from '@/components/OccasionCard';
import SentimentCard from '@/components/SentimentCard';
import BundleCard from '@/components/BundleCard';
import { DataProvider, useData } from '@/components/DataProvider';
import { formatDateAU } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, Briefcase, MapPin, DollarSign, Target, 
  Lightbulb, Gift, Heart, Package, ShoppingBag
} from 'lucide-react';

function PersonaDetailContent() {
  const params = useParams();
  const data = useData();
  const slug = params.slug as string;

  const persona = data.personas.find(p => p.slug === slug);

  // Get top occasions
  const topOccasions = persona?.top_occasion_ids
    .map(id => data.occasions.find(o => o.occasion_id === id))
    .filter(Boolean) || [];

  // Get top sentiments
  const topSentiments = persona?.top_sentiment_ids
    .map(id => data.sentiments.find(s => s.sentiment_id === id))
    .filter(Boolean) || [];

  // Get matching bundles
  const matchingBundles = data.bundles.filter(b => 
    b.persona_fit_ids.includes(persona?.persona_id || '')
  );

  // Priority styling
  const priorityColour = {
    high: 'bg-gold-100 text-gold-700 border-gold-300',
    medium: 'bg-sage-100 text-sage-700 border-sage-300',
    low: 'bg-ivory-200 text-charcoal-500 border-ivory-400',
  }[persona?.commercial_priority || 'low'];

  // Get initials
  const initials = persona?.name
    .split('–')[0]
    .trim()
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2) || '??';

  if (!data.loaded) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="min-h-screen bg-ivory-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-serif text-charcoal-600 mb-4">Persona Not Found</h1>
          <Link href="/personas" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Personas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-100">
      <Header />

      {/* Back Navigation */}
      <div className="bg-white border-b border-ivory-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link href="/personas" className="inline-flex items-center gap-2 text-sm text-charcoal-400 hover:text-gold-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Personas
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-ivory-50 to-sage-50 border-b border-ivory-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-gold-200 to-kraft-300 rounded-2xl flex items-center justify-center text-gold-700 font-serif font-bold text-2xl lg:text-3xl shadow-md shrink-0">
                  {initials}
                </div>

                <div className="flex-1">
                  {/* Priority Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn("pill text-xs border capitalize", priorityColour)}>
                      {persona.commercial_priority} Priority
                    </span>
                    <span className="text-xs text-charcoal-400 capitalize">
                      {persona.gender} • {persona.age_min}–{persona.age_max} years
                    </span>
                  </div>

                  {/* Name */}
                  <h1 className="text-2xl lg:text-3xl font-serif font-bold text-charcoal-600">
                    {persona.name.split('–')[0].trim()}
                  </h1>
                  
                  {/* Role */}
                  <p className="text-lg text-gold-600 font-medium mt-1">
                    {persona.name.includes('–') ? persona.name.split('–')[1].trim() : ''}
                  </p>

                  {/* Summary */}
                  <p className="text-charcoal-400 mt-4 leading-relaxed">
                    {persona.short_summary}
                  </p>
                </div>
              </div>

              {/* Long Description */}
              <div className="mt-8 prose prose-charcoal max-w-none">
                <p className="text-charcoal-500 leading-relaxed editorial-spacing">
                  {persona.long_description}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Demographics Card */}
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-charcoal-500 mb-4">Demographics</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-kraft-500" />
                    <div>
                      <p className="text-xs text-charcoal-400">Occupation</p>
                      <p className="text-sm font-medium text-charcoal-600">{persona.occupation_archetype}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-sage-500" />
                    <div>
                      <p className="text-xs text-charcoal-400">Location</p>
                      <p className="text-sm font-medium text-charcoal-600 capitalize">{persona.location_type}</p>
                    </div>
                  </div>
                  {persona.household_income_min_aud && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-gold-500" />
                      <div>
                        <p className="text-xs text-charcoal-400">Household Income</p>
                        <p className="text-sm font-medium text-charcoal-600">
                          ${persona.household_income_min_aud.toLocaleString()}+
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-blush" />
                    <div>
                      <p className="text-xs text-charcoal-400">Price Band</p>
                      <p className="text-sm font-medium text-charcoal-600">
                        ${persona.price_band_min_aud} – ${persona.price_band_max_aud}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivations Card */}
              {persona.motivations.length > 0 && (
                <div className="card p-5">
                  <h3 className="text-sm font-semibold text-charcoal-500 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-gold-500" />
                    Key Motivations
                  </h3>
                  <ul className="space-y-2">
                    {persona.motivations.map((motivation, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-gold-400 rounded-full mt-2 shrink-0" />
                        <span className="text-sm text-charcoal-500">{motivation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Preferred Channels */}
              {persona.preferred_channels.length > 0 && (
                <div className="card p-5">
                  <h3 className="text-sm font-semibold text-charcoal-500 mb-3">Preferred Channels</h3>
                  <div className="flex flex-wrap gap-2">
                    {persona.preferred_channels.map((channel, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-sage-50 text-sage-700 rounded border border-sage-200">
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Insight Banner */}
      {persona.strategic_insight && (
        <section className="bg-gold-50 border-b border-gold-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gold-200 rounded-xl flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 text-gold-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gold-700 mb-1">Strategic Insight</h3>
                <p className="text-gold-700 editorial-spacing">{persona.strategic_insight}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Top Occasions */}
        {topOccasions.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-semibold text-charcoal-600 mb-6 flex items-center gap-2">
              <Gift className="w-5 h-5 text-gold-500" />
              Priority Occasions ({topOccasions.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topOccasions.map(occasion => occasion && (
                <OccasionCard key={occasion.occasion_id} occasion={occasion} compact />
              ))}
            </div>
          </section>
        )}

        {/* Top Sentiments */}
        {topSentiments.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-semibold text-charcoal-600 mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-blush" />
              Key Sentiments ({topSentiments.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topSentiments.map(sentiment => sentiment && (
                <SentimentCard key={sentiment.sentiment_id} sentiment={sentiment} compact />
              ))}
            </div>
          </section>
        )}

        {/* Recommended Bundles */}
        {matchingBundles.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-semibold text-charcoal-600 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-kraft-500" />
              Recommended Bundles ({matchingBundles.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingBundles.map(bundle => (
                <BundleCard key={bundle.bundle_id} bundle={bundle} />
              ))}
            </div>
          </section>
        )}

        {/* Metadata */}
        <section className="pt-8 border-t border-ivory-300">
          <p className="text-xs text-charcoal-400">
            Last updated: {formatDateAU(persona.updated_at)} by {persona.updated_by}
          </p>
        </section>
      </div>
    </div>
  );
}

export default function PersonaDetailPage() {
  return (
    <DataProvider>
      <PersonaDetailContent />
    </DataProvider>
  );
}
