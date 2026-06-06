"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ShoppingCart, Star, Phone, Mail, MapPin, User, LogIn, UserPlus, 
  Search, Filter, SlidersHorizontal, Check, RefreshCw, X, Eye, 
  FileText, ArrowRight, Package, ShieldCheck, Truck, ChevronLeft, ChevronRight,
  Scale, MessageSquare, Download, Send, DollarSign, Building, Plus, Edit2, Trash2, Save, CheckCircle, ImageIcon
} from "lucide-react";
import Image from "next/image";

export default function AlibabaLayout() {
  // --- Core Base States ---
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- Filtering & Pagination States ---
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("created_at-desc");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 8;

  // --- Cart, Currency, & Logistics States ---
  const [cart, setCart] = useState([]);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [currency, setCurrency] = useState("KES"); 
  const exchangeRate = 0.0077; // 1 KES = 0.0077 USD
  
  // Logistics Configurations
  const [selectedZone, setSelectedZone] = useState("Nyeri Hub");
  const logisticsZones = {
    "Nyeri Hub": { baseFee: 0, costPerKg: 2 },
    "Karatina Terminal": { baseFee: 1500, costPerKg: 5 },
    "Othaya Depot": { baseFee: 1200, costPerKg: 4.5 },
    "Mukurweini Node": { baseFee: 1800, costPerKg: 6 },
    "Nairobi Cross-Dock": { baseFee: 5000, costPerKg: 12 }
  };

  // --- Auth & User States ---
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("shop"); // 'shop', 'dashboard', 'rfq-board', 'admin'

  // --- Admin Dashboard Feature Operations ---
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [adminForm, setAdminForm] = useState({ id: null, name: "", category: "Cement", price: "", image_url: "" });
  const [isAdminEditing, setIsAdminEditing] = useState(false);
  const categories = ["Cement", "Drills", "Paint", "Electrical", "Plumbing"];

  const triggerNotification = (text) => {
    setNotification(text);
    setTimeout(() => setNotification(null), 4000);
  };

  // --- Feature 2: Multi-Item RFQ Board State ---
  const [rfqForm, setRfqForm] = useState({
    description: "",
    targetBudget: "",
    urgency: "Standard (3-5 Days)"
  });

  // --- Feature 4: Live Chat Interface State ---
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "agent", text: "Welcome to Tony's Sourcing Desk. Let us know if you need customized container volume discount pricing charts.", time: "Just Now" }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");

  // --- UI Interactive States ---
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [singleRfqMessage, setSingleRfqMessage] = useState("");

  // --- Derived Calculations ---
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  // --- Wholesale Pricing Matrix Logic ---
  const getTieredUnitPrice = (product, quantity) => {
    const base = product.price;
    if (quantity >= 200) return base * 0.82; // 18% Off Wholesale Bulk Bracket
    if (quantity >= 50) return base * 0.90;  // 10% Off Mid-Tier Volume Bracket
    return base;
  };

  const getProductWeight = (product) => {
    if (product.category === "Cement") return 50; 
    if (product.category === "Paint") return 20;  
    return 2; 
  };

  // --- Banners ---
  const banners = [
    { id: 1, image: "/banner1.jpg", text: "Verified B2B Procurement Hub & Factory-Direct Logistics" },
    { id: 2, image: "/banner2.jpg", text: "Volume-Tiered Pricing Models Optimized For Regional Contractors" }
  ];
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const localCart = localStorage.getItem("tonys_global_cart");
    if (localCart) { try { setCart(JSON.parse(localCart)); } catch (e) {} }
  }, []);

  useEffect(() => {
    localStorage.setItem("tonys_global_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user ?? null); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => { setUser(session?.user ?? null); });
    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("*").eq("id", user.id).single()
        .then(({ data }) => setProfile(data)).catch(() => setProfile(null));

      setOrders([
        { id: "ORD-2026-A", date: "2026-05-10", total: 145000, status: "Dispatched", items: "Premium Blue Triangle Cement x120 Bags" },
        { id: "ORD-2026-B", date: "2026-06-02", total: 38400, status: "Processing", items: "Gloss Finish Weatherguard Paint x12 Pails" }
      ]);
    }
  }, [user]);

  // --- Central Query Inventory Master Function ---
  async function fetchProducts() {
    setLoading(true);
    try {
      let query = supabase.from("products").select("*", { count: "exact" });
      
      // Conditionally skip client filters if using full table management
      if (activeTab !== "admin") {
        if (debouncedSearch) query = query.ilike("name", `%${debouncedSearch}%`);
        if (category !== "All") query = query.eq("category", category);
        if (minPrice) query = query.gte("price", parseFloat(minPrice));
        if (maxPrice) query = query.lte("price", parseFloat(maxPrice));
      }

      const [sortField, sortOrder] = sortBy.split("-");
      query = query.order(sortField, { ascending: sortOrder === "asc" });
      
      if (activeTab !== "admin") {
        query = query.range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
      }

      const { data, error: err, count } = await query;
      if (err) throw err;
      setInventory(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, category, minPrice, maxPrice, sortBy, page, activeTab]);

  // --- Cart System Operations ---
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setShowCartPreview(true);
  };

  const updateCartQuantity = (id, amount) => {
    setCart((prev) => 
      prev.map((item) => {
        if (item.id === id) {
          const nextQty = item.quantity + amount;
          return nextQty > 0 ? { ...item, quantity: nextQty } : null;
        }
        return item;
      }).filter(Boolean)
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // --- Admin Dashboard Functions ---
  const handleAdminFormSubmit = async (e) => {
    e.preventDefault();
    if (!adminForm.name || !adminForm.price) return triggerNotification("Please populate required parameters.");

    setActionLoading(true);
    const payload = {
      name: adminForm.name,
      category: adminForm.category,
      price: parseFloat(adminForm.price),
      image_url: adminForm.image_url || null
    };

    try {
      if (isAdminEditing) {
        const { error } = await supabase.from("products").update(payload).eq("id", adminForm.id);
        if (error) throw error;
        triggerNotification("Product listing modified successfully.");
      } else {
        const { error } = await supabase.from("products").insert([payload]);
        if (error) throw error;
        triggerNotification("New wholesale component added to pipeline.");
      }
      resetAdminForm();
      fetchProducts();
    } catch (err) {
      triggerNotification(`Mutation Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const enterAdminEditMode = (product) => {
    setIsAdminEditing(true);
    setAdminForm({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      image_url: product.image_url || ""
    });
  };

  const executeAdminDelete = async (id) => {
    if (!window.confirm("Purge item permanently from live logistics database?")) return;
    setActionLoading(true);
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      triggerNotification("Item successfully removed from warehouses.");
      fetchProducts();
    } catch (err) {
      triggerNotification(`Purge Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const resetAdminForm = () => {
    setIsAdminEditing(false);
    setAdminForm({ id: null, name: "", category: "Cement", price: "", image_url: "" });
  };

  // --- Advanced Aggregate Financial & Freight Computations ---
  const cartTotalWeight = cart.reduce((sum, item) => sum + (getProductWeight(item) * item.quantity), 0);
  
  const totalItemsPriceKES = cart.reduce((sum, item) => {
    const currentUnitPrice = getTieredUnitPrice(item, item.quantity);
    return sum + (currentUnitPrice * item.quantity);
  }, 0);

  const activeZoneConfig = logisticsZones[selectedZone] || { baseFee: 0, costPerKg: 0 };
  const freightCostKES = cart.length > 0 ? activeZoneConfig.baseFee + (cartTotalWeight * activeZoneConfig.costPerKg) : 0;
  const aggregateVatKES = (totalItemsPriceKES + freightCostKES) * 0.16; 
  const overallInvoiceTotalKES = totalItemsPriceKES + freightCostKES + aggregateVatKES;

  const formatPrice = (priceInKES) => {
    if (currency === "USD") {
      return `$${(priceInKES * exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    }
    return `KES ${priceInKES.toLocaleString()}`;
  };

  // --- Automated Dispatch Handlers ---
  const sendWhatsAppOrder = () => {
    const itemsMarkdown = cart.map(item => `* ${item.name}\n  _Qty:_ ${item.quantity} units @ ${formatPrice(getTieredUnitPrice(item, item.quantity))} ea`).join("\n");
    const dynamicMessage = `*COMMERCIAL PURCHASE REQUEST: TONY'S GLOBAL*\n\n*Logistics Destination:* ${selectedZone}\n*Consignee Profile:* ${profile?.name || user?.email || "Verified Procurement Partner"}\n\n*Manifest Breakdowns:*\n${itemsMarkdown}\n\n*Payload Mass Metrics:* ${cartTotalWeight} KG\n*Net Wholesale Cost:* ${formatPrice(totalItemsPriceKES)}\n*Freight Surcharge:* ${formatPrice(freightCostKES)}\n*Corporate VAT (16%):* ${formatPrice(aggregateVatKES)}\n*Gross Payable Total:* ${formatPrice(overallInvoiceTotalKES)}\n\n_Auto-generated invoice pipeline._`;
    window.open(`https://wa.me/254757528133?text=${encodeURIComponent(dynamicMessage)}`, "_blank");
  };

  const submitGlobalRfqBoardForm = (e) => {
    e.preventDefault();
    if (!rfqForm.description) return alert("Please specify procurement resource requirements.");
    const trackingNo = "RFQ-" + Math.floor(Math.random() * 90000 + 10000);
    alert(`Success! Multi-Item ${trackingNo} has been queued into our global supplier engine.`);
    setRfqForm({ description: "", targetBudget: "", urgency: "Standard (3-5 Days)" });
    setActiveTab("shop");
  };

  const executeChatMessageSend = (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now(), sender: "buyer", text: currentMessage, time: "Just now" }]);
    setCurrentMessage("");
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: "agent", text: "Your message context has been locked into our system pipeline. Sourcing agents are analyzing variables.", time: "Just now" }]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased selection:bg-orange-500 selection:text-white print:bg-white print:text-black">
      
      {/* GLOBAL HUD GLOBAL ALERTS */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-gray-800 flex items-center gap-2 animate-slideUp">
          <CheckCircle className="w-4 h-4 text-orange-400 shrink-0" />
          <span className="font-bold tracking-wide">{notification}</span>
        </div>
      )}

      {/* HEADER UTILITY SYSTEM BAR */}
      <div className="bg-gray-900 text-gray-400 text-[11px] py-2 px-4 border-b border-gray-800 font-medium print:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-6 items-center">
            <span className="flex items-center gap-1 text-gray-300"><ShieldCheck className="w-3.5 h-3.5 text-orange-500" /> Secure Trade Assurance</span>
            <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Direct Site Freight Fleet</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrency(currency === "KES" ? "USD" : "KES")}
              className="hover:text-white font-bold transition bg-gray-800 px-2.5 py-0.5 rounded border border-gray-700 text-orange-400"
            >
              Currency Setup: {currency}
            </button>
            <span className="text-gray-500">Node Sync Active (2026)</span>
          </div>
        </div>
      </div>

      {/* CORE DYNAMIC HEADER CONTROL PLATFORM */}
      <header className="w-full py-4 px-4 sticky top-0 z-40 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-md print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="cursor-pointer" onClick={() => { setActiveTab("shop"); setCategory("All"); }}>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                TONY'S <span className="bg-gray-900 text-orange-400 px-2 py-0.5 rounded text-lg font-black shadow-md">GLOBAL</span>
              </h1>
              <p className="text-[9px] text-orange-100 font-bold tracking-widest uppercase">Verified B2B Supply Network</p>
            </div>
            
            <div className="flex items-center gap-2 md:hidden">
              {cart.length > 0 && (
                <button onClick={() => setShowCartPreview(!showCartPreview)} className="bg-white p-2 rounded-full text-orange-600 relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cart.reduce((a,c)=>a+c.quantity,0)}</span>
                </button>
              )}
            </div>
          </div>

          {/* Search Processing Hub */}
          <div className="w-full md:max-w-lg flex items-center bg-white rounded-lg shadow-inner overflow-hidden border border-orange-200">
            <div className="pl-3 text-gray-400"><Search className="w-4 h-4" /></div>
            <input
              type="text"
              placeholder="Search components, instant wholesale items, certified materials..."
              className="w-full p-2.5 text-xs text-gray-800 bg-transparent focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && <button onClick={() => setSearch("")} className="p-2 text-gray-400"><X className="w-3.5 h-3.5" /></button>}
          </div>

          {/* Core App Navigation Controls */}
          <nav className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button 
              onClick={() => setActiveTab("shop")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition whitespace-nowrap ${activeTab === "shop" ? "bg-gray-900 text-white shadow" : "text-white hover:bg-orange-600"}`}
            >
              Marketplace Catalogs
            </button>
            <button 
              onClick={() => setActiveTab("rfq-board")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition whitespace-nowrap flex items-center gap-1 ${activeTab === "rfq-board" ? "bg-gray-900 text-white shadow" : "text-white hover:bg-orange-600"}`}
            >
              <FileText className="w-3.5 h-3.5 text-orange-300" /> Global RFQ Board
            </button>
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition whitespace-nowrap flex items-center gap-1 ${activeTab === "dashboard" ? "bg-gray-900 text-white shadow" : "text-white hover:bg-orange-600"}`}
            >
              <Building className="w-3.5 h-3.5" /> Procurement Console
            </button>
            <button 
              onClick={() => setActiveTab("admin")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition whitespace-nowrap flex items-center gap-1 ${activeTab === "admin" ? "bg-gray-900 text-white shadow" : "text-white hover:bg-orange-600"}`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-orange-200" /> Control Desk
            </button>
            
            {user ? (
              <button onClick={handleLogout} className="bg-gray-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-700 transition">Logout</button>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="bg-white text-orange-600 px-3 py-1.5 rounded-lg text-xs font-black hover:bg-gray-50 transition shadow-sm">Sign In</button>
            )}
          </nav>

        </div>
      </header>

      {/* RENDER SWITCH BOARD FRAMEWORKS */}
      {activeTab === "rfq-board" ? (
        <main className="max-w-4xl mx-auto px-4 py-10 print:hidden">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8">
            <div className="border-b pb-4 mb-6">
              <span className="text-xs font-extrabold text-orange-600 uppercase tracking-widest">Global Sourcing Desk</span>
              <h2 className="text-2xl font-black text-gray-900 mt-0.5">Submit Multi-Item Supply Requirements</h2>
              <p className="text-xs text-gray-500 mt-1">Specify custom compounds or multi-SKU layouts. Agents respond within 120 minutes.</p>
            </div>

            <form onSubmit={submitGlobalRfqBoardForm} className="space-y-4">
              <div>
                <label className="text-xs font-black text-gray-700 block mb-1">Comprehensive Manifest Requirements Details</label>
                <textarea
                  required
                  placeholder="Example: Sourcing 400 bags of Portland Cement grade 42.5R..."
                  className="w-full border border-gray-200 rounded-lg p-3 text-xs bg-gray-50 focus:bg-white focus:ring-1 focus:ring-orange-500 outline-none h-32 resize-none"
                  value={rfqForm.description}
                  onChange={(e) => setRfqForm({...rfqForm, description: e.target.value})}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">Target Procurement Cap Budget ({currency})</label>
                  <input
                    type="text"
                    placeholder="e.g. 500,000"
                    className="w-full border border-gray-200 p-2.5 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 bg-gray-50"
                    value={rfqForm.targetBudget}
                    onChange={(e) => setRfqForm({...rfqForm, targetBudget: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">Project Site Urgency Windows</label>
                  <select
                    className="w-full border border-gray-200 p-2.5 text-xs rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    value={rfqForm.urgency}
                    onChange={(e) => setRfqForm({...rfqForm, urgency: e.target.value})}
                  >
                    <option>Urgent Dispatch Needed (Within 24 Hours)</option>
                    <option>Standard (3-5 Days)</option>
                    <option>Forward Sourcing Planning (30+ Days)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-black py-3 rounded-lg uppercase tracking-wider transition shadow-md">
                Broadcast Manifest to Supplier Engine
              </button>
            </form>
          </div>
        </main>
      ) : activeTab === "dashboard" ? (
        <main className="max-w-7xl mx-auto px-4 py-10 print:hidden">
          <div className="bg-white rounded-xl shadow-md border p-6">
            <h2 className="text-xl font-black text-gray-900 border-b pb-2 mb-4">Enterprise Buyer Dashboard</h2>
            <p className="text-xs text-gray-500">Corporate Account: <span className="font-bold text-gray-700">{user?.email || "Guest Procurement Profile"}</span></p>
            
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Historical Proforma Manifest Logs</h3>
              {orders.length === 0 ? (
                <p className="text-xs text-gray-400 bg-gray-50 p-4 rounded-lg border border-dashed">No execution statements logged.</p>
              ) : (
                <div className="space-y-2">
                  {orders.map(o => (
                    <div key={o.id} className="p-4 border rounded-xl bg-gray-50/50 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-black text-gray-900">{o.id} ({o.date})</p>
                        <p className="text-gray-500 mt-0.5">{o.items}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900">{formatPrice(o.total)}</p>
                        <span className="inline-block px-2 py-0.5 mt-1 rounded bg-orange-100 text-orange-700 text-[9px] font-black uppercase tracking-wide">{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      ) : activeTab === "admin" ? (
        /* CORE ADMIN INVENTORY CONTROLLER PANEL */
        <main className="max-w-7xl mx-auto px-4 py-8 print:hidden">
          <div className="border-b pb-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-gray-900 flex items-center gap-2">
                TONY'S GLOBAL <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded uppercase font-black tracking-wider">Control Console</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Real-time inventory configurations, price tiers, and structural catalog mapping utilities.</p>
            </div>
            <button 
              onClick={fetchProducts} 
              className="flex items-center gap-1.5 bg-white border text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs hover:bg-gray-50 text-gray-700 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-orange-500" : ""}`} /> Sync Database Tables
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm border p-5 h-fit sticky top-24">
              <div className="border-b pb-3 mb-4 flex justify-between items-center">
                <h3 className="font-black text-xs text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-orange-500" /> {isAdminEditing ? "Modify Stock Entry" : "Register Industrial Item"}
                </h3>
                {isAdminEditing && (
                  <button onClick={resetAdminForm} className="text-gray-400 hover:text-gray-600 p-1 rounded-md bg-gray-50">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <form onSubmit={handleAdminFormSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">Item Title / Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Premium Blue Triangle Cement 42.5R"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-gray-50 focus:bg-white focus:ring-1 focus:ring-orange-500 outline-none transition"
                    value={adminForm.name}
                    onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">Trade Bracket</label>
                    <select
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-gray-50 text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500 transition"
                      value={adminForm.category}
                      onChange={(e) => setAdminForm({ ...adminForm, category: e.target.value })}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">Base Price (KES)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-2.5 text-[10px] font-black text-gray-400">KES</span>
                      <input
                        type="number"
                        required
                        placeholder="1450"
                        className="w-full border border-gray-200 rounded-lg pl-9 pr-2.5 py-2.5 text-xs bg-gray-50 focus:bg-white focus:ring-1 focus:ring-orange-500 outline-none transition font-medium"
                        value={adminForm.price}
                        onChange={(e) => setAdminForm({ ...adminForm, price: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">Image URL (Optional)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-2.5 text-gray-400"><ImageIcon className="w-3.5 h-3.5" /></span>
                    <input
                      type="url"
                      placeholder="https://your-storage-bucket.com/item.jpg"
                      className="w-full border border-gray-200 rounded-lg pl-8 pr-2.5 py-2.5 text-xs bg-gray-50 focus:bg-white focus:ring-1 focus:ring-orange-500 outline-none transition"
                      value={adminForm.image_url}
                      onChange={(e) => setAdminForm({ ...adminForm, image_url: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className={`w-full text-white text-xs font-black py-2.5 rounded-lg uppercase tracking-wider shadow-md transition flex justify-center items-center gap-1.5 ${
                    isAdminEditing ? "bg-amber-500 hover:bg-amber-600" : "bg-orange-500 hover:bg-orange-600"
                  } disabled:opacity-50`}
                >
                  {isAdminEditing ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  {isAdminEditing ? "Commit Entry Changes" : "Deploy Item Live"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2">
              {loading ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed">
                  <RefreshCw className="animate-spin h-6 w-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-400">Querying Supabase Ledger Repositories...</p>
                </div>
              ) : inventory.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed text-gray-400 text-xs font-medium">
                  No products registered in the database.
                </div>
              ) : (
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-900 text-gray-300 text-[10px] font-black uppercase tracking-wider border-b border-gray-800">
                          <th className="py-3 px-4">Item Specifications</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Standard Base Rate</th>
                          <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-xs">
                        {inventory.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50/70 transition">
                            <td className="py-3.5 px-4 font-bold text-gray-900">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0 border overflow-hidden relative">
                                  {product.image_url ? (
                                    <Image src={product.image_url} alt="" fill className="object-cover" />
                                  ) : (
                                    <Package className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                                <span className="truncate max-w-[180px] sm:max-w-xs">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="bg-orange-50 text-orange-700 font-extrabold px-2 py-0.5 rounded text-[10px] border border-orange-100 uppercase tracking-wide">
                                {product.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-gray-700">
                              KES {product.price.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center justify-center space-x-1.5">
                                <button
                                  onClick={() => enterAdminEditMode(product)}
                                  disabled={actionLoading}
                                  className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded border transition"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => executeAdminDelete(product.id)}
                                  disabled={actionLoading}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded border transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      ) : (
        /* STANDARD PUBLIC SHOP VIEW */
        <>
          <section className="w-full h-40 relative bg-gray-900 overflow-hidden shadow-inner flex items-center print:hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-30 scale-105 transition duration-1000" style={{ backgroundImage: `url(${banners[bannerIndex].image})` }} />
            <div className="max-w-7xl mx-auto px-6 relative z-10 text-white">
              <h2 className="text-2xl md:text-3xl font-black max-w-xl leading-tight">{banners[bannerIndex].text}</h2>
              <p className="text-xs text-orange-300 font-bold mt-1 tracking-wide uppercase">Integrated Volume Matrices Configured System-Wide</p>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-4 py-8 print:hidden">
            <div className="flex flex-col lg:flex-row gap-6">
              
              <aside className="w-full lg:w-60 shrink-0 bg-white border border-gray-100 p-4 rounded-xl shadow-sm h-fit space-y-6">
                <div className="border-b pb-2 flex justify-between items-center">
                  <h3 className="font-black text-xs text-gray-900 uppercase tracking-wider">Sourcing Parameters</h3>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Trade Bracket</h4>
                  <div className="space-y-0.5">
                    {["All", "Cement", "Drills", "Paint", "Electrical", "Plumbing"].map(cat => (
                      <button
                        key={cat}
                        onClick={() => { setCategory(cat); setPage(1); }}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs transition flex justify-between items-center ${category === cat ? "bg-orange-50 font-black text-orange-600" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        <span>{cat}</span>
                        {category === cat && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Price Threshold ({currency})</h4>
                  <div className="flex space-x-1">
                    <input type="number" placeholder="Min" className="w-full border p-1.5 text-xs rounded bg-gray-50 outline-none focus:ring-1 focus:ring-orange-500" value={minPrice} onChange={e=>setMinPrice(e.target.value)}/>
                    <input type="number" placeholder="Max" className="w-full border p-1.5 text-xs rounded bg-gray-50 outline-none focus:ring-1 focus:ring-orange-500" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)}/>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Sort Sequence</h4>
                  <select className="w-full border p-2 text-xs rounded bg-gray-50 text-gray-700 outline-none" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                    <option value="created_at-desc">Default Matrix</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </aside>

              <div className="flex-1">
                {loading ? (
                  <div className="text-center py-24 bg-white rounded-xl border border-gray-100">
                    <RefreshCw className="animate-spin h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-gray-400">Synchronizing Live Supabase B2B Warehouses...</p>
                  </div>
                ) : inventory.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-xl border text-gray-400 text-xs font-medium">No matching factory-direct components verified.</div>
                ) : (
                  <>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {inventory.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col group relative shadow-xs hover:shadow-md transition">
                          <div className="absolute top-2 right-2 bg-gray-900/80 backdrop-blur-xs text-orange-400 text-[8px] font-black px-1.5 py-0.5 rounded z-10 tracking-wider uppercase">
                            Up to 18% Bulk Off
                          </div>

                          <div className="h-36 w-full bg-gray-50 rounded-lg overflow-hidden relative flex items-center justify-center mb-2">
                            {product.image_url ? (
                              <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                            ) : (
                              <Package className="w-8 h-8 text-gray-300" />
                            )}
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <button onClick={() => setSelectedProduct(product)} className="bg-white text-gray-900 text-[10px] font-black px-2.5 py-1.5 rounded shadow flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5 text-orange-500" /> Specifications
                              </button>
                            </div>
                          </div>

                          <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{product.category}</span>
                          <h4 className="font-bold text-xs text-gray-900 truncate mt-0.5">{product.name}</h4>
                          
                          <div className="mt-2 bg-gray-50 rounded p-1.5 border border-gray-100 text-[10px] space-y-0.5">
                            <div className="flex justify-between text-gray-500"><span>1-49 units:</span><span className="font-bold text-gray-700">{formatPrice(product.price)}</span></div>
                            <div className="flex justify-between text-orange-600 font-medium"><span>50-199 units:</span><span>{formatPrice(product.price * 0.9)}</span></div>
                            <div className="flex justify-between text-green-600 font-bold"><span>200+ units (FOB):</span><span>{formatPrice(product.price * 0.82)}</span></div>
                          </div>

                          <button
                            onClick={() => addToCart(product)}
                            className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-black py-2 rounded transition flex justify-center items-center gap-1 shadow-sm"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" /> Initialize Supply
                          </button>
                        </div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="mt-8 flex justify-center items-center space-x-1.5 bg-white p-2 border rounded-xl w-fit mx-auto shadow-xs">
                        <button onClick={() => setPage(p => Math.max(p-1, 1))} disabled={page===1} className="p-1.5 rounded bg-gray-50 disabled:opacity-30"><ChevronLeft className="w-3.5 h-3.5"/></button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                          <button key={num} onClick={() => setPage(num)} className={`w-7 h-7 rounded text-xs font-black transition ${page === num ? "bg-orange-500 text-white" : "bg-gray-50 text-gray-600"}`}>{num}</button>
                        ))}
                        <button onClick={() => setPage(p => Math.min(p+1, totalPages))} disabled={page===totalPages} className="p-1.5 rounded bg-gray-50 disabled:opacity-30"><ChevronRight className="w-3.5 h-3.5"/></button>
                      </div>
                    )}
                  </>
                )}
              </div>

            </div>
          </section>
        </>
      )}

      {/* OVERLAY FLOATING CART SUMMARY WITH FREIGHT CONTROLS */}
      {showCartPreview && cart.length > 0 && (
        <div className="fixed right-4 bottom-4 bg-white border border-gray-200 rounded-xl shadow-2xl max-w-sm w-full p-4 z-50 animate-slideUp print:hidden">
          <div className="font-black text-xs uppercase tracking-wider text-gray-900 border-b pb-2 mb-3 flex justify-between items-center">
            <span className="flex items-center gap-1"><ShoppingCart className="w-4 h-4 text-orange-500" /> Active Supply Manifest</span>
            <button onClick={() => setShowCartPreview(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>

          <div className="max-h-36 overflow-y-auto divide-y pr-1 space-y-2">
            {cart.map(item => {
              const activeUnitPrice = getTieredUnitPrice(item, item.quantity);
              const totalDiscountThresholdReached = item.quantity >= 200 ? "Bulk (18% Off)" : item.quantity >= 50 ? "Volume (10% Off)" : "Base Tier";
              
              return (
                <div key={item.id} className="pt-2 first:pt-0 text-xs">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-gray-800 truncate max-w-[65%]">{item.name}</p>
                    <span className="text-[9px] px-1 bg-orange-100 text-orange-800 rounded font-black uppercase tracking-wide">{totalDiscountThresholdReached}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-gray-500">
                    <span>{formatPrice(activeUnitPrice)} unit cost</span>
                    <div className="flex items-center space-x-1.5 bg-gray-50 p-0.5 rounded border border-gray-100">
                      <button onClick={() => updateCartQuantity(item.id, -1)} className="px-1 text-gray-400 font-bold hover:text-red-500">-</button>
                      <span className="font-black text-gray-900">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, 1)} className="px-1 text-gray-400 font-bold hover:text-green-500">+</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t bg-gray-50 p-2 rounded-lg border">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-wider block mb-1">Select Freight Dispatch Hub</label>
            <select 
              value={selectedZone} 
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full bg-white text-xs border rounded p-1.5 font-bold outline-none text-gray-800 focus:ring-1 focus:ring-orange-500"
            >
              {Object.keys(logisticsZones).map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>

          <div className="mt-3 text-xs space-y-1 bg-gray-50/50 p-2 rounded border border-dashed text-gray-600">
            <div className="flex justify-between"><span>Cargo Payload Mass:</span><span className="font-bold text-gray-900">{cartTotalWeight} KG</span></div>
            <div className="flex justify-between"><span>Net Goods Cost:</span><span className="font-bold text-gray-900">{formatPrice(totalItemsPriceKES)}</span></div>
            <div className="flex justify-between"><span>Freight Surcharge:</span><span className="font-bold text-gray-900">{formatPrice(freightCostKES)}</span></div>
            <div className="flex justify-between border-t pt-1 font-black text-gray-900 text-sm"><span>Invoice Gross:</span><span className="text-orange-600">{formatPrice(overallInvoiceTotalKES)}</span></div>
          </div>

          <button onClick={sendWhatsAppOrder} className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 text-xs rounded-lg uppercase tracking-wider transition flex justify-center items-center gap-1.5 shadow">
            <Phone className="w-4 h-4" /> Dispatch Via WhatsApp
          </button>
        </div>
      )}

    </div>
  );
}