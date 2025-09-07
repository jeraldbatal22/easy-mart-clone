import { useEffect, useState } from "react";

/**
 * useClientOnly
 * Returns true if the component is mounted on the client.
 * Useful for SSR/Next.js to avoid hydration mismatches.
 */
export function useClientOnly() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
