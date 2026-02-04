import { useState, useEffect, useCallback, useMemo } from 'react';
import { getEntryTypeAttributes, EntryTypeAttributesResponse } from '../api/azure/entryTypeAttributes.api';
import { TaskConnection } from '../schema/pageSchema';

interface UseEntryTypeAttributesMappingResult {
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

/**
 * Hook to manage Entry Type Attributes Mapping state.
 * Separate from useTaskMapping - uses its own API endpoint.
 * Implements one-to-one mapping rules.
 */
export function useEntryTypeAttributesMapping(): UseEntryTypeAttributesMappingResult {
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

  // Fetch entry type attributes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result: EntryTypeAttributesResponse = await getEntryTypeAttributes();
        setLeft(result.left);
        setRight(result.right);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load entry type attributes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
    
    if (existingConnection && selectedRight === existingConnection.rightId) {
      disconnectByPair(id, existingConnection.rightId);
      setSelectedLeft(null);
      setSelectedRight(null);
      return;
    }
    
    if (selectedRight !== null) {
      connect(id, selectedRight);
      return;
    }
    
    setSelectedLeft(prev => prev === id ? null : id);
  }, [selectedRight, getConnectionByLeft, connect, disconnectByPair]);

  // Handle right selection for click-to-match
  const selectRight = useCallback((id: string) => {
    const existingConnection = getConnectionByRight(id);
    
    if (existingConnection && selectedLeft === existingConnection.leftId) {
      disconnectByPair(existingConnection.leftId, id);
      setSelectedLeft(null);
      setSelectedRight(null);
      return;
    }
    
    if (selectedLeft !== null) {
      connect(selectedLeft, id);
      return;
    }
    
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
