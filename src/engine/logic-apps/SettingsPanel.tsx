import React from 'react';
import { SupportedLocale } from './logicApps.types';
import styles from './SettingsPanel.module.css';

interface SettingsPanelProps {
  /** Current locale */
  locale: SupportedLocale;
  /** Context settings */
  readOnly: boolean;
  unitTestView: boolean;
  /** Theme */
  theme: 'light' | 'dark';
  /** Callbacks for settings changes */
  onReadOnlyChange: (readOnly: boolean) => void;
  onUnitTestViewChange: (unitTestView: boolean) => void;
  onLocaleChange: (locale: SupportedLocale) => void;
  onThemeChange: (theme: 'light' | 'dark') => void;
}

/**
 * SettingsPanel
 * Displays Context Settings and Locale controls for the Logic Apps designer
 * Matches the reference design with checkboxes and dropdowns
 */
export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  locale,
  readOnly,
  unitTestView,
  theme,
  onReadOnlyChange,
  onUnitTestViewChange,
  onLocaleChange,
  onThemeChange,
}) => {
  return (
    <div className={`${styles.settingsPanel} ${theme === 'dark' ? styles.dark : ''}`}>
      {/* Context Settings Section */}
      <div className={styles.settingsSection}>
        <h3 className={styles.sectionTitle}>Context Settings</h3>
        <div className={styles.settingsGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={readOnly}
              onChange={(e) => onReadOnlyChange(e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>Read Only</span>
          </label>
          
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={unitTestView}
              onChange={(e) => onUnitTestViewChange(e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>Unit Test View</span>
          </label>
        </div>
      </div>

      {/* Locale Section */}
      <div className={styles.settingsSection}>
        <h3 className={styles.sectionTitle}>Locale</h3>
        <div className={styles.settingsGroup}>
          <label className={styles.selectLabel}>
            <span className={styles.labelText}>Language</span>
            <select
              value={locale}
              onChange={(e) => onLocaleChange(e.target.value as SupportedLocale)}
              className={styles.select}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
              <option value="fr">French</option>
              <option value="pt">Portuguese</option>
              <option value="ar">Arabic</option>
              <option value="zh">Chinese</option>
            </select>
          </label>
        </div>
      </div>

      {/* Theme Section */}
      <div className={styles.settingsSection}>
        <h3 className={styles.sectionTitle}>Theme</h3>
        <div className={styles.settingsGroup}>
          <label className={styles.selectLabel}>
            <span className={styles.labelText}>Appearance</span>
            <select
              value={theme}
              onChange={(e) => onThemeChange(e.target.value as 'light' | 'dark')}
              className={styles.select}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};
