import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RawLogicAppPayload, SupportedLocale } from './logicApps.types';

interface IframeDesignerHostProps {
  /** Raw Logic App definition to load */
  definition: RawLogicAppPayload | null;
  /** Loading state */
  isLoading: boolean;
  /** Locale for UI strings */
  locale: SupportedLocale;
  /** Context settings */
  readOnly: boolean;
  unitTestView: boolean;
  /** Theme */
  theme: 'light' | 'dark';
  /** Master ID for tracking */
  masterId?: string;
  /** Iframe URL - defaults to localhost:4200 for development */
  iframeUrl?: string;
  /** Callback when workflow changes */
  onWorkflowChange?: (workflow: any, isValid: boolean) => void;
  /** Callback when iframe is ready */
  onReady?: () => void;
  /** Callback for errors */
  onError?: (message: string, code?: string) => void;
}

interface IframeMessage {
  type: string;
  payload?: any;
  requestId?: string;
}

/**
 * IframeDesignerHost
 * Hosts the LogicAppsUX standalone app in an iframe
 * Handles all communication between enterprise UI and the designer
 */
export const IframeDesignerHost: React.FC<IframeDesignerHostProps> = ({
  definition,
  isLoading,
  locale,
  readOnly,
  unitTestView,
  theme,
  masterId,
  iframeUrl = 'http://localhost:4200?iframe=true',
  onWorkflowChange,
  onReady,
  onError,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = useState(false);
  const requestIdCounter = useRef(0);

  // Send message to iframe
  const sendMessage = useCallback((message: IframeMessage) => {
    if (iframeRef.current?.contentWindow && iframeReady) {
      console.log('[IframeDesignerHost] Sending message to iframe:', message);
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  }, [iframeReady]);

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Add origin validation in production
      // if (event.origin !== 'http://localhost:4200') return;
      
      const message: IframeMessage = event.data;
      console.log('[IframeDesignerHost] Received message from iframe:', message);
      
      switch (message.type) {
        case 'READY':
          console.log('[IframeDesignerHost] Iframe is ready');
          setIframeReady(true);
          onReady?.();
          break;
          
        case 'WORKFLOW_CHANGED':
          if (message.payload) {
            onWorkflowChange?.(message.payload.workflow, message.payload.isValid);
          }
          break;
          
        case 'ERROR':
          if (message.payload) {
            console.error('[IframeDesignerHost] Iframe error:', message.payload);
            onError?.(message.payload.message, message.payload.code);
          }
          break;
          
        case 'WORKFLOW_RESPONSE':
          // Handle workflow response if needed
          console.log('[IframeDesignerHost] Workflow response:', message.payload);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onWorkflowChange, onReady, onError]);

  // Send workflow data when definition changes
  useEffect(() => {
    if (iframeReady && definition) {
      console.log('[IframeDesignerHost] Sending workflow to iframe:', { masterId, definition });
      console.log('[IframeDesignerHost] Workflow definition structure:', definition.definition);
      
      const message = {
        type: 'LOAD_WORKFLOW',
        payload: {
          workflow: definition.definition,
          connections: {}, // Add connections if available
          parameters: definition.parameters || {},
          readOnly,
          unitTestView,
          locale,
          theme,
          masterId,
          hideReadOnlyBadge: true, // Hide the "Viewer mode read only" badge
        },
      };
      
      console.log('[IframeDesignerHost] Complete message being sent:', message);
      sendMessage(message);
    }
  }, [iframeReady, definition, readOnly, unitTestView, locale, theme, masterId, sendMessage]);

  // Reset iframe ready state when master ID changes to force reload
  useEffect(() => {
    if (masterId) {
      console.log('[IframeDesignerHost] Master ID changed, resetting iframe state:', masterId);
      setIframeReady(false);
      
      // Force iframe reload by changing the src temporarily
      if (iframeRef.current) {
        const currentSrc = iframeRef.current.src;
        iframeRef.current.src = 'about:blank';
        
        // Restore the original src after a brief delay
        setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.src = currentSrc;
          }
        }, 100);
      }
    }
  }, [masterId]);

  // Handle iframe load event to ensure proper initialization
  const handleIframeLoad = useCallback(() => {
    console.log('[IframeDesignerHost] Iframe loaded, waiting for ready message');
    // Reset ready state and wait for the READY message from iframe
    setIframeReady(false);
  }, []);

  // Send config updates when settings change
  useEffect(() => {
    if (iframeReady) {
      console.log('[IframeDesignerHost] Sending config update to iframe:', { readOnly, unitTestView, locale, theme });
      sendMessage({
        type: 'UPDATE_CONFIG',
        payload: {
          readOnly,
          unitTestView,
          locale,
          theme,
          hideReadOnlyBadge: true, // Hide the "Viewer mode read only" badge
        },
      });
    }
  }, [iframeReady, readOnly, unitTestView, locale, theme, sendMessage]);

  // Get workflow from iframe
  const getWorkflow = useCallback(() => {
    if (iframeReady) {
      const requestId = `req_${++requestIdCounter.current}`;
      sendMessage({
        type: 'GET_WORKFLOW',
        requestId,
      });
    }
  }, [iframeReady, sendMessage]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        fontSize: '16px',
        color: '#666',
      }}>
        Loading workflow...
      </div>
    );
  }

  if (!definition) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        fontSize: '16px',
        color: '#666',
      }}>
        Select a Logic App to view its workflow
      </div>
    );
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      {/* Loading overlay */}
      {(!iframeReady || isLoading) && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          fontSize: '16px',
          color: '#666',
        }}>
          <div style={{ marginBottom: '8px' }}>
            {isLoading ? 'Loading workflow...' : 'Initializing designer...'}
          </div>
          {masterId && (
            <div style={{ fontSize: '14px', color: '#888' }}>
              Master ID: {masterId}
            </div>
          )}
        </div>
      )}
      
      {/* Iframe */}
      <iframe
        ref={iframeRef}
        src={iframeUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
        }}
        title="Logic Apps Designer"
        allow="clipboard-read; clipboard-write"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        onLoad={handleIframeLoad}
      />
    </div>
  );
};
