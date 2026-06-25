import { supabase } from './supabase';

export interface SellerRanking {
  sellerId: string;
  sellerName: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  rank: number;
  change: number; // positive = moved up, negative = moved down
  avatar?: string;
  category?: string;
  region?: string;
}

// Store previous rankings to calculate rank changes
let previousRankings: Map<string, number> = new Map();

// Get seller rankings from real database
export async function getSellerRankings(): Promise<SellerRanking[]> {
  try {
    // Fetch all orders with seller information
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        total,
        seller_id,
        seller_name,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    if (!orders || orders.length === 0) {
      return [];
    }

    // Group orders by seller and calculate metrics
    const sellerMetrics = new Map<string, {
      sellerId: string;
      sellerName: string;
      totalSales: number;
      totalOrders: number;
      category?: string;
      region?: string;
    }>();

    orders.forEach((order: any) => {
      const sellerId = order.seller_id || 'unknown';
      const existing = sellerMetrics.get(sellerId);

      if (existing) {
        existing.totalSales += order.total || 0;
        existing.totalOrders += 1;
      } else {
        sellerMetrics.set(sellerId, {
          sellerId,
          sellerName: order.seller_name || 'Unknown Seller',
          totalSales: order.total || 0,
          totalOrders: 1,
        });
      }
    });

    // Convert to array and calculate average order value
    const rankings: SellerRanking[] = Array.from(sellerMetrics.values()).map((metrics, index) => {
      const averageOrderValue = metrics.totalOrders > 0 
        ? metrics.totalSales / metrics.totalOrders 
        : 0;

      // Get previous rank to calculate change
      const previousRank = previousRankings.get(metrics.sellerId);
      const change = previousRank !== undefined ? previousRank - (index + 1) : 0;

      return {
        sellerId: metrics.sellerId,
        sellerName: metrics.sellerName,
        totalSales: metrics.totalSales,
        totalOrders: metrics.totalOrders,
        averageOrderValue,
        rank: index + 1,
        change,
        avatar: metrics.sellerName
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        category: metrics.category,
        region: metrics.region,
      };
    });

    // Sort by total sales descending
    rankings.sort((a, b) => b.totalSales - a.totalSales);

    // Update ranks and store for next comparison
    rankings.forEach((seller, index) => {
      seller.rank = index + 1;
      previousRankings.set(seller.sellerId, seller.rank);
    });

    return rankings;
  } catch (error) {
    console.error('Error fetching seller rankings:', error);
    return [];
  }
}

// Get seller ranking by ID
export async function getSellerRanking(sellerId: string): Promise<SellerRanking | null> {
  try {
    const rankings = await getSellerRankings();
    return rankings.find(s => s.sellerId === sellerId) || null;
  } catch (error) {
    console.error('Error fetching seller ranking:', error);
    return null;
  }
}

// Update seller sales - this is handled by the orders table, no separate update needed
export async function updateSellerSales(sellerId: string, amount: number): Promise<boolean> {
  try {
    // Sales are updated automatically when orders are created
    // This function is kept for compatibility but doesn't need to do anything
    return true;
  } catch (error) {
    console.error('Error updating seller sales:', error);
    return false;
  }
}

// Get top sellers by category
export async function getTopSellersByCategory(category: string, limit: number = 5): Promise<SellerRanking[]> {
  try {
    const rankings = await getSellerRankings();
    return rankings
      .filter(s => s.category === category)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching top sellers by category:', error);
    return [];
  }
}

// Get top sellers by region
export async function getTopSellersByRegion(region: string, limit: number = 5): Promise<SellerRanking[]> {
  try {
    const rankings = await getSellerRankings();
    return rankings
      .filter(s => s.region === region)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching top sellers by region:', error);
    return [];
  }
}
