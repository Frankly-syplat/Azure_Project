import React from 'react';
import { RawLogicAppPayload, SupportedLocale, LogicAppsEngineConfig } from './logicApps.types';
import { DEFAULT_ENGINE_CONFIG, assertReadOnlyMode } from './logicApps.config';
import { IframeDesignerHost } from './IframeDesignerHost';

interface LogicAppsEngineProps {
  /** Raw Logic App definition from API */
  definition: unknown;
  /** Loading state */
  isLoading: boolean;
  /** Locale for UI strings */
  locale?: SupportedLocale;
  /** Context settings */
  readOnly?: boolean;
  unitTestView?: boolean;
  /** Theme */
  theme?: 'light' | 'dark';
  /** Master ID for tracking */
  masterId?: string;
  /** Iframe URL - defaults to localhost:4200 for development */
  iframeUrl?: string;
  /** Optional configuration overrides */
  config?: Partial<LogicAppsEngineConfig>;
  /** Callback when workflow changes */
  onWorkflowChange?: (workflow: any, isValid: boolean) => void;
  /** Callback when iframe is ready */
  onReady?: () => void;
  /** Callback for errors */
  onError?: (message: string, code?: string) => void;
}

/**
 * LogicAppsEngine
 * Public container component for Logic Apps visualization using iframe integration.
 * 
 * This component:
 * - Hosts LogicAppsUX in an iframe
 * - Handles communication between enterprise UI and designer
 * - Manages settings synchronization
 * - Does NOT call APIs directly
 * - Only receives data via props and renders
 * 
 * Data flow:
 * Enterprise UI → LogicAppsEngine → IframeDesignerHost → LogicAppsUX (iframe)
 */
export const LogicAppsEngine: React.FC<LogicAppsEngineProps> = ({
  definition,
  isLoading,
  locale = 'en',
  readOnly = true,
  unitTestView = false,
  theme = 'light',
  masterId,
  iframeUrl,
  config = {},
  onWorkflowChange,
  onReady,
  onError,
}) => {
  // Merge with default config
  const mergedConfig: LogicAppsEngineConfig = {
    ...DEFAULT_ENGINE_CONFIG,
    ...config,
    locale,
    readOnly,
  };
  
  // Security guard - warn if not read-only but allow for iframe integration
  assertReadOnlyMode(mergedConfig);
  
  // Cast to expected type (API returns unknown for flexibility)
  const payload = definition as RawLogicAppPayload | null;
  
  // Log the current mode for debugging
  React.useEffect(() => {
    console.log(`[LogicAppsEngine] mode: ${readOnly ? 'READ-ONLY' : 'EDIT'} for master ID: ${masterId}`);
  }, [readOnly, masterId]);
  
  return (
    <IframeDesignerHost
      key={masterId} // Only re-mount when masterId changes, not on settings updates
      definition={payload}
      isLoading={isLoading}
      locale={mergedConfig.locale}
      readOnly={readOnly}
      unitTestView={unitTestView}
      theme={theme}
      masterId={masterId}
      iframeUrl={iframeUrl}
      onWorkflowChange={onWorkflowChange}
      onReady={onReady}
      onError={onError}
    />
  );
};
