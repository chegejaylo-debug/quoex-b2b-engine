import React from "react";
import { CheckCircle, Circle, Truck, Package, MapPin, Clock, ShieldCheck } from "lucide-react";

interface OrderStep {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  status: "completed" | "current" | "pending";
  timestamp?: string;
}

interface OrderTrackingTimelineProps {
  orderId: string;
  currentStep: number;
}

export function OrderTrackingTimeline({ orderId, currentStep }: OrderTrackingTimelineProps) {
  const steps: OrderStep[] = [
    {
      id: "initiated",
      label: "Order Initiated",
      description: "Order request received and verified",
      icon: <Package className="w-4 h-4" />,
      status: currentStep >= 0 ? "completed" : "pending",
      timestamp: "Jun 25, 2026 - 9:30 AM",
    },
    {
      id: "approved",
      label: "Manifest Approved",
      description: "Supply manifest approved by procurement team",
      icon: <CheckCircle className="w-4 h-4" />,
      status: currentStep >= 1 ? "completed" : currentStep === 1 ? "current" : "pending",
      timestamp: currentStep >= 1 ? "Jun 25, 2026 - 10:15 AM" : undefined,
    },
    {
      id: "loaded",
      label: "Cargo Loaded",
      description: "Items loaded at Nyeri Hub dispatch center",
      icon: <MapPin className="w-4 h-4" />,
      status: currentStep >= 2 ? "completed" : currentStep === 2 ? "current" : "pending",
      timestamp: currentStep >= 2 ? "Jun 25, 2026 - 11:45 AM" : undefined,
    },
    {
      id: "transit",
      label: "In Transit",
      description: "Shipment en route to destination",
      icon: <Truck className="w-4 h-4" />,
      status: currentStep >= 3 ? "completed" : currentStep === 3 ? "current" : "pending",
      timestamp: currentStep >= 3 ? "Jun 25, 2026 - 12:30 PM" : undefined,
    },
    {
      id: "delivered",
      label: "Delivered",
      description: "Order successfully delivered and confirmed",
      icon: <ShieldCheck className="w-4 h-4" />,
      status: currentStep >= 4 ? "completed" : currentStep === 4 ? "current" : "pending",
      timestamp: currentStep >= 4 ? "Jun 25, 2026 - 3:45 PM" : undefined,
    },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Order Tracking Timeline
          </h3>
          <p className="text-xs text-gray-500 mt-1">Order ID: {orderId}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-xs font-black shadow-lg">
          {currentStep === 4 ? "Completed" : "In Progress"}
        </div>
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2" />
        <div
          className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-orange-500 to-orange-600 -translate-x-1/2 transition-all duration-500"
          style={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex items-start gap-4">
              {/* Step Icon */}
              <div
                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step.status === "completed"
                    ? "bg-gradient-to-br from-orange-500 to-orange-600 border-orange-500 shadow-lg shadow-orange-500/30"
                    : step.status === "current"
                    ? "bg-white border-orange-500 shadow-lg shadow-orange-500/20 animate-pulse"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <div className={`${step.status === "completed" ? "text-white" : step.status === "current" ? "text-orange-500" : "text-gray-400"}`}>
                  {step.status === "completed" ? <CheckCircle className="w-5 h-5" /> : step.icon}
                </div>
              </div>

              {/* Step Content */}
              <div className="flex-1 pt-2">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`text-sm font-black ${step.status === "completed" || step.status === "current" ? "text-gray-900" : "text-gray-400"}`}>
                    {step.label}
                  </h4>
                  {step.status === "current" && (
                    <span className="bg-orange-100 text-orange-700 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Current
                    </span>
                  )}
                </div>
                <p className={`text-xs ${step.status === "completed" || step.status === "current" ? "text-gray-600" : "text-gray-400"}`}>
                  {step.description}
                </p>
                {step.timestamp && (
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {step.timestamp}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estimated Delivery */}
      {currentStep < 4 && (
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-black text-blue-900">Estimated Delivery</span>
          </div>
          <p className="text-xs text-blue-700">Jun 26, 2026 - 2:00 PM</p>
          <p className="text-[10px] text-blue-600 mt-1">Based on current transit conditions</p>
        </div>
      )}
    </div>
  );
}
