import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../config/api';

interface UserData {
  id: string;
  email: string;
  username: string | null;
  name: string | null;
  avatarUrl: string | null;
  provider: string | null;
  emailVerified: boolean;
  banned: boolean;
  bannedAt: string | null;
  bannedReason: string | null;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  adminUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:8080';

const StatCard: React.FC<{ label: string; value: number; icon: string; color: string }> = ({ label, value, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`size-10 rounded-xl flex items-center justify-center ${color}`}>
        <span className="material-symbols-outlined text-[20px] text-white">{icon}</span>
      </div>
      <span className="text-sm text-gray-400 font-medium">{label}</span>
    </div>
    <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
  </motion.div>
);

const AdminDashboard: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'ADMIN' | 'USER'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned'>('all');
  const [confirmAction, setConfirmAction] = useState<{ type: string; userId: string; userName: string } | null>(null);
  const [banReason, setBanReason] = useState('');

  const token = auth.user?.access_token;

  // Primary: read from OIDC profile (id_token) — standard approach
  // Fallback: decode access_token JWT for backwards compatibility
  const getRoles = (): string[] => {
    const profileRoles = (auth.user?.profile as any)?.roles;
    if (Array.isArray(profileRoles) && profileRoles.length > 0) return profileRoles;
    if (!token) return [];
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roles || [];
    } catch { return []; }
  };
  const roles = getRoles();
  const isAdmin = roles.includes('ADMIN');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [isAdmin]);

  const authHeaders = () => ({ headers: { Authorization: `Bearer ${token}` } });

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        apiClient.get(`${API_BASE}/api/auth/admin/users`, authHeaders()),
        apiClient.get(`${API_BASE}/api/auth/admin/stats`, authHeaders()),
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (userId: string) => {
    setActionLoading(userId);
    try {
      await apiClient.put(`${API_BASE}/api/auth/admin/users/${userId}/ban`, { reason: banReason }, authHeaders());
      await fetchData();
      setConfirmAction(null);
      setBanReason('');
    } catch (err) {
      console.error('Ban failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnban = async (userId: string) => {
    setActionLoading(userId);
    try {
      await apiClient.put(`${API_BASE}/api/auth/admin/users/${userId}/unban`, {}, authHeaders());
      await fetchData();
    } catch (err) {
      console.error('Unban failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId: string) => {
    setActionLoading(userId);
    try {
      await apiClient.delete(`${API_BASE}/api/auth/admin/users/${userId}`, authHeaders());
      await fetchData();
      setConfirmAction(null);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = !searchQuery ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === 'all' || u.roles.includes(filterRole);
    const matchStatus = filterStatus === 'all' ||
      (filterStatus === 'banned' && u.banned) ||
      (filterStatus === 'active' && !u.banned);
    return matchSearch && matchRole && matchStatus;
  });

  if (loading) return (
    <div className="h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex gap-2">
        {[0,150,300].map(d => <span key={d} className="size-2.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
      </div>
    </div>
  );

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="size-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
            <div>
              <h1 className="text-lg font-bold">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">User & system management</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="material-symbols-outlined text-[14px]">shield_person</span>
            {auth.user?.profile?.email}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Users" value={stats.totalUsers} icon="group" color="bg-blue-600" />
            <StatCard label="Active" value={stats.activeUsers} icon="check_circle" color="bg-emerald-600" />
            <StatCard label="Banned" value={stats.bannedUsers} icon="block" color="bg-red-600" />
            <StatCard label="New Today" value={stats.newUsersToday} icon="person_add" color="bg-amber-600" />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[18px]">search</span>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 outline-none focus:border-white/20 transition-colors"
            />
          </div>
          <select value={filterRole} onChange={e => setFilterRole(e.target.value as any)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
            <option value="all">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="text-left px-5 py-3 font-medium">User</th>
                  <th className="text-left px-5 py-3 font-medium">Role</th>
                  <th className="text-left px-5 py-3 font-medium">Provider</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Joined</th>
                  <th className="text-right px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold overflow-hidden">
                          {user.avatarUrl
                            ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                            : (user.name?.charAt(0) || user.email.charAt(0)).toUpperCase()
                          }
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name || user.username || 'No name'}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {user.roles.map(r => (
                        <span key={r} className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold ${r === 'ADMIN' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>{r}</span>
                      ))}
                    </td>
                    <td className="px-5 py-4 text-gray-400 capitalize">{user.provider || 'email'}</td>
                    <td className="px-5 py-4">
                      {user.banned
                        ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-red-500/20 text-red-400">
                            <span className="material-symbols-outlined text-[12px]">block</span>Banned
                          </span>
                        : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/20 text-emerald-400">
                            <span className="material-symbols-outlined text-[12px]">check_circle</span>Active
                          </span>
                      }
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {!user.roles.includes('ADMIN') && (
                        <div className="flex items-center justify-end gap-1">
                          {user.banned ? (
                            <button
                              onClick={() => handleUnban(user.id)}
                              disabled={actionLoading === user.id}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                            >Unban</button>
                          ) : (
                            <button
                              onClick={() => setConfirmAction({ type: 'ban', userId: user.id, userName: user.name || user.email })}
                              disabled={actionLoading === user.id}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                            >Ban</button>
                          )}
                          <button
                            onClick={() => setConfirmAction({ type: 'delete', userId: user.id, userName: user.name || user.email })}
                            disabled={actionLoading === user.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          >Delete</button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-gray-600 mt-4 text-center">{filteredUsers.length} of {users.length} users</p>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmAction(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-2xl p-6"
            >
              <div className={`size-12 rounded-xl flex items-center justify-center mb-4 ${confirmAction.type === 'delete' ? 'bg-red-500/20' : 'bg-amber-500/20'}`}>
                <span className={`material-symbols-outlined text-[24px] ${confirmAction.type === 'delete' ? 'text-red-400' : 'text-amber-400'}`}>
                  {confirmAction.type === 'delete' ? 'delete_forever' : 'gavel'}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-1">
                {confirmAction.type === 'delete' ? 'Delete User' : 'Ban User'}
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                {confirmAction.type === 'delete'
                  ? `Permanently delete "${confirmAction.userName}"? This cannot be undone.`
                  : `Ban "${confirmAction.userName}" from using the platform?`
                }
              </p>
              {confirmAction.type === 'ban' && (
                <input
                  type="text"
                  placeholder="Reason (optional)"
                  value={banReason}
                  onChange={e => setBanReason(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 outline-none mb-4"
                />
              )}
              <div className="flex gap-2">
                <button onClick={() => { setConfirmAction(null); setBanReason(''); }} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                <button
                  onClick={() => confirmAction.type === 'delete' ? handleDelete(confirmAction.userId) : handleBan(confirmAction.userId)}
                  disabled={actionLoading === confirmAction.userId}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50 ${confirmAction.type === 'delete' ? 'bg-red-600 hover:bg-red-500' : 'bg-amber-600 hover:bg-amber-500'}`}
                >
                  {actionLoading === confirmAction.userId ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
