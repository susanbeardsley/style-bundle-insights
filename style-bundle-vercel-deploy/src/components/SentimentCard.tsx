'use client';

import Link from 'next/link';
import { Sentiment } from '@/types';
import { cn, getSentimentFamilyColour } from '@/lib/utils';
import { Palette, Type, MessageCircle } from 'lucide-react';

interface SentimentCardProps {
  sentiment: Sentiment;
  compact?: boolean;
}

export default function SentimentCard({ sentiment, compact = false }: SentimentCardProps) {
  // Get primary colour from palette
  const primaryColour = sentiment.visual_cues_palette[0] || '#D4AF37';

  return (
    <Link href={`/sentiments/${sentiment.slug}`}>
      <div className={cn(
        "card group cursor-pointer h-full",
        compact ? "p-4" : "p-6"
      )}>
        {/* Colour Strip */}
        <div 
          className="h-2 -mx-6 -mt-6 mb-4 rounded-t-xl"
          style={{ background: `linear-gradient(90deg, ${sentiment.visual_cues_palette.join(', ') || primaryColour})` }}
        />

        {/* Family Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            "pill text-xs capitalize",
            getSentimentFamilyColour(sentiment.family)
          )}>
            {sentiment.family}
          </span>
        </div>

        {/* Title */}
        <h3 className={cn(
          "font-serif font-semibold text-charcoal-600 group-hover:text-gold-600 transition-colors",
          compact ? "text-base" : "text-lg"
        )}>
          {sentiment.name}
        </h3>

        {/* Definition */}
        <p className={cn(
          "text-charcoal-400 mt-2",
          compact ? "text-xs line-clamp-2" : "text-sm"
        )}>
          {sentiment.short_definition}
        </p>

        {!compact && (
          <>
            {/* Tone Descriptors */}
            {sentiment.tone_descriptors.length > 0 && (
              <div className="flex items-start gap-2 mt-4">
                <Type className="w-4 h-4 text-charcoal-300 mt-0.5 shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {sentiment.tone_descriptors.map((tone, i) => (
                    <span key={i} className="text-xs text-charcoal-500 bg-ivory-100 px-2 py-0.5 rounded italic">
                      {tone}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Visual Cues Palette */}
            {sentiment.visual_cues_palette.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <Palette className="w-4 h-4 text-charcoal-300 shrink-0" />
                <div className="flex gap-1">
                  {sentiment.visual_cues_palette.map((colour, i) => (
                    <div 
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: colour }}
                      title={colour}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Message Conventions */}
            {sentiment.message_conventions_au && (
              <div className="flex items-start gap-2 mt-3 pt-3 border-t border-ivory-200">
                <MessageCircle className="w-4 h-4 text-charcoal-300 mt-0.5 shrink-0" />
                <p className="text-xs text-charcoal-400 italic">
                  "{sentiment.message_conventions_au}"
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
