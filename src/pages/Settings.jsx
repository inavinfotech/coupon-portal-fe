import React from "react";
import { Shield, Database, Cpu, Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Settings</h1>
        <p className="text-gray-500 mt-1 text-sm">Configure core coupon system variables and environment states</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 divide-y divide-gray-100 max-w-2xl">
        <div className="py-4 flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700 shrink-0">
            <Shield size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Security Mode</h4>
            <p className="text-xs text-gray-400 mt-1">Require strict API headers authorization verification on validation endpoints.</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                Enabled
              </span>
            </div>
          </div>
        </div>

        <div className="py-4 flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700 shrink-0">
            <Database size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Local SQLite Cache</h4>
            <p className="text-xs text-gray-400 mt-1">Maintains validation cache entries locally to optimize performance calculations.</p>
            <div className="mt-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-50 text-gray-600 border border-gray-200">
                Connected
              </span>
            </div>
          </div>
        </div>

        <div className="py-4 flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700 shrink-0">
            <Cpu size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Double Verification Logic</h4>
            <p className="text-xs text-gray-400 mt-1">Automatically checks discount prices twice during validate and claim checkpoints.</p>
            <div className="mt-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
