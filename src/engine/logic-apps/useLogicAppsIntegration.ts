import { useState, useCallback } from 'react';
import { RawLogicAppPayload, SupportedLocale } from './logicApps.types';

// Mock workflow definitions for demo purposes
const MOCK_WORKFLOWS: Record<string, RawLogicAppPayload> = {
  'master-001': {
    definition: {
      $schema: 'https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#',
      contentVersion: '1.0.0.0',
      triggers: {
        manual: {
          type: 'Request',
          kind: 'Http',
          inputs: { method: 'POST' },
        },
      },
      actions: {
        Initialize_Counter: {
          type: 'InitializeVariable',
          inputs: { variables: [{ name: 'counter', type: 'integer', value: 0 }] },
        },
        HTTP_Request: {
          type: 'Http',
          runAfter: { Initialize_Counter: ['Succeeded'] },
          inputs: { method: 'GET', uri: 'https://api.example.com/data' },
        },
        Condition: {
          type: 'If',
          runAfter: { HTTP_Request: ['Succeeded'] },
          expression: { equals: ['@variables(\'counter\')', 0] },
          actions: {
            Set_Success: { type: 'SetVariable', inputs: { name: 'status', value: 'success' } },
          },
        },
      },
    },
  },
  'master-002': {
    definition: {
      $schema: 'https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#',
      contentVersion: '1.0.0.0',
      triggers: {
        recurrence: {
          type: 'Recurrence',
          recurrence: { frequency: 'Hour', interval: 1 },
        },
      },
      actions: {
        Get_Items: {
          type: 'Http',
          inputs: { method: 'GET', uri: 'https://api.example.com/items' },
        },
        For_Each_Item: {
          type: 'ForEach',
          runAfter: { Get_Items: ['Succeeded'] },
          foreach: '@body(\'Get_Items\')',
          actions: {
            Process_Item: { type: 'Http', inputs: { method: 'POST', uri: 'https://api.example.com/process' } },
          },
        },
      },
    },
  },
  'master-003': {
    definition: {
      $schema: 'https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#',
      contentVersion: '1.0.0.0',
      triggers: {
        blob_trigger: {
          type: 'ApiConnection',
          kind: 'BlobTrigger',
          inputs: { path: '/container/{name}' },
        },
      },
      actions: {
        Parse_JSON: {
          type: 'Parse',
          inputs: { content: '@triggerBody()', schema: {} },
        },
        Switch_Type: {
          type: 'Switch',
          runAfter: { Parse_JSON: ['Succeeded'] },
          expression: '@body(\'Parse_JSON\')?[\'type\']',
          cases: {
            TypeA: { actions: { Handle_TypeA: { type: 'Compose', inputs: { result: 'TypeA' } } } },
            TypeB: { actions: { Handle_TypeB: { type: 'Compose', inputs: { result: 'TypeB' } } } },
          },
          default: { actions: { Handle_Default: { type: 'Compose', inputs: { result: 'Default' } } } },
        },
      },
    },
  },
};

interface UseLogicAppsIntegrationReturn {
  definition: RawLogicAppPayload | null;
  isLoading: boolean;
  locale: SupportedLocale;
  readOnly: boolean;
  unitTestView: boolean;
  theme: 'light' | 'dark';
  masterId: string | null;
  iframeReady: boolean;
  loadWorkflow: (masterId: string) => void;
  setReadOnly: (value: boolean) => void;
  setUnitTestView: (value: boolean) => void;
  setLocale: (value: SupportedLocale) => void;
  setTheme: (value: 'light' | 'dark') => void;
  onIframeReady: () => void;
  onWorkflowChange: (workflow: any, isValid: boolean) => void;
  onIframeError: (message: string, code?: string) => void;
}

/**
 * useLogicAppsIntegration
 * Hook that manages state for the Logic Apps integration
 * Handles workflow loading, settings, and iframe communication callbacks
 */
export function useLogicAppsIntegration(): UseLogicAppsIntegrationReturn {
  const [definition, setDefinition] = useState<RawLogicAppPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locale, setLocale] = useState<SupportedLocale>('en');
  const [readOnly, setReadOnly] = useState(true);
  const [unitTestView, setUnitTestView] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [masterId, setMasterId] = useState<string | null>(null);
  const [iframeReady, setIframeReady] = useState(false);

  const loadWorkflow = useCallback((newMasterId: string) => {
    console.log(`[useLogicAppsIntegration] Loading workflow for master ID: ${newMasterId}`);
    setIsLoading(true);
    setMasterId(newMasterId);
    setIframeReady(false);

    // Simulate API call with mock data
    setTimeout(() => {
      const workflow = MOCK_WORKFLOWS[newMasterId];
      if (workflow) {
        console.log(`[useLogicAppsIntegration] Workflow loaded:`, workflow);
        setDefinition(workflow);
      } else {
        console.warn(`[useLogicAppsIntegration] No workflow found for master ID: ${newMasterId}`);
        setDefinition(null);
      }
      setIsLoading(false);
    }, 500);
  }, []);

  const onIframeReady = useCallback(() => {
    console.log('[useLogicAppsIntegration] Iframe is ready');
    setIframeReady(true);
  }, []);

  const onWorkflowChange = useCallback((workflow: any, isValid: boolean) => {
    console.log('[useLogicAppsIntegration] Workflow changed:', { workflow, isValid });
  }, []);

  const onIframeError = useCallback((message: string, code?: string) => {
    console.error('[useLogicAppsIntegration] Iframe error:', message, code);
  }, []);

  return {
    definition,
    isLoading,
    locale,
    readOnly,
    unitTestView,
    theme,
    masterId,
    iframeReady,
    loadWorkflow,
    setReadOnly,
    setUnitTestView,
    setLocale,
    setTheme,
    onIframeReady,
    onWorkflowChange,
    onIframeError,
  };
}
