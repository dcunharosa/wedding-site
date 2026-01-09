# Blueprint: API Specification

## Authentication
- **Admin**: JWT-based. `POST /admin/auth/login` returns a token. Use `Authorization: Bearer <token>` for all `/admin/*` routes.
- **RSVP**: Token-based. `?t=RAW_TOKEN` verified against `sha256(RAW_TOKEN)` in DB.

## Key Endpoints

### Public API
- `GET /public/content?keys=...`: Fetch JSONB content records.
- `GET /public/rsvp/household?t=TOKEN`: Fetch household & guests for RSVP page.
- `POST /public/rsvp/submit?t=TOKEN`: Submit RSVP.
  - Body: `{ responses: [{ guestId, attending, dietaryRestrictions }], songRequestText, songRequestSpotifyUrl }`
  - Rule: Enforce `attendanceRequiresGuestId` (Dependent guest cannot attend if Primary guest is No).
- `POST /public/rsvp/change-request?t=TOKEN`: Submit message after deadline.

### Admin API
- `POST /admin/households`: Create household with automatic guest generation.
- `PATCH /admin/households/:id`: Update details.
- `POST /admin/invites/email/send`: Bulk send via configured provider.
- `GET /admin/exports/:type.csv`: Download pre-defined CSVs (households, guests, etc).
- `POST /admin/media/upload-url`: Get signed URL for S3/R2 upload.

## Business Logic (Execution Requirements)
1. **RSVP Deadline**: Fetch from global config. If `now() > deadline`, disable `POST /submit` and permit `POST /change-request`.
2. **Dependency Rule**: 
   - If `Guest.attending == false` AND `Guest.id == Dependent.attendanceRequiresGuestId`, then force `Dependent.attending = false`.
   - UI should disable the dependent's toggle if the primary's toggle is "No".
3. **Latest Submission Wins**: Every `POST /submit` creates a new `RsvpSubmission`. The "current state" is derived from the latest submission timestamp for that household.
