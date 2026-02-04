import { PageSchema } from '../schema/pageSchema';
import pagesData from '../page-sources/pages.json';

interface PageResolverResult {
  data: PageSchema | undefined;
  isLoading: boolean;
  error: string | null;
}

// Type assertion for imported JSON
const pages = pagesData as PageSchema[];

/**
 * Resolves a page by its pageId from the page source.
 * This is designed to be API-shaped for future Azure API integration.
 */
export function resolvePage(pageId: string): PageResolverResult {
  try {
    const page = pages.find((p) => p.pageId === pageId);
    
    return {
      data: page,
      isLoading: false,
      error: page ? null : `Page not found: ${pageId}`,
    };
  } catch (err) {
    return {
      data: undefined,
      isLoading: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Hook-style resolver for React components.
 * Returns page data in an API-ready shape.
 */
export function usePageResolver(pageId: string): PageResolverResult {
  // For now, synchronous resolution from static JSON.
  // In the future, this can be replaced with a React Query hook
  // fetching from Azure APIs.
  return resolvePage(pageId);
}
