import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  LayoutDashboard,
  Wallet,
  UserCheck,
  Shield,
  Cpu,
  TrendingUp,
  PieChart,
  MessageSquare,
  Bell,
  AlertTriangle,
  Lock,
  CheckCircle2,
  Clock,
  Eye,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Download,
  XCircle,
  Activity,
  CreditCard,
  BarChart3,
  ShieldAlert,
  Fingerprint,
  Smartphone,
  Flame,
  AlertOctagon,
  CircleDot,
  Star,
  RefreshCw
} from 'lucide-react';

const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : `http://${window.location.hostname}:5000`;

const API_BASE = `${BACKEND_URL}/api/admin`;

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [socketConnected, setSocketConnected] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // ─── Overview Metrics ───
  const [metrics, setMetrics] = useState({
    totalRevenue: 128400,
    todaysTransactions: 1842,
    activeConductors: 14,
    pendingWalletIssues: 7,
    securityAlerts: 3,
    aiFraudAlerts: 2,
    openComplaints: 5,
    revenueChangePercent: 12.4,
    txnChangePercent: 8.2
  });

  // ─── Wallet Pending Items ───
  const [walletPending, setWalletPending] = useState([
    { id: 'WP-001', passengerName: 'Kavitha P', issue: 'UPI amount debited but wallet not credited', amount: 500, txnId: 'TXN-884520', status: 'PENDING', createdAt: 'Today, 09:15 AM', type: 'Failed Recharge' },
    { id: 'WP-002', passengerName: 'Ramesh V', issue: 'Double deduction on Route 400D Express fare', amount: 45, txnId: 'TXN-883901', status: 'PENDING', createdAt: 'Today, 10:42 AM', type: 'Double Deduction' },
    { id: 'WP-003', passengerName: 'Srinivas Rao', issue: 'Refund request for cancelled trip (offline token)', amount: 35, txnId: 'TXN-884112', status: 'UNDER_REVIEW', createdAt: 'Today, 11:30 AM', type: 'Refund Request' },
    { id: 'WP-004', passengerName: 'Lakshmi Devi', issue: 'Wallet balance mismatch after settlement sync', amount: 120, txnId: 'TXN-883760', status: 'PENDING', createdAt: 'Yesterday, 06:10 PM', type: 'Sync Mismatch' },
    { id: 'WP-005', passengerName: 'Anand Kumar', issue: 'Emergency credit auto-deduction failed', amount: 75, txnId: 'TXN-884300', status: 'ESCALATED', createdAt: 'Yesterday, 04:25 PM', type: 'Credit Failure' }
  ]);

  // ─── Conductors ───
  const [conductors, setConductors] = useState([
    { id: 'C-24568', name: 'Ravi Kumar', busNumber: 'AP 39 X 1234', dutyStatus: 'On Duty', shift: '06:00 – 14:00', shiftLabel: 'Morning Shift', leaveStatus: 'Active', totalCollection: 4280, ticketsIssued: 87 },
    { id: 'C-24569', name: 'Suresh', busNumber: 'AP 40 Y 5678', dutyStatus: 'On Leave', shift: '—', shiftLabel: '—', leaveStatus: 'Casual Leave (1 day)', totalCollection: 0, ticketsIssued: 0 },
    { id: 'C-24570', name: 'Ajay', busNumber: 'AP 39 Z 9012', dutyStatus: 'On Duty', shift: '14:00 – 22:00', shiftLabel: 'Afternoon Shift', leaveStatus: 'Active', totalCollection: 3150, ticketsIssued: 62 },
    { id: 'C-24571', name: 'Venkateswarlu K.', busNumber: 'AP 31 TB 4567', dutyStatus: 'On Duty', shift: '06:00 – 14:00', shiftLabel: 'Morning Shift', leaveStatus: 'Active', totalCollection: 5620, ticketsIssued: 114 },
    { id: 'C-24572', name: 'Ramu S.', busNumber: 'AP 31 TB 8899', dutyStatus: 'On Duty', shift: '06:00 – 14:00', shiftLabel: 'Morning Shift', leaveStatus: 'Active', totalCollection: 4890, ticketsIssued: 98 },
    { id: 'C-24573', name: 'Appa Rao M.', busNumber: 'AP 31 TB 1122', dutyStatus: 'Off Duty', shift: '—', shiftLabel: 'Night Rest', leaveStatus: 'Active', totalCollection: 0, ticketsIssued: 0 },
    { id: 'C-24574', name: 'Nagarjuna P.', busNumber: 'AP 39 W 3456', dutyStatus: 'On Duty', shift: '22:00 – 06:00', shiftLabel: 'Night Shift', leaveStatus: 'Active', totalCollection: 2340, ticketsIssued: 47 }
  ]);

  const [pendingConductors, setPendingConductors] = useState([]);
  
  const fetchPendingConductors = async () => {
    try {
      const res = await fetch(`${API_BASE}/conductors/pending`);
      const data = await res.json();
      if (data.success) {
        setPendingConductors(data.pending);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveConductor = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/conductors/${id}/approve`, { method: 'PATCH' });
      const data = await res.json();
      if (data.success) {
        showToast('✅ Conductor approved successfully');
        fetchPendingConductors(); // refresh list
      } else {
        showToast('❌ Failed to approve conductor');
      }
    } catch (e) {
      showToast('❌ Error approving conductor');
    }
  };

  // ─── Security Events ───
  const [securityEvents, setSecurityEvents] = useState([
    { id: 'SEC-101', timestamp: '2026-08-01T03:45:00Z', eventType: 'FAILED_LOGIN', description: 'Failed admin login attempt – wrong password (3rd attempt)', source: 'Admin Portal', ipAddress: '49.207.12.98', severity: 'MEDIUM', status: 'LOGGED' },
    { id: 'SEC-102', timestamp: '2026-08-01T03:12:00Z', eventType: 'DUPLICATE_TXN', description: 'Duplicate transaction attempt detected on PAS-8724 wallet', source: 'ETM-VSP-003', ipAddress: '192.168.1.45', severity: 'HIGH', status: 'BLOCKED' },
    { id: 'SEC-103', timestamp: '2026-08-01T02:58:00Z', eventType: 'INVALID_AUTH', description: 'Invalid JWT token presented by unknown device', source: 'Mobile API', ipAddress: '106.51.34.12', severity: 'HIGH', status: 'BLOCKED' },
    { id: 'SEC-104', timestamp: '2026-08-01T01:30:00Z', eventType: 'DEVICE_ALERT', description: 'ETM-VSP-003 GPS spoofing anomaly detected', source: 'ETM GPS Module', ipAddress: '—', severity: 'CRITICAL', status: 'INVESTIGATING' },
    { id: 'SEC-105', timestamp: '2026-07-31T23:15:00Z', eventType: 'ACCOUNT_BLOCK', description: 'Auto-suspended PAS-8724 due to 5 failed PIN attempts', source: 'Wallet Security', ipAddress: '—', severity: 'HIGH', status: 'AUTO_BLOCKED' },
    { id: 'SEC-106', timestamp: '2026-07-31T22:45:00Z', eventType: 'SUSPICIOUS_ACTIVITY', description: 'Abnormal scan frequency: 14 QR scans in 2 minutes from C-24568', source: 'ETM-VSP-001', ipAddress: '192.168.1.20', severity: 'MEDIUM', status: 'UNDER_REVIEW' }
  ]);

  // ─── AI Fraud Alerts ───
  const [aiAlerts, setAiAlerts] = useState([
    { alertId: 'ALT-901', timestamp: '2026-08-01T03:30:00Z', type: 'TOKEN_SPIKE', target: 'PAS-8724 (Ramesh V)', trigger: '150 Offline tokens generated in 10 minutes from single device', riskLevel: 'CRITICAL', riskScore: 96, recommendation: 'Suspend wallet & revoke QR certificates immediately', actionTaken: 'AUTO_SUSPENDED', adminReview: 'Pending' },
    { alertId: 'ALT-902', timestamp: '2026-08-01T02:45:00Z', type: 'QR_CLONING', target: 'QR-TOKEN-400D-88', trigger: 'Same QR token scanned on 3 different buses within 2 minutes', riskLevel: 'HIGH', riskScore: 88, recommendation: 'Blacklist token & send push alert to all conductors', actionTaken: 'TOKEN_BLACKLISTED', adminReview: 'Reviewed' },
    { alertId: 'ALT-903', timestamp: '2026-08-01T01:10:00Z', type: 'UNUSUAL_PAYMENT', target: 'PAS-8723 (Kavitha P)', trigger: 'Multiple ₹500 wallet recharges followed by immediate full withdrawals', riskLevel: 'HIGH', riskScore: 82, recommendation: 'Flag for manual KYC re-verification', actionTaken: 'FLAGGED', adminReview: 'Pending' },
    { alertId: 'ALT-904', timestamp: '2026-07-31T21:00:00Z', type: 'REPEATED_TXN', target: 'PAS-9001 (Unknown)', trigger: 'Identical ₹25 fare transactions repeated 8 times to same route in 30 mins', riskLevel: 'MEDIUM', riskScore: 65, recommendation: 'Rate limit transactions & monitor', actionTaken: 'RATE_LIMITED', adminReview: 'Reviewed' }
  ]);

  // ─── Revenue ───
  const [revenue, setRevenue] = useState({
    daily: 128400,
    weekly: 856200,
    monthly: 3642000,
    byMethod: [
      { method: 'UPI Online', amount: 53928, percent: 42, color: '#0D6EFD' },
      { method: 'Offline Wallet', amount: 48792, percent: 38, color: '#10B981' },
      { method: 'Cash Collection', amount: 19260, percent: 15, color: '#F59E0B' },
      { method: 'Emergency Credit', amount: 6420, percent: 5, color: '#EF4444' }
    ],
    trendData: [
      { day: 'Mon', amount: 118500 }, { day: 'Tue', amount: 125200 }, { day: 'Wed', amount: 131800 },
      { day: 'Thu', amount: 122400 }, { day: 'Fri', amount: 128400 }, { day: 'Sat', amount: 142600 }, { day: 'Sun', amount: 98200 }
    ],
    ticketStats: { total: 1842, express: 680, pallevelugu: 520, ultraDeluxe: 310, superLuxury: 180, garudaAC: 152 }
  });

  // ─── Complaints ───
  const [complaints, setComplaints] = useState([
    { ticketId: 'CMP-501', passengerName: 'Srinivas Rao', category: 'Wrong Fare', issue: 'Overcharged ₹15 on Route 400D Express', status: 'OPEN', priority: 'MEDIUM', createdAt: 'Today, 10:15 AM', assignedTo: 'Support Agent 2', resolution: '' },
    { ticketId: 'CMP-502', passengerName: 'Kavitha P', category: 'Wallet Issue', issue: 'UPI amount debited but wallet not credited ₹500', status: 'IN_PROGRESS', priority: 'HIGH', createdAt: 'Yesterday, 04:30 PM', assignedTo: 'Finance Ops', resolution: '' },
    { ticketId: 'CMP-503', passengerName: 'Ramesh V', category: 'Conductor Complaint', issue: 'Conductor refused to accept digital payment', status: 'OPEN', priority: 'HIGH', createdAt: 'Today, 08:45 AM', assignedTo: 'Unassigned', resolution: '' },
    { ticketId: 'CMP-504', passengerName: 'Lakshmi Devi', category: 'App Bug', issue: 'QR code not displaying after booking confirmation', status: 'RESOLVED', priority: 'LOW', createdAt: '2 days ago', assignedTo: 'Tech Team', resolution: 'Fixed in app version 2.4.2' },
    { ticketId: 'CMP-505', passengerName: 'Anand Kumar', category: 'Refund', issue: 'Duplicate fare deduction – requesting refund of ₹45', status: 'IN_PROGRESS', priority: 'MEDIUM', createdAt: 'Yesterday, 11:20 AM', assignedTo: 'Finance Ops', resolution: '' }
  ]);

  // ─── Notifications ───
  const [notifications, setNotifications] = useState([
    { id: 'NOT-001', type: 'SECURITY', title: 'Critical: GPS Spoofing Detected', message: 'ETM-VSP-003 reported GPS coordinates inconsistent with route path. Investigate immediately.', timestamp: '3 mins ago', read: false, severity: 'CRITICAL' },
    { id: 'NOT-002', type: 'AI_FRAUD', title: 'AI Alert: Token Spike on PAS-8724', message: '150 offline tokens generated in 10 minutes. Wallet auto-suspended by AI engine.', timestamp: '15 mins ago', read: false, severity: 'HIGH' },
    { id: 'NOT-003', type: 'WALLET', title: 'Pending: 7 Wallet Issues Awaiting Resolution', message: '5 failed recharges and 2 double deductions require manual review.', timestamp: '30 mins ago', read: false, severity: 'MEDIUM' },
    { id: 'NOT-004', type: 'COMPLAINT', title: 'New Complaint: Conductor Refused Digital Payment', message: 'High priority complaint CMP-503 from Ramesh V needs immediate attention.', timestamp: '1 hour ago', read: true, severity: 'HIGH' },
    { id: 'NOT-005', type: 'SYSTEM', title: 'Scheduled Maintenance: Server Update Tonight', message: 'Backend servers will undergo maintenance from 02:00 AM to 03:00 AM IST.', timestamp: '2 hours ago', read: true, severity: 'LOW' },
    { id: 'NOT-006', type: 'SYSTEM', title: 'Daily Revenue Report Generated', message: 'Yesterdays revenue report (₹1,42,600) has been auto-generated and archived.', timestamp: '5 hours ago', read: true, severity: 'INFO' }
  ]);

  // ─── Socket.IO ───
  useEffect(() => {
    // Connect to WebSocket
    const socket = io(BACKEND_URL, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });
    
    // Initial fetches
    fetchPendingConductors();

    socket.on('connect', () => setSocketConnected(true));
    socket.on('disconnect', () => setSocketConnected(false));

    socket.on('ticketGenerated', (data) => {
      showToast(`🎟️ New Ticket: ₹${data.fare || 25} (${data.paymentStatus || 'SUCCESS'})`);
      setMetrics(prev => ({
        ...prev,
        todaysTransactions: prev.todaysTransactions + 1,
        totalRevenue: prev.totalRevenue + Number(data.fare || 25)
      }));
    });

    socket.on('paymentCompleted', (data) => {
      showToast(`💰 Payment Verified: Ticket #${data.ticketId}`);
    });

    socket.on('qrRedeemed', (data) => {
      showToast(`🔒 QR Redeemed & Expired: ${data.ticketId}`);
    });

    return () => socket.disconnect();
  }, []);

  // ─── Wallet action handlers ───
  const handleWalletResolve = (id) => {
    setWalletPending(prev => prev.map(w => w.id === id ? { ...w, status: 'RESOLVED' } : w));
    showToast(`✅ Wallet issue ${id} marked as resolved`);
  };

  const handleComplaintUpdate = (ticketId, newStatus) => {
    setComplaints(prev => prev.map(c => c.ticketId === ticketId ? { ...c, status: newStatus } : c));
    showToast(`📋 Complaint ${ticketId} updated to ${newStatus}`);
  };

  const handleNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const exportReport = (format) => {
    const csvContent = "data:text/csv;charset=utf-8,Date,Revenue,Transactions,Method\nToday,128400,1842,Mixed\nYesterday,142600,2104,Mixed";
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `APSRTC_Report_${Date.now()}.${format}`);
    document.body.appendChild(link);
    link.click();
    showToast(`📥 Report exported as ${format.toUpperCase()}`);
  };

  // ─── Navigation ───
  const navigationItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, section: 'OVERVIEW' },
    { id: 'wallet', label: 'Wallet Monitoring', icon: Wallet, section: 'OVERVIEW', badge: metrics.pendingWalletIssues },
    { id: 'conductors', label: 'Conductor Management', icon: UserCheck, section: 'OPERATIONS' },
    { id: 'security', label: 'Security Dashboard', icon: Shield, section: 'OPERATIONS' },
    { id: 'ai_fraud', label: 'AI Fraud Detection', icon: Cpu, section: 'OPERATIONS' },
    { id: 'revenue', label: 'Revenue Dashboard', icon: TrendingUp, section: 'OPERATIONS' },
    { id: 'analytics', label: 'Analytics Dashboard', icon: PieChart, section: 'OPERATIONS' },
    { id: 'complaints', label: 'Complaint Management', icon: MessageSquare, section: 'OPERATIONS', badge: complaints.filter(c => c.status !== 'RESOLVED').length },
    { id: 'notifications', label: 'Notifications Centre', icon: Bell, section: 'OPERATIONS', badge: notifications.filter(n => !n.read).length }
  ];

  const severityColor = (sev) => {
    const map = { CRITICAL: 'bg-red-600 text-white', HIGH: 'bg-orange-500 text-white', MEDIUM: 'bg-amber-400 text-slate-900', LOW: 'bg-slate-300 text-slate-700', INFO: 'bg-blue-100 text-blue-700' };
    return map[sev] || 'bg-slate-200 text-slate-600';
  };

  const statusColor = (status) => {
    const map = {
      PENDING: 'bg-amber-100 text-amber-700', UNDER_REVIEW: 'bg-blue-100 text-blue-700', ESCALATED: 'bg-red-100 text-red-700',
      RESOLVED: 'bg-emerald-100 text-emerald-700', OPEN: 'bg-amber-100 text-amber-700', IN_PROGRESS: 'bg-blue-100 text-blue-700',
      BLOCKED: 'bg-red-100 text-red-700', LOGGED: 'bg-slate-100 text-slate-600', AUTO_BLOCKED: 'bg-red-100 text-red-700',
      INVESTIGATING: 'bg-purple-100 text-purple-700', AUTO_SUSPENDED: 'bg-red-100 text-red-700', TOKEN_BLACKLISTED: 'bg-slate-900 text-white',
      FLAGGED: 'bg-amber-100 text-amber-700', RATE_LIMITED: 'bg-blue-100 text-blue-700'
    };
    return map[status] || 'bg-slate-100 text-slate-600';
  };

  const dutyColor = (status) => {
    const map = { 'On Duty': 'bg-emerald-100 text-emerald-700', 'Off Duty': 'bg-slate-200 text-slate-600', 'On Leave': 'bg-amber-100 text-amber-700' };
    return map[status] || 'bg-slate-100 text-slate-600';
  };

  let currentSection = '';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* ═══ TOP HEADER ═══ */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#0D6EFD] flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
            AP
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">APSRTC Admin</h1>
              <span className="bg-blue-50 text-[#0D6EFD] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                Operations Hub
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Monitoring • Security • Fraud Detection • Revenue • Analytics</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Live Socket */}
          <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700">
            <span className={`w-2.5 h-2.5 rounded-full ${socketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span>{socketConnected ? 'Live Connected' : 'Connecting...'}</span>
          </div>

          {/* Notification bell */}
          <button onClick={() => setActiveTab('notifications')} className="relative w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <Bell className="w-4.5 h-4.5 text-slate-600" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>

          {/* Admin profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-[#0D6EFD] text-sm">
              AD
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-slate-800">Admin Officer</p>
              <p className="text-[10px] text-slate-500">GVMC Command Centre</p>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ MAIN LAYOUT ═══ */}
      <div className="flex-1 flex overflow-hidden">

        {/* ─── SIDEBAR ─── */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col py-4 px-3 custom-scrollbar overflow-y-auto shrink-0">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              let sectionHeader = null;
              if (item.section !== currentSection) {
                currentSection = item.section;
                sectionHeader = (
                  <p key={`sec-${item.section}`} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mt-4 mb-1.5 first:mt-0">
                    {item.section}
                  </p>
                );
              }
              return (
                <React.Fragment key={item.id}>
                  {sectionHeader}
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? 'bg-[#0D6EFD] text-white shadow-md shadow-blue-500/25'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center">
                      <IconComp className={`w-4 h-4 mr-2.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/25 text-white' : 'bg-red-100 text-red-600'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </nav>
        </aside>

        {/* ─── CONTENT BODY ─── */}
        <main className="flex-1 p-6 custom-scrollbar overflow-y-auto bg-slate-50">
          
          {/* Toast */}
          {toastMsg && (
            <div className="mb-4 bg-[#0D6EFD] text-white px-4 py-3 rounded-xl shadow-lg font-semibold text-sm flex items-center justify-between">
              <span>{toastMsg}</span>
              <button onClick={() => setToastMsg('')} className="ml-4 text-white hover:text-slate-200">✕</button>
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* 1. DASHBOARD OVERVIEW                      */}
          {/* ═══════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Dashboard Overview</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time operational monitoring for APSRTC Smart Transit</p>
                </div>
                <div className="text-xs text-slate-400 font-semibold">{new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}</div>
              </div>

              {/* KPI Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                {[
                  { label: 'Total Revenue', value: `₹${metrics.totalRevenue.toLocaleString()}`, change: `+${metrics.revenueChangePercent}%`, up: true, color: 'border-emerald-300 bg-emerald-50' },
                  { label: "Today's Transactions", value: metrics.todaysTransactions.toLocaleString(), change: `+${metrics.txnChangePercent}%`, up: true, color: 'border-blue-300 bg-blue-50' },
                  { label: 'Active Conductors', value: metrics.activeConductors, change: '', color: 'border-indigo-300 bg-indigo-50' },
                  { label: 'Pending Wallet', value: metrics.pendingWalletIssues, change: '', color: 'border-amber-300 bg-amber-50' },
                  { label: 'Security Alerts', value: metrics.securityAlerts, change: '', color: 'border-orange-300 bg-orange-50' },
                  { label: 'AI Fraud Alerts', value: metrics.aiFraudAlerts, change: '', color: 'border-red-300 bg-red-50' },
                  { label: 'Open Complaints', value: metrics.openComplaints, change: '', color: 'border-purple-300 bg-purple-50' }
                ].map((kpi, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border-2 ${kpi.color} hover:shadow-md transition-all`}>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">{kpi.value}</h3>
                    {kpi.change && (
                      <p className="text-xs font-semibold text-emerald-600 mt-0.5 flex items-center">
                        <ArrowUpRight className="w-3 h-3 mr-0.5" />{kpi.change} vs yesterday
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Overview Split: AI Alerts + Security + Recent Complaints */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* AI Fraud Alerts Preview */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center"><Cpu className="w-4 h-4 mr-2 text-red-500" />AI Fraud Alerts</h3>
                    <button onClick={() => setActiveTab('ai_fraud')} className="text-[11px] text-[#0D6EFD] font-bold hover:underline">View All →</button>
                  </div>
                  {aiAlerts.slice(0, 2).map(a => (
                    <div key={a.alertId} className="p-3 rounded-xl bg-red-50 border border-red-200 mb-2 last:mb-0">
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-bold text-red-700">{a.type}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${severityColor(a.riskLevel)}`}>{a.riskLevel}</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1 font-medium">{a.trigger}</p>
                    </div>
                  ))}
                </div>

                {/* Security Alerts Preview */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center"><Shield className="w-4 h-4 mr-2 text-orange-500" />Security Alerts</h3>
                    <button onClick={() => setActiveTab('security')} className="text-[11px] text-[#0D6EFD] font-bold hover:underline">View All →</button>
                  </div>
                  {securityEvents.slice(0, 3).map(s => (
                    <div key={s.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 mb-2 last:mb-0 flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500">{s.eventType}</span>
                        <p className="text-xs text-slate-700 font-medium mt-0.5">{s.description}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${severityColor(s.severity)}`}>{s.severity}</span>
                    </div>
                  ))}
                </div>

                {/* Complaints Preview */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center"><MessageSquare className="w-4 h-4 mr-2 text-purple-500" />Open Complaints</h3>
                    <button onClick={() => setActiveTab('complaints')} className="text-[11px] text-[#0D6EFD] font-bold hover:underline">View All →</button>
                  </div>
                  {complaints.filter(c => c.status !== 'RESOLVED').slice(0, 3).map(c => (
                    <div key={c.ticketId} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 mb-2 last:mb-0">
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-bold text-slate-800">{c.ticketId}: {c.category}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{c.priority}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{c.passengerName}: {c.issue}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* 2. WALLET MONITORING                       */}
          {/* ═══════════════════════════════════════════ */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Wallet Monitoring</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Pending wallet-related issues, complaints, and exceptions</p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl border-2 border-amber-300 bg-amber-50">
                  <p className="text-[10px] font-bold text-amber-700 uppercase">Pending Issues</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{walletPending.filter(w => w.status === 'PENDING').length}</h3>
                </div>
                <div className="p-4 rounded-2xl border-2 border-blue-300 bg-blue-50">
                  <p className="text-[10px] font-bold text-blue-700 uppercase">Under Review</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{walletPending.filter(w => w.status === 'UNDER_REVIEW').length}</h3>
                </div>
                <div className="p-4 rounded-2xl border-2 border-red-300 bg-red-50">
                  <p className="text-[10px] font-bold text-red-700 uppercase">Escalated</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{walletPending.filter(w => w.status === 'ESCALATED').length}</h3>
                </div>
                <div className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase">Resolved</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{walletPending.filter(w => w.status === 'RESOLVED').length}</h3>
                </div>
              </div>

              {/* Pending Items Table */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center"><Wallet className="w-5 h-5 mr-2 text-amber-500" />Pending Wallet Issues</h3>
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase">
                    <tr>
                      <th className="p-3 rounded-l-lg">ID</th>
                      <th className="p-3">Passenger</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Issue</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {walletPending.map(w => (
                      <tr key={w.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-500 text-[11px]">{w.id}</td>
                        <td className="p-3 font-bold text-slate-900">{w.passengerName}</td>
                        <td className="p-3"><span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold">{w.type}</span></td>
                        <td className="p-3 text-slate-600 max-w-xs">{w.issue}</td>
                        <td className="p-3 font-bold text-slate-800">₹{w.amount}</td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor(w.status)}`}>{w.status}</span></td>
                        <td className="p-3">
                          {w.status !== 'RESOLVED' ? (
                            <button onClick={() => handleWalletResolve(w.id)} className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-[11px] font-bold hover:bg-emerald-700 transition-colors">
                              Mark Resolved
                            </button>
                          ) : (
                            <span className="text-emerald-600 font-bold text-[11px]">✓ Done</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Wallet-related Complaints */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-purple-500" />Wallet-Related Complaints</h3>
                {complaints.filter(c => c.category === 'Wallet Issue' || c.category === 'Refund' || c.category === 'Wrong Fare').map(c => (
                  <div key={c.ticketId} className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-3 last:mb-0 flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{c.ticketId}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{c.priority}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor(c.status)}`}>{c.status}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1"><b>{c.passengerName}:</b> {c.issue}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Assigned to: {c.assignedTo} • {c.createdAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* 3. CONDUCTOR MANAGEMENT                    */}
          {/* ═══════════════════════════════════════════ */}
          {activeTab === 'conductors' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Conductor Management</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Shift assignments, duty status, and performance tracking</p>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase">On Duty</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{conductors.filter(c => c.dutyStatus === 'On Duty').length}</h3>
                </div>
                <div className="p-4 rounded-2xl border-2 border-slate-300 bg-slate-100">
                  <p className="text-[10px] font-bold text-slate-600 uppercase">Off Duty</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{conductors.filter(c => c.dutyStatus === 'Off Duty').length}</h3>
                </div>
                <div className="p-4 rounded-2xl border-2 border-amber-300 bg-amber-50">
                  <p className="text-[10px] font-bold text-amber-700 uppercase">On Leave</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{conductors.filter(c => c.dutyStatus === 'On Leave').length}</h3>
                </div>
                <div className="p-4 rounded-2xl border-2 border-blue-300 bg-blue-50">
                  <p className="text-[10px] font-bold text-blue-700 uppercase">Total Conductors</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{conductors.length}</h3>
                </div>
              </div>

              {/* Pending Approvals Table */}
              {pendingConductors && pendingConductors.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-amber-300 shadow-sm mb-6 bg-amber-50">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center"><UserCheck className="w-5 h-5 mr-2 text-amber-600" />Pending Conductors for Approval</h3>
                  <table className="w-full text-left text-xs bg-white rounded-lg overflow-hidden shadow-sm border border-slate-200">
                    <thead className="bg-slate-100 text-slate-600 font-bold uppercase">
                      <tr>
                        <th className="p-3">Name</th>
                        <th className="p-3">Phone</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {pendingConductors.map(c => (
                        <tr key={c._id || c.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{c.name}</td>
                          <td className="p-3 font-mono text-slate-600">{c.phone}</td>
                          <td className="p-3"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">{c.role}</span></td>
                          <td className="p-3">
                            <button onClick={() => handleApproveConductor(c._id || c.id)} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold hover:bg-emerald-700 transition-colors shadow-sm">
                              Approve
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase">
                    <tr>
                      <th className="p-3 rounded-l-lg">Conductor Name / ID</th>
                      <th className="p-3">Bus No.</th>
                      <th className="p-3">Duty Status</th>
                      <th className="p-3">Shift Timing</th>
                      <th className="p-3">Leave Status</th>
                      <th className="p-3">Collection ₹</th>
                      <th className="p-3 rounded-r-lg">Tickets</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {conductors.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <span className="font-bold text-slate-900">{c.name}</span>
                          <br/><span className="text-[10px] text-slate-400 font-mono">{c.id}</span>
                        </td>
                        <td className="p-3 font-bold text-slate-700">{c.busNumber}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${dutyColor(c.dutyStatus)}`}>{c.dutyStatus}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-slate-800">{c.shift}</span>
                          <br/><span className="text-[10px] text-slate-400">{c.shiftLabel}</span>
                        </td>
                        <td className="p-3 text-slate-600">{c.leaveStatus}</td>
                        <td className="p-3 font-bold text-emerald-600">₹{c.totalCollection.toLocaleString()}</td>
                        <td className="p-3 font-bold text-[#0D6EFD]">{c.ticketsIssued}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* 4. SECURITY DASHBOARD                      */}
          {/* ═══════════════════════════════════════════ */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Security Dashboard</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Failed logins, suspicious activities, duplicate transactions, device alerts, account blocks</p>
              </div>

              {/* Category Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {['FAILED_LOGIN', 'SUSPICIOUS_ACTIVITY', 'DUPLICATE_TXN', 'INVALID_AUTH', 'DEVICE_ALERT', 'ACCOUNT_BLOCK'].map(type => {
                  const count = securityEvents.filter(e => e.eventType === type).length;
                  const icons = { FAILED_LOGIN: Lock, SUSPICIOUS_ACTIVITY: Eye, DUPLICATE_TXN: CreditCard, INVALID_AUTH: Fingerprint, DEVICE_ALERT: Smartphone, ACCOUNT_BLOCK: ShieldAlert };
                  const colors = { FAILED_LOGIN: 'border-amber-300 bg-amber-50', SUSPICIOUS_ACTIVITY: 'border-orange-300 bg-orange-50', DUPLICATE_TXN: 'border-red-300 bg-red-50', INVALID_AUTH: 'border-purple-300 bg-purple-50', DEVICE_ALERT: 'border-rose-300 bg-rose-50', ACCOUNT_BLOCK: 'border-slate-400 bg-slate-100' };
                  const IconC = icons[type] || Shield;
                  return (
                    <div key={type} className={`p-4 rounded-2xl border-2 ${colors[type] || ''}`}>
                      <IconC className="w-5 h-5 text-slate-600 mb-2" />
                      <p className="text-[10px] font-bold text-slate-500 uppercase">{type.replace(/_/g, ' ')}</p>
                      <h3 className="text-2xl font-black text-slate-900 mt-1">{count}</h3>
                    </div>
                  );
                })}
              </div>

              {/* Events Log */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center"><Shield className="w-5 h-5 mr-2 text-orange-500" />Security Event Logs</h3>
                <div className="space-y-3">
                  {securityEvents.map(ev => (
                    <div key={ev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{ev.eventType.replace(/_/g, ' ')}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${severityColor(ev.severity)}`}>{ev.severity}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-800">{ev.description}</p>
                        <p className="text-[11px] text-slate-500 mt-1">Source: {ev.source} • IP: {ev.ipAddress} • {new Date(ev.timestamp).toLocaleString()}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ml-3 ${statusColor(ev.status)}`}>{ev.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* 5. AI FRAUD DETECTION                      */}
          {/* ═══════════════════════════════════════════ */}
          {activeTab === 'ai_fraud' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">AI Fraud Detection</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">AI-generated alerts, suspicious patterns, risk scoring, and admin review</p>
              </div>

              {/* Alert Cards */}
              <div className="space-y-4">
                {aiAlerts.map(alert => (
                  <div key={alert.alertId} className={`p-5 rounded-2xl border-2 ${
                    alert.riskLevel === 'CRITICAL' ? 'border-red-400 bg-red-50' : alert.riskLevel === 'HIGH' ? 'border-orange-400 bg-orange-50' : 'border-amber-300 bg-amber-50'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Flame className={`w-5 h-5 ${alert.riskLevel === 'CRITICAL' ? 'text-red-600' : 'text-orange-500'}`} />
                        <span className="text-sm font-extrabold text-slate-900">AI FRAUD ALERT</span>
                        <span className="font-mono text-[10px] text-slate-400">{alert.alertId}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${severityColor(alert.riskLevel)}`}>{alert.riskLevel}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Risk Level</p>
                          <p className="text-sm font-bold text-slate-900">{alert.riskLevel} — Score: {alert.riskScore}/100</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Pattern Detected</p>
                          <p className="text-xs font-bold text-slate-800">{alert.type.replace(/_/g, ' ')}: {alert.trigger}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Target</p>
                          <p className="text-xs font-bold text-slate-800">{alert.target}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">AI Recommendation</p>
                          <p className="text-xs font-medium text-slate-700">{alert.recommendation}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Action Taken</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor(alert.actionTaken)}`}>{alert.actionTaken}</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Admin Review</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${alert.adminReview === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{alert.adminReview}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* 6. REVENUE DASHBOARD                       */}
          {/* ═══════════════════════════════════════════ */}
          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Revenue Dashboard</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Daily, weekly, monthly revenue with payment method breakdowns</p>
                </div>
                <button onClick={() => exportReport('csv')} className="bg-[#0D6EFD] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center hover:bg-blue-700 transition-colors">
                  <Download className="w-3.5 h-3.5 mr-1.5" />Export Report
                </button>
              </div>

              {/* Period Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { label: 'Daily Revenue', value: revenue.daily, icon: Activity, color: 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-white' },
                  { label: 'Weekly Revenue', value: revenue.weekly, icon: BarChart3, color: 'border-blue-400 bg-gradient-to-br from-blue-50 to-white' },
                  { label: 'Monthly Revenue', value: revenue.monthly, icon: TrendingUp, color: 'border-indigo-400 bg-gradient-to-br from-indigo-50 to-white' }
                ].map((item, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border-2 ${item.color}`}>
                    <item.icon className="w-6 h-6 text-slate-500 mb-2" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</p>
                    <h3 className="text-3xl font-black text-slate-900 mt-1">₹{item.value.toLocaleString()}</h3>
                  </div>
                ))}
              </div>

              {/* Revenue by Payment Method */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4">Revenue by Payment Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {revenue.byMethod.map((m, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700">{m.method}</span>
                        <span className="text-xs font-extrabold" style={{ color: m.color }}>{m.percent}%</span>
                      </div>
                      <h4 className="text-xl font-black text-slate-900">₹{m.amount.toLocaleString()}</h4>
                      <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${m.percent}%`, backgroundColor: m.color }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Trend Visual */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4">Weekly Revenue Trend</h3>
                <div className="flex items-end space-x-3 h-40">
                  {revenue.trendData.map((d, idx) => {
                    const maxAmt = Math.max(...revenue.trendData.map(t => t.amount));
                    const barHeight = (d.amount / maxAmt) * 100;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-500 mb-1">₹{(d.amount / 1000).toFixed(0)}K</span>
                        <div className="w-full rounded-t-lg transition-all hover:opacity-80" style={{
                          height: `${barHeight}%`,
                          backgroundColor: d.day === 'Fri' ? '#0D6EFD' : '#CBD5E1'
                        }}></div>
                        <span className="text-[10px] font-bold text-slate-500 mt-1">{d.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ticket Stats */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4">Ticket Collection Statistics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                  {Object.entries(revenue.ticketStats).map(([key, val]) => (
                    <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <h4 className="text-xl font-black text-slate-900 mt-1">{val.toLocaleString()}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* 7. ANALYTICS DASHBOARD                     */}
          {/* ═══════════════════════════════════════════ */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Analytics Dashboard</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Passenger trends, payment analytics, conductor performance, peak periods</p>
              </div>

              {/* Ticketing Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center"><BarChart3 className="w-4 h-4 mr-2 text-blue-500" />Passenger & Ticketing Trends</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Average Daily Passengers', value: '1,842', trend: '+8.2%', up: true },
                      { label: 'Peak Hour (08:00–10:00)', value: '487 tickets', trend: 'Highest', up: true },
                      { label: 'Off-Peak (14:00–16:00)', value: '124 tickets', trend: 'Lowest', up: false },
                      { label: 'Weekend Avg. Passengers', value: '1,204', trend: '-22% vs weekday', up: false }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-xs font-bold text-slate-700">{item.label}</span>
                        <div className="text-right">
                          <span className="text-sm font-black text-slate-900">{item.value}</span>
                          <p className={`text-[10px] font-bold ${item.up ? 'text-emerald-600' : 'text-red-500'}`}>{item.trend}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center"><CreditCard className="w-4 h-4 mr-2 text-indigo-500" />Payment Method Usage</h3>
                  <div className="space-y-3">
                    {[
                      { method: 'UPI Online', usage: '42%', txns: 774, color: '#0D6EFD' },
                      { method: 'Offline Wallet', usage: '38%', txns: 700, color: '#10B981' },
                      { method: 'Cash', usage: '15%', txns: 276, color: '#F59E0B' },
                      { method: 'Emergency Credit', usage: '5%', txns: 92, color: '#EF4444' }
                    ].map((m, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-bold text-slate-700">{m.method}</span>
                          <span className="text-xs font-extrabold" style={{ color: m.color }}>{m.usage} ({m.txns} txns)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: m.usage, backgroundColor: m.color }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Offline vs Online Trends */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center"><Activity className="w-4 h-4 mr-2 text-orange-500" />Offline vs Online Transaction Trends</h3>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                    const online = [62, 58, 65, 60, 63, 55, 48][idx];
                    const offline = 100 - online;
                    return (
                      <div key={day} className="text-center">
                        <div className="h-24 flex flex-col rounded-lg overflow-hidden border border-slate-200">
                          <div className="transition-all" style={{ flex: online, backgroundColor: '#0D6EFD' }}></div>
                          <div className="transition-all" style={{ flex: offline, backgroundColor: '#10B981' }}></div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 mt-1">{day}</p>
                        <p className="text-[9px] text-slate-400">{online}% / {offline}%</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center space-x-1"><div className="w-3 h-3 rounded-sm bg-[#0D6EFD]"></div><span className="text-[10px] text-slate-500 font-bold">Online</span></div>
                  <div className="flex items-center space-x-1"><div className="w-3 h-3 rounded-sm bg-[#10B981]"></div><span className="text-[10px] text-slate-500 font-bold">Offline</span></div>
                </div>
              </div>

              {/* Conductor Performance */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center"><Star className="w-4 h-4 mr-2 text-amber-500" />Conductor Performance Analytics</h3>
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase">
                    <tr>
                      <th className="p-3 rounded-l-lg">Conductor</th>
                      <th className="p-3">Tickets Issued</th>
                      <th className="p-3">Collection ₹</th>
                      <th className="p-3">Avg Ticket ₹</th>
                      <th className="p-3 rounded-r-lg">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {conductors.filter(c => c.ticketsIssued > 0).sort((a, b) => b.totalCollection - a.totalCollection).map(c => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{c.name}</td>
                        <td className="p-3 font-bold text-[#0D6EFD]">{c.ticketsIssued}</td>
                        <td className="p-3 font-bold text-emerald-600">₹{c.totalCollection.toLocaleString()}</td>
                        <td className="p-3 font-bold text-slate-700">₹{(c.totalCollection / c.ticketsIssued).toFixed(0)}</td>
                        <td className="p-3"><span className="text-amber-500">★★★★☆</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* 8. COMPLAINT MANAGEMENT                    */}
          {/* ═══════════════════════════════════════════ */}
          {activeTab === 'complaints' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Complaint Management</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Track, assign, and resolve passenger complaints</p>
              </div>

              {/* Status Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'New / Open', count: complaints.filter(c => c.status === 'OPEN').length, color: 'border-amber-300 bg-amber-50' },
                  { label: 'In Progress', count: complaints.filter(c => c.status === 'IN_PROGRESS').length, color: 'border-blue-300 bg-blue-50' },
                  { label: 'Resolved', count: complaints.filter(c => c.status === 'RESOLVED').length, color: 'border-emerald-300 bg-emerald-50' },
                  { label: 'Total', count: complaints.length, color: 'border-slate-300 bg-slate-100' }
                ].map((s, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border-2 ${s.color}`}>
                    <p className="text-[10px] font-bold text-slate-600 uppercase">{s.label}</p>
                    <h3 className="text-3xl font-black text-slate-900 mt-1">{s.count}</h3>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase">
                    <tr>
                      <th className="p-3 rounded-l-lg">Ticket ID</th>
                      <th className="p-3">Passenger</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Issue</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Assigned To</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {complaints.map(c => (
                      <tr key={c.ticketId} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-[11px] font-bold text-slate-500">{c.ticketId}</td>
                        <td className="p-3 font-bold text-slate-900">{c.passengerName}</td>
                        <td className="p-3"><span className="bg-slate-100 px-2 py-0.5 rounded-full text-[10px] font-bold">{c.category}</span></td>
                        <td className="p-3 text-slate-600 max-w-xs">{c.issue}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.priority === 'HIGH' ? 'bg-red-100 text-red-700' : c.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                            {c.priority}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600">{c.assignedTo}</td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor(c.status)}`}>{c.status}</span></td>
                        <td className="p-3 space-x-1">
                          {c.status === 'OPEN' && (
                            <button onClick={() => handleComplaintUpdate(c.ticketId, 'IN_PROGRESS')} className="bg-blue-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold">Start</button>
                          )}
                          {c.status === 'IN_PROGRESS' && (
                            <button onClick={() => handleComplaintUpdate(c.ticketId, 'RESOLVED')} className="bg-emerald-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold">Resolve</button>
                          )}
                          {c.status === 'RESOLVED' && (
                            <span className="text-emerald-600 text-[10px] font-bold">✓ Closed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* 9. NOTIFICATIONS CENTRE                    */}
          {/* ═══════════════════════════════════════════ */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Notifications Centre</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">System alerts, security, AI fraud, wallet, and complaint notifications</p>
                </div>
                <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))} className="text-xs text-[#0D6EFD] font-bold hover:underline">
                  Mark All as Read
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map(n => {
                  const typeIcons = { SECURITY: Shield, AI_FRAUD: Cpu, WALLET: Wallet, COMPLAINT: MessageSquare, SYSTEM: Bell };
                  const typeColors = { SECURITY: 'text-red-500', AI_FRAUD: 'text-orange-500', WALLET: 'text-amber-500', COMPLAINT: 'text-purple-500', SYSTEM: 'text-blue-500' };
                  const TypeIcon = typeIcons[n.type] || Bell;
                  
                  return (
                    <div key={n.id}
                      onClick={() => handleNotificationRead(n.id)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        n.read ? 'bg-white border-slate-200' : 'bg-blue-50/50 border-blue-200 shadow-sm'
                      } hover:shadow-md`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.read ? 'bg-slate-100' : 'bg-white border border-slate-200'}`}>
                          <TypeIcon className={`w-5 h-5 ${typeColors[n.type] || 'text-slate-500'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-0.5">
                            <span className="text-xs font-extrabold text-slate-900">{n.title}</span>
                            {!n.read && <span className="w-2 h-2 bg-[#0D6EFD] rounded-full"></span>}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${severityColor(n.severity)}`}>{n.severity}</span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium">{n.message}</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-1">{n.timestamp} • {n.type}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
