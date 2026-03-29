import { test, expect, type Page } from "@playwright/test";

// Helpers
async function openLauncher(page: Page) {
  // Click the Open Launcher button — keyboard shortcuts vary by OS in headless
  await page.getByRole("button", { name: /open launcher/i }).click();
  await page.getByRole("dialog").waitFor();
}

function getResults(page: Page) {
  return page.getByRole("region", { name: "Results" });
}

function getSidebar(page: Page) {
  return page.getByRole("navigation", { name: "Categories" });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  // Clear localStorage between tests
  await page.evaluate(() => localStorage.clear());
});

// ─── Opening & Closing ───

test.describe("Opening and Closing", () => {
  test("launcher is not visible on load", async ({ page }) => {
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("opens when ⌘K is pressed", async ({ page }) => {
    await openLauncher(page);
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("shows all leagues in results", async ({ page }) => {
    await openLauncher(page);
    const results = getResults(page);
    await expect(results.getByRole("option", { name: /NFL/ })).toBeVisible();
    await expect(results.getByRole("option", { name: /NBA/ })).toBeVisible();
    await expect(results.getByRole("option", { name: /MLB/ })).toBeVisible();
    await expect(results.getByRole("option", { name: /NHL/ })).toBeVisible();
    await expect(results.getByRole("option", { name: /MLS/ })).toBeVisible();
    await expect(
      results.getByRole("option", { name: /College Sports/ })
    ).toBeVisible();
    await expect(
      results.getByRole("option", { name: /Golf/ })
    ).toBeVisible();
  });

  test("shows external links", async ({ page }) => {
    await openLauncher(page);
    const results = getResults(page);
    await expect(
      results.getByRole("option", { name: /ESPN/ })
    ).toBeVisible();
    await expect(
      results.getByRole("option", { name: /The Athletic/ })
    ).toBeVisible();
  });

  test("shows sidebar categories", async ({ page }) => {
    await openLauncher(page);
    const sidebar = getSidebar(page);
    await expect(sidebar.getByText("All")).toBeVisible();
    await expect(sidebar.getByText("Recent")).toBeVisible();
    await expect(sidebar.getByText("Favorites")).toBeVisible();
    await expect(sidebar.getByText("NFL")).toBeVisible();
    await expect(sidebar.getByText("NBA")).toBeVisible();
  });

  test("closes when Escape is pressed at root", async ({ page }) => {
    await openLauncher(page);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});

// ─── Drill Down ───

test.describe("Drill Down", () => {
  test("drills into NFL on Enter", async ({ page }) => {
    await openLauncher(page);
    await page.keyboard.press("Enter");

    const results = getResults(page);
    await expect(
      results.getByRole("option", { name: /Carolina Panthers/ })
    ).toBeVisible();
    await expect(
      results.getByRole("option", { name: /Kansas City Chiefs/ })
    ).toBeVisible();
    // Other leagues gone
    await expect(
      results.getByRole("option", { name: /NBA/ })
    ).not.toBeVisible();
  });

  test("shows breadcrumb after drilling", async ({ page }) => {
    await openLauncher(page);
    await page.keyboard.press("Enter");
    // Breadcrumb root button
    await expect(page.getByRole("button", { name: "sports" })).toBeVisible();
    // NFL badge in breadcrumb
    await expect(page.locator("[data-slot='badge']").getByText("NFL")).toBeVisible();
  });

  test("drills two levels: NFL → Panthers → sub-pages", async ({ page }) => {
    await openLauncher(page);
    await page.keyboard.press("Enter"); // NFL
    await page.keyboard.press("Enter"); // Panthers

    const results = getResults(page);
    await expect(results.getByRole("option", { name: /Schedule/ })).toBeVisible();
    await expect(results.getByRole("option", { name: /Roster/ })).toBeVisible();
    await expect(results.getByRole("option", { name: /Stats/ })).toBeVisible();
    await expect(results.getByRole("option", { name: /Standings/ })).toBeVisible();
    await expect(results.getByRole("option", { name: /News/ })).toBeVisible();
  });

  test("Escape goes back one level", async ({ page }) => {
    await openLauncher(page);
    await page.keyboard.press("Enter"); // NFL
    await page.keyboard.press("Enter"); // Panthers

    await expect(getResults(page).getByRole("option", { name: /Schedule/ })).toBeVisible();

    await page.keyboard.press("Escape"); // back to NFL teams

    await expect(
      getResults(page).getByRole("option", { name: /Carolina Panthers/ })
    ).toBeVisible();
    await expect(getResults(page).getByRole("option", { name: /Schedule/ })).not.toBeVisible();
  });

  test("Escape from first drill goes to root", async ({ page }) => {
    await openLauncher(page);
    await page.keyboard.press("Enter"); // NFL
    await page.keyboard.press("Escape"); // root

    await expect(
      getResults(page).getByRole("option", { name: /NBA/ })
    ).toBeVisible();
  });

  test("three Escapes: drill → back → back → close", async ({ page }) => {
    await openLauncher(page);
    await page.keyboard.press("Enter"); // NFL
    await page.keyboard.press("Escape"); // root
    await page.keyboard.press("Escape"); // close

    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("arrow down + Enter drills into second item", async ({ page }) => {
    await openLauncher(page);
    await page.keyboard.press("ArrowDown"); // NBA
    await page.keyboard.press("Enter");

    const results = getResults(page);
    await expect(
      results.getByRole("option", { name: /Portland Trail Blazers/ })
    ).toBeVisible();
  });
});

// ─── Search ───

test.describe("Search", () => {
  test("filters results as user types", async ({ page }) => {
    await openLauncher(page);
    await page.locator("[cmdk-input]").fill("golf");

    const results = getResults(page);
    await expect(
      results.getByRole("option", { name: /Golf/ })
    ).toBeVisible();
    await expect(
      results.getByRole("option", { name: /^NFL/ })
    ).not.toBeVisible();
  });

  test("shows no results for nonsense", async ({ page }) => {
    await openLauncher(page);
    await page.locator("[cmdk-input]").fill("xyzxyzxyz");
    await expect(page.getByText(/no results/i)).toBeVisible();
  });

  test("clears search when drilling down", async ({ page }) => {
    await openLauncher(page);
    await page.keyboard.type("NFL");
    await page.keyboard.press("Enter");

    // Input cleared, showing NFL teams
    await expect(
      getResults(page).getByRole("option", { name: /Carolina Panthers/ })
    ).toBeVisible();
  });

  test("search scopes to drill-down level", async ({ page }) => {
    await openLauncher(page);
    await page.keyboard.press("Enter"); // into NFL
    await page.keyboard.type("Chiefs");

    const results = getResults(page);
    await expect(
      results.getByRole("option", { name: /Kansas City Chiefs/ })
    ).toBeVisible();
    await expect(
      results.getByRole("option", { name: /Carolina Panthers/ })
    ).not.toBeVisible();
  });
});

// ─── Sidebar ───

test.describe("Sidebar Categories", () => {
  test("clicking a category filters results", async ({ page }) => {
    await openLauncher(page);
    await getSidebar(page).getByText("NFL").click();

    const results = getResults(page);
    await expect(
      results.getByRole("option", { name: /NFL/ })
    ).toBeVisible();
    await expect(
      results.getByRole("option", { name: /NBA/ })
    ).not.toBeVisible();
  });

  test("clicking All shows everything", async ({ page }) => {
    await openLauncher(page);
    await getSidebar(page).getByText("NFL").click();
    await getSidebar(page).getByText("All").click();

    await expect(
      getResults(page).getByRole("option", { name: /NBA/ })
    ).toBeVisible();
  });

  test("switching category while drilled resets to root", async ({ page }) => {
    await openLauncher(page);
    await page.keyboard.press("Enter"); // into NFL

    await expect(
      getResults(page).getByRole("option", { name: /Carolina Panthers/ })
    ).toBeVisible();

    await getSidebar(page).getByText("NBA").click();

    await expect(
      getResults(page).getByRole("option", { name: /NBA/ })
    ).toBeVisible();
    await expect(
      getResults(page).getByRole("option", { name: /Carolina Panthers/ })
    ).not.toBeVisible();
  });
});

// ─── Favorites ───

test.describe("Favorites", () => {
  test("favorited items appear in Favorites view", async ({ page }) => {
    await openLauncher(page);

    // Hover NFL to reveal star, click it
    const nflItem = getResults(page).getByRole("option", { name: /^NFL/ });
    await nflItem.hover();
    await nflItem.locator("button").first().click();

    // Switch to Favorites
    await getSidebar(page).getByText("Favorites").click();

    await expect(
      getResults(page).getByRole("option", { name: /NFL/ })
    ).toBeVisible();
  });
});

// ─── Recents ───

test.describe("Recents", () => {
  test("recently visited items appear in Recent view", async ({ page }) => {
    await openLauncher(page);
    await page.keyboard.press("Enter"); // drill into NFL (adds to recents)
    await page.keyboard.press("Escape"); // back to root

    await getSidebar(page).getByText("Recent").click();

    await expect(
      getResults(page).getByRole("option", { name: /NFL/ })
    ).toBeVisible();
  });
});

// ─── Breadcrumbs ───

test.describe("Breadcrumb Navigation", () => {
  test("clicking root breadcrumb goes all the way back", async ({ page }) => {
    await openLauncher(page);
    await page.keyboard.press("Enter"); // NFL
    await page.keyboard.press("Enter"); // Panthers

    await page.getByRole("button", { name: "sports" }).click();

    await expect(
      getResults(page).getByRole("option", { name: /NBA/ })
    ).toBeVisible();
  });
});
