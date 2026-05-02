'use client';

import Link from 'next/link';
import { BundleArchetype } from '@/types';
import { cn } from '@/lib/utils';
import { Package, DollarSign, Leaf, ExternalLink } from 'lucide-react';

interface BundleCardProps {
  bundle: BundleArchetype;
  compact?: boolean;
}

export default function BundleCard({ bundle, compact = false }: BundleCardProps) {
  // Price tier colour
  const priceTierColour = {
    low: 'bg-sage-100 text-sage-700',
    'low–mid': 'bg-sage-100 text-sage-700',
    mid: 'bg-kraft-100 text-kraft-600',
    'mid–premium': 'bg-gold-100 text-gold-600',
    premium: 'bg-gold-200 text-gold-700',
  }[bundle.price_tier] || 'bg-gray-100 text-gray-600';

  return (
    <Link href={`/bundles/${bundle.slug}`}>
      <div className={cn(
        "card group cursor-pointer h-full",
        compact ? "p-4" : "p-6"
      )}>
        {/* Hero Image Placeholder */}
        {!compact && (
          <div className="aspect-[4/3] bg-gradient-to-br from-kraft-100 to-gold-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
            <Package className="w-12 h-12 text-kraft-300" />
            {bundle.status === 'concept' && (
              <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 bg-charcoal-500 text-white rounded-full">
                Concept
              </span>
            )}
          </div>
        )}

        {/* Price & Status */}
        <div className="flex items-center gap-2 mb-2">
          <span className={cn("pill text-xs", priceTierColour)}>
            {bundle.price_tier}
          </span>
          <span className="text-xs text-charcoal-400">
            ${bundle.price_min_aud}–${bundle.price_max_aud}
          </span>
        </div>

        {/* Title */}
        <h3 className={cn(
          "font-serif font-semibold text-charcoal-600 group-hover:text-gold-600 transition-colors",
          compact ? "text-base" : "text-lg"
        )}>
          {bundle.concept_name}
        </h3>

        {/* Tagline */}
        <p className={cn(
          "text-gold-600 italic mt-1",
          compact ? "text-xs" : "text-sm"
        )}>
          {bundle.tagline}
        </p>

        {/* Description */}
        <p className={cn(
          "text-charcoal-400 mt-2",
          compact ? "text-xs line-clamp-2" : "text-sm line-clamp-3"
        )}>
          {bundle.concept_description}
        </p>

        {!compact && (
          <>
            {/* Product Categories */}
            {bundle.product_categories.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-4">
                {bundle.product_categories.slice(0, 4).map((category, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 bg-ivory-100 rounded text-charcoal-400 border border-ivory-200">
                    {category}
                  </span>
                ))}
                {bundle.product_categories.length > 4 && (
                  <span className="text-xs text-charcoal-300">
                    +{bundle.product_categories.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-ivory-200">
              <div className="flex items-center gap-3">
                {/* Seasonality */}
                <span className="text-xs text-charcoal-400">
                  {bundle.seasonality}
                </span>
                
                {/* Sustainability */}
                {bundle.sustainability_notes && (
                  <div className="flex items-center gap-1 text-sage-600">
                    <Leaf className="w-3.5 h-3.5" />
                    <span className="text-xs">Sustainable</span>
                  </div>
                )}
              </div>

              {/* Product Link */}
              {bundle.stylebundle_product_url && (
                <span className="flex items-center gap-1 text-xs text-gold-600">
                  <ExternalLink className="w-3 h-3" />
                  View
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
