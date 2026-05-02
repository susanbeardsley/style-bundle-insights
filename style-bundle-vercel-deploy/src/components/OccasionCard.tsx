'use client';

import Link from 'next/link';
import { Occasion } from '@/types';
import { cn, formatCategory, getCategoryColour, formatPriceTier } from '@/lib/utils';
import { Calendar, Clock, Users, DollarSign } from 'lucide-react';

interface OccasionCardProps {
  occasion: Occasion;
  compact?: boolean;
}

export default function OccasionCard({ occasion, compact = false }: OccasionCardProps) {
  return (
    <Link href={`/occasions/${occasion.slug}`}>
      <div className={cn(
        "card group cursor-pointer h-full",
        compact ? "p-4" : "p-6"
      )}>
        {/* Hero Image Placeholder */}
        {!compact && (
          <div className="aspect-video bg-gradient-to-br from-ivory-200 to-kraft-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            <span className="text-4xl opacity-50">🎁</span>
          </div>
        )}

        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            "pill text-xs border",
            getCategoryColour(occasion.category)
          )}>
            {formatCategory(occasion.category)}
          </span>
          {occasion.sensitivity_flag && (
            <span className="pill text-xs bg-amber-100 text-amber-700 border border-amber-200">
              Sensitive
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={cn(
          "font-serif font-semibold text-charcoal-600 group-hover:text-gold-600 transition-colors",
          compact ? "text-base" : "text-lg"
        )}>
          {occasion.name}
        </h3>

        {/* Description */}
        <p className={cn(
          "text-charcoal-400 mt-2 line-clamp-2",
          compact ? "text-xs" : "text-sm"
        )}>
          {occasion.short_description}
        </p>

        {/* Meta Info */}
        {!compact && (
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-ivory-200">
            <div className="flex items-center gap-1.5 text-xs text-charcoal-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{occasion.is_year_round ? 'Year-round' : occasion.season}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-charcoal-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{occasion.lead_time_min_days}–{occasion.lead_time_max_days} days</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-charcoal-400">
              <DollarSign className="w-3.5 h-3.5" />
              <span>{formatPriceTier(occasion.price_tier_low_aud, occasion.price_tier_high_aud)}</span>
            </div>
          </div>
        )}

        {/* Recipients */}
        {!compact && occasion.typical_recipients.length > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <Users className="w-3.5 h-3.5 text-charcoal-300" />
            <div className="flex flex-wrap gap-1">
              {occasion.typical_recipients.slice(0, 4).map((recipient, i) => (
                <span key={i} className="text-xs text-charcoal-400 bg-ivory-100 px-2 py-0.5 rounded">
                  {recipient}
                </span>
              ))}
              {occasion.typical_recipients.length > 4 && (
                <span className="text-xs text-charcoal-300">
                  +{occasion.typical_recipients.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
