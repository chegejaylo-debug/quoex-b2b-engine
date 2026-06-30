import React, { useState } from "react";
import { FileText, Clock, TrendingUp, Users, Plus, Send, Award, CheckCircle, AlertCircle, X } from "lucide-react";

interface RFQRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  deadline: string;
  budget: string;
  status: "open" | "closed" | "awarded";
  bids: Bid[];
  createdAt: string;
}

interface Bid {
  id: string;
  supplierName: string;
  supplierId: string;
  price: number;
  deliveryDays: number;
  notes: string;
  status: "pending" | "accepted" | "rejected";
  submittedAt: string;
}

interface RFQBiddingSystemProps {
  userRole: "buyer" | "supplier" | null;
}

export function RFQBiddingSystem({ userRole }: RFQBiddingSystemProps) {
  const [showCreateRFQ, setShowCreateRFQ] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQRequest | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);

  // Mock RFQ data
  const [rfqRequests, setRfqRequests] = useState<RFQRequest[]>([
    {
      id: "RFQ-2026-001",
      title: "10,000 meters of electrical wire",
      description: "Need high-quality copper electrical wire for commercial building project. Must meet KEBS standards.",
      category: "Electronics",
      quantity: 10000,
      unit: "meters",
      deadline: "2026-07-15",
      budget: "KES 500,000 - 700,000",
      status: "open",
      bids: [
        {
          id: "BID-001",
          supplierName: "Nairobi Electrical Supplies",
          supplierId: "SUP-001",
          price: 650000,
          deliveryDays: 7,
          notes: "Premium copper wire, certified. Can deliver within 7 days.",
          status: "pending",
          submittedAt: "2026-06-25",
        },
        {
          id: "BID-002",
          supplierName: "Central Wiring Co",
          supplierId: "SUP-002",
          price: 580000,
          deliveryDays: 10,
          notes: "Standard grade, bulk discount available.",
          status: "pending",
          submittedAt: "2026-06-25",
        },
      ],
      createdAt: "2026-06-20",
    },
    {
      id: "RFQ-2026-002",
      title: "500 bags of cement 42.5R",
      description: "Construction project requiring premium cement. Must be Blue Triangle or equivalent.",
      category: "Hardware",
      quantity: 500,
      unit: "bags",
      deadline: "2026-07-10",
      budget: "KES 700,000 - 800,000",
      status: "open",
      bids: [
        {
          id: "BID-003",
          supplierName: "Nyeri Hardware Supplies",
          supplierId: "SUP-003",
          price: 725000,
          deliveryDays: 3,
          notes: "Blue Triangle Cement, immediate availability.",
          status: "pending",
          submittedAt: "2026-06-24",
        },
      ],
      createdAt: "2026-06-22",
    },
    {
      id: "RFQ-2026-003",
      title: "Industrial steel beams 20 tons",
      description: "Heavy-duty steel beams for warehouse construction. Grade A steel required.",
      category: "Construction",
      quantity: 20,
      unit: "tons",
      deadline: "2026-07-20",
      budget: "KES 2,000,000 - 2,500,000",
      status: "closed",
      bids: [
        {
          id: "BID-004",
          supplierName: "Steel Masters Kenya",
          supplierId: "SUP-004",
          price: 2150000,
          deliveryDays: 14,
          notes: "Grade A steel, certified. Includes delivery.",
          status: "accepted",
          submittedAt: "2026-06-23",
        },
      ],
      createdAt: "2026-06-18",
    },
  ]);

  const [newRFQ, setNewRFQ] = useState({
    title: "",
    description: "",
    category: "Hardware",
    quantity: "",
    unit: "",
    deadline: "",
    budget: "",
  });

  const [newBid, setNewBid] = useState({
    price: "",
    deliveryDays: "",
    notes: "",
  });

  const handleCreateRFQ = () => {
    const rfq: RFQRequest = {
      id: `RFQ-2026-${String(rfqRequests.length + 1).padStart(3, "0")}`,
      title: newRFQ.title,
      description: newRFQ.description,
      category: newRFQ.category,
      quantity: parseInt(newRFQ.quantity),
      unit: newRFQ.unit,
      deadline: newRFQ.deadline,
      budget: newRFQ.budget,
      status: "open",
      bids: [],
      createdAt: new Date().toISOString().split("T")[0],
    };
    setRfqRequests([rfq, ...rfqRequests]);
    setShowCreateRFQ(false);
    setNewRFQ({
      title: "",
      description: "",
      category: "Hardware",
      quantity: "",
      unit: "",
      deadline: "",
      budget: "",
    });
  };

  const handleSubmitBid = () => {
    if (!selectedRFQ) return;
    const bid: Bid = {
      id: `BID-${String(selectedRFQ.bids.length + 1).padStart(3, "0")}`,
      supplierName: "Your Company",
      supplierId: "SUP-YOU",
      price: parseInt(newBid.price),
      deliveryDays: parseInt(newBid.deliveryDays),
      notes: newBid.notes,
      status: "pending",
      submittedAt: new Date().toISOString().split("T")[0],
    };
    const updatedRFQ = {
      ...selectedRFQ,
      bids: [...selectedRFQ.bids, bid],
    };
    setRfqRequests(rfqRequests.map(r => r.id === selectedRFQ.id ? updatedRFQ : r));
    setSelectedRFQ(updatedRFQ);
    setShowBidForm(false);
    setNewBid({ price: "", deliveryDays: "", notes: "" });
  };

  const handleAcceptBid = (rfqId: string, bidId: string) => {
    setRfqRequests(rfqRequests.map(rfq => {
      if (rfq.id === rfqId) {
        return {
          ...rfq,
          status: "awarded" as const,
          bids: rfq.bids.map(bid => ({
            ...bid,
            status: bid.id === bidId ? "accepted" as const : "rejected" as const,
          })),
        };
      }
      return rfq;
    }));
  };

  const openRFQ = (rfq: RFQRequest) => {
    setSelectedRFQ(rfq);
    setShowBidForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-orange-500" />
            Automated RFQ Bidding System
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {userRole === "buyer" ? "Post requests and receive competitive bids from suppliers" : "Browse open requests and submit competitive bids"}
          </p>
        </div>
        {userRole === "buyer" && (
          <button
            onClick={() => setShowCreateRFQ(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-black px-4 py-2 rounded-lg transition flex items-center gap-1 shadow-md"
          >
            <Plus className="w-4 h-4" /> Create RFQ
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-black text-blue-900 uppercase tracking-wider">Total RFQs</span>
          </div>
          <p className="text-2xl font-black text-blue-900">{rfqRequests.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="text-[10px] font-black text-green-900 uppercase tracking-wider">Open Requests</span>
          </div>
          <p className="text-2xl font-black text-green-900">{rfqRequests.filter(r => r.status === "open").length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="text-[10px] font-black text-purple-900 uppercase tracking-wider">Total Bids</span>
          </div>
          <p className="text-2xl font-black text-purple-900">{rfqRequests.reduce((acc, r) => acc + r.bids.length, 0)}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider">Awarded</span>
          </div>
          <p className="text-2xl font-black text-amber-900">{rfqRequests.filter(r => r.status === "awarded").length}</p>
        </div>
      </div>

      {/* RFQ List */}
      {!selectedRFQ ? (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="text-sm font-black text-gray-900">Active Requests</h3>
          </div>
          <div className="divide-y">
            {rfqRequests.map((rfq) => (
              <div
                key={rfq.id}
                onClick={() => openRFQ(rfq)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-gray-900">{rfq.title}</h4>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        rfq.status === "open" ? "bg-green-100 text-green-700" :
                        rfq.status === "closed" ? "bg-gray-100 text-gray-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {rfq.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{rfq.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {rfq.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {rfq.quantity} {rfq.unit}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Due: {rfq.deadline}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {rfq.bids.length} bids
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-900">{rfq.budget}</p>
                    <p className="text-[10px] text-gray-400">Budget Range</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Back Button */}
          <button
            onClick={() => setSelectedRFQ(null)}
            className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            ← Back to all requests
          </button>

          {/* RFQ Details */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-orange-100">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-black text-gray-900">{selectedRFQ.title}</h3>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                      selectedRFQ.status === "open" ? "bg-green-500 text-white" :
                      selectedRFQ.status === "closed" ? "bg-gray-500 text-white" :
                      "bg-amber-500 text-white"
                    }`}>
                      {selectedRFQ.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{selectedRFQ.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{selectedRFQ.budget}</p>
                  <p className="text-[10px] text-gray-500">Budget Range</p>
                </div>
              </div>
              <div className="flex items-center gap-6 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {selectedRFQ.category}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {selectedRFQ.quantity} {selectedRFQ.unit}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Deadline: {selectedRFQ.deadline}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {selectedRFQ.bids.length} bids received
                </span>
              </div>
            </div>

            {/* Bids Section */}
            <div className="p-6">
        <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-black text-gray-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              Submitted Bids
            </h4>
          </div>
          {userRole === "supplier" && selectedRFQ.status === "open" && !showBidForm && (
            <button
              onClick={() => setShowBidForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-black px-4 py-2 rounded-lg transition flex items-center gap-1 shrink-0"
            >
              <Send className="w-3.5 h-3.5" /> Submit Bid
            </button>
          )}
        </div>

              {showBidForm ? (
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 space-y-4">
                  <h5 className="text-sm font-black text-purple-900">Submit Your Bid</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-purple-700 block mb-1">Price (KES)</label>
                      <input
                        type="number"
                        value={newBid.price}
                        onChange={(e) => setNewBid({ ...newBid, price: e.target.value })}
                        className="w-full border border-purple-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                        placeholder="Enter your price"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-purple-700 block mb-1">Delivery Days</label>
                      <input
                        type="number"
                        value={newBid.deliveryDays}
                        onChange={(e) => setNewBid({ ...newBid, deliveryDays: e.target.value })}
                        className="w-full border border-purple-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                        placeholder="Days to deliver"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-purple-700 block mb-1">Notes</label>
                    <textarea
                      value={newBid.notes}
                      onChange={(e) => setNewBid({ ...newBid, notes: e.target.value })}
                      className="w-full border border-purple-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-purple-500 outline-none h-20"
                      placeholder="Additional details about your bid..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmitBid}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-black px-4 py-2 rounded-lg transition flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit Bid
                    </button>
                    <button
                      onClick={() => setShowBidForm(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-black px-4 py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : selectedRFQ.bids.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed">
                  <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">No bids submitted yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedRFQ.bids
                    .sort((a, b) => a.price - b.price)
                    .map((bid, index) => (
                    <div
                      key={bid.id}
                      className={`p-4 rounded-xl border ${
                        bid.status === "accepted" ? "bg-green-50 border-green-200" :
                        bid.status === "rejected" ? "bg-gray-50 border-gray-200" :
                        "bg-white border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-gray-900">{bid.supplierName}</span>
                            {bid.status === "accepted" && (
                              <span className="bg-green-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Accepted
                              </span>
                            )}
                            {bid.status === "rejected" && (
                              <span className="bg-gray-400 text-white text-[8px] font-black px-2 py-0.5 rounded-full">
                                Rejected
                              </span>
                            )}
                            {index === 0 && bid.status === "pending" && (
                              <span className="bg-amber-100 text-amber-700 text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> Lowest Bid
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{bid.notes}</p>
                          <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              KES {bid.price.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {bid.deliveryDays} days delivery
                            </span>
                          </div>
                        </div>
                        {userRole === "buyer" && selectedRFQ.status === "open" && bid.status === "pending" && (
                          <button
                            onClick={() => handleAcceptBid(selectedRFQ.id, bid.id)}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs font-black px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Accept
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create RFQ Modal */}
      {showCreateRFQ && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-500" />
                Create New RFQ Request
              </h3>
              <button
                onClick={() => setShowCreateRFQ(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              <div>
                <label className="text-xs font-black text-gray-700 block mb-1">Request Title</label>
                <input
                  type="text"
                  value={newRFQ.title}
                  onChange={(e) => setNewRFQ({ ...newRFQ, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                  placeholder="e.g., 10,000 meters of electrical wire"
                />
              </div>
              <div>
                <label className="text-xs font-black text-gray-700 block mb-1">Description</label>
                <textarea
                  value={newRFQ.description}
                  onChange={(e) => setNewRFQ({ ...newRFQ, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none h-24"
                  placeholder="Describe your requirements in detail..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">Category</label>
                  <select
                    value={newRFQ.category}
                    onChange={(e) => setNewRFQ({ ...newRFQ, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Construction">Construction</option>
                    <option value="Agriculture">Agriculture</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">Quantity</label>
                    <input
                      type="number"
                      value={newRFQ.quantity}
                      onChange={(e) => setNewRFQ({ ...newRFQ, quantity: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">Unit</label>
                    <input
                      type="text"
                      value={newRFQ.unit}
                      onChange={(e) => setNewRFQ({ ...newRFQ, unit: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                      placeholder="units"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">Deadline</label>
                  <input
                    type="date"
                    value={newRFQ.deadline}
                    onChange={(e) => setNewRFQ({ ...newRFQ, deadline: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">Budget Range</label>
                  <input
                    type="text"
                    value={newRFQ.budget}
                    onChange={(e) => setNewRFQ({ ...newRFQ, budget: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                    placeholder="KES 100,000 - 150,000"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateRFQ(false)}
                className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRFQ}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-black px-6 py-2 rounded-lg transition flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" /> Publish RFQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
