'use client';

import { useState } from 'react';
import Sidebar from '@components/Sidebar';
import Styles from '@styles/siderbar.module.css';

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="d-flex">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className={`${Styles.content} ${!isOpen ? Styles.shifted : ''}`}>
        {children}
      </div>
    </div>
  );
}
