import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col relative shadow-xs animate-pulse">
      <div className="h-36 w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-2" />
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
      <div className="h-2 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="h-8 bg-gray-200 rounded mt-auto" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="h-12 bg-gray-100 border-b" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 border-b animate-pulse bg-gray-50" />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md border p-6">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-50 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}
