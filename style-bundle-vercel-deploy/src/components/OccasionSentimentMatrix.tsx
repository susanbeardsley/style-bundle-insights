'use client';

import { useState, useMemo } from 'react';
import { 
  Occasion, 
  Sentiment, 
  OccasionSentimentRelationship,
  BundleArchetype,
  Persona 
} from '@/types';
import { cn, formatCategory, getStrengthColour, getSentimentFamilyColour, getCategoryColour } from '@/lib/utils';
import { X, Package, Users, MapPin, Sparkles, Tag } from 'lucide-react';

interface MatrixProps {
  occasions: Occasion[];
  sentiments: Sentiment[];
  relationships: OccasionSentimentRelationship[];
  bundles: BundleArchetype[];
  personas: Persona[];
  onOccasionClick?: (occasion: Occasion) => void;
  onSentimentClick?: (sentiment: Sentiment) => void;
}

interface CellDetail {
  occasion: Occasion;
  sentiment: Sentiment;
  relationship: OccasionSentimentRelationship | undefined;
  matchingBundles: BundleArchetype[];
  matchingPersonas: Persona[];
}

export default function OccasionSentimentMatrix({
  occasions,
  sentiments,
  relationships,
  bundles,
  personas,
  onOccasionClick,
  onSentimentClick,
}: MatrixProps) {
  const [selectedCell, setSelectedCell] = useState<CellDetail | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [familyFilter, setFamilyFilter] = useState<string>('all');

  // Get unique categories and families
  const categories = useMemo(() => {
    const cats = [...new Set(occasions.map(o => o.category))];
    return cats.sort();
  }, [occasions]);

  const families = useMemo(() => {
    const fams = [...new Set(sentiments.map(s => s.family))];
    return fams.sort();
  }, [sentiments]);

  // Filter occasions and sentiments
  const filteredOccasions = useMemo(() => {
    return occasions
      .filter(o => categoryFilter === 'all' || o.category === categoryFilter)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [occasions, categoryFilter]);

  const filteredSentiments = useMemo(() => {
    return sentiments
      .filter(s => familyFilter === 'all' || s.family === familyFilter)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [sentiments, familyFilter]);

  // Build relationship lookup map
  const relationshipMap = useMemo(() => {
    const map = new Map<string, OccasionSentimentRelationship>();
    relationships.forEach(r => {
      map.set(`${r.occasion_id}-${r.sentiment_id}`, r);
    });
    return map;
  }, [relationships]);

  // Get relationship for a cell
  const getRelationship = (occasionId: string, sentimentId: string) => {
    return relationshipMap.get(`${occasionId}-${sentimentId}`);
  };

  // Get matching bundles for occasion + sentiment
  const getMatchingBundles = (occasionId: string, sentimentId: string) => {
    return bundles.filter(b => 
      b.occasion_ids.includes(occasionId) && 
      b.sentiment_ids.includes(sentimentId)
    );
  };

  // Get matching personas for occasion + sentiment
  const getMatchingPersonas = (occasionId: string, sentimentId: string) => {
    return personas.filter(p =>
      p.top_occasion_ids.includes(occasionId) ||
      p.top_sentiment_ids.includes(sentimentId)
    );
  };

  // Handle cell click
  const handleCellClick = (occasion: Occasion, sentiment: Sentiment) => {
    const relationship = getRelationship(occasion.occasion_id, sentiment.sentiment_id);
    const matchingBundles = getMatchingBundles(occasion.occasion_id, sentiment.sentiment_id);
    const matchingPersonas = getMatchingPersonas(occasion.occasion_id, sentiment.sentiment_id);
    
    setSelectedCell({
      occasion,
      sentiment,
      relationship,
      matchingBundles,
      matchingPersonas,
    });
  };

  // Get cell styling based on relationship strength
  const getCellClass = (occasionId: string, sentimentId: string) => {
    const rel = getRelationship(occasionId, sentimentId);
    if (!rel) return 'matrix-cell-empty';
    
    switch (rel.strength) {
      case 'primary':
        return 'matrix-cell-primary';
      case 'secondary':
        return 'matrix-cell-secondary';
      case 'rare':
        return 'matrix-cell-rare';
      default:
        return 'matrix-cell-empty';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-charcoal-500">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-input py-1.5 text-sm w-auto"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{formatCategory(cat)}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-charcoal-500">Sentiment Family:</label>
          <select
            value={familyFilter}
            onChange={(e) => setFamilyFilter(e.target.value)}
            className="form-input py-1.5 text-sm w-auto"
          >
            <option value="all">All Families</option>
            {families.map(fam => (
              <option key={fam} value={fam} className="capitalize">{fam}</option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 ml-auto">
          <span className="text-xs text-charcoal-400">Strength:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded matrix-cell-primary"></div>
            <span className="text-xs text-charcoal-500">Primary</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded matrix-cell-secondary"></div>
            <span className="text-xs text-charcoal-500">Secondary</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded matrix-cell-rare"></div>
            <span className="text-xs text-charcoal-500">Rare</span>
          </div>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="overflow-x-auto pb-4">
        <div className="inline-block min-w-full">
          <div className="bg-white rounded-xl border border-ivory-300 shadow-card overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-ivory-100">
                  <th className="sticky left-0 z-20 bg-ivory-100 p-3 text-left text-xs font-semibold text-charcoal-500 border-b border-r border-ivory-300 min-w-[180px]">
                    Occasion / Sentiment →
                  </th>
                  {filteredSentiments.map((sentiment, colIndex) => (
                    <th
                      key={sentiment.sentiment_id}
                      className={cn(
                        "p-2 text-center border-b border-ivory-300 min-w-[100px] cursor-pointer hover:bg-ivory-200 transition-colors",
                        hoveredCell?.col === colIndex && "bg-gold-50"
                      )}
                      onClick={() => onSentimentClick?.(sentiment)}
                      onMouseEnter={() => setHoveredCell(prev => prev ? { ...prev, col: colIndex } : null)}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className={cn(
                          "pill text-[10px]",
                          getSentimentFamilyColour(sentiment.family)
                        )}>
                          {sentiment.family}
                        </span>
                        <span className="text-xs font-medium text-charcoal-600 whitespace-nowrap">
                          {sentiment.name}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOccasions.map((occasion, rowIndex) => (
                  <tr 
                    key={occasion.occasion_id}
                    className={cn(
                      "hover:bg-ivory-50 transition-colors",
                      hoveredCell?.row === rowIndex && "bg-gold-50/50"
                    )}
                  >
                    <td
                      className={cn(
                        "sticky left-0 z-10 bg-white p-3 border-r border-b border-ivory-200 cursor-pointer hover:bg-ivory-100 transition-colors",
                        hoveredCell?.row === rowIndex && "bg-gold-50"
                      )}
                      onClick={() => onOccasionClick?.(occasion)}
                      onMouseEnter={() => setHoveredCell(prev => prev ? { ...prev, row: rowIndex } : null)}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-charcoal-600">
                          {occasion.name}
                        </span>
                        <span className={cn(
                          "pill text-[10px] w-fit border",
                          getCategoryColour(occasion.category)
                        )}>
                          {formatCategory(occasion.category)}
                        </span>
                      </div>
                    </td>
                    {filteredSentiments.map((sentiment, colIndex) => {
                      const rel = getRelationship(occasion.occasion_id, sentiment.sentiment_id);
                      return (
                        <td
                          key={sentiment.sentiment_id}
                          className="p-1.5 border-b border-ivory-200"
                          onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          <button
                            onClick={() => handleCellClick(occasion, sentiment)}
                            className={cn(
                              "matrix-cell w-full h-10",
                              getCellClass(occasion.occasion_id, sentiment.sentiment_id)
                            )}
                            title={rel ? `${rel.strength} (score: ${rel.strength_score})` : 'No relationship'}
                          >
                            {rel?.strength_score || '—'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cell Detail Modal */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-600/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="relative p-6 bg-gradient-to-r from-gold-50 to-ivory-100 border-b border-ivory-300">
              <button
                onClick={() => setSelectedCell(null)}
                className="absolute top-4 right-4 p-2 text-charcoal-400 hover:text-charcoal-600 hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-semibold text-charcoal-600">
                    {selectedCell.occasion.name} × {selectedCell.sentiment.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn(
                      "pill text-xs border",
                      getCategoryColour(selectedCell.occasion.category)
                    )}>
                      {formatCategory(selectedCell.occasion.category)}
                    </span>
                    <span className={cn(
                      "pill text-xs",
                      getSentimentFamilyColour(selectedCell.sentiment.family)
                    )}>
                      {selectedCell.sentiment.family}
                    </span>
                    {selectedCell.relationship && (
                      <span className={cn(
                        "pill text-xs",
                        getStrengthColour(selectedCell.relationship.strength)
                      )}>
                        {selectedCell.relationship.strength} ({selectedCell.relationship.strength_score})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
              {/* Editorial Note */}
              {selectedCell.relationship?.editorial_note && (
                <div className="ribbon-accent pl-4">
                  <h4 className="text-sm font-semibold text-charcoal-500 mb-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-500" />
                    Editorial Insight
                  </h4>
                  <p className="text-sm text-charcoal-500 editorial-spacing">
                    {selectedCell.relationship.editorial_note}
                  </p>
                </div>
              )}

              {/* AU Cultural Notes */}
              {selectedCell.occasion.au_cultural_notes && (
                <div className="ribbon-accent pl-4">
                  <h4 className="text-sm font-semibold text-charcoal-500 mb-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sage-500" />
                    Australian Cultural Notes
                  </h4>
                  <p className="text-sm text-charcoal-500 editorial-spacing">
                    {selectedCell.occasion.au_cultural_notes}
                  </p>
                </div>
              )}

              {/* Product Keywords */}
              {selectedCell.relationship?.product_keywords && selectedCell.relationship.product_keywords.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-charcoal-500 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-kraft-500" />
                    Product Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCell.relationship.product_keywords.map((keyword, i) => (
                      <span key={i} className="pill bg-kraft-100 text-kraft-600 border border-kraft-200">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Bundles */}
              {selectedCell.matchingBundles.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-charcoal-500 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4 text-gold-500" />
                    Recommended Bundles ({selectedCell.matchingBundles.length})
                  </h4>
                  <div className="grid gap-3">
                    {selectedCell.matchingBundles.map(bundle => (
                      <div key={bundle.bundle_id} className="p-3 bg-ivory-50 rounded-lg border border-ivory-200">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h5 className="font-medium text-charcoal-600">{bundle.concept_name}</h5>
                            <p className="text-xs text-gold-600 italic">{bundle.tagline}</p>
                          </div>
                          <span className="text-xs text-charcoal-400 whitespace-nowrap">
                            ${bundle.price_min_aud}–${bundle.price_max_aud}
                          </span>
                        </div>
                        <p className="text-sm text-charcoal-500 mt-2">{bundle.concept_description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {bundle.product_categories.slice(0, 4).map((cat, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-white rounded border border-ivory-300 text-charcoal-400">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Personas */}
              {selectedCell.matchingPersonas.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-charcoal-500 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-sage-500" />
                    Target Personas ({selectedCell.matchingPersonas.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCell.matchingPersonas.map(persona => (
                      <div key={persona.persona_id} className="flex items-center gap-2 px-3 py-2 bg-sage-50 rounded-lg border border-sage-200">
                        <div className="w-8 h-8 bg-sage-200 rounded-full flex items-center justify-center text-sage-600 font-medium text-sm">
                          {persona.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-charcoal-600">{persona.name.split('–')[0].trim()}</p>
                          <p className="text-xs text-charcoal-400">{persona.commercial_priority} priority</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Data State */}
              {!selectedCell.relationship && selectedCell.matchingBundles.length === 0 && (
                <div className="text-center py-8 text-charcoal-400">
                  <p>No specific relationship data for this combination.</p>
                  <p className="text-sm mt-1">This may represent an opportunity for exploration.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
