'use client';

import Link from 'next/link';
import Styles from '@styles/siderbar.module.css';

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`${Styles.sidebar} ${!isOpen ? Styles.collapsed : ''}`}>
      <div className={Styles.header}>
        {isOpen && <h5 className="mb-0">Admin Panel</h5>}
        <button
          onClick={toggleSidebar}
          className="btn btn-sm btn-outline-secondary"
          title={isOpen ? 'Collapse' : 'Expand'}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {isOpen && (
        <nav className="mt-3">
          <Link href="/admin" className={Styles.navLink}>Dashboard</Link>
          <Link href="/admin/usuarios" className={Styles.navLink}>Usuarios</Link>
          <Link href="/admin/registrar" className={Styles.navLink}>Registrar</Link>
        </nav>
      )}
    </div>
  );
}
