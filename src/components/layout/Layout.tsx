import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useMapStore } from '../../store/useMapStore';
import { Map, LayoutDashboard, LogIn, LogOut, BarChart2, Leaf, Shield, Menu, X } from 'lucide-react';
import { supabase } from '../../services/supabase';
import styles from './Layout.module.css';
import MapSidebar from '../map/MapSidebar';

const Layout: React.FC = () => {
  const { user, profile, setUser, setProfile } = useAuthStore();
  const { reports } = useMapStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    navigate('/login');
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  // Page title based on route
  const pageTitle = (() => {
    switch (location.pathname) {
      case '/': return 'Map View';
      case '/analytics': return 'Analytics';
      case '/dashboard': return 'Dashboard';
      default: return 'EcoMap';
    }
  })();

  return (
    <div className={styles.layout}>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.overlay} onClick={closeMenu} />
      )}

      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Leaf size={20} />
          </div>
          <span>EcoMap</span>
          <button className={styles.mobileCloseBtn} onClick={closeMenu}>
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <div className={styles.navSection}>
          <span className={styles.navLabel}>Navigation</span>

          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
            onClick={closeMenu}
            end
          >
            <Map size={18} /> <span>Map View</span>
          </NavLink>

          {/* Waste Stream filters – only on map page */}
          {location.pathname === '/' && (
            <div style={{ padding: '0 0.25rem', margin: '0.25rem 0 0.5rem' }}>
              <MapSidebar />
            </div>
          )}

          <NavLink 
            to="/analytics" 
            className={({ isActive }) => isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
            onClick={closeMenu}
          >
            <BarChart2 size={18} /> <span>Analytics</span>
          </NavLink>

          {user && (
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
              onClick={closeMenu}
            >
              {profile?.role === 'admin' ? <Shield size={18} /> : <LayoutDashboard size={18} />}
              <span>{profile?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}</span>
            </NavLink>
          )}
        </div>

        {/* User section at bottom */}
        <div className={styles.userSection}>
          {user ? (
            <div className={styles.userCard}>
              <div className={styles.userAvatar}>{initials}</div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{profile?.full_name || 'User'}</div>
                <div className={styles.userRole}>{profile?.role || 'citizen'}</div>
              </div>
              <button className={styles.logoutBtn} onClick={handleLogout} title="Sign out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <NavLink to="/login" className={styles.loginLink} onClick={closeMenu}>
              <LogIn size={18} /> <span>Sign In</span>
            </NavLink>
          )}
        </div>
      </aside>
      
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.mobileMenuBtn} onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className={styles.topbarTitle}>
              {pageTitle}
            </div>
          </div>
          <div className={styles.topbarActions}>
            {pendingCount > 0 && (
              <span className={styles.topbarBadge}>{pendingCount} pending</span>
            )}
          </div>
        </header>
        <div className={styles.contentArea}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
