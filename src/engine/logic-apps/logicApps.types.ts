// Logic Apps Engine Type Definitions
// Enterprise-grade types for Logic App workflow visualization

/**
 * Raw Logic App definition as returned from Azure API
 * This is the complete, unmodified JSON structure
 */
export interface RawLogicAppPayload {
  definition: LogicAppWorkflowDefinition;
  parameters?: Record<string, ParameterDefinition>;
}

export interface LogicAppWorkflowDefinition {
  $schema: string;
  contentVersion: string;
  triggers: Record<string, TriggerDefinition>;
  actions: Record<string, ActionDefinition>;
  outputs?: Record<string, unknown>;
  parameters?: Record<string, ParameterDefinition>;
}

/**
 * Trigger definition from workflow JSON
 */
export interface TriggerDefinition {
  type: string;
  kind?: string;
  inputs?: Record<string, unknown>;
  recurrence?: RecurrenceDefinition;
  splitOn?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Action definition from workflow JSON
 * Supports all action types: HTTP, Variable, Scope, Condition, Loop, Workflow, etc.
 */
export interface ActionDefinition {
  type: string;
  kind?: string;
  runAfter?: Record<string, string[]>;
  inputs?: Record<string, unknown>;
  actions?: Record<string, ActionDefinition>; // For Scope/If/Switch
  else?: { actions: Record<string, ActionDefinition> }; // For If conditions
  expression?: unknown;
  cases?: Record<string, { actions: Record<string, ActionDefinition> }>; // For Switch
  default?: { actions: Record<string, ActionDefinition> }; // For Switch
  foreach?: string; // For ForEach loops
  until?: string; // For Until loops
  limit?: { count?: number; timeout?: string };
  operationOptions?: string;
  retryPolicy?: RetryPolicyDefinition;
  metadata?: Record<string, unknown>;
}

export interface RecurrenceDefinition {
  frequency: string;
  interval: number;
  timeZone?: string;
  startTime?: string;
}

export interface RetryPolicyDefinition {
  type: string;
  count?: number | string;
  interval?: string;
  minimumInterval?: string;
  maximumInterval?: string;
}

export interface ParameterDefinition {
  type: string;
  defaultValue?: unknown;
  value?: unknown;
  allowedValues?: unknown[];
  metadata?: Record<string, unknown>;
}

/**
 * Supported locales for Logic Apps visualization
 */
export type SupportedLocale = 'en' | 'es' | 'de' | 'fr' | 'pt' | 'ar' | 'zh';

/**
 * Engine configuration
 */
export interface LogicAppsEngineConfig {
  readOnly: boolean;
  locale: SupportedLocale;
  showMinimap: boolean;
  showRunHistory: boolean;
}

/**
 * Node types for workflow visualization
 */
export type WorkflowNodeType = 
  | 'trigger'
  | 'http'
  | 'variable'
  | 'condition'
  | 'scope'
  | 'foreach'
  | 'until'
  | 'switch'
  | 'workflow'
  | 'response'
  | 'compose'
  | 'parse'
  | 'select'
  | 'filter'
  | 'join'
  | 'table'
  | 'terminate'
  | 'delay'
  | 'action';

/**
 * Processed node for visualization
 */
export interface WorkflowNode {
  id: string;
  name: string;
  type: WorkflowNodeType;
  rawType: string;
  dependencies: string[];
  isContainer: boolean;
  children?: WorkflowNode[];
}

/**
 * Edge between workflow nodes
 */
export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  condition?: string;
}

/**
 * Processed workflow graph for visualization
 */
export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  triggers: WorkflowNode[];
}
