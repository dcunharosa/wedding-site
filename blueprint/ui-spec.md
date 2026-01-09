# Blueprint: UI & Design Spec

## Design System (Tailwind + Radix)
- **Typography**: 
  - Serif (Editorial style, e.g., "Cormorant Garamond" or "Playfair Display") for headings.
  - Sans-serif (Clean, e.g., "Inter" or "Outfit") for body text.
- **Colors**: 
  - Primary: Off-white (`#F9F9F7`), Deep Charcoal (`#1A1A1A`), Subtle Gold or Sage accent.
- **Components**: 
  - Use `shadcn/ui` as the base for Admin.
  - Custom premium components for Public Web:
    - `Hero`: Full-width image with floating large typography.
    - `EditorialSection`: Alternating text and image blocks with generous margin.
    - `StickyNav`: Simple, minimal navigation that disappears on scroll down / appears on scroll up.

## Public Web Pages
- `/`: Home. Editorial storytelling.
- `/schedule`: Minimal list of events with icons.
- `/venue`: Embedded Map (Google/Mapbox) + card-based travel info.
- `/gifts`: Text-heavy section for bank details.
- `/rsvp?t=...`: Progressive multi-step form (Guest details -> Dietary -> Song -> Confirmation).

## Admin Web Screens
- **Dashboard**: High-level stats (Target Attending vs. Actual).
- **Media Library**: Grid view of images with focal point editor (crosshair on click).
- **Content Manager**: Field-by-field editor for JSONB content keys.
- **Households**: Table with search, status filters, and "Resend Invite" quick actions.
