import React from 'react';
import { ChartIcon, LayersIcon, EditIcon, GridIcon } from '../Icons';
import { TileActionButton } from './TileActionButton';
import styles from './CardTile.module.css';

interface CardTileProps {
  id: string;
  title: string;
  description: string;
  onTileClick?: () => void;
  onAction1Click?: () => void;
  onAction2Click?: () => void;
  onAction3Click?: () => void;
}

const tileIconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  'dashboard': ChartIcon,
  'ui-generation': LayersIcon,
};

export const CardTile: React.FC<CardTileProps> = ({
  id,
  title,
  description,
  onTileClick,
  onAction1Click,
  onAction2Click,
  onAction3Click,
}) => {
  const TileIcon = tileIconMap[id] || ChartIcon;

  const handleCardClick = (e: React.MouseEvent) => {
    // Check if the click was on the action buttons area
    const target = e.target as HTMLElement;
    if (target.closest(`.${styles.actionButtons}`)) {
      return; // Don't trigger tile click if clicking action buttons
    }
    onTileClick?.();
  };

  return (
    <article className={styles.cardTile} onClick={handleCardClick}>
      <div className={styles.content}>
        <div className={styles.textContent}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
        
        <div className={styles.iconRow}>
          <div className={styles.mainIcon}>
            <TileIcon size={36} />
          </div>
          
          <div className={styles.actionButtons}>
            <TileActionButton 
              ariaLabel="View analytics" 
              icon={<ChartIcon size={18} />}
              onClick={(e) => {
                e.stopPropagation();
                onAction1Click?.();
              }} 
            />
            <TileActionButton 
              ariaLabel="Edit" 
              icon={<EditIcon size={18} />}
              onClick={(e) => {
                e.stopPropagation();
                onAction2Click?.();
              }} 
            />
            <TileActionButton 
              ariaLabel="View grid" 
              icon={<GridIcon size={18} />}
              onClick={(e) => {
                e.stopPropagation();
                onAction3Click?.();
              }} 
            />
          </div>
        </div>
      </div>
    </article>
  );
};
