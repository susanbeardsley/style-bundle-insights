// Core data types for Style Bundle Gifting Insights Engine

export interface Occasion {
  occasion_id: string;
  name: string;
  slug: string;
  category: 'life_milestone' | 'calendar' | 'cultural' | 'professional' | 'spontaneous' | 'sympathy';
  short_description: string;
  long_description: string;
  season: string;
  season_start_month?: number;
  season_end_month?: number;
  is_year_round: boolean;
  price_tier_low_aud: number;
  price_tier_high_aud: number;
  price_tier_label: string;
  typical_recipients: string[];
  lead_time_min_days: number;
  lead_time_max_days: number;
  au_cultural_notes: string;
  sensitivity_flag: boolean;
  sensitivity_notes?: string;
  market_size_aud?: number;
  participation_rate_pct?: number;
  avg_spend_aud?: number;
  hero_image_url: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface Sentiment {
  sentiment_id: string;
  name: string;
  slug: string;
  family: 'love' | 'gratitude' | 'celebration' | 'comfort' | 'encouragement' | 'acknowledgement' | 'apology' | 'nostalgia' | 'playful';
  short_definition: string;
  long_definition: string;
  tone_descriptors: string[];
  visual_cues_palette: string[];
  visual_cues_textures: string[];
  visual_cues_motifs: string[];
  message_conventions_au: string;
  dominant_in_occasions: string[];
  avoid_in_occasions: string[];
  hero_image_url: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface OccasionSentimentRelationship {
  relationship_id: string;
  occasion_id: string;
  sentiment_id: string;
  strength: 'primary' | 'secondary' | 'rare';
  strength_score: number;
  editorial_note: string;
  recommended_bundle_ids: string[];
  product_keywords: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Persona {
  persona_id: string;
  name: string;
  slug: string;
  short_summary: string;
  long_description: string;
  gender: string;
  age_min: number;
  age_max: number;
  household_income_min_aud?: number;
  location_type: string;
  occupation_archetype: string;
  motivations: string[];
  price_band_min_aud: number;
  price_band_max_aud: number;
  preferred_channels: string[];
  top_occasion_ids: string[];
  top_sentiment_ids: string[];
  commercial_priority: 'high' | 'medium' | 'low';
  strategic_insight: string;
  avatar_image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface BundleArchetype {
  bundle_id: string;
  concept_name: string;
  slug: string;
  tagline: string;
  concept_description: string;
  occasion_ids: string[];
  sentiment_ids: string[];
  persona_fit_ids: string[];
  price_tier: string;
  price_min_aud: number;
  price_max_aud: number;
  product_categories: string[];
  recommended_format: string;
  service_model: string;
  stylebundle_product_url?: string;
  stylebundle_product_sku?: string;
  hero_image_url: string;
  status: string;
  seasonality: string;
  sustainability_notes: string;
  cultural_considerations?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface Tag {
  tag_id: string;
  name: string;
  slug: string;
  tag_type: 'theme' | 'commercial' | 'sensitivity' | 'audience';
  description: string;
  colour_hex: string;
  usage_count: number;
  created_at: string;
  created_by: string;
}

export interface EntityTag {
  entity_tag_id: string;
  tag_id: string;
  entity_type: 'occasion' | 'sentiment' | 'bundle' | 'persona';
  entity_id: string;
  created_at: string;
  created_by: string;
}

export interface MediaAsset {
  media_id: string;
  entity_type: 'occasion' | 'sentiment' | 'bundle' | 'persona';
  entity_id: string;
  role: 'hero' | 'mood_board';
  slot_index?: number;
  file_url: string;
  file_name: string;
  mime_type: string;
  file_size_bytes: number;
  width_px?: number;
  height_px?: number;
  alt_text: string;
  caption?: string;
  credit?: string;
  is_placeholder: boolean;
  is_active: boolean;
  created_at: string;
  created_by: string;
}

export interface VersionLog {
  version_id: string;
  entity_type: string;
  entity_id: string;
  action: 'create' | 'update' | 'delete';
  field_changed?: string;
  old_value?: string;
  new_value?: string;
  version_note: string;
  changed_by: string;
  changed_at: string;
  ip_address?: string;
}

export interface User {
  user_id: string;
  email: string;
  display_name: string;
  role: 'admin' | 'editor' | 'viewer';
  team: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
}

// Matrix cell type for cross-filter view
export interface MatrixCell {
  occasion: Occasion;
  sentiment: Sentiment;
  relationship?: OccasionSentimentRelationship;
  matchingBundles: BundleArchetype[];
  matchingPersonas: Persona[];
}

// Filter state types
export interface FilterState {
  categories: string[];
  seasons: string[];
  priceTiers: string[];
  sentimentFamilies: string[];
  personaIds: string[];
  searchQuery: string;
}
