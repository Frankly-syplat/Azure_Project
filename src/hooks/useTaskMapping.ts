import { useState, useEffect, useCallback, useMemo } from 'react';
import { getEntryTypesByOcisid, EntryTypeItem } from '../api/azure/entryTypes.api';
import { TaskConnection } from '../schema/pageSchema';

interface UseTaskMappingResult {
  // Data
  left: string[];
  right: string[];
  isLoading: boolean;
  error: string | null;
  
  // Selection state (for click-to-match)
  selectedLeft: string | null;
  selectedRight: string | null;
  
  // Connections (one-to-one mappings)
  connections: TaskConnection[];
  hasAnyConnections: boolean;
  
  // Selection handlers
  selectLeft: (id: string) => void;
  selectRight: (id: string) => void;
  
  // Connection handlers
  connect: (leftId: string, rightId: string) => void;
  disconnectByPair: (leftId: string, rightId: string) => void;
  disconnectByLeft: (leftId: string) => void;
  disconnectByRight: (rightId: string) => void;
  
  // Drag handlers
  draggedItem: string | null;
  handleDragStart: (leftId: string) => void;
  handleDragEnd: () => void;
  handleDrop: (rightId: string) => void;
}

interface UseTaskMappingOptions {
  ocisid?: number; // Filter entry types by ocisid (1, 6, or 9)
}

/**
 * Hook to manage Task Mapping state with multi-connection support.
 * Implements one-to-one mapping rules:
 * - Each left task can match only one right task
 * - Each right task can match only one left task
 * - Multiple independent pairs allowed
 */
export function useTaskMapping(options: UseTaskMappingOptions = {}): UseTaskMappingResult {
  const { ocisid = 1 } = options; // Default to ocisid 1
  
  // Data state
  const [left, setLeft] = useState<string[]>([]);
  const [right, setRight] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Selection state for click-to-match
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  
  // Connections map (one-to-one)
  const [connections, setConnections] = useState<TaskConnection[]>([]);
  
  // Drag state
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Fetch entry types filtered by ocisid
  useEffect(() => {
    const fetchEntryTypes = async () => {
      try {
        setIsLoading(true);
        console.log("[useTaskMapping] Fetching entry types for ocisid:", ocisid);
        
        const items: EntryTypeItem[] = await getEntryTypesByOcisid(ocisid);
        console.log("[useTaskMapping] Fetched items:", items.length);
        
        // Extract ocnames for Source System (left)
        const ocnames = items.map(item => item.ocname);
        
        // Generate numbered targets for Target System (right)
        const targetNumbers = ocnames.map((_, index) => String(index + 1));
        
        console.log("[useTaskMapping] Left (ocnames):", ocnames.length, "items");
        console.log("[useTaskMapping] Right (targets):", targetNumbers.length, "items");
        
        setLeft(ocnames);
        setRight(targetNumbers);
        setError(null);
      } catch (err) {
        console.error("[useTaskMapping] Error:", err);
        setError(err instanceof Error ? err.message : 'Failed to load entry types');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntryTypes();
  }, [ocisid]); // Re-fetch when ocisid changes

  // Check if a left item is connected
  const getConnectionByLeft = useCallback((leftId: string): TaskConnection | undefined => {
    return connections.find(c => c.leftId === leftId);
  }, [connections]);

  // Check if a right item is connected
  const getConnectionByRight = useCallback((rightId: string): TaskConnection | undefined => {
    return connections.find(c => c.rightId === rightId);
  }, [connections]);

  // Connect two items (handles one-to-one rule)
  const connect = useCallback((leftId: string, rightId: string) => {
    setConnections(prev => {
      // Remove any existing connections involving these items
      const filtered = prev.filter(c => c.leftId !== leftId && c.rightId !== rightId);
      // Add the new connection
      return [...filtered, { leftId, rightId }];
    });
    // Clear selection after connecting
    setSelectedLeft(null);
    setSelectedRight(null);
  }, []);

  // Disconnect by pair
  const disconnectByPair = useCallback((leftId: string, rightId: string) => {
    setConnections(prev => prev.filter(c => !(c.leftId === leftId && c.rightId === rightId)));
  }, []);

  // Disconnect by left item
  const disconnectByLeft = useCallback((leftId: string) => {
    setConnections(prev => prev.filter(c => c.leftId !== leftId));
  }, []);

  // Disconnect by right item
  const disconnectByRight = useCallback((rightId: string) => {
    setConnections(prev => prev.filter(c => c.rightId !== rightId));
  }, []);

  // Handle left selection for click-to-match
  const selectLeft = useCallback((id: string) => {
    const existingConnection = getConnectionByLeft(id);
    
    // If this item is connected and user clicks it followed by its connected pair, disconnect
    if (existingConnection && selectedRight === existingConnection.rightId) {
      disconnectByPair(id, existingConnection.rightId);
      setSelectedLeft(null);
      setSelectedRight(null);
      return;
    }
    
    // If we already have a right selected, create connection
    if (selectedRight !== null) {
      connect(id, selectedRight);
      return;
    }
    
    // Toggle selection
    setSelectedLeft(prev => prev === id ? null : id);
  }, [selectedRight, getConnectionByLeft, connect, disconnectByPair]);

  // Handle right selection for click-to-match
  const selectRight = useCallback((id: string) => {
    const existingConnection = getConnectionByRight(id);
    
    // If this item is connected and user clicks its connected pair, disconnect
    if (existingConnection && selectedLeft === existingConnection.leftId) {
      disconnectByPair(existingConnection.leftId, id);
      setSelectedLeft(null);
      setSelectedRight(null);
      return;
    }
    
    // If we already have a left selected, create connection
    if (selectedLeft !== null) {
      connect(selectedLeft, id);
      return;
    }
    
    // Toggle selection
    setSelectedRight(prev => prev === id ? null : id);
  }, [selectedLeft, getConnectionByRight, connect, disconnectByPair]);

  // Drag handlers
  const handleDragStart = useCallback((leftId: string) => {
    setDraggedItem(leftId);
    setSelectedLeft(leftId);
    setSelectedRight(null);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  const handleDrop = useCallback((rightId: string) => {
    if (draggedItem) {
      connect(draggedItem, rightId);
      setDraggedItem(null);
    }
  }, [draggedItem, connect]);

  // Computed values
  const hasAnyConnections = useMemo(() => connections.length > 0, [connections]);

  return {
    left,
    right,
    isLoading,
    error,
    selectedLeft,
    selectedRight,
    connections,
    hasAnyConnections,
    selectLeft,
    selectRight,
    connect,
    disconnectByPair,
    disconnectByLeft,
    disconnectByRight,
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDrop,
  };
}
