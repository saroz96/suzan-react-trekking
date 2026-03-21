import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from './Sidebar';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Sample dashboard stats
  const stats = [
    { label: 'Total Trips', value: '24', icon: '🏔️', color: '#e67e22', change: '+12%' },
    { label: 'Active Bookings', value: '18', icon: '📅', color: '#3498db', change: '+5%' },
    { label: 'Total Reviews', value: '156', icon: '⭐', color: '#f1c40f', change: '+23%' },
    { label: 'Revenue', value: '$45.2K', icon: '💰', color: '#2ecc71', change: '+18%' },
  ];

  const recentBookings = [
    { id: 1, customer: 'John Doe', trek: 'Everest Base Camp', date: '2024-03-15', status: 'confirmed', amount: '$1,200' },
    { id: 2, customer: 'Jane Smith', trek: 'Annapurna Circuit', date: '2024-03-14', status: 'pending', amount: '$950' },
    { id: 3, customer: 'Mike Johnson', trek: 'Langtang Valley', date: '2024-03-13', status: 'completed', amount: '$750' },
    { id: 4, customer: 'Sarah Wilson', trek: 'Manaslu Circuit', date: '2024-03-12', status: 'confirmed', amount: '$1,500' },
  ];

  return (
    <div style={styles.container}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Content */}
      <main style={{
        ...styles.main,
        marginLeft: isSidebarOpen ? '280px' : '0',
      }}>
        {/* Top Bar */}
        <div style={styles.topBar}>
          <button onClick={toggleSidebar} style={styles.menuToggle} id="sidebar-toggle">
            ☰
          </button>
          <h1 style={styles.pageTitle}>Dashboard</h1>
          <div style={styles.topBarRight}>
            <span style={styles.date}>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Welcome Banner */}
        <div style={styles.welcomeBanner}>
          <div>
            <h2 style={styles.welcomeTitle}>Welcome back, {user?.name}! 👋</h2>
            <p style={styles.welcomeText}>Here's what's happening with your trekking business today.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} style={styles.statCard}>
              <div style={{ ...styles.statIcon, backgroundColor: stat.color + '20', color: stat.color }}>
                {stat.icon}
              </div>
              <div style={styles.statInfo}>
                <span style={styles.statValue}>{stat.value}</span>
                <span style={styles.statLabel}>{stat.label}</span>
                <span style={{
                  ...styles.statChange,
                  color: stat.change.startsWith('+') ? '#2ecc71' : '#e74c3c'
                }}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Recent Bookings</h3>
            <button style={styles.viewAllButton}>View All →</button>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Trek</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td style={styles.td}>{booking.customer}</td>
                    <td style={styles.td}>{booking.trek}</td>
                    <td style={styles.td}>{booking.date}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: 
                          booking.status === 'confirmed' ? '#e8f5e8' : 
                          booking.status === 'pending' ? '#fff3e0' : '#e8f4fd',
                        color: 
                          booking.status === 'confirmed' ? '#2ecc71' : 
                          booking.status === 'pending' ? '#e67e22' : '#3498db',
                      }}>
                        {booking.status}
                      </span>
                    </td>
                    <td style={styles.td}>{booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: 'Arial, sans-serif',
  },
  main: {
    padding: '30px',
    transition: 'margin-left 0.3s ease',
    minHeight: '100vh',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '30px',
    backgroundColor: 'white',
    padding: '15px 25px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  menuToggle: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#2c3e50',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    ':hover': {
      backgroundColor: '#f8f9fa',
    },
  },
  pageTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0,
  },
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  date: {
    color: '#7f8c8d',
    fontSize: '14px',
  },
  welcomeBanner: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  welcomeTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 8px 0',
  },
  welcomeText: {
    fontSize: '14px',
    color: '#7f8c8d',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    transition: 'transform 0.2s, boxShadow 0.2s',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    },
  },
  statIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    display: 'block',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50',
    lineHeight: '1.2',
  },
  statLabel: {
    display: 'block',
    fontSize: '13px',
    color: '#7f8c8d',
    marginBottom: '4px',
  },
  statChange: {
    fontSize: '12px',
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0,
  },
  viewAllButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#e67e22',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    padding: '5px 10px',
    borderRadius: '4px',
    ':hover': {
      backgroundColor: '#fff3e0',
    },
  },
  tableContainer: {
    overflowX: 'auto' as const,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  th: {
    textAlign: 'left' as const,
    padding: '12px',
    borderBottom: '2px solid #ecf0f1',
    color: '#7f8c8d',
    fontSize: '13px',
    fontWeight: '600',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ecf0f1',
    color: '#2c3e50',
    fontSize: '14px',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'capitalize' as const,
  },
};

export default Dashboard;