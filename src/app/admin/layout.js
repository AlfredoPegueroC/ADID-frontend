'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@components/Sidebar';
import Styles from '@styles/siderbar.module.css';
import { useAuth } from '@contexts/AuthContext';
import Notification from "@components/Notification";

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!user.groups.includes('admin')) {
        Notification.alertError('Acceso denegado. Solo administradores pueden acceder a esta sección.');
        router.push('/');
      }
    }
  }, [user, loading, router]);

  if (loading) return <div>Cargando...</div>;
  if (!user || !user.groups.includes('admin')) return null;

  return (
    <div>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className={`${Styles.content} ${!isOpen ? Styles.shifted : ''}`}>
        {children}
      </div>
    </div>
  );
}
