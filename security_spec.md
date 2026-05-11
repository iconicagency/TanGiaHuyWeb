# Security Specification for Tan Gia Huy CMS

## Data Invariants
- Admin users are defined in the `admins` collection by their UID.
- Public can read all content (Settings, Slides, News, Products, Company Page).
- Only authenticated admins can write (create, update, delete) content.
- `createdAt` and `updatedAt` (if used) must be server-validated.

## The Dirty Dozen Payloads (to test against)
1. Unauthenticated user trying to change the Logo URL.
2. Unauthenticated user trying to add a new admin.
3. Authenticated (but non-admin) user trying to delete a product.
4. Admin trying to inject an oversized string (resource exhaustion).
5. Admin trying to create a document with missing required fields.
6. Admin trying to spoof the `userId` in `admins` collection.
7. User trying to read sensitive admin fields without being the admin themselves (though our admins col is just for check).
8. Admin trying to update `createdAt` after creation.
9. Attacker trying to list `admins` collection.
10. Attacker trying to use a very long ID to poison paths.
11. Admin trying to set `authorized: true` in their own record without existing auth.
12. Unauthenticated user trying to read internal admin metadata.

## The Rules logic
- `isSignedIn()`
- `isAdmin()` checks `admins/$(request.auth.uid).authorized == true`
- `isValidId(id)`
- `isValid[Entity]` for each entity.
