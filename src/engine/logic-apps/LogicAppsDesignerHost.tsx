import React, { useState, useMemo } from 'react';
import { 
  RawLogicAppPayload, 
  SupportedLocale,
  WorkflowNodeType,
  ActionDefinition,
} from './logicApps.types';
import { getLocalizationStrings, isRTL } from './logicApps.localization';
import styles from './LogicAppsDesignerHost.module.css';

interface LogicAppsDesignerHostProps {
  definition: RawLogicAppPayload | null;
  locale: SupportedLocale;
  isLoading: boolean;
}

// Icons for different node types
const TriggerIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const VariableIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 7h6M4 17h6M14 7h6M14 17h6M7 4v16M17 4v16" />
  </svg>
);

const HttpIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ConditionIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
  </svg>
);

const ScopeIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);

const WorkflowIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ChevronIcon: React.FC<{ expanded: boolean }> = ({ expanded }) => (
  <svg 
    className={`${styles.expandIcon} ${expanded ? styles.expanded : ''}`} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ArrowDownIcon: React.FC = () => (
  <svg className={styles.runAfterIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
);

/**
 * Get node type from action type string
 */
function getNodeType(actionType: string): WorkflowNodeType {
  const typeMap: Record<string, WorkflowNodeType> = {
    'InitializeVariable': 'variable',
    'SetVariable': 'variable',
    'IncrementVariable': 'variable',
    'AppendToArrayVariable': 'variable',
    'AppendToStringVariable': 'variable',
    'Http': 'http',
    'Workflow': 'workflow',
    'If': 'condition',
    'Switch': 'switch',
    'Scope': 'scope',
    'ForEach': 'foreach',
    'Until': 'until',
    'Response': 'response',
    'Compose': 'compose',
    'Parse': 'parse',
    'Select': 'select',
    'Filter': 'filter',
    'Join': 'join',
    'Table': 'table',
    'Terminate': 'terminate',
    'Delay': 'delay',
  };
  return typeMap[actionType] || 'action';
}

/**
 * Get icon for node type
 */
function getNodeIcon(nodeType: WorkflowNodeType): React.ReactNode {
  switch (nodeType) {
    case 'trigger':
      return <TriggerIcon />;
    case 'variable':
      return <VariableIcon />;
    case 'http':
      return <HttpIcon />;
    case 'condition':
    case 'switch':
      return <ConditionIcon />;
    case 'scope':
    case 'foreach':
    case 'until':
      return <ScopeIcon />;
    case 'workflow':
      return <WorkflowIcon />;
    default:
      return <HttpIcon />;
  }
}

/**
 * Render run-after dependencies
 */
function RunAfterInfo({ runAfter, strings }: { 
  runAfter: Record<string, string[]>; 
  strings: ReturnType<typeof getLocalizationStrings>;
}): React.ReactElement | null {
  const deps = Object.keys(runAfter);
  if (deps.length === 0) return null;
  
  const display = deps.length <= 2 
    ? deps.join(', ') 
    : `${deps.slice(0, 2).join(', ')} +${deps.length - 2} ${strings.more}`;
  
  return (
    <div className={styles.runAfter}>
      <ArrowDownIcon />
      <span>{strings.runAfter}: {display}</span>
    </div>
  );
}

/**
 * Action Node Component
 */
function ActionNode({ 
  name, 
  action, 
  strings,
}: { 
  name: string; 
  action: ActionDefinition;
  strings: ReturnType<typeof getLocalizationStrings>;
}): React.ReactElement {
  const [expanded, setExpanded] = useState(false);
  const nodeType = getNodeType(action.type);
  const hasNestedActions = action.actions && Object.keys(action.actions).length > 0;
  const isClickable = nodeType === 'workflow' || hasNestedActions;
  
  return (
    <div 
      className={`${styles.actionNode} ${styles[nodeType]}`}
      onClick={isClickable ? () => setExpanded(!expanded) : undefined}
    >
      <div className={styles.nodeHeader}>
        <div className={styles.nodeIcon} style={{ backgroundColor: 'hsl(var(--color-gray-500))' }}>
          {getNodeIcon(nodeType)}
        </div>
        <span className={styles.nodeTitle}>{name}</span>
        <span className={styles.nodeType}>{action.type}</span>
        {isClickable && <ChevronIcon expanded={expanded} />}
      </div>
      
      {action.runAfter && Object.keys(action.runAfter).length > 0 && (
        <RunAfterInfo runAfter={action.runAfter} strings={strings} />
      )}
      
      {expanded && hasNestedActions && (
        <div className={styles.scopeContent}>
          <div className={styles.nodeContainer}>
            {Object.entries(action.actions!).map(([nestedName, nestedAction]) => (
              <ActionNode 
                key={nestedName} 
                name={nestedName} 
                action={nestedAction as ActionDefinition}
                strings={strings}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * LogicAppsDesignerHost
 * SDK mount point - renders raw Logic App definition as Azure-like visual
 * READ-ONLY mode only - no editing, no saving, no deploying
 */
export const LogicAppsDesignerHost: React.FC<LogicAppsDesignerHostProps> = ({
  definition,
  locale,
  isLoading,
}) => {
  const strings = useMemo(() => getLocalizationStrings(locale), [locale]);
  const rtl = isRTL(locale);
  
  if (isLoading) {
    return (
      <div className={styles.designerContainer}>
        <div className={styles.loadingState}>{strings.loading}</div>
      </div>
    );
  }
  
  if (!definition) {
    return (
      <div className={styles.designerContainer}>
        <div className={styles.emptyState}>{strings.noSelection}</div>
      </div>
    );
  }
  
  const workflowDef = definition.definition;
  const triggers = workflowDef.triggers || {};
  const actions = workflowDef.actions || {};
  
  return (
    <div className={`${styles.designerContainer} ${rtl ? styles.rtl : ''}`}>
      {/* Header with read-only badge */}
      <div className={styles.designerHeader}>
        <span className={styles.headerBadge}>
          {strings.viewerMode} • {strings.readOnlyMode}
        </span>
      </div>
      
      {/* Workflow Canvas */}
      <div className={styles.workflowCanvas}>
        {/* Triggers Section */}
        <div className={styles.workflowSection}>
          <div className={styles.sectionTitle}>{strings.triggers}</div>
          <div className={styles.nodeContainer}>
            {Object.entries(triggers).map(([name, trigger]) => (
              <div key={name} className={styles.triggerNode}>
                <div className={styles.nodeHeader}>
                  <div className={styles.nodeIcon}>
                    <TriggerIcon />
                  </div>
                  <span className={styles.nodeTitle}>{name}</span>
                  <span className={styles.nodeType}>{trigger.type}</span>
                </div>
                <div className={styles.nodeMeta}>
                  {trigger.kind && <span className={styles.metaTag}>{trigger.kind}</span>}
                  {trigger.inputs?.method && (
                    <span className={styles.metaTag}>
                      {String(trigger.inputs.method)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Connector */}
        {Object.keys(triggers).length > 0 && Object.keys(actions).length > 0 && (
          <div className={styles.connector}>
            <div className={styles.connectorLine} />
          </div>
        )}
        
        {/* Actions Section */}
        <div className={styles.workflowSection}>
          <div className={styles.sectionTitle}>
            {strings.actions} ({Object.keys(actions).length})
          </div>
          <div className={styles.nodeContainer}>
            {Object.entries(actions).map(([name, action]) => (
              <React.Fragment key={name}>
                <ActionNode 
                  name={name} 
                  action={action as ActionDefinition}
                  strings={strings}
                />
                <div className={styles.connector}>
                  <div className={styles.connectorLine} />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
