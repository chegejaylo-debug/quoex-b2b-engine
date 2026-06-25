"use client";

import { useEffect, useState } from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus, Award, Filter, RefreshCw } from 'lucide-react';

interface SellerRanking {
  sellerId: string;
  sellerName: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  rank: number;
  change: number;
  avatar?: string;
  category?: string;
  region?: string;
}

export default function SellerRankings() {
  const [rankings, setRankings] = useState<SellerRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'category' | 'region'>('all');
  const [filterValue, setFilterValue] = useState<string>('');

  useEffect(() => {
    fetchRankings();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRankings, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRankings = async () => {
    try {
      const response = await fetch('/api/rankings');
      const data = await response.json();
      if (data.success) {
        setRankings(data.rankings);
      }
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Trophy className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="w-5 h-5 text-amber-700" />;
    return <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-500">{rank}</span>;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const filteredRankings = rankings.filter(seller => {
    if (filter === 'all') return true;
    if (filter === 'category' && filterValue) return seller.category === filterValue;
    if (filter === 'region' && filterValue) return seller.region === filterValue;
    return true;
  });

  const categories = Array.from(new Set(rankings.map(r => r.category).filter(Boolean)));
  const regions = Array.from(new Set(rankings.map(r => r.region).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-500" />
              Seller Rankings
            </h2>
            <p className="text-xs text-gray-500 mt-1">Live sales volume rankings updated every 30 seconds</p>
          </div>
          <button
            onClick={fetchRankings}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'category' | 'region')}
            className="px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          >
            <option value="all">All Sellers</option>
            <option value="category">By Category</option>
            <option value="region">By Region</option>
          </select>

          {filter === 'category' && (
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}

          {filter === 'region' && (
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            >
              <option value="">Select Region</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-gray-700 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-gray-700 uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-gray-700 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-[10px] font-black text-gray-700 uppercase tracking-wider">Region</th>
                  <th className="px-6 py-3 text-right text-[10px] font-black text-gray-700 uppercase tracking-wider">Total Sales</th>
                  <th className="px-6 py-3 text-right text-[10px] font-black text-gray-700 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-3 text-right text-[10px] font-black text-gray-700 uppercase tracking-wider">Avg Order</th>
                  <th className="px-6 py-3 text-center text-[10px] font-black text-gray-700 uppercase tracking-wider">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRankings.map((seller) => (
                  <tr key={seller.sellerId} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        {getRankBadge(seller.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs mr-3">
                          {seller.avatar || seller.sellerName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">{seller.sellerName}</p>
                          <p className="text-[10px] text-gray-500">{seller.sellerId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {seller.category || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {seller.region || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <p className="text-xs font-black text-gray-900">{formatPrice(seller.totalSales)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-gray-500">
                      {seller.totalOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-gray-500">
                      {formatPrice(seller.averageOrderValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        {getChangeIcon(seller.change)}
                        <span className={`ml-1 text-xs font-bold ${seller.change > 0 ? 'text-green-500' : seller.change < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                          {seller.change !== 0 ? Math.abs(seller.change) : '-'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Total Sellers</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{rankings.length}</p>
            </div>
            <Award className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Total Sales Volume</p>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {formatPrice(rankings.reduce((sum, r) => sum + r.totalSales, 0))}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Total Orders</p>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {rankings.reduce((sum, r) => sum + r.totalOrders, 0)}
              </p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
