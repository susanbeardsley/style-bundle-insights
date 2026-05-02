'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import MoodBoard from '@/components/MoodBoard';
import OccasionCard from '@/components/OccasionCard';
import SentimentCard from '@/components/SentimentCard';
import PersonaCard from '@/components/PersonaCard';
import { DataProvider, useData } from '@/components/DataProvider';
import { formatDateAU } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, DollarSign, Leaf, ExternalLink, Gift, Heart, 
  Users, Tag, Calendar, Package, Globe
} from 'lucide-react';

function BundleDetailContent() {
  const params = useParams();
  const data = useData();
  const slug = params.slug as string;

  const bundle = data.bundles.find(b => b.slug === slug);

  // Get related occasions
  const relatedOccasions = bundle?.occasion_ids
    .map(id => data.occasions.find(o => o.occasion_id === id))
    .filter(Boolean) || [];

  // Get related sentiments
  const relatedSentiments = bundle?.sentiment_ids
    .map(id => data.sentiments.find(s => s.sentiment_id === id))
    .filter(Boolean) || [];

  // Get target personas
  const targetPersonas = bundle?.persona_fit_ids
    .map(id => data.personas.find(p => p.persona_id === id))
    .filter(Boolean) || [];

  // Get media assets
  const mediaAssets = data.mediaAssets.filter(m => 
    m.entity_type === 'bundle' && m.entity_id === bundle?.bundle_id
  );

  // Get tags
  const entityTags = data.entityTags.filter(et => 
    et.entity_type === 'bundle' && et.entity_id === bundle?.bundle_id
  );
  const tags = entityTags.map(et => data.tags.find(t => t.tag_id === et.tag_id)).filter(Boolean);

  // Price tier styling
  const priceTierColour = {
    low: 'bg-sage-100 text-sage-700 border-sage-300',
    'low–mid': 'bg-sage-100 text-sage-700 border-sage-300',
    mid: 'bg-kraft-100 text-kraft-600 border-kraft-300',
    'mid–premium': 'bg-gold-100 text-gold-600 border-gold-300',
    premium: 'bg-gold-200 text-gold-700 border-gold-400',
  }[bundle?.price_tier || 'mid'];

  if (!data.loaded) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="min-h-screen bg-ivory-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-serif text-charcoal-600 mb-4">Bundle Not Found</h1>
          <Link href="/bundles" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bundles
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
          <Link href="/bundles" className="inline-flex items-center gap-2 text-sm text-charcoal-400 hover:text-gold-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Bundles
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-ivory-50 to-kraft-50 border-b border-ivory-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Price & Status Badges */}
              <div className="flex items-center gap-2 mb-4">
                <span className={cn("pill text-xs border", priceTierColour)}>
                  {bundle.price_tier}
                </span>
                {bundle.status === 'concept' && (
                  <span className="pill text-xs bg-charcoal-100 text-charcoal-500 border border-charcoal-200">
                    Concept
                  </span>
                )}
                {bundle.sustainability_notes && (
                  <span className="pill text-xs bg-sage-50 text-sage-600 border border-sage-200 flex items-center gap-1">
                    <Leaf className="w-3 h-3" />
                    Sustainable
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-charcoal-600 mb-2">
                {bundle.concept_name}
              </h1>

              {/* Tagline */}
              <p className="text-xl text-gold-600 italic mb-6">
                "{bundle.tagline}"
              </p>

              {/* Description */}
              <div className="prose prose-charcoal max-w-none">
                <p className="text-charcoal-500 leading-relaxed editorial-spacing text-lg">
                  {bundle.concept_description}
                </p>
              </div>

              {/* Product Categories */}
              {bundle.product_categories.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-charcoal-500 mb-3">Product Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {bundle.product_categories.map((category, i) => (
                      <span key={i} className="px-3 py-1.5 bg-ivory-100 text-charcoal-600 rounded-lg border border-ivory-300 text-sm">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Pricing & Details Card */}
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-charcoal-500 mb-4">Bundle Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-gold-500" />
                    <div>
                      <p className="text-xs text-charcoal-400">Price Range</p>
                      <p className="text-lg font-semibold text-charcoal-600">
                        ${bundle.price_min_aud} – ${bundle.price_max_aud}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-kraft-500" />
                    <div>
                      <p className="text-xs text-charcoal-400">Format</p>
                      <p className="text-sm font-medium text-charcoal-600 capitalize">
                        {bundle.recommended_format}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-sage-500" />
                    <div>
                      <p className="text-xs text-charcoal-400">Seasonality</p>
                      <p className="text-sm font-medium text-charcoal-600">
                        {bundle.seasonality}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blush" />
                    <div>
                      <p className="text-xs text-charcoal-400">Service Model</p>
                      <p className="text-sm font-medium text-charcoal-600 capitalize">
                        {bundle.service_model.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Link */}
                {bundle.stylebundle_product_url && (
                  <a
                    href={bundle.stylebundle_product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full mt-6 text-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Style Bundle
                  </a>
                )}

                {/* SKU */}
                {bundle.stylebundle_product_sku && (
                  <p className="text-xs text-charcoal-400 text-center mt-3">
                    SKU: {bundle.stylebundle_product_sku}
                  </p>
                )}
              </div>

              {/* Sustainability Notes */}
              {bundle.sustainability_notes && (
                <div className="card p-5 bg-sage-50 border-sage-200">
                  <h3 className="text-sm font-semibold text-sage-700 mb-2 flex items-center gap-2">
                    <Leaf className="w-4 h-4" />
                    Sustainability
                  </h3>
                  <p className="text-sm text-sage-700">{bundle.sustainability_notes}</p>
                </div>
              )}

              {/* Cultural Considerations */}
              {bundle.cultural_considerations && (
                <div className="card p-5 bg-amber-50 border-amber-200">
                  <h3 className="text-sm font-semibold text-amber-700 mb-2">
                    Cultural Considerations
                  </h3>
                  <p className="text-sm text-amber-700">{bundle.cultural_considerations}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Mood Board */}
        <section>
          <MoodBoard assets={mediaAssets.filter(m => m.role === 'mood_board')} slots={8} />
        </section>

        {/* Related Occasions */}
        {relatedOccasions.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-semibold text-charcoal-600 mb-6 flex items-center gap-2">
              <Gift className="w-5 h-5 text-gold-500" />
              Perfect For Occasions ({relatedOccasions.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedOccasions.map(occasion => occasion && (
                <OccasionCard key={occasion.occasion_id} occasion={occasion} compact />
              ))}
            </div>
          </section>
        )}

        {/* Related Sentiments */}
        {relatedSentiments.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-semibold text-charcoal-600 mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-blush" />
              Expresses Sentiments ({relatedSentiments.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedSentiments.map(sentiment => sentiment && (
                <SentimentCard key={sentiment.sentiment_id} sentiment={sentiment} compact />
              ))}
            </div>
          </section>
        )}

        {/* Target Personas */}
        {targetPersonas.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-semibold text-charcoal-600 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-sage-500" />
              Target Personas ({targetPersonas.length})
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {targetPersonas.map(persona => persona && (
                <PersonaCard key={persona.persona_id} persona={persona} />
              ))}
            </div>
          </section>
        )}

        {/* Metadata */}
        <section className="pt-8 border-t border-ivory-300">
          <p className="text-xs text-charcoal-400">
            Last updated: {formatDateAU(bundle.updated_at)} by {bundle.updated_by}
          </p>
        </section>
      </div>
    </div>
  );
}

export default function BundleDetailPage() {
  return (
    <DataProvider>
      <BundleDetailContent />
    </DataProvider>
  );
}
