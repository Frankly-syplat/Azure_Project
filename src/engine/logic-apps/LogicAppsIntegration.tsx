import React from 'react';
import { LogicAppsEngine } from './LogicAppsEngine';
import { SettingsPanel } from './SettingsPanel';
import { useLogicAppsIntegration } from './useLogicAppsIntegration';
import styles from './LogicAppsIntegration.module.css';

interface LogicAppsIntegrationProps {
  /** Master ID to load initially */
  initialMasterId?: string;
  /** Iframe URL - defaults to localhost:4200 for development */
  iframeUrl?: string;
  /** Custom CSS class */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * LogicAppsIntegration
 * Complete integration component that combines the designer iframe with settings panel
 * This is the main component to use in your enterprise UI
 */
export const LogicAppsIntegration: React.FC<LogicAppsIntegrationProps> = ({
  initialMasterId,
  iframeUrl,
  className,
  style,
}) => {
  const {
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
  } = useLogicAppsIntegration();

  // Load initial workflow if provided
  React.useEffect(() => {
    if (initialMasterId && !masterId) {
      loadWorkflow(initialMasterId);
    }
  }, [initialMasterId, masterId, loadWorkflow]);

  // Demo function to simulate master ID selection
  const handleMasterIdSelection = (newMasterId: string) => {
    console.log(`[LogicAppsIntegration] Selected master ID: ${newMasterId}`);
    loadWorkflow(newMasterId);
  };

  return (
    <div className={`${styles.integrationContainer} ${className || ''}`} style={style}>
      {/* Demo Master ID Selector */}
      <div className={styles.demoControls}>
        <h3>Demo: Select Master ID</h3>
        <div className={styles.masterIdButtons}>
          <button 
            onClick={() => handleMasterIdSelection('master-001')}
            className={masterId === 'master-001' ? styles.active : ''}
          >
            Master ID: 001
          </button>
          <button 
            onClick={() => handleMasterIdSelection('master-002')}
            className={masterId === 'master-002' ? styles.active : ''}
          >
            Master ID: 002
          </button>
          <button 
            onClick={() => handleMasterIdSelection('master-003')}
            className={masterId === 'master-003' ? styles.active : ''}
          >
            Master ID: 003
          </button>
        </div>
        {masterId && (
          <p className={styles.currentMaster}>
            Current: {masterId} {iframeReady ? '✅' : '⏳'}
          </p>
        )}
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Designer Iframe */}
        <div className={styles.designerArea}>
          <LogicAppsEngine
            definition={definition}
            isLoading={isLoading}
            locale={locale}
            readOnly={readOnly}
            unitTestView={unitTestView}
            theme={theme}
            masterId={masterId}
            iframeUrl={iframeUrl}
            onWorkflowChange={onWorkflowChange}
            onReady={onIframeReady}
            onError={onIframeError}
          />
        </div>

        {/* Right Panel with Context Settings Above */}
        <div className={styles.rightPanelContainer}>
          {/* Context Settings and Locale Controls - ABOVE the right panel */}
          <div className={styles.rightPanelHeader}>
            <div className={styles.headerRow}>
              {/* Mode Indicator and Context Settings in one line */}
              <div className={styles.headerContent}>
                <span className={styles.modeBadge}>
                  {isLoading ? 'Loading...' : readOnly ? 'Viewer Mode • Read-only' : 'Edit Mode • Editable'}
                </span>
                
                {/* Context Settings - inline with mode badge */}
                <div className={styles.contextSettings}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={readOnly}
                      onChange={(e) => {
                        console.log('[LogicAppsIntegration] Read Only changed:', e.target.checked);
                        setReadOnly(e.target.checked);
                      }}
                    />
                    <span>Read Only</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={unitTestView}
                      onChange={(e) => {
                        console.log('[LogicAppsIntegration] Unit Test View changed:', e.target.checked);
                        setUnitTestView(e.target.checked);
                      }}
                    />
                    <span>Unit Test View</span>
                  </label>
                </div>
                
                {/* Locale Settings - inline */}
                <div className={styles.localeSettings}>
                  <span className={styles.settingsLabel}>Locale:</span>
                  <select
                    value={locale}
                    onChange={(e) => {
                      console.log('[LogicAppsIntegration] Locale changed:', e.target.value);
                      setLocale(e.target.value as any);
                    }}
                    className={styles.localeSelect}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="de">German</option>
                    <option value="fr">French</option>
                    <option value="pt">Portuguese</option>
                    <option value="ar">Arabic</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>
              </div>
              
              {/* Master ID Info on the right */}
              {masterId && !isLoading && (
                <div className={styles.masterIdSection}>
                  <span className={styles.masterIdInfo}>
                    Master ID: {masterId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel Content */}
          <div className={styles.rightPanel}>
            <div className={styles.settingsArea}>
              <SettingsPanel
                locale={locale}
                readOnly={readOnly}
                unitTestView={unitTestView}
                theme={theme}
                onReadOnlyChange={setReadOnly}
                onUnitTestViewChange={setUnitTestView}
                onLocaleChange={setLocale}
                onThemeChange={setTheme}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
