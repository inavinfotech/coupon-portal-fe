import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import api from "../services/api";

const CouponModal = ({ coupon, onClose, onSuccess }) => {
  const isEdit = !!coupon;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    min_order_amount: 0,
    max_discount_amount: "",
    valid_from: "",
    valid_to: "",
    usage_limit: "",
    user_usage_limit: 1,
    app_restriction: "global",
    is_active: true,
  });

  const [apps, setApps] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get("/apps/");
        setApps(res.data);
      } catch (err) {
        console.error("Failed to fetch applications for coupon restrictions dropdown", err);
      }
    };
    fetchApps();
  }, []);

  useEffect(() => {
    if (coupon) {
      // Format datetime strings for input values (YYYY-MM-DDThh:mm)
      const formatDatetime = (dtStr) => {
        if (!dtStr) return "";
        try {
          const date = new Date(dtStr);
          return date.toISOString().slice(0, 16);
        } catch {
          return "";
        }
      };

      setFormData({
        code: coupon.code,
        description: coupon.description || "",
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        min_order_amount: coupon.min_order_amount,
        max_discount_amount: coupon.max_discount_amount || "",
        valid_from: formatDatetime(coupon.valid_from),
        valid_to: formatDatetime(coupon.valid_to),
        usage_limit: coupon.usage_limit || "",
        user_usage_limit: coupon.user_usage_limit,
        app_restriction: coupon.app_restriction,
        is_active: coupon.is_active,
      });
    }
  }, [coupon]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Prepare payload
    const payload = {
      ...formData,
      discount_value: parseFloat(formData.discount_value),
      min_order_amount: parseFloat(formData.min_order_amount),
      max_discount_amount: formData.max_discount_amount ? parseFloat(formData.max_discount_amount) : null,
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
      user_usage_limit: parseInt(formData.user_usage_limit),
      valid_from: formData.valid_from ? new Date(formData.valid_from).toISOString() : null,
      valid_to: formData.valid_to ? new Date(formData.valid_to).toISOString() : null,
    };

    try {
      if (isEdit) {
        await api.put(`/coupons/${coupon.id}`, payload);
      } else {
        await api.post("/coupons/", payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred while saving the coupon.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {isEdit ? "Edit Coupon" : "Create New Coupon"}
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Set up coupon details, discount amounts, and scope rules.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Coupon Code</label>
              <input
                type="text"
                name="code"
                required
                placeholder="WELCOME10"
                value={formData.code}
                onChange={handleChange}
                disabled={isEdit}
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 text-sm font-medium disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">App Restriction</label>
              <select
                name="app_restriction"
                value={formData.app_restriction}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:border-primary-500 text-sm font-medium"
              >
                <option value="global">Global (All Apps)</option>
                {apps.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
            <textarea
              name="description"
              placeholder="e.g. Welcome discount for new users"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Discount Type</label>
              <select
                name="discount_type"
                value={formData.discount_type}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:border-primary-500 text-sm font-medium"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Flat Discount (₹)</option>
              </select>
            </div>

            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Discount Value</label>
              <input
                type="number"
                name="discount_value"
                required
                step="any"
                min="0.01"
                placeholder={formData.discount_type === "percentage" ? "10" : "150"}
                value={formData.discount_value}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Min Subtotal</label>
              <input
                type="number"
                name="min_order_amount"
                min="0"
                step="any"
                value={formData.min_order_amount}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Max Discount Capping</label>
              <input
                type="number"
                name="max_discount_amount"
                min="0"
                step="any"
                placeholder="No Limit"
                value={formData.max_discount_amount}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Valid From</label>
              <input
                type="datetime-local"
                name="valid_from"
                value={formData.valid_from}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Valid To</label>
              <input
                type="datetime-local"
                name="valid_to"
                value={formData.valid_to}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Limit Uses</label>
              <input
                type="number"
                name="usage_limit"
                min="1"
                placeholder="No Limit"
                value={formData.usage_limit}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Per-User Limit</label>
              <input
                type="number"
                name="user_usage_limit"
                min="1"
                value={formData.user_usage_limit}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 px-4 text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="is_active" className="text-xs font-bold text-gray-700 uppercase tracking-wider select-none cursor-pointer">
              Mark Coupon Active Immediately
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold py-3 px-4 rounded-xl flex items-center gap-3 animate-shake">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-600/50 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              <span>{isEdit ? "Save Changes" : "Create Coupon"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponModal;
