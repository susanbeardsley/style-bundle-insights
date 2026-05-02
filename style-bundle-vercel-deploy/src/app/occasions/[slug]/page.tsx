'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import MoodBoard from '@/components/MoodBoard';
import BundleCard from '@/components/BundleCard';
import PersonaCard from '@/components/PersonaCard';
import { DataProvider, useData } from '@/components/DataProvider';
import { formatCategory, getCategoryColour, formatPriceTier, formatDateAU } from '@/lib/utils';
import { 
  ArrowLeft, Calendar, Clock, DollarSign, Users, MapPin, 
  AlertTriangle, Heart, Package, Sparkles, Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';

function OccasionDetailContent() {
  const params = useParams();
  const data = useData();
  const slug = params.slug as string;

  const occasion = data.occasions.find(o => o.slug === slug);

  // Get related sentiments
  const relatedRelationships = data.relationships.filter(r => r.occasion_id === occasion?.occasion_id);
  const relatedSentiments = relatedRelationships
    .map(r => ({
      sentiment: data.sentiments.find(s => s.sentiment_id === r.sentiment_id),
      relationship: r
    }))
    .filter(item => item.sentiment)
    .sort((a, b) => b.relationship.strength_score - a.relationship.strength_score);

  // Get matching bundles
  const matchingBundles = data.bundles.filter(b => 
    b.occasion_ids.includes(occasion?.occasion_id || '')
  );

  // Get matching personas
  const matchingPersonas = data.personas.filter(p =>
    p.top_occasion_ids.includes(occasion?.occasion_id || '')
  );

  // Get media assets
  const mediaAssets = data.mediaAssets.filter(m => 
    m.entity_type === 'occasion' && m.entity_id === occasion?.occasion_id
  );

  // Get tags
  const entityTags = data.entityTags.filter(et => 
    et.entity_type === 'occasion' && et.entity_id === occasion?.occasion_id
  );
  const tags = entityTags.map(et => data.tags.find(t => t.tag_id === et.tag_id)).filter(Boolean);

  if (!data.loaded) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!occasion) {
    return (
      <div className="min-h-screen bg-ivory-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-serif text-charcoal-600 mb-4">Occasion Not Found</h1>
          <Link href="/occasions" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Occasions
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
          <Link href="/occasions" className="inline-flex items-center gap-2 text-sm text-charcoal-400 hover:text-gold-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Occasions
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-ivory-50 to-kraft-50 border-b border-ivory-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Category & Sensitivity */}
              <div className="flex items-center gap-2 mb-4">
                <span className={cn("pill text-xs border", getCategoryColour(occasion.category))}>
                  {formatCategory(occasion.category)}
                </span>
                {occasion.sensitivity_flag && (
                  <span className="pill text-xs bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Sensitive
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-charcoal-600 mb-4">
                {occasion.name}
              </h1>

              {/* Short Description */}
              <p className="text-lg text-charcoal-500 leading-relaxed mb-6">
                {occasion.short_description}
              </p>

              {/* Long Description */}
              <div className="prose prose-charcoal max-w-none">
                <p className="text-charcoal-400 leading-relaxed editorial-spacing">
                  {occasion.long_description}
                </p>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex items-center gap-2 mt-6">
                  <Tag className="w-4 h-4 text-charcoal-300" />
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => tag && (
                      <span 
                        key={tag.tag_id} 
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ backgroundColor: `${tag.colour_hex}20`, color: tag.colour_hex }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-charcoal-500 mb-4">Quick Facts</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gold-500" />
                    <div>
                      <p className="text-xs text-charcoal-400">Season</p>
                      <p className="text-sm font-medium text-charcoal-600">
                        {occasion.is_year_round ? 'Year-round' : occasion.season}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-sage-500" />
                    <div>
                      <p className="text-xs text-charcoal-400">Lead Time</p>
                      <p className="text-sm font-medium text-charcoal-600">
                        {occasion.lead_time_min_days}–{occasion.lead_time_max_days} days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-kraft-500" />
                    <div>
                      <p className="text-xs text-charcoal-400">Price Range</p>
                      <p className="text-sm font-medium text-charcoal-600">
                        {formatPriceTier(occasion.price_tier_low_aud, occasion.price_tier_high_aud)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blush mt-0.5" />
                    <div>
                      <p className="text-xs text-charcoal-400">Typical Recipients</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {occasion.typical_recipients.map((recipient, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-ivory-100 rounded text-charcoal-500">
                            {recipient}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Data (if available) */}
              {(occasion.avg_spend_aud || occasion.participation_rate_pct) && (
                <div className="card p-5">
                  <h3 className="text-sm font-semibold text-charcoal-500 mb-4">Market Data</h3>
                  <div className="space-y-3">
                    {occasion.avg_spend_aud && (
                      <div>
                        <p className="text-xs text-charcoal-400">Average Spend</p>
                        <p className="text-lg font-semibold text-gold-600">${occasion.avg_spend_aud}</p>
                      </div>
                    )}
                    {occasion.participation_rate_pct && (
                      <div>
                        <p className="text-xs text-charcoal-400">Participation Rate</p>
                        <p className="text-lg font-semibold text-sage-600">{occasion.participation_rate_pct}%</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Australian Cultural Notes */}
      {occasion.au_cultural_notes && (
        <section className="bg-sage-50 border-b border-sage-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-sage-200 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-sage-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-sage-700 mb-1">Australian Cultural Notes</h3>
                <p className="text-sage-700 editorial-spacing">{occasion.au_cultural_notes}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sensitivity Notes */}
      {occasion.sensitivity_flag && occasion.sensitivity_notes && (
        <section className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-amber-700 mb-1">Sensitivity Considerations</h3>
                <p className="text-amber-700 editorial-spacing">{occasion.sensitivity_notes}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Mood Board */}
        <section>
          <MoodBoard assets={mediaAssets.filter(m => m.role === 'mood_board')} slots={8} />
        </section>

        {/* Related Sentiments */}
        {relatedSentiments.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-semibold text-charcoal-600 mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-blush" />
              Associated Sentiments
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedSentiments.slice(0, 6).map(({ sentiment, relationship }) => sentiment && (
                <Link key={sentiment.sentiment_id} href={`/sentiments/${sentiment.slug}`}>
                  <div className="card p-4 hover:border-gold-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn(
                        "pill text-xs capitalize",
                        relationship.strength === 'primary' ? 'bg-gold-100 text-gold-700' :
                        relationship.strength === 'secondary' ? 'bg-sage-100 text-sage-700' :
                        'bg-ivory-200 text-charcoal-500'
                      )}>
                        {relationship.strength}
                      </span>
                      <span className="text-xs text-charcoal-400">Score: {relationship.strength_score}</span>
                    </div>
                    <h3 className="font-medium text-charcoal-600">{sentiment.name}</h3>
                    <p className="text-sm text-charcoal-400 mt-1 line-clamp-2">{sentiment.short_definition}</p>
                    {relationship.editorial_note && (
                      <p className="text-xs text-gold-600 italic mt-2 line-clamp-2">
                        "{relationship.editorial_note}"
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Matching Bundles */}
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

        {/* Target Personas */}
        {matchingPersonas.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-semibold text-charcoal-600 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-sage-500" />
              Target Personas ({matchingPersonas.length})
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {matchingPersonas.map(persona => (
                <PersonaCard key={persona.persona_id} persona={persona} />
              ))}
            </div>
          </section>
        )}

        {/* Metadata */}
        <section className="pt-8 border-t border-ivory-300">
          <p className="text-xs text-charcoal-400">
            Last updated: {formatDateAU(occasion.updated_at)} by {occasion.updated_by}
          </p>
        </section>
      </div>
    </div>
  );
}

export default function OccasionDetailPage() {
  return (
    <DataProvider>
      <OccasionDetailContent />
    </DataProvider>
  );
}
