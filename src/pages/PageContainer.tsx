import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageRenderer, ExternalComponentState } from '../page-engine';
import { useMasterIds } from '../hooks/useMasterIds';
import { useTaskMapping } from '../hooks/useTaskMapping';
import { useEntryTypeAttributesMapping } from '../hooks/useEntryTypeAttributesMapping';
import { useLogicApps } from '../hooks/useLogicApps';
import { useMigrationChecklistContext } from '../context/MigrationChecklistContext';
import { saveSelectedMasterId } from '../api/azure/masterIds.api';
import { saveEntryTypeMappings } from '../api/azure/entryTypesMapping.api';

/**
 * PageContainer
 * Route-level component that extracts pageId from URL and renders via PageRenderer.
 */
export const PageContainer: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  
  const masterIds = useMasterIds();
  const taskMapping = useTaskMapping({ ocisid: masterIds.selectedOcisid }); // Entry Types filtered by Master ID's ocisid
  const entryTypeAttributesMapping = useEntryTypeAttributesMapping(); // Entry Type Attributes page
  const logicApps = useLogicApps();
  const checklist = useMigrationChecklistContext();

  /**
   * Handle actions from schema-driven buttons.
   * Workflow advancement happens ONLY through Next button clicks.
   * Checklist progression is PAGE-AWARE - only the matching step is completed.
   */
  const handleAction = useCallback(async (action: string) => {
    switch (action) {
      case 'START_MIGRATION':
        navigate('/page/master-id');
        break;
        
      case 'SUBMIT_MASTER_ID':
        // Save Master ID via API (no workflow advancement)
        if (masterIds.selectedId) {
          await saveSelectedMasterId(masterIds.selectedId);
          console.log('[Action] Master ID saved:', masterIds.selectedId);
        }
        break;
        
      case 'NEXT_FROM_MASTER_ID':
        // Advance workflow for master-id page (completes step 1) and navigate
        await checklist.advanceStepForPage('master-id');
        navigate('/page/entry-types');
        break;
        
      case 'SUBMIT_ENTRY_TYPES':
        // Save mappings via API - no navigation, no workflow advancement
        await saveEntryTypeMappings(taskMapping.connections);
        console.log('[Action] Entry Types mappings saved');
        break;
        
      case 'PREV_FROM_ENTRY_TYPES':
        // Navigate back without reverting workflow (Prev never unticks)
        navigate('/page/master-id');
        break;
        
      case 'NEXT_FROM_ENTRY_TYPES':
        // Advance workflow for entry-types page (completes step 2) and navigate
        await checklist.advanceStepForPage('entry-types');
        navigate('/page/entry-type-attributes');
        break;
        
      case 'SUBMIT_ENTRY_TYPE_ATTRIBUTES':
        // Save Entry Type Attributes mappings via API
        await saveEntryTypeMappings(entryTypeAttributesMapping.connections);
        console.log('[Action] Entry Type Attributes mappings saved');
        break;
        
      case 'PREV_FROM_ENTRY_TYPE_ATTRIBUTES':
        // Navigate back without reverting workflow (Prev never unticks)
        navigate('/page/entry-types');
        break;
        
      case 'NEXT_FROM_ENTRY_TYPE_ATTRIBUTES':
        // Advance workflow for entry-type-attributes page (completes step 3) and navigate
        await checklist.advanceStepForPage('entry-type-attributes');
        navigate('/page/logic-apps');
        break;
        
      case 'PREV_FROM_LOGIC_APPS':
        // Navigate back without reverting workflow (Prev never unticks)
        navigate('/page/entry-type-attributes');
        break;
        
      case 'NEXT_FROM_LOGIC_APPS':
        // Advance workflow for logic-apps page (completes step 4)
        await checklist.advanceStepForPage('logic-apps');
        console.log('[Action] Logic Apps step completed');
        // Future: navigate to next step when implemented
        break;
        
      default:
        console.warn(`Unknown action: ${action}`);
    }
  }, [navigate, masterIds.selectedId, taskMapping.connections, entryTypeAttributesMapping.connections, checklist]);

  // Logic Apps action handlers (not using schema actions for internal buttons)
  const handleLogicAppsClickMe = useCallback(() => {
    console.log('[LogicApps] Click me button pressed');
  }, []);

  const handleLogicAppsSubmit = useCallback(() => {
    console.log('[LogicApps] Submit pressed - no checklist tick');
    // Future: persist logic apps configuration
  }, []);

  const handleLogicAppsPrev = useCallback(() => {
    navigate('/page/entry-type-attributes');
  }, [navigate]);

  const handleLogicAppsNext = useCallback(async () => {
    await checklist.advanceStepForPage('logic-apps');
    console.log('[Action] Logic Apps step completed via Next');
    // Future: navigate to step 4 when implemented
  }, [checklist]);

  // Build external state for components
  const externalState: ExternalComponentState = {
    // Master ID state
    masterIdOptions: masterIds.data,
    masterIdValue: masterIds.selectedId,
    masterIdLoading: masterIds.isLoading,
    onMasterIdChange: masterIds.selectId,
    submitDisabled: !masterIds.selectedId,
    
    // Entry Types state (Source: ocnames, Target: 1 to N numbers)
    entryTypesLeft: taskMapping.left,
    entryTypesRight: taskMapping.right,
    entryTypesLoading: taskMapping.isLoading,
    entryTypesConnections: taskMapping.connections,
    entryTypesSelectedLeft: taskMapping.selectedLeft,
    entryTypesSelectedRight: taskMapping.selectedRight,
    entryTypesDraggedItem: taskMapping.draggedItem,
    onEntryTypesSelectLeft: taskMapping.selectLeft,
    onEntryTypesSelectRight: taskMapping.selectRight,
    onEntryTypesDragStart: taskMapping.handleDragStart,
    onEntryTypesDragEnd: taskMapping.handleDragEnd,
    onEntryTypesDrop: taskMapping.handleDrop,
    
    // Entry Type Attributes state (separate data source)
    entryTypeAttributesLeft: entryTypeAttributesMapping.left,
    entryTypeAttributesRight: entryTypeAttributesMapping.right,
    entryTypeAttributesLoading: entryTypeAttributesMapping.isLoading,
    entryTypeAttributesConnections: entryTypeAttributesMapping.connections,
    entryTypeAttributesSelectedLeft: entryTypeAttributesMapping.selectedLeft,
    entryTypeAttributesSelectedRight: entryTypeAttributesMapping.selectedRight,
    entryTypeAttributesDraggedItem: entryTypeAttributesMapping.draggedItem,
    onEntryTypeAttributesSelectLeft: entryTypeAttributesMapping.selectLeft,
    onEntryTypeAttributesSelectRight: entryTypeAttributesMapping.selectRight,
    onEntryTypeAttributesDragStart: entryTypeAttributesMapping.handleDragStart,
    onEntryTypeAttributesDragEnd: entryTypeAttributesMapping.handleDragEnd,
    onEntryTypeAttributesDrop: entryTypeAttributesMapping.handleDrop,
    
    // Logic Apps state
    logicAppsOptions: logicApps.logicApps.map(la => ({ id: la.id, label: la.label })),
    logicAppsSelectedId: logicApps.selectedId || '',
    logicAppsLoading: logicApps.listLoading,
    onLogicAppSelect: logicApps.selectLogicApp,
    logicAppsDefinition: logicApps.definition,
    logicAppsDefinitionLoading: logicApps.definitionLoading,
    onLogicAppsClickMe: handleLogicAppsClickMe,
    onLogicAppsSubmit: handleLogicAppsSubmit,
    onLogicAppsPrev: handleLogicAppsPrev,
    onLogicAppsNext: handleLogicAppsNext,
  };

  if (!pageId) {
    return <div style={{ padding: 'var(--space-6)' }}><p>No page specified</p></div>;
  }

  return <PageRenderer pageId={pageId} onAction={handleAction} externalState={externalState} />;
};

export default PageContainer;
