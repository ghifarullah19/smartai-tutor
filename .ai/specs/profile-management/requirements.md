# Profile Management Requirements

## User Stories
1. As a user, I want to be able to view my current profile data (Name, Email).
2. As a user, I want to be able to update my Name and Email so that my account information stays current.
3. As a user, I want to be able to update my password securely.
4. As a user, I want to be able to permanently delete my account from the Profile Management screen.

## Acceptance Criteria
- [ ] User can open a "Profil Saya" modal from the Profile dropdown menu.
- [ ] The modal displays the user's current Name and Email.
- [ ] The user can submit changes to Name and Email, which are reflected immediately in the UI upon success.
- [ ] The user can submit a password change.
- [ ] The user can delete their account from this modal with a confirmation prompt.
- [ ] Backend has a `PUT /account` endpoint that handles profile updates (Name, Email, Password).
- [ ] If email is updated, it must be unique and valid.
- [ ] If password is updated, the new password is hashed and saved.

## Functional Requirements
- **Frontend**: Add `ProfileModal` component. Update `ProfileMenu` to trigger the modal. Update `authStore.ts` with an `updateUser` function.
- **Backend**: Implement `PUT /account` endpoint in `app.py`. Modify `delete_account` route if needed to ensure data integrity.
