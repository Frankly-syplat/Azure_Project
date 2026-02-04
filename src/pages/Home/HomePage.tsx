import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardTile } from '../../UI/CardTile';
import { useHome } from '../../hooks/useHome';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  const { tiles, status, error } = useHome();
  const navigate = useNavigate();

  const handleTileClick = (tileId: string) => {
    // First tile (Dashboard Overview) navigates to migration page
    if (tileId === 'dashboard') {
      navigate('/page/migration-start');
    }
  };

  if (status === 'loading') {
    return (
      <div className={styles.loading}>
        <span>Loading...</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={styles.error}>
        <span>{error || 'An error occurred'}</span>
      </div>
    );
  }

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Here's what's happening with your projects today.</p>
      </header>

      <section className={styles.tilesSection}>
        {tiles.map((tile) => (
          <div key={tile.id} className={styles.tileWrapper}>
            <CardTile
              id={tile.id}
              title={tile.title}
              description={tile.description}
              onTileClick={() => handleTileClick(tile.id)}
            />
          </div>
        ))}
      </section>
    </>
  );
};
