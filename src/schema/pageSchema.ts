// Page Schema Type Definitions
// Foundation for schema-driven UI rendering

export type ButtonConfig = {
  label: string;
  action: string;
  position: 'left' | 'right';
};

export type UIComponent =
  | { type: 'heading'; value: string }
  | { type: 'button'; label: string; action: string }
  | { type: 'buttonGroup'; buttons: ButtonConfig[] }
  | { type: 'text'; value: string }
  | { type: 'dropdown'; label: string; source: string }
  | { type: 'taskMapping'; leftSource: string; rightSource: string }
  | { type: 'logicAppsWorkspace'; source: string };

export type PageLayout = 'default' | 'migration';

export interface PageSchema {
  pageId: string;
  title: string;
  description?: string; // Full-width description below title
  layout: PageLayout;
  components: UIComponent[];
}

// Checklist types for migration layout
export type ChecklistStatus = 'completed' | 'active' | 'pending';

export interface ChecklistStep {
  id: string;
  label: string;
  status: ChecklistStatus;
  pages: string[];
}

// Task Mapping Connection type
export interface TaskConnection {
  leftId: string;
  rightId: string;
}
