"use client";

import { useEffect } from "react";
import { useLauncherStore } from "@/lib/launcher-store";

export function useLauncherKeyboard() {
  const open = useLauncherStore((s) => s.open);
  const setOpen = useLauncherStore((s) => s.setOpen);
  const popNavigation = useLauncherStore((s) => s.popNavigation);
  const navigationStack = useLauncherStore((s) => s.navigationStack);
  const breadcrumbs = navigationStack.filter((l) => l.item).map((l) => l.item!.name);

  // This hook is currently unused — keyboard handling is in launcher.tsx
  // Keeping for potential extraction later
}
