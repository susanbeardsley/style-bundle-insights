'use client';

import Link from 'next/link';
import { Persona } from '@/types';
import { cn } from '@/lib/utils';
import { Briefcase, MapPin, DollarSign, Target, Lightbulb } from 'lucide-react';

interface PersonaCardProps {
  persona: Persona;
  compact?: boolean;
}

export default function PersonaCard({ persona, compact = false }: PersonaCardProps) {
  // Get initials from name
  const initials = persona.name
    .split('–')[0]
    .trim()
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2);

  // Priority colour
  const priorityColour = {
    high: 'bg-gold-100 text-gold-700 border-gold-300',
    medium: 'bg-sage-100 text-sage-700 border-sage-300',
    low: 'bg-ivory-200 text-charcoal-500 border-ivory-400',
  }[persona.commercial_priority] || 'bg-gray-100 text-gray-600';

  return (
    <Link href={`/personas/${persona.slug}`}>
      <div className={cn(
        "card group cursor-pointer h-full",
        compact ? "p-4" : "p-6"
      )}>
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className={cn(
            "shrink-0 bg-gradient-to-br from-gold-200 to-kraft-300 rounded-full flex items-center justify-center text-gold-700 font-serif font-semibold shadow-sm",
            compact ? "w-12 h-12 text-lg" : "w-16 h-16 text-xl"
          )}>
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            {/* Name & Priority */}
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn(
                "font-serif font-semibold text-charcoal-600 group-hover:text-gold-600 transition-colors",
                compact ? "text-base" : "text-lg"
              )}>
                {persona.name.split('–')[0].trim()}
              </h3>
              <span className={cn(
                "pill text-[10px] border shrink-0 capitalize",
                priorityColour
              )}>
                {persona.commercial_priority}
              </span>
            </div>

            {/* Role descriptor */}
            <p className="text-xs text-gold-600 font-medium mt-0.5">
              {persona.name.includes('–') ? persona.name.split('–')[1].trim() : ''}
            </p>

            {/* Summary */}
            <p className={cn(
              "text-charcoal-400 mt-2",
              compact ? "text-xs line-clamp-2" : "text-sm line-clamp-3"
            )}>
              {persona.short_summary}
            </p>
          </div>
        </div>

        {!compact && (
          <>
            {/* Demographics */}
            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-ivory-200">
              <div className="flex items-center gap-1.5 text-xs text-charcoal-400">
                <Briefcase className="w-3.5 h-3.5" />
                <span>{persona.occupation_archetype}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-charcoal-400">
                <MapPin className="w-3.5 h-3.5" />
                <span className="capitalize">{persona.location_type}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-charcoal-400">
                <DollarSign className="w-3.5 h-3.5" />
                <span>${persona.price_band_min_aud}–${persona.price_band_max_aud}</span>
              </div>
            </div>

            {/* Motivations */}
            {persona.motivations.length > 0 && (
              <div className="flex items-start gap-2 mt-3">
                <Target className="w-4 h-4 text-charcoal-300 mt-0.5 shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {persona.motivations.slice(0, 3).map((motivation, i) => (
                    <span key={i} className="text-xs text-charcoal-500 bg-ivory-100 px-2 py-0.5 rounded">
                      {motivation}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Strategic Insight */}
            {persona.strategic_insight && (
              <div className="flex items-start gap-2 mt-3 p-3 bg-gold-50 rounded-lg border border-gold-100">
                <Lightbulb className="w-4 h-4 text-gold-500 mt-0.5 shrink-0" />
                <p className="text-xs text-charcoal-500 italic line-clamp-2">
                  {persona.strategic_insight}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
