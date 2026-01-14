# Smart Issue Board

A simple, efficient issue tracking application built for the Frontend Developer Internship Assignment.

## 🚀 Deployment
[Link to Vercel Deployment] (You will add this after deploying)

## 🛠 Tech Stack Choice
I chose **React + Vite + Firebase** for this project.

1.  **React**: It's the industry standard for dynamic UIs. Its component-based architecture is perfect for lists (IssueList) and reusable items (IssueCard).
2.  **Vite**: Chosen for its blazing fast build times and hot module replacement (HMR), greatly speeding up development compared to CRA.
3.  **Firebase (Auth & Firestore)**:
    -   **Auth**: Provides secure, ready-to-use email/password authentication without needing a complex backend.
    -   **Firestore**: A flexible NoSQL document database that allows for rapid iteration. Its real-time capabilities are a bonus, though simple fetching was used here to meet requirements.

## 🗂 Firestore Data Structure
The data is stored in a single collection named `issues`. Each document represents one issue.

**Schema:**
```json
{
  "id": "auto-generated-uid",
  "title": "String (Issue Title)",
  "description": "String (Detailed description)",
  "status": "String (Open | In Progress | Done)",
  "priority": "String (Low | Medium | High)",
  "assignedTo": "String (Email/Name of assignee)",
  "createdBy": "String (Email of creator)",
  "createdAt": "Timestamp (Server time)"
}
```

## 🔍 Handling Similar Issues
To prevent duplicate work, I implemented a "Similar Issue Detection" system in the `CreateIssue` page.

-   **Logic**: As the user types the title, the app debounces the input (waits 500ms) and queries the existing issues.
-   **Comparison**: It checks if the existing issue title *includes* the new title OR if the new title *includes* the existing one (simple substring matching).
-   **UX**: A non-intrusive warning ("Did you mean one of these?") appears with a list of matches. It does **not** block creation, as the user might have a nuanced request, but it forces them to be aware of duplicates.

## 🤯 Confusing/Challenging Aspects
-   **Firestore Text Search**: Firestore does not support native full-text search (like "fuzzy" matching) out of the box. I had to rely on client-side filtering or simple exact/prefix checks. For a real production app, I would integrate Algolia or Typesense.
-   **Status Transition Rules**: Ensuring the "Open -> Done" rule was enforced both visually and logically required state management within the card component itself.

## 🔮 Future Improvements
1.  **Pagination**: Currently, the app fetches all issues. I would implement `limit()` and `startAfter()` for infinite scroll.
2.  **Rich Text Editor**: Replace the simple textarea with a Markdown editor for better issue descriptions.
3.  **Comments**: Add a sub-collection for comments on each issue.
4.  **Drag & Drop**: Implement a Kanban board view (Trello style) for moving tickets between statuses.

## 🏃‍♂️ How to Run Locally

1.  Clone the repo.
2.  `npm install`
3.  Create a `.env` file with your Firebase config.
4.  `npm run dev`
