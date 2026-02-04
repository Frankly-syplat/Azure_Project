import React from 'react';
import { UIComponent, ButtonConfig, TaskConnection } from '../schema/pageSchema';
import { Heading } from '../UI/Heading';
import { Text } from '../UI/Text';
import { Button } from '../UI/Button';
import { DropdownField, DropdownOption } from '../UI/DropdownField';
import { TaskMapping } from '../UI/TaskMapping';
import { LogicAppsEngine, SettingsPanel, CONTEXT_PANEL_WIDTH } from '../engine/logic-apps';
import { SupportedLocale } from '../engine/logic-apps/logicApps.types';
// Component props types for registry entries
interface HeadingComponentProps {
  value: string;
}

interface TextComponentProps {
  value: string;
  fullWidth?: boolean;
}

interface ButtonComponentProps {
  label: string;
  action: string;
  onAction?: (action: string) => void;
  disabled?: boolean;
  centered?: boolean;
}

interface ButtonGroupComponentProps {
  buttons: ButtonConfig[];
  onAction?: (action: string) => void;
  submitDisabled?: boolean;
}

interface DropdownComponentProps {
  label: string;
  source: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

interface TaskMappingComponentProps {
  leftSource: string;
  rightSource: string;
  leftItems: string[];
  rightItems: string[];
  connections: TaskConnection[];
  selectedLeft: string | null;
  selectedRight: string | null;
  draggedItem: string | null;
  onSelectLeft: (item: string) => void;
  onSelectRight: (item: string) => void;
  onDragStart: (leftId: string) => void;
  onDragEnd: () => void;
  onDrop: (rightId: string) => void;
  isLoading?: boolean;
}

// Wrapper components that bridge schema props to UI components
const HeadingComponent: React.FC<HeadingComponentProps> = ({ value }) => {
  return React.createElement(Heading, { value, level: 1 });
};

const TextComponent: React.FC<TextComponentProps> = ({ value, fullWidth = true }) => {
  const textElement = React.createElement(Text, { value, variant: 'body' });
  if (fullWidth) {
    return React.createElement('div', { style: { width: '100%' } }, textElement);
  }
  return textElement;
};

const ButtonComponent: React.FC<ButtonComponentProps> = ({ 
  label, 
  action, 
  onAction, 
  disabled = false,
  centered = false,
}) => {
  const button = React.createElement(
    Button,
    {
      variant: 'primary',
      size: 'md',
      onClick: () => onAction?.(action),
      disabled,
      children: label,
    }
  );
  
  if (centered) {
    return React.createElement(
      'div',
      { 
        style: { 
          display: 'flex', 
          justifyContent: 'center', 
          width: '100%',
          marginTop: 'var(--space-4)',
        } 
      },
      button
    );
  }
  
  return button;
};

/**
 * ButtonGroup Component
 * Renders multiple buttons with positioning (left/right)
 * Used for navigation patterns (Prev/Next, Submit/Next)
 */
const ButtonGroupComponent: React.FC<ButtonGroupComponentProps> = ({
  buttons,
  onAction,
  submitDisabled = false,
}) => {
  const leftButtons = buttons.filter(b => b.position === 'left');
  const rightButtons = buttons.filter(b => b.position === 'right');
  
  const renderButton = (config: ButtonConfig) => {
    const isSubmitButton = config.action === 'SUBMIT_MASTER_ID';
    const isPrevButton = config.action.startsWith('PREV_');
    
    return React.createElement(
      Button,
      {
        key: config.action,
        variant: isPrevButton ? 'secondary' : 'primary',
        size: 'md',
        onClick: () => onAction?.(config.action),
        disabled: isSubmitButton ? submitDisabled : false,
        children: config.label,
      }
    );
  };
  
  return React.createElement(
    'div',
    {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 'var(--space-6)',
        paddingTop: 'var(--space-4)',
        borderTop: '1px solid hsl(var(--color-gray-200))',
      },
    },
    // Left side buttons
    React.createElement(
      'div',
      { style: { display: 'flex', gap: 'var(--space-3)' } },
      leftButtons.map(renderButton)
    ),
    // Right side buttons
    React.createElement(
      'div',
      { style: { display: 'flex', gap: 'var(--space-3)' } },
      rightButtons.map(renderButton)
    )
  );
};

const DropdownComponent: React.FC<DropdownComponentProps> = ({
  label,
  options,
  value,
  onChange,
  isLoading,
}) => {
  return React.createElement(DropdownField, {
    label,
    options,
    value,
    onChange,
    isLoading,
    placeholder: 'Select an option',
  });
};

const TaskMappingComponent: React.FC<TaskMappingComponentProps> = ({
  leftItems,
  rightItems,
  connections,
  selectedLeft,
  selectedRight,
  draggedItem,
  onSelectLeft,
  onSelectRight,
  onDragStart,
  onDragEnd,
  onDrop,
  isLoading,
}) => {
  return React.createElement(TaskMapping, {
    leftItems,
    rightItems,
    connections,
    selectedLeft,
    selectedRight,
    draggedItem,
    onSelectLeft,
    onSelectRight,
    onDragStart,
    onDragEnd,
    onDrop,
    isLoading,
  });
};

// Type for component registry
type ComponentType = 'heading' | 'button' | 'buttonGroup' | 'text' | 'dropdown' | 'taskMapping' | 'logicAppsWorkspace';

type ComponentRegistry = {
  [K in ComponentType]: React.FC<any>;
};

// LogicAppsWorkspace wrapper component - uses new engine
interface LogicAppsWorkspaceComponentProps {
  options: DropdownOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  isLoading?: boolean;
  definition: unknown;
  definitionLoading?: boolean;
  onClickMe?: () => void;
  onSubmit?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

const LogicAppsWorkspaceComponent: React.FC<LogicAppsWorkspaceComponentProps> = ({
  options,
  selectedId,
  onSelect,
  isLoading = false,
  definition,
  definitionLoading = false,
  onClickMe,
  onSubmit,
  onPrev,
  onNext,
}) => {
  // Local state for settings panel - default to edit mode (readOnly: false)
  const [locale, setLocale] = React.useState<SupportedLocale>('en');
  const [readOnly, setReadOnly] = React.useState(true);
  const [unitTestView, setUnitTestView] = React.useState(false);
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  return React.createElement(
    'div',
    { 
      style: { 
        display: 'flex', 
        flexDirection: 'column',
        gap: 'var(--space-4)', 
        width: '100%',
        height: '100%',
        flex: 1,
        minHeight: 0,
        minWidth: 0,
      } 
    },
    // Main Content Row - Left Panel + Right Panel (aligned to top)
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          gap: 'var(--space-4)',
          width: '100%',
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          alignItems: 'stretch',
        },
      },
      // Left Column - Dropdown + Settings Panel
      React.createElement(
        'div',
        {
          style: {
            width: CONTEXT_PANEL_WIDTH,
            minWidth: CONTEXT_PANEL_WIDTH,
            maxWidth: CONTEXT_PANEL_WIDTH,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          },
        },
        // Dropdown Section - compact width
        React.createElement(
          'div',
          { style: { maxWidth: '200px' } },
          React.createElement(DropdownField, {
            label: 'Select Logic App',
            options,
            value: selectedId,
            onChange: onSelect,
            isLoading,
            placeholder: 'Choose a Logic App',
          })
        ),
        // Settings Panel
        React.createElement(SettingsPanel, {
          locale,
          readOnly,
          unitTestView,
          theme,
          onLocaleChange: setLocale,
          onReadOnlyChange: setReadOnly,
          onUnitTestViewChange: setUnitTestView,
          onThemeChange: setTheme,
        })
      ),
      // Right Panel - Iframe Designer Host (flex: 1, aligned to top)
      React.createElement(
        'div',
        {
          style: {
            flex: 1,
            minWidth: 0,
            backgroundColor: 'hsl(var(--color-white))',
            border: '1px solid hsl(var(--color-gray-200))',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '600px',
            height: '100%',
          },
        },
        definitionLoading
          ? React.createElement(
              'div',
              {
                style: {
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'hsl(var(--color-gray-500))',
                  fontSize: 'var(--font-size-sm)',
                },
              },
              'Loading Logic App definition...'
            )
          : !selectedId
            ? React.createElement(
                'div',
                {
                  style: {
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'hsl(var(--color-gray-500))',
                    fontSize: 'var(--font-size-sm)',
                  },
                },
                'Select a Logic App to view the workflow'
              )
            : React.createElement(
                'div',
                { style: { flex: 1, minHeight: 0, width: '100%', height: '100%' } },
                React.createElement(LogicAppsEngine, {
                  definition: selectedId && definition ? definition : null,
                  isLoading: definitionLoading,
                  locale,
                  readOnly,
                  unitTestView,
                  theme,
                  masterId: selectedId,
                })
              )
      )
    ),
    // Button Rows - Below both panels
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          marginTop: 'var(--space-6)',
        },
      },
      // Row A: 3 "Click me" buttons
      React.createElement(
        'div',
        { style: { display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-start' } },
        React.createElement(Button, { variant: 'primary', onClick: onClickMe, children: 'Click me' }),
        React.createElement(Button, { variant: 'primary', onClick: onClickMe, children: 'Click me' }),
        React.createElement(Button, { variant: 'primary', onClick: onClickMe, children: 'Click me' })
      ),
      // Row B: Centered Submit
      React.createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'center' } },
        React.createElement(Button, { variant: 'primary', onClick: onSubmit, children: 'Submit' })
      ),
      // Row C: Prev left, Next right
      React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid hsl(var(--color-gray-200))',
          },
        },
        React.createElement(Button, { variant: 'secondary', onClick: onPrev, children: 'Previous' }),
        React.createElement(Button, { variant: 'primary', onClick: onNext, children: 'Next' })
      )
    )
  );
};

/**
 * Component Registry
 * Maps UIComponent.type values to presentational React components.
 * Components must be pure presentational - no data fetching or routing.
 */
export const componentRegistry: ComponentRegistry = {
  heading: HeadingComponent,
  button: ButtonComponent,
  buttonGroup: ButtonGroupComponent,
  text: TextComponent,
  dropdown: DropdownComponent,
  taskMapping: TaskMappingComponent,
  logicAppsWorkspace: LogicAppsWorkspaceComponent,
};

/**
 * Get component from registry by type.
 * Returns undefined if type is not registered.
 */
export function getComponent(type: string): React.FC<any> | undefined {
  return componentRegistry[type as ComponentType];
}

// External state interface for components that need external data
export interface ExternalComponentState {
  // Master ID dropdown state
  masterIdOptions?: DropdownOption[];
  masterIdValue?: string;
  masterIdLoading?: boolean;
  onMasterIdChange?: (value: string) => void;
  
  // Entry Types task mapping state (Source: ocnames, Target: 1-N numbers)
  entryTypesLeft?: string[];
  entryTypesRight?: string[];
  entryTypesLoading?: boolean;
  entryTypesConnections?: TaskConnection[];
  entryTypesSelectedLeft?: string | null;
  entryTypesSelectedRight?: string | null;
  entryTypesDraggedItem?: string | null;
  onEntryTypesSelectLeft?: (item: string) => void;
  onEntryTypesSelectRight?: (item: string) => void;
  onEntryTypesDragStart?: (leftId: string) => void;
  onEntryTypesDragEnd?: () => void;
  onEntryTypesDrop?: (rightId: string) => void;
  
  // Entry Type Attributes task mapping state (separate data source)
  entryTypeAttributesLeft?: string[];
  entryTypeAttributesRight?: string[];
  entryTypeAttributesLoading?: boolean;
  entryTypeAttributesConnections?: TaskConnection[];
  entryTypeAttributesSelectedLeft?: string | null;
  entryTypeAttributesSelectedRight?: string | null;
  entryTypeAttributesDraggedItem?: string | null;
  onEntryTypeAttributesSelectLeft?: (item: string) => void;
  onEntryTypeAttributesSelectRight?: (item: string) => void;
  onEntryTypeAttributesDragStart?: (leftId: string) => void;
  onEntryTypeAttributesDragEnd?: () => void;
  onEntryTypeAttributesDrop?: (rightId: string) => void;
  
  // Logic Apps state (now uses RAW JSON)
  logicAppsOptions?: DropdownOption[];
  logicAppsSelectedId?: string;
  logicAppsLoading?: boolean;
  onLogicAppSelect?: (id: string) => void;
  logicAppsDefinition?: unknown;
  logicAppsDefinitionLoading?: boolean;
  onLogicAppsClickMe?: () => void;
  onLogicAppsSubmit?: () => void;
  onLogicAppsPrev?: () => void;
  onLogicAppsNext?: () => void;
  
  // Button disabled states
  submitDisabled?: boolean;
}

/**
 * Render a UIComponent from schema.
 * Returns null if component type is not found in registry.
 */
export function renderComponent(
  component: UIComponent,
  index: number,
  onAction?: (action: string) => void,
  externalState?: ExternalComponentState
): React.ReactNode {
  const Component = getComponent(component.type);
  
  if (!Component) {
    console.warn(`Unknown component type: ${component.type}`);
    return null;
  }

  // Build props based on component type
  const props: Record<string, unknown> = {};
  
  if (component.type === 'heading') {
    props.value = component.value;
  } else if (component.type === 'text') {
    props.value = component.value;
    props.fullWidth = true;
  } else if (component.type === 'button') {
    props.label = component.label;
    props.action = component.action;
    props.onAction = onAction;
    props.centered = true;
    
    // Handle button disabled state based on action
    if (component.action === 'SUBMIT_MASTER_ID' && externalState) {
      props.disabled = externalState.submitDisabled;
    }
  } else if (component.type === 'buttonGroup') {
    props.buttons = component.buttons;
    props.onAction = onAction;
    props.submitDisabled = externalState?.submitDisabled;
  } else if (component.type === 'dropdown') {
    if (component.source === 'masterIds' && externalState) {
      props.label = component.label;
      props.source = component.source;
      props.options = externalState.masterIdOptions || [];
      props.value = externalState.masterIdValue || '';
      props.onChange = externalState.onMasterIdChange;
      props.isLoading = externalState.masterIdLoading;
    }
  } else if (component.type === 'taskMapping') {
    if (externalState) {
      props.leftSource = component.leftSource;
      props.rightSource = component.rightSource;
      
      // Determine which data source to use based on leftSource
      const isEntryTypeAttributes = component.leftSource === 'entryTypeAttributesLeft';
      
      if (isEntryTypeAttributes) {
        // Entry Type Attributes page - uses separate data source
        props.leftItems = externalState.entryTypeAttributesLeft || [];
        props.rightItems = externalState.entryTypeAttributesRight || [];
        props.connections = externalState.entryTypeAttributesConnections || [];
        props.selectedLeft = externalState.entryTypeAttributesSelectedLeft ?? null;
        props.selectedRight = externalState.entryTypeAttributesSelectedRight ?? null;
        props.draggedItem = externalState.entryTypeAttributesDraggedItem ?? null;
        props.onSelectLeft = externalState.onEntryTypeAttributesSelectLeft;
        props.onSelectRight = externalState.onEntryTypeAttributesSelectRight;
        props.onDragStart = externalState.onEntryTypeAttributesDragStart;
        props.onDragEnd = externalState.onEntryTypeAttributesDragEnd;
        props.onDrop = externalState.onEntryTypeAttributesDrop;
        props.isLoading = externalState.entryTypeAttributesLoading;
      } else {
        // Entry Types page - uses entry types data (ocnames -> 1 to N)
        props.leftItems = externalState.entryTypesLeft || [];
        props.rightItems = externalState.entryTypesRight || [];
        props.connections = externalState.entryTypesConnections || [];
        props.selectedLeft = externalState.entryTypesSelectedLeft ?? null;
        props.selectedRight = externalState.entryTypesSelectedRight ?? null;
        props.draggedItem = externalState.entryTypesDraggedItem ?? null;
        props.onSelectLeft = externalState.onEntryTypesSelectLeft;
        props.onSelectRight = externalState.onEntryTypesSelectRight;
        props.onDragStart = externalState.onEntryTypesDragStart;
        props.onDragEnd = externalState.onEntryTypesDragEnd;
        props.onDrop = externalState.onEntryTypesDrop;
        props.isLoading = externalState.entryTypesLoading;
      }
    }
  } else if (component.type === 'logicAppsWorkspace') {
    if (externalState) {
      props.options = externalState.logicAppsOptions || [];
      props.selectedId = externalState.logicAppsSelectedId || '';
      props.onSelect = externalState.onLogicAppSelect;
      props.isLoading = externalState.logicAppsLoading;
      props.definition = externalState.logicAppsDefinition ?? null;
      props.definitionLoading = externalState.logicAppsDefinitionLoading;
      props.onClickMe = externalState.onLogicAppsClickMe;
      props.onSubmit = externalState.onLogicAppsSubmit;
      props.onPrev = externalState.onLogicAppsPrev;
      props.onNext = externalState.onLogicAppsNext;
    }
  }

  return React.createElement(Component, { key: index, ...props });
}
