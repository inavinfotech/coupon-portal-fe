import React from 'react';
import { cn } from '../utils/cn';

const StatusBadge = ({ active, validTo }) => {
  let statusText = 'Active';
  let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200/50';

  if (!active) {
    statusText = 'Inactive';
    badgeClass = 'bg-gray-100 text-gray-600 border-gray-200';
  } else if (validTo) {
    const expiry = new Date(validTo);
    if (expiry < new Date()) {
      statusText = 'Expired';
      badgeClass = 'bg-rose-50 text-rose-700 border-rose-200/50';
    }
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border",
      badgeClass
    )}>
      {statusText}
    </span>
  );
};

export default StatusBadge;
