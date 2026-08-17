import React, { useState, useEffect } from "react";
import {
  Box,
  Plus,
  Key,
  Copy,
  Check,
  Trash2,
  Loader2,
  X,
  AlertCircle
} from "lucide-react";
import api from "../services/api";
import { cn } from "../utils/cn";

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newAppName, setNewAppName] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);
  const [revealModal, setRevealModal] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchApps = async () => {
    try {
      const response = await api.get("/apps/");
      setApps(response.data);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    superFetch();
  }, []);

  const superFetch = () => {
    fetchApps();
  };

  const handleCreateApp = async (e) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    setCreating(true);
    try {
      const response = await api.post("/apps/", { name: newAppName });
      setNewAppName("");
      setShowCreateModal(false);
      setRevealModal(response.data); // Store credentials with plain secret for one-time reveal
      fetchApps();
    } catch (err) {
      console.error("Failed to create application", err);
    } finally {
      setCreating(false);
    }
  };

  const toggleStatus = async (appId, currentStatus) => {
    try {
      await api.put(`/apps/${appId}/status`, { is_active: !currentStatus });
      fetchApps();
    } catch (err) {
      console.error("Failed to toggle application status", err);
    }
  };

  const deleteApp = async (appId) => {
    if (!confirm("Are you sure you want to delete this application? Access credentials will be permanently revoked.")) return;
    try {
      await api.delete(`/apps/${appId}`);
      fetchApps();
    } catch (err) {
      console.error("Failed to delete application", err);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Applications Registry</h1>
          <p className="text-gray-500 mt-1 text-sm">Register client systems (Store BFF, LMS) to generate secure API credentials</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-primary-600/10 transition-all flex items-center gap-2 text-sm active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>Register New App</span>
        </button>
      </div>

      {/* Grid of registered Apps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apps.length === 0 ? (
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center text-gray-400">
            <Box className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm font-medium">No client applications registered yet.</p>
            <p className="text-xs mt-1">Register a system to start using validation APIs.</p>
          </div>
        ) : (
          apps.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                    <Box size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{app.name}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Created {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={app.is_active}
                      onChange={() => toggleStatus(app.id, app.is_active)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>

                  <button
                    onClick={() => deleteApp(app.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* API Credentials */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">API Key</span>
                  <div className="flex items-center gap-2">
                    <code className="bg-white border border-gray-200 px-2 py-0.5 rounded font-mono font-bold text-gray-800">
                      {app.api_key}
                    </code>
                    <button
                      onClick={() => handleCopy(app.api_key, `${app.id}-key`)}
                      className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      {copiedKey === `${app.id}-key` ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">API Secret</span>
                  <span className="text-gray-400 font-mono italic">•••••••••••••••• (hidden)</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Register Application</h3>
            <p className="text-sm text-gray-500 mb-6">Create credentials for LMS, Store BFF, or other microservices.</p>
            
            <form onSubmit={handleCreateApp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Application Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Store BFF Gateway"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 text-sm font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-600/50 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {creating && <Loader2 size={16} className="animate-spin" />}
                  <span>Generate Credentials</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reveal Credentials Modal (One-time only) */}
      {revealModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 relative animate-shake">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2 text-emerald-600">
              <Check className="w-5 h-5" />
              <span>Registered Successfully</span>
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Here are the credentials for <span className="font-bold text-gray-700">{revealModal.name}</span>. Copy the secret now, as it cannot be revealed again.
            </p>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-3 text-amber-800 text-xs mb-4">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="font-medium">
                Make sure to copy the client secret. For security reasons, it will not be displayed again.
              </p>
            </div>

            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">API Key</span>
                <div className="flex items-center justify-between">
                  <code className="font-mono text-sm font-bold text-gray-900 select-all">{revealModal.api_key}</code>
                  <button
                    onClick={() => handleCopy(revealModal.api_key, "reveal-key")}
                    className="text-primary-600 hover:text-primary-700 p-1 rounded"
                  >
                    {copiedKey === "reveal-key" ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">API Client Secret</span>
                <div className="flex items-center justify-between">
                  <code className="font-mono text-sm font-bold text-gray-900 select-all">{revealModal.api_secret}</code>
                  <button
                    onClick={() => handleCopy(revealModal.api_secret, "reveal-secret")}
                    className="text-primary-600 hover:text-primary-700 p-1 rounded"
                  >
                    {copiedKey === "reveal-secret" ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setRevealModal(null)}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl mt-6 transition-all text-sm cursor-pointer"
            >
              Done, I Have Copied Secret
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
