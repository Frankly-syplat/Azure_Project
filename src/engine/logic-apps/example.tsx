import React from 'react';
import { LogicAppsIntegration } from './LogicAppsIntegration';

/**
 * Example usage of LogicAppsIntegration
 * This shows how to integrate the Logic Apps designer into your enterprise UI
 * with context settings and locale controls positioned next to the "Viewer Mode • Read-only" badge
 */
export const LogicAppsExample: React.FC = () => {
  return (
    <div style={{ height: '100vh' }}>
      <LogicAppsIntegration
        initialMasterId="master-001"
        iframeUrl="http://localhost:4200?iframe=true"
      />
    </div>
  );
};

/**
 * Alternative: Using individual components for more control
 */
export const LogicAppsCustomExample: React.FC = () => {
  const [masterId, setMasterId] = React.useState<string>('master-001');
  
  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      {/* Your custom master ID selector */}
      <div style={{ width: '200px', padding: '16px', backgroundColor: '#f5f5f5' }}>
        <h3>Select Logic App</h3>
        <select 
          value={masterId} 
          onChange={(e) => setMasterId(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        >
          <option value="master-001">Logic App 001</option>
          <option value="master-002">Logic App 002</option>
          <option value="master-003">Logic App 003</option>
        </select>
      </div>
      
      {/* Logic Apps Integration */}
      <div style={{ flex: 1 }}>
        <LogicAppsIntegration
          initialMasterId={masterId}
          iframeUrl="http://localhost:4200?iframe=true"
        />
      </div>
    </div>
  );
};

/**
 * Minimal example without demo controls
 * Perfect for embedding in existing enterprise UI
 */
export const LogicAppsMinimalExample: React.FC = () => {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <LogicAppsIntegration
        iframeUrl="http://localhost:4200?iframe=true"
      />
    </div>
  );
};

export default LogicAppsExample;
