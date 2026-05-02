'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import MoodBoard from '@/components/MoodBoard';
import OccasionCard from '@/components/OccasionCard';
import BundleCard from '@/components/BundleCard';
import { DataProvider, useData } from '@/components/DataProvider';
import { formatDateAU, getSentimentFamilyColour } from '@/lib/utils';
import { 
  ArrowLeft, Palette, Type, MessageCircle, Gift, Package, 
  CheckCircle, XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

function SentimentDetailContent() {
  const params = useParams();
  const data = useData();
  const slug = params.slug as string;

  const sentiment = data.sentiments.find(s => s.slug === slug);

  // Get related occasions
  const relatedRelationships = data.relationships.filter(r => r.sentiment_id === sentiment?.sentiment_id);
  const relatedOccasions = relatedRelationships
    .map(r => ({
      occasion: data.occasions.find(o => o.occasion_id === r.occasion_id),
      relationship: r
    }))
    .filter(item => item.occasion)
    .sort((a, b) => b.relationship.strength_score - a.relationship.strength_score);

  // Get matching bundles
  const matchingBundles = data.bundles.filter(b => 
    b.sentiment_ids.includes(sentiment?.sentiment_id || '')
  );

  // Get dominant occasions
  const dominantOccasions = sentiment?.dominant_in_occasions
    .map(id => data.occasions.find(o => o.occasion_id === id))
    .filter(Boolean) || [];

  // Get avoid occasions
  const avoidOccasions = sentiment?.avoid_in_occasions
    .map(id => data.occasions.find(o => o.occasion_id === id))
    .filter(Boolean) || [];

  // Get media assets
  const mediaAssets = data.mediaAssets.filter(m => 
    m.entity_type === 'sentiment' && m.entity_id === sentiment?.sentiment_id
  );

  if (!data.loaded) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!sentiment) {
    return (
      <div className="min-h-screen bg-ivory-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-serif text-charcoal-600 mb-4">Sentiment Not Found</h1>
          <Link href="/sentiments" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sentiments
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
          <Link href="/sentiments" className="inline-flex items-center gap-2 text-sm text-charcoal-400 hover:text-gold-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Sentiments
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-ivory-50 to-kraft-50 border-b border-ivory-300">
        {/* Colour Strip */}
        <div 
          className="h-3"
          style={{ background: `linear-gradient(90deg, ${sentiment.visual_cues_palette.join(', ') || '#D4AF37'})` }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Family Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className={cn("pill text-sm capitalize", getSentimentFamilyColour(sentiment.family))}>
                  {sentiment.family}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-charcoal-600 mb-4">
                {sentiment.name}
              </h1>

              {/* Short Definition */}
              <p className="text-lg text-charcoal-500 leading-relaxed mb-6">
                {sentiment.short_definition}
              </p>

              {/* Long Definition */}
              <div className="prose prose-charcoal max-w-none">
                <p className="text-charcoal-400 leading-relaxed editorial-spacing">
                  {sentiment.long_definition}
                </p>
              </div>

              {/* Tone Descriptors */}
              {sentiment.tone_descriptors.length > 0 && (
                <div className="flex items-start gap-3 mt-6">
                  <Type className="w-5 h-5 text-charcoal-300 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-charcoal-400 mb-2">Tone Descriptors</p>
                    <div className="flex flex-wrap gap-2">
                      {sentiment.tone_descriptors.map((tone, i) => (
                        <span key={i} className="text-sm text-charcoal-600 bg-ivory-200 px-3 py-1 rounded-full italic">
                          {tone}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Visual Cues Card */}
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-charcoal-500 mb-4 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-kraft-500" />
                  Visual Cues
                </h3>
                
                {/* Colour Palette */}
                {sentiment.visual_cues_palette.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-charcoal-400 mb-2">Colour Palette</p>
                    <div className="flex gap-2">
                      {sentiment.visual_cues_palette.map((colour, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div 
                            className="w-10 h-10 rounded-lg border-2 border-white shadow-sm"
                            style={{ backgroundColor: colour }}
                          />
                          <span className="text-[10px] text-charcoal-400">{colour}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Textures */}
                {sentiment.visual_cues_textures.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-charcoal-400 mb-2">Textures</p>
                    <div className="flex flex-wrap gap-1">
                      {sentiment.visual_cues_textures.map((texture, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-ivory-100 rounded text-charcoal-500">
                          {texture}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Motifs */}
                {sentiment.visual_cues_motifs.length > 0 && (
                  <div>
                    <p className="text-xs text-charcoal-400 mb-2">Motifs</p>
                    <div className="flex flex-wrap gap-1">
                      {sentiment.visual_cues_motifs.map((motif, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-kraft-50 rounded text-kraft-600 border border-kraft-200">
                          {motif}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Message Conventions */}
              {sentiment.message_conventions_au && (
                <div className="card p-5">
                  <h3 className="text-sm font-semibold text-charcoal-500 mb-3 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-sage-500" />
                    AU Message Conventions
                  </h3>
                  <p className="text-sm text-charcoal-500 italic leading-relaxed">
                    "{sentiment.message_conventions_au}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Dominant & Avoid Occasions */}
        <section className="grid md:grid-cols-2 gap-6">
          {/* Dominant Occasions */}
          {dominantOccasions.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-charcoal-500 mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-sage-500" />
                Dominant In
              </h3>
              <div className="flex flex-wrap gap-2">
                {dominantOccasions.map(occasion => occasion && (
                  <Link 
                    key={occasion.occasion_id}
                    href={`/occasions/${occasion.slug}`}
                    className="text-sm px-3 py-1.5 bg-sage-50 text-sage-700 rounded-lg border border-sage-200 hover:bg-sage-100 transition-colors"
                  >
                    {occasion.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Avoid Occasions */}
          {avoidOccasions.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-charcoal-500 mb-4 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-400" />
                Avoid In
              </h3>
              <div className="flex flex-wrap gap-2">
                {avoidOccasions.map(occasion => occasion && (
                  <Link 
                    key={occasion.occasion_id}
                    href={`/occasions/${occasion.slug}`}
                    className="text-sm px-3 py-1.5 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                  >
                    {occasion.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Mood Board */}
        <section>
          <MoodBoard assets={mediaAssets.filter(m => m.role === 'mood_board')} slots={8} />
        </section>

        {/* Related Occasions */}
        {relatedOccasions.length > 0 && (
          <section>
            <h2 className="text-xl font-serif font-semibold text-charcoal-600 mb-6 flex items-center gap-2">
              <Gift className="w-5 h-5 text-gold-500" />
              Associated Occasions ({relatedOccasions.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedOccasions.slice(0, 9).map(({ occasion, relationship }) => occasion && (
                <div key={occasion.occasion_id} className="relative">
                  <OccasionCard occasion={occasion} compact />
                  <span className={cn(
                    "absolute top-2 right-2 pill text-[10px]",
                    relationship.strength === 'primary' ? 'bg-gold-500 text-white' :
                    relationship.strength === 'secondary' ? 'bg-sage-300 text-charcoal-600' :
                    'bg-ivory-300 text-charcoal-500'
                  )}>
                    {relationship.strength}
                  </span>
                </div>
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

        {/* Metadata */}
        <section className="pt-8 border-t border-ivory-300">
          <p className="text-xs text-charcoal-400">
            Last updated: {formatDateAU(sentiment.updated_at)} by {sentiment.updated_by}
          </p>
        </section>
      </div>
    </div>
  );
}

export default function SentimentDetailPage() {
  return (
    <DataProvider>
      <SentimentDetailContent />
    </DataProvider>
  );
}
