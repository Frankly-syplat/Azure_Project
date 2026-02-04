import React from 'react';
import styles from './DropdownField.module.css';

export interface DropdownOption {
  id: string;
  label: string;
}

interface DropdownFieldProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

/**
 * DropdownField - Presentational dropdown component.
 * Receives data and callbacks via props only.
 * Does NOT fetch data or manage routing.
 */
export const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  isLoading = false,
  disabled = false,
}) => {
  return (
    <div className={styles.dropdownContainer}>
      <label className={styles.label}>{label}</label>
      <div className={styles.selectWrapper}>
        <select
          className={styles.select}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || isLoading}
        >
          <option value="" disabled>
            {isLoading ? 'Loading...' : placeholder}
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <div className={styles.chevron}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
