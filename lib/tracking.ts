import { supabase } from './supabase';

export interface TrackingLocation {
  lat: number;
  lng: number;
  timestamp: string;
}

export interface OrderTracking {
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered';
  currentLocation: TrackingLocation;
  estimatedDelivery: string;
  route: TrackingLocation[];
  driverName?: string;
  driverPhone?: string;
}

// Simulated logistics hubs in Kenya
const logisticsHubs = {
  "Nyeri Hub": { lat: -0.4238, lng: 36.9475 },
  "Karatina Terminal": { lat: -0.4950, lng: 37.0167 },
  "Othaya Depot": { lat: -0.5667, lng: 36.9333 },
  "Mukurweini Node": { lat: -0.6167, lng: 37.0500 },
  "Nairobi Cross-Dock": { lat: -1.286389, lng: 36.817223 },
};

// Generate simulated route between two points
export function generateRoute(startLat: number, startLng: number, endLat: number, endLng: number): TrackingLocation[] {
  const route: TrackingLocation[] = [];
  const steps = 10;
  
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const lat = startLat + (endLat - startLat) * progress;
    const lng = startLng + (endLng - startLng) * progress;
    
    // Add some randomness to simulate real routes
    const randomOffset = (Math.random() - 0.5) * 0.01;
    
    route.push({
      lat: lat + randomOffset,
      lng: lng + randomOffset,
      timestamp: new Date(Date.now() + i * 15 * 60000).toISOString(), // Every 15 minutes
    });
  }
  
  return route;
}

// Get order tracking data
export async function getOrderTracking(orderId: string): Promise<OrderTracking | null> {
  try {
    // In a real app, this would query a tracking table
    // For now, we'll simulate tracking data
    
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (!order) return null;
    
    // Simulate tracking based on order status
    const statuses: Array<'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered'> = 
      ['pending', 'processing', 'shipped', 'in_transit', 'delivered'];
    const currentIndex = Math.floor(Math.random() * statuses.length);
    const currentStatus = statuses[currentIndex];
    
    // Get start and end points
    const startPoint = logisticsHubs["Nyeri Hub"];
    const endPoint = logisticsHubs["Nairobi Cross-Dock"];
    
    const route = generateRoute(startPoint.lat, startPoint.lng, endPoint.lat, endPoint.lng);
    const currentLocation = route[Math.min(currentIndex, route.length - 1)];
    
    return {
      orderId,
      status: currentStatus,
      currentLocation,
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      route,
      driverName: "John Kamau",
      driverPhone: "+254712345678",
    };
  } catch (error) {
    console.error('Error fetching order tracking:', error);
    return null;
  }
}

// Update order location (simulated)
export async function updateOrderLocation(orderId: string, lat: number, lng: number): Promise<boolean> {
  try {
    // In a real app, this would update a tracking table
    console.log(`Updated location for order ${orderId}: ${lat}, ${lng}`);
    return true;
  } catch (error) {
    console.error('Error updating order location:', error);
    return false;
  }
}

// Get all active orders for tracking
export async function getActiveOrders(): Promise<OrderTracking[]> {
  try {
    // Simulate multiple orders
    const orders = [
      { id: "ORD-2026-A", destination: "Nairobi Cross-Dock" },
      { id: "ORD-2026-B", destination: "Karatina Terminal" },
      { id: "ORD-2026-C", destination: "Othaya Depot" },
    ];
    
    const trackingData = await Promise.all(
      orders.map(async (order) => {
        const tracking = await getOrderTracking(order.id);
        return tracking;
      })
    );
    
    return trackingData.filter((t): t is OrderTracking => t !== null);
  } catch (error) {
    console.error('Error fetching active orders:', error);
    return [];
  }
}
