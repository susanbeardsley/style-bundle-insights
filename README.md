# Style Bundle — Gifting Insights Engine

An internal interactive web app for Style Bundle (stylebundle.com.au) — an Australian creative gifting agency. This app is the internal source-of-truth tool for the strategy, marketing and buying teams to navigate gifting occasions, sentiments, personas and bundle archetypes specific to the Australian market.

## 🎯 Features

- **Global Search** — Full-text search across occasions, sentiments, bundles, personas, AU notes
- **Browse Occasions** — Grid view with filters by category, season, price tier (36 records)
- **Browse Sentiments** — Grid view with filters by emotional family (15 records)
- **Browse Personas** — Card view of 6 buyer personas (Pia, Nat, Will, Sam, Jordan, Multicultural Connector)
- **Browse Bundle Archetypes** — Card view with filters by price tier and persona fit (20 records)
- **🔀 Cross-filter Matrix** — The hero feature! Visual Occasion × Sentiment matrix with Primary/Secondary/Rare colour coding. Click any cell to see matching bundles, personas, AU cultural notes, and product recommendations
- **Detail Pages** — Rich detail pages for each occasion, sentiment, persona, and bundle
- **Mood Board Slots** — 8-12 image placeholder slots per occasion and sentiment
- **Product Link Fields** — Each bundle archetype has fields for linking to stylebundle.com.au products
- **Admin Panel** — Full CRUD on all entities, tag management, image upload, version notes/change log

## 🔐 Authentication

Simple shared-password authentication:

| Role | Password | Access |
|------|----------|--------|
| Viewer | `stylebundle2024` | Read-only access to all data |
| Admin | `stylebundleadmin` | Full CRUD access + admin panel |

## 🎨 Visual Design

- Style Bundle brand: clean, premium, contemporary, warm
- Wave/ribbon motif throughout
- Soft neutral palette: ivory, sage, kraft, gold accents
- Australian English spelling (colour, favourite, organisation)
- Mobile-responsive design
- Editorial feel with generous whitespace

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + custom design tokens
- **Icons**: Lucide React
- **Data**: JSON seed data (ready for Supabase migration)
- **Deployment**: Vercel-ready

## 📦 Data Structure

All data is seeded from the Stage 1 research report:

| Table | Records | Key Fields |
|-------|---------|------------|
| occasions | 36 | id, name, category, season, price_tier, primary_sentiments, typical_recipients, lead_time_days, au_notes |
| sentiments | 15 | id, name, family, tone_descriptors, visual_cues, message_conventions_au |
| occasion_sentiment_relationships | 90 | strength (Primary/Secondary/Rare), editorial_note, product_keywords |
| personas | 6 | Pia, Nat, Will, Sam, Jordan, Multicultural Connector |
| bundle_archetypes | 20 | concept, occasions, sentiments, price_tier, product_categories, persona_fit |
| tags | 24 | Cross-cutting theme/audience/sensitivity tags |
| entity_tags | 30 | Polymorphic tag-to-entity mappings |
| media_assets | 12 | Hero & mood-board image placeholders |
| version_log | 10 | Audit trail seed examples |
| users | 8 | Sample admin/editor/viewer users |

Categories: life_milestone, calendar, cultural, professional, spontaneous, sympathy
Sentiment families: love, gratitude, celebration, comfort, encouragement, acknowledgement, apology, nostalgia, playful

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) and login with the shared password.

## 📤 Deploy to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push this repo to GitHub
2. Import to Vercel
3. Deploy — no environment variables needed for the demo

### Option 2: Vercel CLI
```bash
npm i -g vercel
vercel
```

## 🗄️ Supabase Migration (Production)

For production use with persistent data:

1. Create a Supabase project
2. Run the schema migrations in `/supabase/migrations/`
3. Import seed data from `/src/data/*.json`
4. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home (Matrix view)
│   ├── occasions/         # Occasions browse & detail
│   ├── sentiments/        # Sentiments browse & detail
│   ├── personas/          # Personas browse & detail
│   ├── bundles/           # Bundles browse & detail
│   └── admin/             # Admin panel
├── components/            # React components
│   ├── Header.tsx
│   ├── OccasionSentimentMatrix.tsx  # Hero matrix component
│   ├── OccasionCard.tsx
│   ├── SentimentCard.tsx
│   ├── PersonaCard.tsx
│   ├── BundleCard.tsx
│   ├── MoodBoard.tsx
│   ├── SearchResults.tsx
│   ├── LoginForm.tsx
│   └── DataProvider.tsx   # Data context
├── data/                  # JSON seed data
├── lib/                   # Utilities
│   ├── utils.ts
│   ├── data-loader.ts
│   └── auth.ts
└── types/                 # TypeScript definitions
    └── index.ts
```

## ✅ Definition of Done Checklist

- [x] Live shareable URL ready (deploy to Vercel)
- [x] All 5 datasets seeded (36 occasions, 15 sentiments, 6 personas, 20 bundles, 90 relationships)
- [x] Global search working
- [x] Browse Occasions with filters
- [x] Browse Sentiments with filters
- [x] Browse Personas with filters
- [x] Browse Bundle Archetypes with filters
- [x] Cross-filter matrix (hero feature) on home page
- [x] Detail pages for all entity types
- [x] Mood board placeholder slots
- [x] Product link fields on bundles
- [x] Admin panel with CRUD
- [x] Tag management
- [x] Version notes / change log
- [x] Simple role-based auth (admin vs viewer)
- [x] Mobile responsive
- [x] Australian English spelling throughout

## 📝 Notes

- All data is currently stored in JSON files for the demo
- For production, migrate to Supabase for persistence, image storage, and proper auth
- The admin panel demonstrates CRUD UI but saves are not persisted (demo mode)

---

© 2024 Style Bundle — stylebundle.com.au
