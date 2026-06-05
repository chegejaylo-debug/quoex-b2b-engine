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
  const [sortBy, setSortBy] = useState("id-desc");
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

  const triggerNotification = (text: string) => {
  // @ts-ignore
  setNotification(text as any);
  setTimeout(() => setNotification(null), 4000);
};

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
    { id: 1, sender: "agent", text: "Welcome to QUOEX B2B Sourcing Desk. Let us know if you need customized container volume discount pricing charts.", time: "Just Now" }
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
    const dynamicMessage = `*COMMERCIAL PURCHASE REQUEST: QUOEX B2B*\n\n*Logistics Destination:* ${selectedZone}\n*Consignee Profile:* ${profile?.name || user?.email || "Verified Procurement Partner"}\n\n*Manifest Breakdowns:*\n${itemsMarkdown}\n\n*Payload Mass Metrics:* ${cartTotalWeight} KG\n*Net Wholesale Cost:* ${formatPrice(totalItemsPriceKES)}\n*Freight Surcharge:* ${formatPrice(freightCostKES)}\n*Corporate VAT (16%):* ${formatPrice(aggregateVatKES)}\n*Gross Payable Total:* ${formatPrice(overallInvoiceTotalKES)}\n\n_Auto-generated invoice pipeline._`;
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
              <p className="text-[9px] text-orange-100 font-bold tracking-widest uppercase">INTELLIGENT B2B PROCUREMENT ENGINE</p>
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
                QUOEX B2BL <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded uppercase font-black tracking-wider">Control Console</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Real-time inventory configurations, price tiers, and structural catalog mapping utilities.</p>
            </div>
           <button
  onClick={fetchProducts}
  className="flex items-center gap-1.5 bg-white border text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs hover:bg-gray-50 text-gray-700 transition"
>
  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-orange-500" : ""}`} /> 
  Sync Database Tables
</button>

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
                                <span>{product.name}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4"><span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-bold text-[10px] uppercase">{product.category}</span></td>
                            <td className="py-3.5 px-4 font-extrabold text-gray-900">{formatPrice(product.price)}</td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center justify-center gap-1.5">
                                <button onClick={() => enterAdminEditMode(product)} className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"><Edit2 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => executeAdminDelete(product.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-3.5 h-3.5" /></button>
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
      
        
        {/* CORE MARKETPLACE B2B BROWSING ENGINE (DEFAULT) */}
        <main className="max-w-7xl mx-auto px-4 py-6">

          
          {/* HERO CORPORATE MARKETING BANNER HUB */}
          <div className="w-full h-44 sm:h-56 bg-gray-900 rounded-2xl relative overflow-hidden mb-8 shadow-md border border-gray-800 flex items-center px-6 md:px-12">
            <div className="z-10 max-w-xl">
              <span className="bg-orange-500 text-white text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded shadow">Global Distribution Channels</span>
              <h2 className="text-lg sm:text-2xl font-black text-white mt-2 leading-tight transition-all duration-500">{banners[bannerIndex].text}</h2>
              <div className="flex items-center gap-4 mt-4">
                <button onClick={() => setActiveTab("rfq-board")} className="bg-white text-gray-900 px-4 py-2 rounded-lg text-xs font-black hover:bg-orange-50 transition shadow-md flex items-center gap-1">Instant RFQ Sourcing <ArrowRight className="w-3 h-3" /></button>
                <span className="text-[10px] text-gray-400 font-bold hidden sm:inline-block">✓ Direct Factory Delivery Agreements Matrix</span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-orange-600/20 to-transparent hidden md:block" />
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* SIDEBAR ADVANCED DISCOVERY FILTER ENGINE */}
            <aside className="space-y-6 lg:block hidden">
              <div className="bg-white rounded-xl border p-5 shadow-sm">
                <h3 className="font-black text-xs text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-1.5"><Filter className="w-3.5 h-3.5 text-orange-500" /> Filter Criteria</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-black text-gray-700 block mb-1 uppercase tracking-wider">Industrial Categories</label>
                    <div className="space-y-1">
                      {["All", ...categories].map((cat) => (
                        <button 
                          key={cat} 
                          onClick={() => { setCategory(cat); setPage(1); }}
                          className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition font-medium ${category === cat ? "bg-orange-50 text-orange-700 font-black" : "text-gray-600 hover:bg-gray-50"}`}
                        >
                          {cat} {cat === "All" ? "Inventory" : "Supplies"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <label className="text-[11px] font-black text-gray-700 block mb-1 uppercase tracking-wider">Unit Pricing Caps ({currency})</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" placeholder="Min" className="w-full bg-gray-50 border p-2 text-xs rounded-lg focus:outline-none" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1); }} />
                      <input type="number" placeholder="Max" className="w-full bg-gray-50 border p-2 text-xs rounded-lg focus:outline-none" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <label className="text-[11px] font-black text-gray-700 block mb-1 uppercase tracking-wider">Database Indexing</label>
                    <select className="w-full bg-gray-50 border p-2 text-xs rounded-lg text-gray-600 focus:outline-none font-medium" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
                      <option value="created_at-desc">Newest Components First</option>
                      <option value="price-asc">Base Rate: Low to High</option>
                      <option value="price-desc">Base Rate: High to Low</option>
                      <option value="name-asc">Alphabetical: A-Z</option>
                    </select>
                  </div>
                </div>
              </div>
            </aside>

            {/* DYNAMIC PRODUCT GRID INTERFACES */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border shadow-xs lg:hidden">
                <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1.5 text-xs font-black text-gray-700 bg-gray-100 px-3 py-2 rounded-lg">
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Discovery Setups
                </button>
                <span className="text-xs font-bold text-gray-500">{totalCount} Pipeline Records Loaded</span>
              </div>

              {/* MOBILE DISCOVERY PANEL OVERLAYS */}
              {showFilters && (
                <div className="bg-white rounded-xl border p-4 space-y-4 shadow-sm lg:hidden animate-fadeIn">
                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">Supplies Category</label>
                    <div className="flex flex-wrap gap-1.5">
                      {["All", ...categories].map((cat) => (
                        <button key={cat} onClick={() => { setCategory(cat); setPage(1); }} className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${category === cat ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}>{cat}</button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase">Min Price</label>
                      <input type="number" className="w-full border p-2 text-xs bg-gray-50 rounded-md" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase">Max Price</label>
                      <input type="number" className="w-full border p-2 text-xs bg-gray-50 rounded-md" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white border rounded-xl p-4 space-y-3 animate-pulse">
                      <div className="w-full h-32 bg-gray-200 rounded-lg" />
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-medium">
                  Connection Pipeline Broken: {error}
                </div>
              ) : inventory.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed text-gray-400 text-xs font-medium">
                  No catalog items found matching selected matrix fields.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {inventory.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl border shadow-xs hover:shadow-md transition overflow-hidden flex flex-col group relative">
                      <div className="w-full h-36 bg-gray-50 relative border-b overflow-hidden shrink-0">
                        {product.image_url ? (
                          <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-105 transition duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300"><Package className="w-8 h-8" /></div>
                        )}
                        <button 
                          onClick={() => setSelectedProduct(product)}
                          className="absolute bottom-2 right-2 bg-gray-900/80 backdrop-blur-xs text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition shadow text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect
                        </button>
                      </div>

                      <div className="p-3.5 flex flex-col flex-grow justify-between space-y-2">
                        <div>
                          <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded uppercase tracking-wider">{product.category}</span>
                          <h4 className="font-bold text-xs text-gray-800 line-clamp-2 mt-1 min-h-[32px]">{product.name}</h4>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <div>
                            <p className="text-xs font-black text-gray-900">{formatPrice(getTieredUnitPrice(product, 1))}</p>
                            <p className="text-[9px] text-gray-400 font-medium">1-49 Units Base</p>
                          </div>
                          <div className="grid grid-cols-2 gap-1 border-t pt-1.5 text-[9px] text-gray-500">
                            <div>
                              <p className="font-extrabold text-gray-700">{formatPrice(getTieredUnitPrice(product, 50))}</p>
                              <p>50+ Units Tier</p>
                            </div>
                            <div className="border-l pl-1">
                              <p className="font-extrabold text-orange-600">{formatPrice(getTieredUnitPrice(product, 200))}</p>
                              <p>200+ Container</p>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => addToCart(product)}
                          className="w-full bg-gray-900 hover:bg-orange-500 text-white text-[10px] font-black py-2 rounded-lg transition uppercase tracking-wider shadow-xs"
                        >
                          Queue Cargo Bundle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* INTERACTIVE COMPONENT PAGINATION HUD */}
              {totalPages > 1 && activeTab !== "admin" && (
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-xs font-bold text-gray-400">Page {page} of {totalPages} Blocks</span>
                  <div className="flex gap-1.5">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 border rounded-lg bg-white disabled:opacity-40 text-gray-600 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 border rounded-lg bg-white disabled:opacity-40 text-gray-600 hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </main>
      )}

      {/* DETAILED HIGH-TIER INSPECTOR PRODUCT SPEC MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn print:hidden">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col md:flex-row animate-scaleUp">
            <div className="w-full md:w-1/2 bg-gray-50 relative h-48 md:h-auto border-b md:border-b-0 md:border-r">
              {selectedProduct.image_url ? (
                <Image src={selectedProduct.image_url} alt="" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300"><Package className="w-12 h-12" /></div>
              )}
            </div>
            <div className="p-6 md:w-1/2 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="bg-gray-900 text-orange-400 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">{selectedProduct.category} Material</span>
                  <button onClick={() => { setSelectedProduct(null); setSingleRfqMessage(""); }} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                </div>
                <h3 className="text-lg font-black text-gray-900 mt-2">{selectedProduct.name}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5 font-medium">B2B Tracking Identifier: SKU-{selectedProduct.id?.slice(0,8).toUpperCase()}</p>
                
                <div className="mt-4 bg-gray-50 rounded-xl p-3 border space-y-2 text-xs">
                  <p className="font-black text-[10px] text-gray-400 uppercase tracking-wider">Wholesale Bracket Pricing Layouts</p>
                  <div className="flex justify-between items-center"><span>1 - 49 Units (Retail)</span><span className="font-extrabold text-gray-900">{formatPrice(getTieredUnitPrice(selectedProduct, 1))}</span></div>
                  <div className="flex justify-between items-center text-gray-600"><span>50 - 199 Units (10% Off)</span><span className="font-bold text-gray-900">{formatPrice(getTieredUnitPrice(selectedProduct, 50))}</span></div>
                  <div className="flex justify-between items-center text-orange-600 font-bold"><span>200+ Units (18% Container)</span><span className="font-black">{formatPrice(getTieredUnitPrice(selectedProduct, 200))}</span></div>
                </div>

                <div className="mt-3 text-[11px] text-gray-500 space-y-1">
                  <p>• Estimated single unit mass payload: ~{getProductWeight(selectedProduct)} KG</p>
                  <p>• Inspection protocols: Trade Assurance Covered via Tony's Fleet</p>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <button 
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-black py-2.5 rounded-lg uppercase tracking-wider shadow-md transition"
                >
                  Allocate Cargo Mass To Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING PROCUREMENT CART DOCK UTILITY OVERLAY */}
      {cart.length > 0 && showCartPreview && (
        <div className="fixed top-0 bottom-0 right-0 w-full max-w-md bg-white shadow-2xl border-l z-50 flex flex-col justify-between animate-slideLeft print:hidden">
          <div className="p-4 border-b bg-gray-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-orange-400" />
              <h3 className="font-black text-xs uppercase tracking-wider">Active Procurement Manifest Container</h3>
            </div>
            <button onClick={() => setShowCartPreview(false)} className="text-gray-400 hover:text-white p-1 rounded-md bg-gray-800"><X className="w-4 h-4" /></button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-3 divide-y divide-gray-100">
            {cart.map((item) => {
              const appliedUnitPrice = getTieredUnitPrice(item, item.quantity);
              return (
                <div key={item.id} className="pt-3 flex justify-between items-start gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="font-black text-gray-900 line-clamp-1">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Mass Parameter Calculation: {getProductWeight(item) * item.quantity} KG Total</p>
                    <div className="flex items-center bg-gray-100 rounded border w-fit">
                      <button onClick={() => updateCartQuantity(item.id, -1)} className="px-2 py-0.5 text-gray-600 hover:bg-gray-200 transition font-bold">-</button>
                      <span className="px-2.5 text-gray-800 font-black text-[11px] bg-white border-x">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, 1)} className="px-2 py-0.5 text-gray-600 hover:bg-gray-200 transition font-bold">+</button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-gray-900">{formatPrice(appliedUnitPrice * item.quantity)}</p>
                    <p className="text-[9px] text-gray-400 font-bold">@{formatPrice(appliedUnitPrice)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DYNAMIC REAL-TIME LOGISTICS COST CALCULATION BLOCK */}
          <div className="p-4 bg-gray-50 border-t space-y-3.5">
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase block mb-1">Corporate Dispatch Logistics Destination</label>
              <select 
                className="w-full bg-white border rounded-lg p-2 text-xs text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-orange-500"
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
              >
                {Object.keys(logisticsZones).map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 text-xs border-t pt-3">
              <div className="flex justify-between text-gray-500"><span>Aggregate Net Load Mass:</span><span className="font-bold text-gray-700">{cartTotalWeight} KG</span></div>
              <div className="flex justify-between text-gray-500"><span>Wholesale Item Subtotal:</span><span className="font-bold text-gray-900">{formatPrice(totalItemsPriceKES)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Freight Fleet Surcharge:</span><span className="font-bold text-gray-900">{formatPrice(freightCostKES)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Corporate VAT Breakdown (16%):</span><span className="font-bold text-gray-900">{formatPrice(aggregateVatKES)}</span></div>
              <div className="flex justify-between text-sm font-black text-gray-900 border-t pt-2 text-orange-600"><span>Gross Invoice Total:</span><span>{formatPrice(overallInvoiceTotalKES)}</span></div>
            </div>

            <button 
              onClick={sendWhatsAppOrder}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs py-3 rounded-lg uppercase tracking-wider shadow-md hover:from-emerald-700 hover:to-teal-700 transition flex justify-center items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Dispatch Manifest to WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* PERSISTENT FLOATING REVENUE CHAT INTERFACE HUB */}
      <div className="fixed bottom-4 right-4 z-40 print:hidden">
        {showChat ? (
          <div className="bg-white w-80 sm:w-96 h-96 rounded-2xl shadow-2xl border flex flex-col justify-between overflow-hidden animate-scaleUp">
            <div className="bg-gray-900 p-3.5 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h4 className="font-black text-xs uppercase tracking-wider">Tony's Sourcing Helpdesk</h4>
                  <p className="text-[9px] text-gray-400">Average response matrix: <span className="text-orange-400 font-bold">Instant</span></p>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-gray-50/50 text-xs">
              {chatMessages.map(m => (
                <div key={m.id} className={`flex ${m.sender === "buyer" ? "justify-end" : "justify-start"}`}>
                  <div className={`p-3 rounded-xl max-w-[80%] shadow-xs leading-relaxed ${m.sender === "buyer" ? "bg-orange-500 text-white rounded-br-none" : "bg-white text-gray-800 border rounded-bl-none"}`}>
                    <p className="font-medium">{m.text}</p>
                    <span className="block text-[8px] mt-1 text-right opacity-70 font-bold uppercase tracking-widest">{m.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={executeChatMessageSend} className="p-2 border-t bg-white flex items-center gap-1.5">
              <input 
                type="text" 
                placeholder="Inquire about custom pricing slots..." 
                className="w-full bg-gray-50 p-2 text-xs rounded-lg focus:outline-none"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
              />
              <button type="submit" className="bg-gray-900 text-white p-2 rounded-lg hover:bg-orange-500 transition"><Send className="w-3.5 h-3.5" /></button>
            </form>
          </div>
        ) : (
          <button 
            onClick={() => setShowChat(true)}
            className="bg-gray-900 text-white p-3.5 rounded-full shadow-2xl hover:bg-orange-500 transition flex items-center gap-2 group border border-gray-800"
          >
            <MessageSquare className="w-5 h-5 text-orange-400" />
            <span className="text-xs font-black uppercase tracking-wider pr-1 max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300">Live Agent Sourcing Desk</span>
          </button>
        )}
      </div>

    </div>
  );
}