// Data loader - loads CSV data and provides in-memory data store
import {
  Occasion,
  Sentiment,
  OccasionSentimentRelationship,
  Persona,
  BundleArchetype,
  Tag,
  EntityTag,
  MediaAsset,
  VersionLog,
  User,
} from '@/types';
import { parseSemicolonList } from './utils';

// In-memory data store (simulates database)
let dataStore: {
  occasions: Occasion[];
  sentiments: Sentiment[];
  relationships: OccasionSentimentRelationship[];
  personas: Persona[];
  bundles: BundleArchetype[];
  tags: Tag[];
  entityTags: EntityTag[];
  mediaAssets: MediaAsset[];
  versionLogs: VersionLog[];
  users: User[];
  loaded: boolean;
} = {
  occasions: [],
  sentiments: [],
  relationships: [],
  personas: [],
  bundles: [],
  tags: [],
  entityTags: [],
  mediaAssets: [],
  versionLogs: [],
  users: [],
  loaded: false,
};

// Parse occasion from CSV row
function parseOccasion(row: Record<string, string>): Occasion {
  return {
    occasion_id: row.occasion_id,
    name: row.name,
    slug: row.slug,
    category: row.category as Occasion['category'],
    short_description: row.short_description,
    long_description: row.long_description,
    season: row.season,
    season_start_month: row.season_start_month ? parseInt(row.season_start_month) : undefined,
    season_end_month: row.season_end_month ? parseInt(row.season_end_month) : undefined,
    is_year_round: row.is_year_round === 'true',
    price_tier_low_aud: parseFloat(row.price_tier_low_aud) || 0,
    price_tier_high_aud: parseFloat(row.price_tier_high_aud) || 0,
    price_tier_label: row.price_tier_label,
    typical_recipients: parseSemicolonList(row.typical_recipients),
    lead_time_min_days: parseInt(row.lead_time_min_days) || 0,
    lead_time_max_days: parseInt(row.lead_time_max_days) || 0,
    au_cultural_notes: row.au_cultural_notes,
    sensitivity_flag: row.sensitivity_flag === 'true',
    sensitivity_notes: row.sensitivity_notes,
    market_size_aud: row.market_size_aud ? parseFloat(row.market_size_aud) : undefined,
    participation_rate_pct: row.participation_rate_pct ? parseFloat(row.participation_rate_pct) : undefined,
    avg_spend_aud: row.avg_spend_aud ? parseFloat(row.avg_spend_aud) : undefined,
    hero_image_url: row.hero_image_url,
    icon: row.icon,
    is_active: row.is_active === 'true',
    sort_order: parseInt(row.sort_order) || 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: row.created_by,
    updated_by: row.updated_by,
  };
}

// Parse sentiment from CSV row
function parseSentiment(row: Record<string, string>): Sentiment {
  return {
    sentiment_id: row.sentiment_id,
    name: row.name,
    slug: row.slug,
    family: row.family as Sentiment['family'],
    short_definition: row.short_definition,
    long_definition: row.long_definition,
    tone_descriptors: parseSemicolonList(row.tone_descriptors),
    visual_cues_palette: parseSemicolonList(row.visual_cues_palette),
    visual_cues_textures: parseSemicolonList(row.visual_cues_textures),
    visual_cues_motifs: parseSemicolonList(row.visual_cues_motifs),
    message_conventions_au: row.message_conventions_au,
    dominant_in_occasions: parseSemicolonList(row.dominant_in_occasions),
    avoid_in_occasions: parseSemicolonList(row.avoid_in_occasions),
    hero_image_url: row.hero_image_url,
    icon: row.icon,
    is_active: row.is_active === 'true',
    sort_order: parseInt(row.sort_order) || 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: row.created_by,
    updated_by: row.updated_by,
  };
}

// Parse relationship from CSV row
function parseRelationship(row: Record<string, string>): OccasionSentimentRelationship {
  return {
    relationship_id: row.relationship_id,
    occasion_id: row.occasion_id,
    sentiment_id: row.sentiment_id,
    strength: row.strength as OccasionSentimentRelationship['strength'],
    strength_score: parseInt(row.strength_score) || 0,
    editorial_note: row.editorial_note,
    recommended_bundle_ids: parseSemicolonList(row.recommended_bundle_ids),
    product_keywords: parseSemicolonList(row.product_keywords),
    is_active: row.is_active === 'true',
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// Parse persona from CSV row
function parsePersona(row: Record<string, string>): Persona {
  return {
    persona_id: row.persona_id,
    name: row.name,
    slug: row.slug,
    short_summary: row.short_summary,
    long_description: row.long_description,
    gender: row.gender,
    age_min: parseInt(row.age_min) || 0,
    age_max: parseInt(row.age_max) || 0,
    household_income_min_aud: row.household_income_min_aud ? parseInt(row.household_income_min_aud) : undefined,
    location_type: row.location_type,
    occupation_archetype: row.occupation_archetype,
    motivations: parseSemicolonList(row.motivations),
    price_band_min_aud: parseFloat(row.price_band_min_aud) || 0,
    price_band_max_aud: parseFloat(row.price_band_max_aud) || 0,
    preferred_channels: parseSemicolonList(row.preferred_channels),
    top_occasion_ids: parseSemicolonList(row.top_occasion_ids),
    top_sentiment_ids: parseSemicolonList(row.top_sentiment_ids),
    commercial_priority: row.commercial_priority as Persona['commercial_priority'],
    strategic_insight: row.strategic_insight,
    avatar_image_url: row.avatar_image_url,
    is_active: row.is_active === 'true',
    sort_order: parseInt(row.sort_order) || 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: row.created_by,
    updated_by: row.updated_by,
  };
}

// Parse bundle from CSV row
function parseBundle(row: Record<string, string>): BundleArchetype {
  return {
    bundle_id: row.bundle_id,
    concept_name: row.concept_name,
    slug: row.slug,
    tagline: row.tagline,
    concept_description: row.concept_description,
    occasion_ids: parseSemicolonList(row.occasion_ids),
    sentiment_ids: parseSemicolonList(row.sentiment_ids),
    persona_fit_ids: parseSemicolonList(row.persona_fit_ids),
    price_tier: row.price_tier,
    price_min_aud: parseFloat(row.price_min_aud) || 0,
    price_max_aud: parseFloat(row.price_max_aud) || 0,
    product_categories: parseSemicolonList(row.product_categories),
    recommended_format: row.recommended_format,
    service_model: row.service_model,
    stylebundle_product_url: row.stylebundle_product_url,
    stylebundle_product_sku: row.stylebundle_product_sku,
    hero_image_url: row.hero_image_url,
    status: row.status,
    seasonality: row.seasonality,
    sustainability_notes: row.sustainability_notes,
    cultural_considerations: row.cultural_considerations,
    is_active: row.is_active === 'true',
    sort_order: parseInt(row.sort_order) || 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: row.created_by,
    updated_by: row.updated_by,
  };
}

// Parse tag from CSV row
function parseTag(row: Record<string, string>): Tag {
  return {
    tag_id: row.tag_id,
    name: row.name,
    slug: row.slug,
    tag_type: row.tag_type as Tag['tag_type'],
    description: row.description,
    colour_hex: row.colour_hex,
    usage_count: parseInt(row.usage_count) || 0,
    created_at: row.created_at,
    created_by: row.created_by,
  };
}

// Parse entity tag from CSV row
function parseEntityTag(row: Record<string, string>): EntityTag {
  return {
    entity_tag_id: row.entity_tag_id,
    tag_id: row.tag_id,
    entity_type: row.entity_type as EntityTag['entity_type'],
    entity_id: row.entity_id,
    created_at: row.created_at,
    created_by: row.created_by,
  };
}

// Parse media asset from CSV row
function parseMediaAsset(row: Record<string, string>): MediaAsset {
  return {
    media_id: row.media_id,
    entity_type: row.entity_type as MediaAsset['entity_type'],
    entity_id: row.entity_id,
    role: row.role as MediaAsset['role'],
    slot_index: row.slot_index ? parseInt(row.slot_index) : undefined,
    file_url: row.file_url,
    file_name: row.file_name,
    mime_type: row.mime_type,
    file_size_bytes: parseInt(row.file_size_bytes) || 0,
    width_px: row.width_px ? parseInt(row.width_px) : undefined,
    height_px: row.height_px ? parseInt(row.height_px) : undefined,
    alt_text: row.alt_text,
    caption: row.caption,
    credit: row.credit,
    is_placeholder: row.is_placeholder === 'true',
    is_active: row.is_active === 'true',
    created_at: row.created_at,
    created_by: row.created_by,
  };
}

// Parse version log from CSV row
function parseVersionLog(row: Record<string, string>): VersionLog {
  return {
    version_id: row.version_id,
    entity_type: row.entity_type,
    entity_id: row.entity_id,
    action: row.action as VersionLog['action'],
    field_changed: row.field_changed,
    old_value: row.old_value,
    new_value: row.new_value,
    version_note: row.version_note,
    changed_by: row.changed_by,
    changed_at: row.changed_at,
    ip_address: row.ip_address,
  };
}

// Parse user from CSV row
function parseUser(row: Record<string, string>): User {
  return {
    user_id: row.user_id,
    email: row.email,
    display_name: row.display_name,
    role: row.role as User['role'],
    team: row.team,
    is_active: row.is_active === 'true',
    last_login_at: row.last_login_at,
    created_at: row.created_at,
  };
}

// Load and parse CSV data
export function loadData(csvData: {
  occasions: Record<string, string>[];
  sentiments: Record<string, string>[];
  relationships: Record<string, string>[];
  personas: Record<string, string>[];
  bundles: Record<string, string>[];
  tags: Record<string, string>[];
  entityTags: Record<string, string>[];
  mediaAssets: Record<string, string>[];
  versionLogs: Record<string, string>[];
  users: Record<string, string>[];
}) {
  dataStore = {
    occasions: csvData.occasions.map(parseOccasion),
    sentiments: csvData.sentiments.map(parseSentiment),
    relationships: csvData.relationships.map(parseRelationship),
    personas: csvData.personas.map(parsePersona),
    bundles: csvData.bundles.map(parseBundle),
    tags: csvData.tags.map(parseTag),
    entityTags: csvData.entityTags.map(parseEntityTag),
    mediaAssets: csvData.mediaAssets.map(parseMediaAsset),
    versionLogs: csvData.versionLogs.map(parseVersionLog),
    users: csvData.users.map(parseUser),
    loaded: true,
  };
  return dataStore;
}

// Get data store
export function getDataStore() {
  return dataStore;
}

// Data accessor functions
export function getOccasions() {
  return dataStore.occasions.filter(o => o.is_active);
}

export function getOccasionById(id: string) {
  return dataStore.occasions.find(o => o.occasion_id === id);
}

export function getOccasionBySlug(slug: string) {
  return dataStore.occasions.find(o => o.slug === slug);
}

export function getSentiments() {
  return dataStore.sentiments.filter(s => s.is_active);
}

export function getSentimentById(id: string) {
  return dataStore.sentiments.find(s => s.sentiment_id === id);
}

export function getSentimentBySlug(slug: string) {
  return dataStore.sentiments.find(s => s.slug === slug);
}

export function getPersonas() {
  return dataStore.personas.filter(p => p.is_active);
}

export function getPersonaById(id: string) {
  return dataStore.personas.find(p => p.persona_id === id);
}

export function getPersonaBySlug(slug: string) {
  return dataStore.personas.find(p => p.slug === slug);
}

export function getBundles() {
  return dataStore.bundles.filter(b => b.is_active);
}

export function getBundleById(id: string) {
  return dataStore.bundles.find(b => b.bundle_id === id);
}

export function getBundleBySlug(slug: string) {
  return dataStore.bundles.find(b => b.slug === slug);
}

export function getRelationships() {
  return dataStore.relationships.filter(r => r.is_active);
}

export function getRelationship(occasionId: string, sentimentId: string) {
  return dataStore.relationships.find(
    r => r.occasion_id === occasionId && r.sentiment_id === sentimentId && r.is_active
  );
}

export function getTags() {
  return dataStore.tags;
}

export function getEntityTags(entityType: string, entityId: string) {
  return dataStore.entityTags.filter(
    et => et.entity_type === entityType && et.entity_id === entityId
  );
}

export function getMediaAssets(entityType: string, entityId: string) {
  return dataStore.mediaAssets.filter(
    ma => ma.entity_type === entityType && ma.entity_id === entityId && ma.is_active
  );
}

export function getVersionLogs(entityType?: string, entityId?: string) {
  if (entityType && entityId) {
    return dataStore.versionLogs.filter(
      vl => vl.entity_type === entityType && vl.entity_id === entityId
    );
  }
  return dataStore.versionLogs;
}

export function getUsers() {
  return dataStore.users.filter(u => u.is_active);
}

// Search function - full text across all entities
export function globalSearch(query: string) {
  const q = query.toLowerCase();
  
  const occasions = dataStore.occasions.filter(o => 
    o.is_active && (
      o.name.toLowerCase().includes(q) ||
      o.short_description.toLowerCase().includes(q) ||
      o.long_description.toLowerCase().includes(q) ||
      o.au_cultural_notes.toLowerCase().includes(q) ||
      o.category.toLowerCase().includes(q)
    )
  );

  const sentiments = dataStore.sentiments.filter(s =>
    s.is_active && (
      s.name.toLowerCase().includes(q) ||
      s.short_definition.toLowerCase().includes(q) ||
      s.long_definition.toLowerCase().includes(q) ||
      s.family.toLowerCase().includes(q) ||
      s.tone_descriptors.some(t => t.toLowerCase().includes(q))
    )
  );

  const personas = dataStore.personas.filter(p =>
    p.is_active && (
      p.name.toLowerCase().includes(q) ||
      p.short_summary.toLowerCase().includes(q) ||
      p.long_description.toLowerCase().includes(q) ||
      p.strategic_insight.toLowerCase().includes(q)
    )
  );

  const bundles = dataStore.bundles.filter(b =>
    b.is_active && (
      b.concept_name.toLowerCase().includes(q) ||
      b.tagline.toLowerCase().includes(q) ||
      b.concept_description.toLowerCase().includes(q) ||
      b.product_categories.some(c => c.toLowerCase().includes(q))
    )
  );

  return { occasions, sentiments, personas, bundles };
}

// Get bundles for a specific occasion-sentiment relationship
export function getBundlesForRelationship(occasionId: string, sentimentId: string) {
  return dataStore.bundles.filter(b =>
    b.is_active &&
    b.occasion_ids.includes(occasionId) &&
    b.sentiment_ids.includes(sentimentId)
  );
}

// Get personas that match certain occasions and sentiments
export function getMatchingPersonas(occasionId: string, sentimentId: string) {
  return dataStore.personas.filter(p =>
    p.is_active &&
    (p.top_occasion_ids.includes(occasionId) || p.top_sentiment_ids.includes(sentimentId))
  );
}

// Update functions for admin panel
export function updateOccasion(id: string, updates: Partial<Occasion>) {
  const index = dataStore.occasions.findIndex(o => o.occasion_id === id);
  if (index !== -1) {
    dataStore.occasions[index] = { ...dataStore.occasions[index], ...updates, updated_at: new Date().toISOString() };
    return dataStore.occasions[index];
  }
  return null;
}

export function updateSentiment(id: string, updates: Partial<Sentiment>) {
  const index = dataStore.sentiments.findIndex(s => s.sentiment_id === id);
  if (index !== -1) {
    dataStore.sentiments[index] = { ...dataStore.sentiments[index], ...updates, updated_at: new Date().toISOString() };
    return dataStore.sentiments[index];
  }
  return null;
}

export function updateBundle(id: string, updates: Partial<BundleArchetype>) {
  const index = dataStore.bundles.findIndex(b => b.bundle_id === id);
  if (index !== -1) {
    dataStore.bundles[index] = { ...dataStore.bundles[index], ...updates, updated_at: new Date().toISOString() };
    return dataStore.bundles[index];
  }
  return null;
}

export function updatePersona(id: string, updates: Partial<Persona>) {
  const index = dataStore.personas.findIndex(p => p.persona_id === id);
  if (index !== -1) {
    dataStore.personas[index] = { ...dataStore.personas[index], ...updates, updated_at: new Date().toISOString() };
    return dataStore.personas[index];
  }
  return null;
}

export function addVersionLog(log: Omit<VersionLog, 'version_id' | 'changed_at'>) {
  const newLog: VersionLog = {
    ...log,
    version_id: `VER-${String(dataStore.versionLogs.length + 1).padStart(3, '0')}`,
    changed_at: new Date().toISOString(),
  };
  dataStore.versionLogs.push(newLog);
  return newLog;
}

export function setDataStore(newStore: typeof dataStore) {
  dataStore = newStore;
}
