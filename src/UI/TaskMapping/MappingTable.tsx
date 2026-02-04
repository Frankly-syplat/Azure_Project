import React from 'react';
import { TaskConnection } from '../../schema/pageSchema';
import styles from './MappingTable.module.css';

interface MappingTableProps {
  connections: TaskConnection[];
}

/**
 * MappingTable - Presentational table showing active mappings.
 * Displays Source → Target pairs in a clean 2-column format.
 * 
 * Receives data via props only.
 * Does NOT manage state or compute mappings.
 */
export const MappingTable: React.FC<MappingTableProps> = ({ connections }) => {
  if (connections.length === 0) {
    return null;
  }

  return (
    <div className={styles.tableContainer}>
      <h4 className={styles.tableTitle}>Active Mappings ({connections.length})</h4>
      <table className={styles.mappingTable}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Source Task</th>
            <th className={styles.tableHeader}>Target Task</th>
          </tr>
        </thead>
        <tbody>
          {connections.map((conn) => (
            <tr key={`${conn.leftId}-${conn.rightId}`} className={styles.tableRow}>
              <td className={styles.tableCell}>{conn.leftId}</td>
              <td className={styles.tableCell}>{conn.rightId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
