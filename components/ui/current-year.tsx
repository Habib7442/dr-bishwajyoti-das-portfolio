import { cacheLife } from "next/cache";

/**
 * Current year for the © line. `new Date()` can't run in the prerender with cacheComponents on
 * (not even in a Client Component), so it's computed in a cached scope: set at build time and
 * refreshed in the background at most every 30 days ("max" profile), so it rolls over in January.
 */
export async function CurrentYear() {
  "use cache";
  cacheLife("max");
  return <>{new Date().getFullYear()}</>;
}
