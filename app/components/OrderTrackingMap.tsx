"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Truck, Navigation } from 'lucide-react';

// Fix for default marker icons in Leaflet with Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TrackingLocation {
  lat: number;
  lng: number;
  timestamp: string;
}

interface OrderTracking {
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered';
  currentLocation: TrackingLocation;
  estimatedDelivery: string;
  route: TrackingLocation[];
  driverName?: string;
  driverPhone?: string;
}

interface OrderTrackingMapProps {
  trackingData: OrderTracking;
}

function MapView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 10);
  }, [center, map]);
  return null;
}

export default function OrderTrackingMap({ trackingData }: OrderTrackingMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading map...</div>
      </div>
    );
  }

  const center: [number, number] = [trackingData.currentLocation.lat, trackingData.currentLocation.lng];
  const routeCoordinates = trackingData.route.map(loc => [loc.lat, loc.lng] as [number, number]);

  const statusColors = {
    pending: 'bg-yellow-500',
    processing: 'bg-blue-500',
    shipped: 'bg-purple-500',
    in_transit: 'bg-green-500',
    delivered: 'bg-emerald-500',
  };

  const statusLabels = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    in_transit: 'In Transit',
    delivered: 'Delivered',
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-orange-500" />
            Order {trackingData.orderId}
          </h3>
          <span className={`px-2 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wide ${statusColors[trackingData.status]}`}>
            {statusLabels[trackingData.status]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
          <div>
            <p className="text-gray-500">Driver</p>
            <p className="font-bold text-gray-900">{trackingData.driverName || 'Assigned'}</p>
          </div>
          <div>
            <p className="text-gray-500">Contact</p>
            <p className="font-bold text-gray-900">{trackingData.driverPhone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500">Est. Delivery</p>
            <p className="font-bold text-gray-900">
              {new Date(trackingData.estimatedDelivery).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Last Update</p>
            <p className="font-bold text-gray-900">
              {new Date(trackingData.currentLocation.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <MapContainer
          center={center}
          zoom={10}
          style={{ height: '400px', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapView center={center} />
          
          {/* Route polyline */}
          <Polyline
            positions={routeCoordinates}
            color="#f97316"
            weight={4}
            opacity={0.7}
            dashArray="10, 10"
          />
          
          {/* Current location marker */}
          <Marker position={center}>
            <Popup>
              <div className="text-xs">
                <p className="font-bold">Current Location</p>
                <p>Lat: {trackingData.currentLocation.lat.toFixed(4)}</p>
                <p>Lng: {trackingData.currentLocation.lng.toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4">
        <h4 className="text-xs font-black text-gray-900 mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4 text-orange-500" />
          Delivery Progress
        </h4>
        <div className="space-y-2">
          {['pending', 'processing', 'shipped', 'in_transit', 'delivered'].map((status, index) => {
            const statusIndex = ['pending', 'processing', 'shipped', 'in_transit', 'delivered'].indexOf(trackingData.status);
            const isComplete = index <= statusIndex;
            const isCurrent = status === trackingData.status;
            
            return (
              <div key={status} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isComplete ? 'bg-orange-500' : 'bg-gray-200'} ${isCurrent ? 'ring-2 ring-orange-300' : ''}`} />
                <span className={`text-xs font-medium ${isComplete ? 'text-gray-900' : 'text-gray-400'} capitalize`}>
                  {status.replace('_', ' ')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
