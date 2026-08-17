import React, { useState, useEffect } from "react";
import {
  Ticket,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle
} from "lucide-react";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";
import CouponModal from "../components/CouponModal";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterApp, setFilterApp] = useState("all");
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  
  const [apps, setApps] = useState([]);

  const fetchApps = async () => {
    try {
      const res = await api.get("/apps/");
      setApps(res.data);
    } catch (err) {
      console.error("Failed to fetch apps for filter dropdown", err);
    }
  };

  const getAppRestrictionLabel = (restriction) => {
    if (!restriction || restriction.toLowerCase() === "global") {
      return "Global";
    }
    const app = apps.find(a => a.id === restriction);
    return app ? app.name : restriction;
  };

  const fetchCoupons = async () => {
    try {
      const response = await api.get("/coupons/");
      setCoupons(response.data);
    } catch (err) {
      console.error("Failed to fetch coupons", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchApps();
  }, []);

  const handleToggleActive = async (couponId, currentStatus) => {
    try {
      await api.put(`/coupons/${couponId}/status`, { is_active: !currentStatus });
      fetchCoupons();
    } catch (err) {
      console.error("Failed to toggle coupon status", err);
    }
  };

  const handleDelete = async (couponId, code) => {
    if (!confirm(`Are you sure you want to delete coupon '${code}'?`)) return;
    try {
      await api.delete(`/coupons/${couponId}`);
      fetchCoupons();
    } catch (err) {
      console.error("Failed to delete coupon", err);
    }
  };

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedCoupon(null);
    setShowModal(true);
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    fetchCoupons();
  };

  // Filter logic
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (coupon.description && coupon.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesApp =
      filterApp === "all" || coupon.app_restriction.toLowerCase() === filterApp.toLowerCase();
      
    return matchesSearch && matchesApp;
  });

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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Coupons Registry</h1>
          <p className="text-gray-500 mt-1 text-sm">Create and manage active checkout discount coupons and rules</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-primary-600/10 transition-all flex items-center gap-2 text-sm active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-xs group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
          <input
            type="text"
            placeholder="Search code or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">App Restrict</span>
          <select
            value={filterApp}
            onChange={(e) => setFilterApp(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 text-gray-900 focus:outline-none focus:border-primary-500 text-sm font-medium w-full sm:w-auto"
          >
            <option value="all">All Scopes</option>
            <option value="global">Global Only</option>
            {apps.map((app) => (
              <option key={app.id} value={app.id}>
                {app.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50 p-4">
                <th className="py-4 px-6">Code & Details</th>
                <th className="py-4 px-4">Discount</th>
                <th className="py-4 px-4">App Restrictions</th>
                <th className="py-4 px-4">Usage Limit</th>
                <th className="py-4 px-4">Validity Dates</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm font-medium">No coupons matched the filters.</p>
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm select-all">{coupon.code}</span>
                        <span className="text-xs text-gray-500 max-w-[200px] truncate mt-0.5" title={coupon.description}>
                          {coupon.description || "No description"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-900">
                      {coupon.discount_type === "percentage" ? (
                        <div className="flex flex-col">
                          <span>{coupon.discount_value}% Off</span>
                          {coupon.max_discount_amount && (
                            <span className="text-[10px] text-gray-400 font-bold">Max ₹{coupon.max_discount_amount}</span>
                          )}
                        </div>
                      ) : (
                        <span>Flat ₹{coupon.discount_value}</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-gray-50 text-gray-600 border-gray-200">
                        {getAppRestrictionLabel(coupon.app_restriction)}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-800">
                      <div className="flex flex-col text-xs">
                        <span>Used: {coupon.used_count}</span>
                        <span className="text-gray-400 mt-0.5">
                          Limit: {coupon.usage_limit || "∞"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Calendar size={13} className="text-gray-400" />
                        <div className="flex flex-col">
                          <span>
                            {coupon.valid_from ? new Date(coupon.valid_from).toLocaleDateString() : "—"}
                          </span>
                          <span className="text-gray-400 mt-0.5">
                            to {coupon.valid_to ? new Date(coupon.valid_to).toLocaleDateString() : "—"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge active={coupon.is_active} validTo={coupon.valid_to} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={coupon.is_active}
                            onChange={() => handleToggleActive(coupon.id, coupon.is_active)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>

                        <button
                          onClick={() => handleEdit(coupon)}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id, coupon.code)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <CouponModal
          coupon={selectedCoupon}
          onClose={() => setShowModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default Coupons;
