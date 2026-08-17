import React, { useEffect, useState } from "react";
import { Ticket, Percent, Sparkles, TrendingUp, HelpCircle } from "lucide-react";
import api from "../services/api";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        setSummary(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard summary", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const metrics = summary?.metrics || {
    total_coupons: 0,
    active_coupons: 0,
    total_usages: 0,
    total_saved: 0.0,
  };

  const topCoupons = summary?.top_coupons || [];
  const appSplit = summary?.app_split || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1 text-sm">Real-time coupon stats & performance indicators</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700">
            <Ticket size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Coupons</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.total_coupons}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700">
            <Sparkles size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Coupons</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.active_coupons}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Usages</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.total_usages}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
            <Percent size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Discount Saved</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹{metrics.total_saved}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Coupons Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Top Redeemed Coupons</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-3">
                  <th className="pb-3">Coupon Code</th>
                  <th className="pb-3">Discount Detail</th>
                  <th className="pb-3">Usages</th>
                  <th className="pb-3">Total Saved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topCoupons.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-400">
                      No redemptions logged yet.
                    </td>
                  </tr>
                ) : (
                  topCoupons.map((coupon) => (
                    <tr key={coupon.code} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 font-bold text-gray-800">{coupon.code}</td>
                      <td className="py-3 text-gray-600">
                        {coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}% Off`
                          : `Flat ₹${coupon.discount_value}`}
                      </td>
                      <td className="py-3 font-semibold text-gray-900">{coupon.usages_count}</td>
                      <td className="py-3 font-semibold text-primary-600">₹{coupon.total_saved}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Application restriction distribution */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Scope Distribution</h3>
          <div className="space-y-4">
            {appSplit.length === 0 ? (
              <p className="text-center py-8 text-gray-400 text-sm">No scopes recorded</p>
            ) : (
              appSplit.map((split) => (
                <div key={split.app} className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize font-medium text-gray-700">{split.app}</span>
                    <span className="font-bold text-gray-900">{split.count} usages</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary-500 h-full rounded-full"
                      style={{
                        width: `${
                          metrics.total_usages > 0
                            ? (split.count / metrics.total_usages) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
