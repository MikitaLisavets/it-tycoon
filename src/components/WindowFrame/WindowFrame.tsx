import React, { ReactNode } from 'react';
import styles from './WindowFrame.module.css';

interface WindowFrameProps {
  title: string;
  children: ReactNode;
  width?: string;
  height?: string;
  icon?: string; // Optional icon url or component
}

const WindowFrame: React.FC<WindowFrameProps> = ({ title, children, width = '100%', height = 'auto' }) => {
  return (
    <div className={styles.window} style={{ width, height }}>
      <div className={styles.titleBar}>
        <div className={styles.title}>
          {/* Default generic icon if none provided */}
          <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png" alt="" width={16} height={16} /> 
          {title}
        </div>
        <div className={styles.controls}>
            {/* Visual only buttons */}
             <button className={`${styles.controlBtn} ${styles.minimize}`}>_</button>
             <button className={`${styles.controlBtn} ${styles.maximize}`}>□</button>
             <button className={`${styles.controlBtn} ${styles.close}`}>X</button>
        </div>
      </div>
      <div className={styles.menuBar}>
         <span className={styles.menuItem}>File</span>
         <span className={styles.menuItem}>Help</span>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default WindowFrame;
