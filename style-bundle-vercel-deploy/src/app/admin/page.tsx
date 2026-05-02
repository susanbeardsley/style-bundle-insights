'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { DataProvider, useData } from '@/components/DataProvider';
import { validatePassword, getSessionFromCookie, AuthSession } from '@/lib/auth';
import { formatDateAU } from '@/lib/utils';
import { 
  Settings, Gift, Heart, Users, Package, Tag, History, 
  ChevronRight, Shield, Edit, Trash2, Plus, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

function AdminContent() {
  const router = useRouter();
  const data = useData();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'occasions' | 'sentiments' | 'personas' | 'bundles' | 'tags' | 'logs'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

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

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data.loaded) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-charcoal-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'occasions', label: 'Occasions', icon: Gift, count: data.occasions.length },
    { id: 'sentiments', label: 'Sentiments', icon: Heart, count: data.sentiments.length },
    { id: 'personas', label: 'Personas', icon: Users, count: data.personas.length },
    { id: 'bundles', label: 'Bundles', icon: Package, count: data.bundles.length },
    { id: 'tags', label: 'Tags', icon: Tag, count: data.tags.length },
    { id: 'logs', label: 'Change Log', icon: History, count: data.versionLogs.length },
  ];

  return (
    <div className="min-h-screen bg-ivory-100">
      <Header isAdmin={true} />

      {/* Admin Header */}
      <section className="bg-charcoal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Admin Panel</h1>
              <p className="text-sm text-charcoal-300">Manage occasions, sentiments, bundles, and more</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <nav className="lg:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-ivory-300 overflow-hidden sticky top-24">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-left border-b border-ivory-200 last:border-0 transition-colors",
                    activeTab === tab.id 
                      ? "bg-gold-50 text-gold-700" 
                      : "hover:bg-ivory-50 text-charcoal-500"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {tab.count !== undefined && (
                      <span className="text-xs px-2 py-0.5 bg-ivory-200 rounded-full">
                        {tab.count}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-charcoal-300" />
                  </div>
                </button>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-charcoal-600 mb-4">Dashboard Overview</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-gold-50 rounded-lg border border-gold-200">
                      <Gift className="w-6 h-6 text-gold-600 mb-2" />
                      <p className="text-2xl font-bold text-charcoal-600">{data.occasions.length}</p>
                      <p className="text-sm text-charcoal-400">Occasions</p>
                    </div>
                    <div className="p-4 bg-blush-light rounded-lg border border-rose-200">
                      <Heart className="w-6 h-6 text-rose-500 mb-2" />
                      <p className="text-2xl font-bold text-charcoal-600">{data.sentiments.length}</p>
                      <p className="text-sm text-charcoal-400">Sentiments</p>
                    </div>
                    <div className="p-4 bg-sage-50 rounded-lg border border-sage-200">
                      <Users className="w-6 h-6 text-sage-600 mb-2" />
                      <p className="text-2xl font-bold text-charcoal-600">{data.personas.length}</p>
                      <p className="text-sm text-charcoal-400">Personas</p>
                    </div>
                    <div className="p-4 bg-kraft-50 rounded-lg border border-kraft-200">
                      <Package className="w-6 h-6 text-kraft-600 mb-2" />
                      <p className="text-2xl font-bold text-charcoal-600">{data.bundles.length}</p>
                      <p className="text-sm text-charcoal-400">Bundles</p>
                    </div>
                  </div>
                </div>

                {/* Recent Changes */}
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-charcoal-600 mb-4">Recent Changes</h2>
                  <div className="space-y-3">
                    {data.versionLogs.slice(0, 5).map(log => (
                      <div key={log.version_id} className="flex items-start gap-3 p-3 bg-ivory-50 rounded-lg">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-medium",
                          log.action === 'create' ? 'bg-sage-100 text-sage-700' :
                          log.action === 'update' ? 'bg-gold-100 text-gold-700' :
                          'bg-red-100 text-red-700'
                        )}>
                          {log.action[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-charcoal-600">
                            <span className="font-medium capitalize">{log.action}</span>
                            {' '}{log.entity_type}{' '}
                            <span className="text-charcoal-400">{log.entity_id}</span>
                          </p>
                          {log.version_note && (
                            <p className="text-xs text-charcoal-400 mt-0.5">{log.version_note}</p>
                          )}
                          <p className="text-xs text-charcoal-300 mt-1">
                            {formatDateAU(log.changed_at)} by {log.changed_by}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Occasions Tab */}
            {activeTab === 'occasions' && (
              <div className="card">
                <div className="p-4 border-b border-ivory-200 flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
                    <input
                      type="text"
                      placeholder="Search occasions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-input pl-10 py-2"
                    />
                  </div>
                  <button className="btn-primary text-sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Occasion
                  </button>
                </div>
                <div className="divide-y divide-ivory-200">
                  {data.occasions
                    .filter(o => o.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(occasion => (
                    <div key={occasion.occasion_id} className="p-4 flex items-center justify-between hover:bg-ivory-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-charcoal-600">{occasion.name}</h3>
                          <span className="text-xs px-2 py-0.5 bg-ivory-200 rounded text-charcoal-500 capitalize">
                            {occasion.category.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-charcoal-400 truncate mt-0.5">
                          {occasion.short_description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Link
                          href={`/admin/occasions/${occasion.slug}`}
                          className="p-2 text-charcoal-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-charcoal-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sentiments Tab */}
            {activeTab === 'sentiments' && (
              <div className="card">
                <div className="p-4 border-b border-ivory-200 flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
                    <input
                      type="text"
                      placeholder="Search sentiments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-input pl-10 py-2"
                    />
                  </div>
                  <button className="btn-primary text-sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Sentiment
                  </button>
                </div>
                <div className="divide-y divide-ivory-200">
                  {data.sentiments
                    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(sentiment => (
                    <div key={sentiment.sentiment_id} className="p-4 flex items-center justify-between hover:bg-ivory-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: sentiment.visual_cues_palette[0] || '#D4AF37' }}
                          />
                          <h3 className="font-medium text-charcoal-600">{sentiment.name}</h3>
                          <span className="text-xs px-2 py-0.5 bg-ivory-200 rounded text-charcoal-500 capitalize">
                            {sentiment.family}
                          </span>
                        </div>
                        <p className="text-sm text-charcoal-400 truncate mt-0.5">
                          {sentiment.short_definition}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Link
                          href={`/admin/sentiments/${sentiment.slug}`}
                          className="p-2 text-charcoal-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-charcoal-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personas Tab */}
            {activeTab === 'personas' && (
              <div className="card">
                <div className="p-4 border-b border-ivory-200 flex items-center justify-between gap-4">
                  <h2 className="font-semibold text-charcoal-600">Manage Personas</h2>
                  <button className="btn-primary text-sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Persona
                  </button>
                </div>
                <div className="divide-y divide-ivory-200">
                  {data.personas.map(persona => (
                    <div key={persona.persona_id} className="p-4 flex items-center justify-between hover:bg-ivory-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gold-200 to-kraft-300 rounded-full flex items-center justify-center text-gold-700 font-serif font-semibold">
                          {persona.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium text-charcoal-600">{persona.name}</h3>
                          <p className="text-sm text-charcoal-400">{persona.commercial_priority} priority</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/personas/${persona.slug}`}
                          className="p-2 text-charcoal-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-charcoal-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bundles Tab */}
            {activeTab === 'bundles' && (
              <div className="card">
                <div className="p-4 border-b border-ivory-200 flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
                    <input
                      type="text"
                      placeholder="Search bundles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-input pl-10 py-2"
                    />
                  </div>
                  <button className="btn-primary text-sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Bundle
                  </button>
                </div>
                <div className="divide-y divide-ivory-200">
                  {data.bundles
                    .filter(b => b.concept_name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(bundle => (
                    <div key={bundle.bundle_id} className="p-4 flex items-center justify-between hover:bg-ivory-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-charcoal-600">{bundle.concept_name}</h3>
                          <span className="text-xs px-2 py-0.5 bg-kraft-100 text-kraft-600 rounded">
                            {bundle.price_tier}
                          </span>
                          {bundle.status === 'concept' && (
                            <span className="text-xs px-2 py-0.5 bg-charcoal-100 text-charcoal-500 rounded">
                              Concept
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-charcoal-400 truncate mt-0.5">
                          {bundle.tagline}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Link
                          href={`/admin/bundles/${bundle.slug}`}
                          className="p-2 text-charcoal-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-charcoal-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Tab */}
            {activeTab === 'tags' && (
              <div className="card">
                <div className="p-4 border-b border-ivory-200 flex items-center justify-between gap-4">
                  <h2 className="font-semibold text-charcoal-600">Manage Tags</h2>
                  <button className="btn-primary text-sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Tag
                  </button>
                </div>
                <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.tags.map(tag => (
                    <div 
                      key={tag.tag_id} 
                      className="p-3 bg-ivory-50 rounded-lg border border-ivory-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.colour_hex }}
                        />
                        <div>
                          <p className="text-sm font-medium text-charcoal-600">{tag.name}</p>
                          <p className="text-xs text-charcoal-400 capitalize">{tag.tag_type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-charcoal-400 hover:text-gold-600 rounded transition-colors">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-charcoal-400 hover:text-red-500 rounded transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Change Logs Tab */}
            {activeTab === 'logs' && (
              <div className="card">
                <div className="p-4 border-b border-ivory-200">
                  <h2 className="font-semibold text-charcoal-600">Version History / Change Log</h2>
                  <p className="text-sm text-charcoal-400 mt-1">All changes are tracked for audit purposes</p>
                </div>
                <div className="divide-y divide-ivory-200">
                  {data.versionLogs.map(log => (
                    <div key={log.version_id} className="p-4 hover:bg-ivory-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold",
                          log.action === 'create' ? 'bg-sage-100 text-sage-700' :
                          log.action === 'update' ? 'bg-gold-100 text-gold-700' :
                          'bg-red-100 text-red-700'
                        )}>
                          {log.action === 'create' ? '+' : log.action === 'update' ? '✎' : '−'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded capitalize",
                              log.action === 'create' ? 'bg-sage-100 text-sage-700' :
                              log.action === 'update' ? 'bg-gold-100 text-gold-700' :
                              'bg-red-100 text-red-700'
                            )}>
                              {log.action}
                            </span>
                            <span className="text-sm font-medium text-charcoal-600 capitalize">
                              {log.entity_type}
                            </span>
                            <span className="text-sm text-charcoal-400">
                              {log.entity_id}
                            </span>
                          </div>
                          {log.field_changed && (
                            <p className="text-sm text-charcoal-500 mt-1">
                              Field: <span className="font-medium">{log.field_changed}</span>
                              {log.old_value && (
                                <span className="text-charcoal-400"> from "{log.old_value}"</span>
                              )}
                              {log.new_value && (
                                <span className="text-charcoal-400"> to "{log.new_value}"</span>
                              )}
                            </p>
                          )}
                          {log.version_note && (
                            <p className="text-sm text-charcoal-400 italic mt-1">
                              "{log.version_note}"
                            </p>
                          )}
                          <p className="text-xs text-charcoal-300 mt-2">
                            {formatDateAU(log.changed_at)} by {log.changed_by}
                            {log.ip_address && <span> • IP: {log.ip_address}</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <DataProvider>
      <AdminContent />
    </DataProvider>
  );
}
