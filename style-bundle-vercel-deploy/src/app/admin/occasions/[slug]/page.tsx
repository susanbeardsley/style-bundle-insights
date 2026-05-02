'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import MoodBoard from '@/components/MoodBoard';
import { DataProvider, useData } from '@/components/DataProvider';
import { getSessionFromCookie, AuthSession } from '@/lib/auth';
import { formatCategory, formatDateAU } from '@/lib/utils';
import { ArrowLeft, Save, X, Trash2, Upload } from 'lucide-react';

function EditOccasionContent() {
  const params = useParams();
  const router = useRouter();
  const data = useData();
  const slug = params.slug as string;

  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const occasion = data.occasions.find(o => o.slug === slug);

  // Check for admin session
  useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('sb_session='))
      ?.split('=')[1];
    
    const existingSession = getSessionFromCookie(cookieValue);
    if (existingSession && existingSession.role === 'admin') {
      setSession(existingSession);
    } else {
      router.push('/');
    }
    setLoading(false);
  }, [router]);

  // Initialize form data when occasion loads
  useEffect(() => {
    if (occasion && !formData) {
      setFormData({
        name: occasion.name,
        slug: occasion.slug,
        category: occasion.category,
        short_description: occasion.short_description,
        long_description: occasion.long_description,
        season: occasion.season,
        is_year_round: occasion.is_year_round,
        price_tier_low_aud: occasion.price_tier_low_aud,
        price_tier_high_aud: occasion.price_tier_high_aud,
        price_tier_label: occasion.price_tier_label,
        typical_recipients: occasion.typical_recipients.join('; '),
        lead_time_min_days: occasion.lead_time_min_days,
        lead_time_max_days: occasion.lead_time_max_days,
        au_cultural_notes: occasion.au_cultural_notes,
        sensitivity_flag: occasion.sensitivity_flag,
        sensitivity_notes: occasion.sensitivity_notes || '',
        is_active: occasion.is_active,
      });
    }
  }, [occasion, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate save - in production this would call Supabase
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    alert('Changes saved successfully! (Demo mode - changes not persisted)');
    setSaving(false);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data.loaded || !occasion || !formData) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-charcoal-400">Loading...</p>
        </div>
      </div>
    );
  }

  const categories = ['life_milestone', 'calendar', 'cultural', 'professional', 'spontaneous', 'sympathy'];

  return (
    <div className="min-h-screen bg-ivory-100">
      <Header isAdmin={true} />

      {/* Back Navigation */}
      <div className="bg-white border-b border-ivory-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-charcoal-400 hover:text-gold-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-charcoal-600">
                Edit Occasion
              </h1>
              <p className="text-sm text-charcoal-400 mt-1">
                ID: {occasion.occasion_id} • Last updated: {formatDateAU(occasion.updated_at)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="btn-ghost">
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Link>
              <button type="submit" disabled={saving} className="btn-primary">
                <Save className="w-4 h-4 mr-1" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Form Sections */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-charcoal-600 mb-4">Basic Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="form-input"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{formatCategory(cat)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => handleChange('is_active', e.target.checked)}
                      className="w-4 h-4 rounded border-ivory-400 text-gold-500 focus:ring-gold-400"
                    />
                    <span className="text-sm text-charcoal-600">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sensitivity_flag}
                      onChange={(e) => handleChange('sensitivity_flag', e.target.checked)}
                      className="w-4 h-4 rounded border-ivory-400 text-amber-500 focus:ring-amber-400"
                    />
                    <span className="text-sm text-charcoal-600">Sensitive</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-charcoal-600 mb-4">Descriptions</h2>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Short Description *</label>
                  <input
                    type="text"
                    value={formData.short_description}
                    onChange={(e) => handleChange('short_description', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Long Description</label>
                  <textarea
                    value={formData.long_description}
                    onChange={(e) => handleChange('long_description', e.target.value)}
                    className="form-input min-h-[120px]"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="form-label">AU Cultural Notes</label>
                  <textarea
                    value={formData.au_cultural_notes}
                    onChange={(e) => handleChange('au_cultural_notes', e.target.value)}
                    className="form-input"
                    rows={3}
                  />
                </div>
                {formData.sensitivity_flag && (
                  <div>
                    <label className="form-label">Sensitivity Notes</label>
                    <textarea
                      value={formData.sensitivity_notes}
                      onChange={(e) => handleChange('sensitivity_notes', e.target.value)}
                      className="form-input"
                      rows={2}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Timing & Pricing */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-charcoal-600 mb-4">Timing & Pricing</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Season</label>
                  <input
                    type="text"
                    value={formData.season}
                    onChange={(e) => handleChange('season', e.target.value)}
                    className="form-input"
                    placeholder="e.g., year-round, Dec, Q4"
                  />
                </div>
                <div>
                  <label className="form-label">Lead Time (Min Days)</label>
                  <input
                    type="number"
                    value={formData.lead_time_min_days}
                    onChange={(e) => handleChange('lead_time_min_days', parseInt(e.target.value))}
                    className="form-input"
                    min={0}
                  />
                </div>
                <div>
                  <label className="form-label">Lead Time (Max Days)</label>
                  <input
                    type="number"
                    value={formData.lead_time_max_days}
                    onChange={(e) => handleChange('lead_time_max_days', parseInt(e.target.value))}
                    className="form-input"
                    min={0}
                  />
                </div>
                <div>
                  <label className="form-label">Price Tier Label</label>
                  <input
                    type="text"
                    value={formData.price_tier_label}
                    onChange={(e) => handleChange('price_tier_label', e.target.value)}
                    className="form-input"
                    placeholder="e.g., mid–premium"
                  />
                </div>
                <div>
                  <label className="form-label">Price Low (AUD)</label>
                  <input
                    type="number"
                    value={formData.price_tier_low_aud}
                    onChange={(e) => handleChange('price_tier_low_aud', parseFloat(e.target.value))}
                    className="form-input"
                    min={0}
                  />
                </div>
                <div>
                  <label className="form-label">Price High (AUD)</label>
                  <input
                    type="number"
                    value={formData.price_tier_high_aud}
                    onChange={(e) => handleChange('price_tier_high_aud', parseFloat(e.target.value))}
                    className="form-input"
                    min={0}
                  />
                </div>
              </div>
            </div>

            {/* Recipients */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-charcoal-600 mb-4">Typical Recipients</h2>
              <div>
                <label className="form-label">Recipients (semicolon separated)</label>
                <input
                  type="text"
                  value={formData.typical_recipients}
                  onChange={(e) => handleChange('typical_recipients', e.target.value)}
                  className="form-input"
                  placeholder="partner; parent; friend; colleague"
                />
                <p className="text-xs text-charcoal-400 mt-1">Separate multiple recipients with semicolons</p>
              </div>
            </div>

            {/* Hero Image & Mood Board */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-charcoal-600 mb-4">Images</h2>
              <div className="space-y-6">
                <div>
                  <label className="form-label">Hero Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-20 bg-ivory-200 rounded-lg flex items-center justify-center">
                      <Upload className="w-6 h-6 text-charcoal-300" />
                    </div>
                    <button type="button" className="btn-secondary text-sm">
                      Upload Image
                    </button>
                  </div>
                </div>
                <MoodBoard 
                  assets={data.mediaAssets.filter(m => m.entity_type === 'occasion' && m.entity_id === occasion.occasion_id && m.role === 'mood_board')}
                  slots={8}
                  editable={true}
                />
              </div>
            </div>

            {/* Version Note */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-charcoal-600 mb-4">Change Notes</h2>
              <div>
                <label className="form-label">Version Note (optional)</label>
                <textarea
                  placeholder="Describe what you changed and why..."
                  className="form-input"
                  rows={2}
                />
                <p className="text-xs text-charcoal-400 mt-1">This will be recorded in the change log</p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-ivory-300">
            <button type="button" className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
              <Trash2 className="w-4 h-4" />
              Delete Occasion
            </button>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="btn-ghost">
                Cancel
              </Link>
              <button type="submit" disabled={saving} className="btn-primary">
                <Save className="w-4 h-4 mr-1" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditOccasionPage() {
  return (
    <DataProvider>
      <EditOccasionContent />
    </DataProvider>
  );
}
