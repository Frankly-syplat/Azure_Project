import React from 'react';
import { ChecklistStatus } from '../../api/azure/migrationChecklist.api';
import styles from './ChecklistPanel.module.css';

interface ChecklistStep {
  id: string;
  label: string;
  status: ChecklistStatus;
  pages: string[];
}

interface ChecklistPanelProps {
  steps: ChecklistStep[];
  onStepClick: (step: ChecklistStep) => void;
  isLoading?: boolean;
}

const CheckIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M10 3L4.5 8.5L2 6" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const StepCircle: React.FC<{ status: ChecklistStatus }> = ({ status }) => {
  return (
    <div className={`${styles.circle} ${styles[status]}`}>
      {status === 'completed' && <CheckIcon />}
    </div>
  );
};

export const ChecklistPanel: React.FC<ChecklistPanelProps> = ({
  steps,
  onStepClick,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className={styles.checklistPanel}>
        <div className={styles.loading}>Loading checklist...</div>
      </div>
    );
  }

  return (
    <aside className={styles.checklistPanel}>
      <h3 className={styles.panelTitle}>Migration Steps</h3>
      <div className={styles.checklistContainer}>
        <div className={styles.verticalLine} />
        <ul className={styles.stepsList}>
          {steps.map((step, index) => (
            <li key={step.id} className={styles.stepItem}>
              <button
                type="button"
                className={`${styles.stepButton} ${styles[step.status]}`}
                onClick={() => onStepClick(step)}
              >
                <StepCircle status={step.status} />
                <span className={styles.stepLabel}>{step.label}</span>
                {step.pages.length > 1 && (
                  <span className={styles.pageCount}>({step.pages.length} pages)</span>
                )}
              </button>
              {index < steps.length - 1 && (
                <div className={styles.connector} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
