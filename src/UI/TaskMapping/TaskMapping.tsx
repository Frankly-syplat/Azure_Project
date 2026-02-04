import React, { useRef, useCallback, useMemo, useLayoutEffect, useState } from 'react';
import { TaskConnection } from '../../schema/pageSchema';
import { MappingTable } from './MappingTable';
import styles from './TaskMapping.module.css';

interface TaskMappingProps {
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

interface CirclePosition {
  id: string;
  y: number;
}

interface ConnectionPath {
  id: string;
  leftY: number;
  rightY: number;
  path: string;
}

/**
 * TaskMapping - Presentational task mapping component with SVG connections.
 * Shows two vertical buckets with items that can be matched via click or drag.
 * Connections are rendered as curved lines anchored to endpoint circles.
 * 
 * Receives data and callbacks via props only.
 * Does NOT fetch data or manage routing.
 */
export const TaskMapping: React.FC<TaskMappingProps> = ({
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
  isLoading = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const connectorRef = useRef<HTMLDivElement>(null);
  const leftListRef = useRef<HTMLUListElement>(null);
  const leftCircleRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const rightCircleRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  
  // State for measured positions
  const [leftPositions, setLeftPositions] = useState<CirclePosition[]>([]);
  const [rightPositions, setRightPositions] = useState<CirclePosition[]>([]);

  // Set ref for left endpoint circles
  const setLeftCircleRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      leftCircleRefs.current.set(id, el);
    } else {
      leftCircleRefs.current.delete(id);
    }
  }, []);

  // Set ref for right endpoint circles
  const setRightCircleRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      rightCircleRefs.current.set(id, el);
    } else {
      rightCircleRefs.current.delete(id);
    }
  }, []);

  // Measure circle positions after render using requestAnimationFrame for accuracy
  // Use the connector area as the SVG baseline since that's where the SVG is positioned
  useLayoutEffect(() => {
    const measurePositions = () => {
      if (!connectorRef.current) return;
      
      // Use connector area as baseline since SVG is positioned within it
      const connectorRect = connectorRef.current.getBoundingClientRect();
      
      // Measure left circles relative to connector area top
      const newLeftPositions: CirclePosition[] = [];
      leftCircleRefs.current.forEach((el, id) => {
        const rect = el.getBoundingClientRect();
        // Calculate center Y relative to connector area top
        const centerY = rect.top + rect.height / 2 - connectorRect.top;
        newLeftPositions.push({ id, y: centerY });
      });
      setLeftPositions(newLeftPositions);
      
      // Measure right circles relative to same baseline
      const newRightPositions: CirclePosition[] = [];
      rightCircleRefs.current.forEach((el, id) => {
        const rect = el.getBoundingClientRect();
        // Calculate center Y relative to connector area top
        const centerY = rect.top + rect.height / 2 - connectorRect.top;
        newRightPositions.push({ id, y: centerY });
      });
      setRightPositions(newRightPositions);
    };

    // Use RAF to ensure DOM is fully rendered before measuring
    const rafId = requestAnimationFrame(() => {
      measurePositions();
    });
    
    // Also measure on window resize
    window.addEventListener('resize', measurePositions);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', measurePositions);
    };
  }, [leftItems, rightItems, connections]);

  // Check if item is connected
  const isLeftConnected = useCallback((id: string) => {
    return connections.some(c => c.leftId === id);
  }, [connections]);

  const isRightConnected = useCallback((id: string) => {
    return connections.some(c => c.rightId === id);
  }, [connections]);

  // Handle drag events
  const handleDragStart = useCallback((e: React.DragEvent<HTMLButtonElement>, leftId: string) => {
    e.dataTransfer.setData('text/plain', leftId);
    e.dataTransfer.effectAllowed = 'link';
    onDragStart(leftId);
  }, [onDragStart]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'link';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLButtonElement>, rightId: string) => {
    e.preventDefault();
    onDrop(rightId);
  }, [onDrop]);

  const handleDragEnd = useCallback(() => {
    onDragEnd();
  }, [onDragEnd]);

  // Calculate SVG paths from measured positions
  const connectionPaths = useMemo((): ConnectionPath[] => {
    return connections.map(conn => {
      const leftPos = leftPositions.find(p => p.id === conn.leftId);
      const rightPos = rightPositions.find(p => p.id === conn.rightId);
      
      if (!leftPos || !rightPos) {
        return null;
      }

      const leftY = leftPos.y;
      const rightY = rightPos.y;
      const leftX = 8; // Offset for endpoint circle
      const rightX = 92; // SVG viewBox width - offset
      const midX = 50;
      
      return {
        id: `${conn.leftId}-${conn.rightId}`,
        leftY,
        rightY,
        path: `M ${leftX} ${leftY} C ${midX} ${leftY}, ${midX} ${rightY}, ${rightX} ${rightY}`,
      };
    }).filter((p): p is ConnectionPath => p !== null);
  }, [connections, leftPositions, rightPositions]);

  // Calculate SVG height based on measured positions
  const svgHeight = useMemo(() => {
    const allYs = [...leftPositions, ...rightPositions].map(p => p.y);
    if (allYs.length === 0) return 300;
    return Math.max(...allYs) + 24; // Add padding
  }, [leftPositions, rightPositions]);

  if (isLoading) {
    return (
      <div className={styles.taskMappingContainer}>
        <div className={styles.loading}>Loading entry types...</div>
      </div>
    );
  }

  return (
    <div className={styles.taskMappingContainer} ref={containerRef}>
      <div className={styles.mappingGrid}>
        {/* Left Bucket - Source System */}
        <div className={styles.bucket}>
          <div className={styles.bucketHeader}>
            <h4 className={styles.bucketTitle}>Source System</h4>
            <span className={styles.itemCount}>{leftItems.length} items</span>
          </div>
          <ul className={styles.itemList} ref={leftListRef}>
            {leftItems.map((item) => (
              <li key={item} className={styles.itemRow}>
                <button
                  type="button"
                  draggable
                  className={`${styles.item} ${styles.draggable} ${selectedLeft === item ? styles.selected : ''} ${isLeftConnected(item) ? styles.connected : ''} ${draggedItem === item ? styles.dragging : ''}`}
                  onClick={() => onSelectLeft(item)}
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                >
                  <span className={styles.dragHandle}>⋮⋮</span>
                  <span className={styles.itemText}>{item}</span>
                </button>
                <div 
                  ref={(el) => setLeftCircleRef(item, el)}
                  className={`${styles.endpointCircleLeft} ${isLeftConnected(item) ? styles.visible : ''}`} 
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Connector Area with SVG - positioned relative to the buckets */}
        <div className={styles.connectorArea}>
          {/* Spacer to match bucket header height */}
          <div className={styles.connectorHeaderSpacer} />
          {/* SVG container aligned with item lists */}
          <div className={styles.connectorSvgContainer} ref={connectorRef}>
            <svg 
              className={styles.connectorSvg}
              viewBox={`0 0 100 ${svgHeight}`}
              preserveAspectRatio="none"
              style={{ height: `${svgHeight}px` }}
            >
            {connectionPaths.map(({ id, path, leftY, rightY }) => (
              <g key={id}>
                {/* Connection line */}
                <path
                  d={path}
                  className={styles.connectionPath}
                  fill="none"
                  strokeWidth="2"
                />
                {/* Left endpoint circle */}
                <circle
                  cx="4"
                  cy={leftY}
                  r="4"
                  className={styles.endpointCircle}
                />
                {/* Right endpoint circle */}
                <circle
                  cx="96"
                  cy={rightY}
                  r="4"
                  className={styles.endpointCircle}
                />
              </g>
            ))}
            </svg>
          </div>
        </div>

        {/* Right Bucket - Target System */}
        <div className={styles.bucket}>
          <div className={styles.bucketHeader}>
            <h4 className={styles.bucketTitle}>Target System</h4>
            <span className={styles.itemCount}>{rightItems.length} items</span>
          </div>
          <ul className={styles.itemList}>
            {rightItems.map((item) => (
              <li key={item} className={styles.itemRow}>
                <div 
                  ref={(el) => setRightCircleRef(item, el)}
                  className={`${styles.endpointCircleRight} ${isRightConnected(item) ? styles.visible : ''}`} 
                />
                <button
                  type="button"
                  className={`${styles.item} ${selectedRight === item ? styles.selected : ''} ${isRightConnected(item) ? styles.connected : ''} ${draggedItem ? styles.droppable : ''}`}
                  onClick={() => onSelectRight(item)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item)}
                >
                  <span className={styles.itemText}>{item}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mapping Table (replaces arrow list) */}
      <MappingTable connections={connections} />
    </div>
  );
};
