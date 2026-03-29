# Testing Rules

## Behavioral TDD — The Only Way We Test

### The Rule

**Test the user experience, not the implementation.**

Every test answers: "What does the user see? What happens when they interact?"

If a test can pass while the UI is broken, the test is wrong.

### What We Test

- **What's visible** — `screen.getByText`, `getByRole`, `getByPlaceholderText`
- **What's NOT visible** — `queryByText` returns null
- **User interactions** — `userEvent.keyboard`, `userEvent.click`, `userEvent.type`
- **Outcomes** — after an action, what changed on screen?

### What We Don't Test

- Internal state shape (`navigationStack.length`, `selectedIndex`)
- Context values or provider internals
- CSS classes or DOM structure
- Implementation details that could change without affecting UX

### Query Priority (Testing Library)

1. `getByRole` — accessible role + name (best: most resilient)
2. `getByPlaceholderText` — for inputs
3. `getByText` — visible text (use `within()` to scope)
4. `getAllByText` — when duplicates exist (but prefer role queries)

**Never:** `getByClassName`, `getByTestId` (unless absolutely no other option)

### Scoping with Landmarks

Use `within()` to scope queries to specific UI regions:

```tsx
const results = within(screen.getByRole("region", { name: "Results" }));
const sidebar = within(screen.getByRole("navigation", { name: "Categories" }));

// Now queries are unambiguous
results.getByRole("option", { name: /NFL/ });
sidebar.getByText("NFL");
```

This requires the app to have proper ARIA landmarks — which it should anyway.

### Dealing with Duplicate Text

When the same text appears in multiple places (sidebar + results + group heading):

```tsx
// ❌ Breaks — finds multiple elements
results.getByText("NFL");

// ✅ Works — targets the interactive option specifically
results.getByRole("option", { name: /NFL/ });
```

cmdk items have `role="option"` and group headings are `aria-hidden`. Use role queries to disambiguate.

### TDD Flow

1. Write failing test describing desired behavior
2. Run it — confirm it fails for the right reason
3. Write minimum code to pass
4. Run — confirm it passes
5. Refactor without breaking tests

**No production code without a failing test first.**

### Test Structure

```tsx
describe("Feature — User-Visible Behavior", () => {
  it("describes what the user experiences", async () => {
    const { user } = renderLauncher();
    
    // Setup: get to the state we want to test
    await openLauncher(user);
    
    // Act: do what the user would do
    await user.keyboard("{Enter}");
    
    // Assert: verify what the user sees
    const results = getResults();
    expect(results.getByText("Carolina Panthers")).toBeVisible();
    expect(results.queryByText("NBA")).not.toBeInTheDocument();
  });
});
```
