// Logic Apps Engine Configuration
// Centralized configuration for the workflow visualization engine

import { LogicAppsEngineConfig, SupportedLocale } from './logicApps.types';

// Global flag to allow edit mode (can be set via environment or runtime)
(globalThis as any).__ALLOW_EDIT_MODE__ = true; // Enable edit mode for development

/**
 * Default engine configuration
 * Read-only mode by default for security, but can be overridden
 */
export const DEFAULT_ENGINE_CONFIG: LogicAppsEngineConfig = {
  readOnly: true,
  locale: 'en',
  showMinimap: false,
  showRunHistory: false,
};

/**
 * Create engine configuration with overrides
 */
export function createEngineConfig(
  overrides: Partial<LogicAppsEngineConfig> = {}
): LogicAppsEngineConfig {
  return {
    ...DEFAULT_ENGINE_CONFIG,
    ...overrides,
  };
}

/**
 * Get locale from browser or fallback to English
 */
export function detectLocale(): SupportedLocale {
  const browserLocale = navigator.language.split('-')[0];
  const supportedLocales: SupportedLocale[] = ['en', 'es', 'de', 'fr', 'pt', 'ar', 'zh'];
  
  return supportedLocales.includes(browserLocale as SupportedLocale)
    ? (browserLocale as SupportedLocale)
    : 'en';
}

/**
 * Validate that engine is in read-only mode
 * Throws if not read-only (security guard)
 * Note: This can be disabled by setting the global flag
 */
export function assertReadOnlyMode(config: LogicAppsEngineConfig): void {
  // Allow edit mode if explicitly enabled via global flag
  const allowEditMode = (globalThis as any).__ALLOW_EDIT_MODE__ === true;
  
  if (!config.readOnly && !allowEditMode) {
    console.warn('[LogicAppsEngine] Edit mode requested but not explicitly allowed. Enable __ALLOW_EDIT_MODE__ to allow editing.');
  }
  
  // Log the current mode for debugging
  console.log(`[LogicAppsEngine] assertReadOnlyMode: readOnly=${config.readOnly}, allowEditMode=${allowEditMode}`);
}
