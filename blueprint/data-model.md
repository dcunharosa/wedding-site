# Blueprint: Data Model Spec

## Prisma Schema Entities

### AdminUser
```prisma
model AdminUser {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String
  passwordHash  String
  role          String    @default("ADMIN") // SUPER_ADMIN | ADMIN
  createdAt     DateTime  @default(now())
  lastLoginAt   DateTime?
}
```

### Household
```prisma
model Household {
  id                   String           @id @default(uuid())
  displayName          String
  rsvpTokenHash        String           @unique
  rsvpLastSubmittedAt  DateTime?
  notes                String?
  guests               Guest[]
  rsvpSubmissions      RsvpSubmission[]
  createdAt            DateTime         @default(now())
  updatedAt            DateTime         @updatedAt
}
```

### Guest
```prisma
model Guest {
  id                        String               @id @default(uuid())
  householdId               String
  household                 Household            @relation(fields: [householdId], references: [id])
  firstName                 String
  lastName                  String
  email                     String?
  phone                     String?
  isPrimary                 Boolean              @default(false)
  attendanceRequiresGuestId String?
  requiredGuest             Guest?               @relation("Dependency", fields: [attendanceRequiresGuestId], references: [id])
  dependentGuests           Guest[]              @relation("Dependency")
  responses                 RsvpGuestResponse[]
  createdAt                 DateTime             @default(now())
  updatedAt                 DateTime             @updatedAt
}
```

### RsvpSubmission
```prisma
model RsvpSubmission {
  id             String                @id @default(uuid())
  householdId    String
  household      Household             @relation(fields: [householdId], references: [id])
  submittedAt    DateTime              @default(now())
  actorType      String                // GUEST | ADMIN
  actorAdminId   String?
  ip             String?
  userAgent      String?
  responses      RsvpGuestResponse[]
  extras         RsvpHouseholdExtras?
}
```

### RsvpGuestResponse
```prisma
model RsvpGuestResponse {
  id                 String         @id @default(uuid())
  submissionId       String
  submission         RsvpSubmission @relation(fields: [submissionId], references: [id])
  guestId            String
  guest              Guest          @relation(fields: [guestId], references: [id])
  attending          Boolean
  dietaryRestrictions String?
}
```

### RsvpHouseholdExtras
```prisma
model RsvpHouseholdExtras {
  id                   String         @id @default(uuid())
  submissionId         String         @unique
  submission           RsvpSubmission @relation(fields: [submissionId], references: [id])
  songRequestText      String?
  songRequestSpotifyUrl String?
}
```

### Content (CMS)
```prisma
model Content {
  id               String   @id @default(uuid())
  key              String   @unique // e.g. "HOME_HERO"
  json             Json     // Structured content
  updatedAt        DateTime @updatedAt
  updatedByAdminId String?
}
```

### MediaAsset
```prisma
model MediaAsset {
  id               String   @id @default(uuid())
  storageKey       String
  url              String
  altText          String?
  caption          String?
  width            Int?
  height           Int?
  mimeType         String
  focalX           Float?   // 0..1
  focalY           Float?   // 0..1
  createdAt        DateTime @default(now())
  createdByAdminId String?
}
```

### AuditLog
```prisma
model AuditLog {
  id           String   @id @default(uuid())
  createdAt    DateTime @default(now())
  actorType    String   // ADMIN | GUEST | SYSTEM
  actorAdminId String?
  householdId  String?
  action       String
  entityType   String
  entityId     String
  metadata     Json?
}
```
