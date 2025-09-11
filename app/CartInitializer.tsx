"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/hooks/useCart";

export default function CartInitializer() {
  // Opt-in autoload once at the app root
  useCart({ autoLoad: true });
  useEffect(() => {
    // no-op; presence of this component ensures hook runs on mount
  }, []);
  return null;
}
