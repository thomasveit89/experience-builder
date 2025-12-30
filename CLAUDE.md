# Joyo – AI Gift Journey Builder

## Product Overview

Joyo is a SaaS platform that enables creators to generate emotional "gift journeys" (interactive story screens + questions + media) via AI chat, then publish them to a unique URL that recipients experience as a delightful, guided flow.

**Brand**: Joyo (rebranded from "experience-builder")

---

## Tech Stack (Current Implementation)

### Frontend
- **Next.js 16.1.0** (App Router, Turbopack)
- **React 19** with Server Components
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **next-intl** for internationalization (EN/DE)
- **Framer Motion** for animations (drag-drop reordering)
- **canvas-confetti** for celebrations

### Backend & Database
- **Supabase** (Postgres + Auth)
  - Auth: Magic link email authentication
  - Database: Projects, nodes, assets, profiles tables
  - Storage: Asset management (images)
- **Server Actions** for CRUD operations (src/app/actions/nodes.ts)

### AI & Media
- **Anthropic Claude API** (Sonnet 4.5) for flow generation
- **Unsplash API** for image search and selection
- Custom image upload system with URL validation

### Hosting
- **Vercel** (Next.js deployment)
- **Supabase** (Database + Auth)

---

## Project Structure

```
src/
├── app/
│   ├── [locale]/              # Locale-based routing (en, de)
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Creator dashboard
│   │   │   ├── new/          # AI chat interface
│   │   │   └── projects/[id]/ # Flow editor
│   │   ├── play/[slug]/      # Public recipient player
│   │   └── preview/[id]/     # Private preview for creator
│   ├── actions/               # Server actions
│   ├── layout.tsx            # Root layout (HTML/body)
│   └── globals.css
├── components/
│   ├── chat/                 # AI chat interface
│   ├── dashboard/            # Dashboard components
│   ├── editor/               # Flow editor suite
│   │   ├── add-screen-dialog.tsx
│   │   ├── flow-editor.tsx
│   │   ├── image-picker.tsx
│   │   ├── live-preview.tsx
│   │   ├── node-editor.tsx
│   │   ├── node-list.tsx
│   │   ├── publish-dialog.tsx
│   │   └── theme-selector.tsx
│   ├── player/               # Recipient player
│   │   ├── player.tsx
│   │   └── screens/          # Screen type components
│   ├── ui/                   # shadcn components
│   └── language-switcher.tsx
├── i18n/
│   ├── config.ts             # Locale configuration
│   └── request.ts            # next-intl setup
├── lib/
│   └── supabase/             # Supabase client/server
├── types/
│   ├── assets.ts
│   └── flow.ts               # Core type definitions
└── middleware.ts             # I18n + Supabase middleware

messages/
├── en.json                   # English translations (~350+ keys)
└── de.json                   # German translations (~350+ keys)

supabase/
└── migrations/
    ├── 001_initial_schema.sql
    ├── 002_add_assets_table.sql
    └── 003_add_language_support.sql
```

---

## Core Data Models

### Project (Gift)
```typescript
{
  id: string;
  userId: string;
  title: string;
  description: string;
  theme: Theme;
  language: 'en' | 'de';
  published: boolean;
  shareSlug: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### Node (Screen)
```typescript
{
  id: string;
  projectId: string;
  type: NodeType;  // 'hero' | 'choice' | 'text-input' | 'reveal' | 'media' | 'end'
  orderIndex: number;
  content: NodeContent;  // Type-specific content
}
```

### Node Types
1. **Hero** - Story screen with headline, body, optional background image
2. **Choice** - Multiple choice question (2-4 options, single/multi-select)
3. **Text Input** - Free-form text answer with validation
4. **Reveal** - Big reveal moment with confetti, CTA button
5. **Media** - Full-screen image display with caption
6. **End** - Final screen (auto-generated)

### Themes
- `playful-pastel` - Light, cheerful with soft colors
- `elegant-dark` - Sophisticated with dark tones
- `warm-mediterranean` - Warm, inviting earth tones
- `minimal-zen` - Clean, simple, calming

---

## Internationalization (i18n)

### Implementation
- **Library**: next-intl
- **Supported Locales**: English (en), German (de)
- **Default Locale**: English
- **Routing Strategy**: `localePrefix: 'as-needed'`
  - English: `/dashboard` or `/en/dashboard`
  - German: `/de/dashboard`

### Key Files
- `src/i18n/config.ts` - Locale constants and types
- `src/i18n/request.ts` - next-intl request configuration
- `messages/en.json` - English translations
- `messages/de.json` - German translations
- `src/middleware.ts` - Combined i18n + Supabase middleware

### Translation Usage Patterns

**Server Components:**
```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return <h1>{t('title')}</h1>;
}
```

**Client Components:**
```typescript
'use client';
import { useTranslations } from 'next-intl';

export function Component() {
  const t = useTranslations('editor.nodeList');
  return <button>{t('addScreen')}</button>;
}
```

**Getting Locale in Client Components:**
```typescript
import { useParams } from 'next/navigation';

const params = useParams();
const locale = params.locale as string;
```

### Translation Structure
All translations organized by feature area:
- `app.*` - App branding
- `auth.*` - Authentication flows
- `dashboard.*` - Dashboard UI
- `chat.*` - AI chat interface + examples
- `editor.*` - Flow editor, node types, dialogs
- `player.*` - Recipient player screens
- `common.*` - Shared UI elements
- `errors.*` - Error messages
- `time.*` - Relative time formatting

### Important i18n Patterns
1. **All redirects must include locale prefix**: `redirect(\`/\${locale}/dashboard\`)`
2. **Share URLs include locale**: `/\${locale}/play/\${slug}`
3. **Preview URLs include locale**: `/\${locale}/preview/\${id}`
4. **Date formatting uses locale**: `formatDistanceToNow(date, { locale: dateLocale })`

---

## Database Schema

### Tables
- `profiles` - User profiles (linked to Supabase auth)
  - `preferred_language` - User's UI language preference
- `projects` - Gift projects
  - `language` - Content language (for future multi-language gifts)
- `nodes` - Flow screens
- `assets` - Uploaded/generated media with metadata

### Key Relationships
- `projects.user_id` → `auth.users.id`
- `nodes.project_id` → `projects.id`
- `assets.project_id` → `projects.id`

---

## Key Features & Workflows

### 1. Creator Flow
1. **Login** - Magic link email authentication
2. **Dashboard** - View all gift projects
3. **Create New Gift** - AI chat interface
   - Describe gift concept
   - View categorized examples
   - AI generates complete flow
4. **Edit Flow** - Visual editor
   - Drag-drop reorder screens
   - Edit individual screens
   - Add/delete screens
   - Upload/search images
   - Select theme
   - Live preview
5. **Publish** - Generate shareable link
6. **Share** - Copy link to send to recipient

### 2. Recipient Flow
1. Receive unique URL: `/[locale]/play/[slug]`
2. Experience full-screen journey
3. Answer questions, make choices
4. Reach final reveal with confetti

### 3. AI Flow Generation
- Uses Anthropic Claude API (Sonnet 4.5)
- Structured output: array of nodes with type-specific content
- Automatic theme selection based on prompt
- Example prompts categorized: romantic, family, travel, celebrations

---

## Important Code Patterns

### Server Actions
Located in `src/app/actions/nodes.ts`:
- `addNodeAction` - Create new screen
- `updateNodeAction` - Update screen content
- `deleteNodeAction` - Delete screen
- `reorderNodesAction` - Update screen order
- `publishProjectAction` - Publish gift
- `unpublishProjectAction` - Unpublish gift
- All return `{ success: boolean, error?: string, ...data }`

### Image Management
- **Upload**: Direct upload via server action
- **Unsplash**: Search and select via API
- **Storage**: Supabase Storage bucket
- **Validation**: URL format checks, placeholder detection
- **Cleanup**: Automatic deletion of unused assets

### Theme System
Each theme defines:
- Color palette (primary, accent, muted)
- Typography settings
- Confetti configuration (colors, particle count, gravity)
- Applied globally via CSS custom properties

### Node Reordering
- Uses Framer Motion Reorder component
- Debounced server updates (500ms)
- Optimistic UI updates
- Error handling with toast notifications

---

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
UNSPLASH_ACCESS_KEY=
NEXT_PUBLIC_APP_URL=https://yourapp.com
```

---

## Development Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npx supabase db push # Apply database migrations
```

---

## Critical Implementation Notes

### 1. Locale Handling
- **ALWAYS** include locale in redirects and internal links
- **ALWAYS** use `useParams()` to get current locale in client components
- **ALWAYS** pass locale explicitly to `getTranslations()` in server components

### 2. Supabase Client Selection
- **Server Components**: Use `createClient()` from `@/lib/supabase/server`
- **Client Components**: Use `createClient()` from `@/lib/supabase/client`
- **Never** mix server/client Supabase instances

### 3. Form Validation
- Client-side validation in dialogs before submission
- Server-side validation in server actions
- Toast notifications for errors
- Clear error messages from translation files

### 4. Image Handling
- Validate URLs before displaying (check for `UNSPLASH:` placeholders)
- Skip media screens with invalid images (auto-advance)
- Clean up unused assets when nodes are deleted
- Handle both Unsplash URLs and uploaded file URLs

### 5. Layout Structure
- Root layout (`src/app/layout.tsx`): HTML/body tags + fonts
- Locale layout (`src/app/[locale]/layout.tsx`): NextIntlClientProvider + Toaster
- **Never** nest HTML/body tags - will cause hydration errors

---

## Common Debugging Scenarios

### Translation Not Showing
1. Check translation key exists in both en.json and de.json
2. Verify namespace is correct (e.g., 'editor.nodeList' not 'editor')
3. Check locale is being passed correctly to getTranslations
4. Clear .next build cache: `rm -rf .next`

### 404 on Preview/Play Routes
- Ensure URL includes locale prefix: `/de/preview/...` not `/preview/...`
- Check middleware.ts is not excluding the route

### Hydration Errors
- Check for duplicate HTML/body tags in layouts
- Verify server/client component boundaries
- Check for inconsistent rendering between server/client

### Share Link Not Working
- Verify `shareSlug` is set after publishing
- Check URL includes locale: `/${locale}/play/${slug}`
- Ensure project is marked as `published: true`

---

## Future Enhancements

### Planned Features
- Video support for media screens
- Custom fonts per theme
- Analytics dashboard (completion rates, drop-off points)
- Multi-language content (same gift in EN/DE)
- Custom domain support for share links
- PDF export of gift journey
- Recipient response collection
- Payment integration (Stripe)

### Technical Improvements
- Image optimization and lazy loading
- Edge caching for public player pages
- Real-time collaboration on flows
- Undo/redo in editor
- Keyboard shortcuts
- Accessibility improvements (WCAG AA)

---

## Code Style & Conventions

### File Naming
- Components: PascalCase (e.g., `FlowEditor.tsx`)
- Utilities: camelCase (e.g., `createClient.ts`)
- Types: PascalCase (e.g., `Project`, `NodeType`)

### Component Patterns
- Server Components by default
- Add `'use client'` only when needed (hooks, events)
- Co-locate types with components when possible
- Use shadcn/ui components for consistency

### Translation Keys
- Lowercase with dots: `editor.nodeList.addScreen`
- Group by feature area
- Keep keys descriptive and hierarchical
- Always provide both English and German

### Error Handling
- Toast notifications for user-facing errors
- Console logs for debugging
- Graceful degradation (e.g., skip invalid media screens)
- Clear error messages in user's language

---

## API Integration Notes

### Anthropic Claude API
- Model: claude-sonnet-4-5-20250929
- Used for: Flow generation from chat prompts
- Output: Structured JSON matching NodeContent types
- Rate limiting: Handle via error responses

### Unsplash API
- Used for: Image search in editor
- Returns: Photo URLs with photographer attribution
- Store: URL + alt text + photographer name
- Display: Attribution in player screens

---

## Performance Considerations

- **Server Components**: Default for better performance
- **Image Optimization**: Next.js Image component with priority flag
- **Code Splitting**: Automatic via Next.js dynamic imports
- **Caching**: Built-in Next.js caching for static pages
- **Database**: Indexed queries on frequently accessed columns

---

## Security

- **Authentication**: Supabase Auth with magic links (passwordless)
- **Authorization**: Row-Level Security (RLS) in Supabase
- **API Keys**: Stored in environment variables
- **Share Links**: Unguessable UUIDs (crypto.randomUUID())
- **CSRF**: Protected via Next.js server actions
- **XSS**: React's built-in escaping + Input validation

---

## Testing Strategy (Future)

Recommended approach:
- **Unit Tests**: Utility functions, type guards
- **Component Tests**: React Testing Library
- **E2E Tests**: Playwright for critical user flows
- **Visual Regression**: Chromatic or Percy
- **Accessibility**: axe-core integration

---

## Useful References

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Framer Motion](https://www.framer.com/motion/)
