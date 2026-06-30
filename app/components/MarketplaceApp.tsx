"use client";

/**
 * MarketplaceApp — Tony's Global B2B Marketplace
 * This is the full live demo of the B2B platform built by Quoex Technologies.
 * Accessible at /marketplace from the main site.
 */

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  ShoppingCart, Phone, ShieldCheck, Truck, Search, Check, RefreshCw, X,
  Eye, FileText, Package, ChevronLeft, ChevronRight, SlidersHorizontal,
  CheckCircle, ImageIcon, Plus, Edit2, Trash2, Save, Building, CreditCard,
  Share2, Lock, Navigation, Award, Moon, Sun, Heart, Star, TrendingUp,
  Zap, Sparkles, Upload, Menu,
} from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";

const OrderTrackingMap = dynamic(() => import("@/app/components/OrderTrackingMap"), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">Loading map...</div>,
});
const SellerRankings = dynamic(() => import("@/app/components/SellerRankings"), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">Loading rankings...</div>,
});

import { ProductCardSkeleton } from "@/app/components/LoadingSkeleton";
import { OrderTrackingTimeline } from "@/app/components/OrderTrackingTimeline";
import { BulkOrderUpload } from "@/app/components/BulkOrderUpload";
import { RFQBiddingSystem } from "@/app/components/RFQBiddingSystem";

type Product = { id: string; name: string; category: string; price: number; image_url?: string | null; created_at?: string };
type CartItem = Product & { quantity: number };
type Order = { id: string; date: string; total: number; status: string; items: string };
type ChatMessage = { id: number; sender: "agent" | "buyer"; text: string; time: string };
type UserProfile = { id?: string; name?: string | null; email?: string | null };
type AdminFormState = { id: string | null; name: string; category: string; price: string; image_url: string };

export default function MarketplaceApp() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [currency, setCurrency] = useState("KES");
  const exchangeRate = 0.0077;
  const [selectedZone, setSelectedZone] = useState("Nyeri Hub");
  const logisticsZones: Record<string, { baseFee: number; costPerKg: number }> = {
    "Nyeri Hub": { baseFee: 0, costPerKg: 2 },
    "Karatina Terminal": { baseFee: 1500, costPerKg: 5 },
    "Othaya Depot": { baseFee: 1200, costPerKg: 4.5 },
    "Mukurweini Node": { baseFee: 1800, costPerKg: 6 },
    "Nairobi Cross-Dock": { baseFee: 5000, costPerKg: 12 },
  };
  const [user, setUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("shop");
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [adminForm, setAdminForm] = useState<AdminFormState>({ id: null, name: "", category: "Cement", price: "", image_url: "" });
  const [isAdminEditing, setIsAdminEditing] = useState(false);
  const categories = ["Cement", "Drills", "Paint", "Electrical", "Plumbing"];
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([{ id: 1, sender: "agent", text: "Welcome to Tony's Global. How can we help with your procurement?", time: "Now" }]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("stripe");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialPostText, setSocialPostText] = useState("");
  const [socialMediaUrls, setSocialMediaUrls] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["twitter"]);
  const [socialPosting, setSocialPosting] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [showWishlist, setShowWishlist] = useState(false);
  const [paymentTerms, setPaymentTerms] = useState("upfront");
  const [selectedWarehouse, setSelectedWarehouse] = useState("nyeri");
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const banners = [
    { id: 1, image: "/banner1.jpg", text: "Verified B2B Procurement Hub & Factory-Direct Logistics" },
    { id: 2, image: "/banner2.jpg", text: "Volume-Tiered Pricing Models Optimized For Regional Contractors" },
  ];
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const triggerNotification = (text: string) => { setNotification(text); setTimeout(() => setNotification(null), 4000); };
  const getTieredUnitPrice = (product: Product, quantity: number) => { const base = product.price; if (quantity >= 200) return base * 0.82; if (quantity >= 50) return base * 0.9; return base; };
  const getCreditFee = (total: number) => { if (paymentTerms === "net30") return total * 0.02; if (paymentTerms === "net60") return total * 0.04; if (paymentTerms === "net90") return total * 0.06; return 0; };
  const getDueDate = () => { const days = paymentTerms === "net30" ? 30 : paymentTerms === "net60" ? 60 : paymentTerms === "net90" ? 90 : 0; if (days === 0) return "Immediate"; const date = new Date(); date.setDate(date.getDate() + days); return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); };
  const getNextTierSavings = (product: Product, currentQuantity: number) => { const base = product.price; if (currentQuantity < 50) { return { quantity: 50 - currentQuantity, savings: 50 * (base * 0.9) - currentQuantity * base }; } if (currentQuantity < 200) { return { quantity: 200 - currentQuantity, savings: 200 * (base * 0.82) - currentQuantity * (base * 0.9) }; } return null; };
  const getProductWeight = (product: Product) => { if (product.category === "Cement") return 50; if (product.category === "Paint") return 20; return 2; };

  const warehouseInventory: Record<string, { name: string; region: string; stock: Set<string> }> = {
    nyeri: { name: "Nyeri Hub", region: "Central", stock: new Set() },
    karatina: { name: "Karatina Hub", region: "Central", stock: new Set() },
    nairobi: { name: "Nairobi Hub", region: "Nairobi", stock: new Set() },
    mombasa: { name: "Mombasa Hub", region: "Coastal", stock: new Set() },
  };

  useEffect(() => { const interval = setInterval(() => setBannerIndex((prev) => (prev + 1) % banners.length), 6000); return () => clearInterval(interval); }, [banners.length]);
  useEffect(() => { const handler = setTimeout(() => setDebouncedSearch(search), 400); return () => clearTimeout(handler); }, [search]);
  useEffect(() => { const localCart = localStorage.getItem("tonys_global_cart"); if (localCart) { try { setCart(JSON.parse(localCart)); } catch {} } }, []);
  useEffect(() => { localStorage.setItem("tonys_global_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null)); const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null)); return () => subscription?.unsubscribe(); }, []);
  useEffect(() => { if (user) { supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => setProfile(data as UserProfile)); setOrders([{ id: "ORD-2026-A", date: "2026-05-10", total: 145000, status: "Dispatched", items: "Blue Triangle Cement x120" }, { id: "ORD-2026-B", date: "2026-06-02", total: 38400, status: "Processing", items: "Weatherguard Paint x12" }]); } }, [user]);
  useEffect(() => { const saved = localStorage.getItem("darkMode"); if (saved) setDarkMode(JSON.parse(saved)); }, []);
  useEffect(() => { localStorage.setItem("darkMode", JSON.stringify(darkMode)); darkMode ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark"); }, [darkMode]);
  useEffect(() => { const saved = localStorage.getItem("wishlist"); if (saved) setWishlist(new Set(JSON.parse(saved))); }, []);
  useEffect(() => { localStorage.setItem("wishlist", JSON.stringify(Array.from(wishlist))); }, [wishlist]);
  const toggleWishlist = (id: string) => setWishlist((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

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
      if (activeTab !== "admin") query = query.range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
      const { data, error: err, count } = await query;
      if (err) throw err;
      setInventory((data ?? []) as Product[]);
      setTotalCount(count ?? 0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProducts(); }, [debouncedSearch, category, minPrice, maxPrice, sortBy, page, activeTab]);

  const addToCart = (product: Product) => { setCart((prev) => { const existing = prev.find((p) => p.id === product.id); if (existing) return prev.map((p) => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p); return [...prev, { ...product, quantity: 1 }]; }); setShowCartPreview(true); };
  const updateCartQuantity = (id: string, amount: number) => setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0));
  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setProfile(null); };

  const cartTotalWeight = cart.reduce((sum, item) => sum + getProductWeight(item) * item.quantity, 0);
  const totalItemsPriceKES = cart.reduce((sum, item) => sum + getTieredUnitPrice(item, item.quantity) * item.quantity, 0);
  const activeZoneConfig = logisticsZones[selectedZone] || { baseFee: 0, costPerKg: 0 };
  const freightCostKES = cart.length > 0 ? activeZoneConfig.baseFee + cartTotalWeight * activeZoneConfig.costPerKg : 0;
  const aggregateVatKES = (totalItemsPriceKES + freightCostKES) * 0.16;
  const overallInvoiceTotalKES = totalItemsPriceKES + freightCostKES + aggregateVatKES;

  const formatPrice = (priceInKES: number) => currency === "USD" ? `$${(priceInKES * exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD` : `KES ${priceInKES.toLocaleString()}`;

  const sendWhatsAppOrder = () => {
    const itemsText = cart.map((item) => `• ${item.name} x${item.quantity} @ ${formatPrice(getTieredUnitPrice(item, item.quantity))}`).join("\n");
    const msg = `*TONY'S GLOBAL ORDER*\n\n${itemsText}\n\n*Freight:* ${formatPrice(freightCostKES)}\n*VAT:* ${formatPrice(aggregateVatKES)}\n*Total:* ${formatPrice(overallInvoiceTotalKES)}`;
    window.open(`https://wa.me/254757528133?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault(); setPaymentProcessing(true);
    const endpoint = selectedPaymentMethod === "mpesa" ? "/api/payments/mpesa" : selectedPaymentMethod === "paypal" ? "/api/payments/paypal" : "/api/payments/stripe";
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: overallInvoiceTotalKES, currency, provider: selectedPaymentMethod, phoneNumber: paymentPhone || undefined }) });
      const data = await res.json();
      if (data.success) { triggerNotification(`Payment initiated via ${selectedPaymentMethod.toUpperCase()}`); setShowPaymentModal(false); setCart([]); }
      else triggerNotification(`Payment failed: ${data.error}`);
    } catch { triggerNotification("Payment error occurred"); } finally { setPaymentProcessing(false); }
  };

  const handleTrackOrder = async (orderId: string) => {
    setSelectedTrackingOrder(orderId); setShowTrackingModal(true); setTrackingLoading(true);
    try {
      const res = await fetch(`/api/tracking/${orderId}`);
      const data = await res.json();
      if (data.success) setTrackingData(data.tracking);
      else triggerNotification("Failed to fetch tracking");
    } catch { triggerNotification("Tracking error"); } finally { setTrackingLoading(false); }
  };

  const handleAdminFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!adminForm.name || !adminForm.price) return triggerNotification("Fill required fields.");
    setActionLoading(true);
    const payload = { name: adminForm.name, category: adminForm.category, price: parseFloat(adminForm.price), image_url: adminForm.image_url || null };
    try {
      if (isAdminEditing) { const { error } = await supabase.from("products").update(payload).eq("id", adminForm.id as string); if (error) throw error; triggerNotification("Product updated."); }
      else { const { error } = await supabase.from("products").insert([payload]); if (error) throw error; triggerNotification("Product added."); }
      setAdminForm({ id: null, name: "", category: "Cement", price: "", image_url: "" }); setIsAdminEditing(false); fetchProducts();
    } catch (err: unknown) { triggerNotification(`Error: ${err instanceof Error ? err.message : "unknown"}`); }
    finally { setActionLoading(false); }
  };

  const executeAdminDelete = async (id: string) => {
    if (!window.confirm("Delete this product permanently?")) return;
    setActionLoading(true);
    try { const { error } = await supabase.from("products").delete().eq("id", id); if (error) throw error; triggerNotification("Product deleted."); fetchProducts(); }
    catch (err: unknown) { triggerNotification(`Error: ${err instanceof Error ? err.message : "unknown"}`); }
    finally { setActionLoading(false); }
  };

  const getWarehouseStock = (productId: string) => {
    const allIds = inventory.map((p) => p.id);
    const inCurrent = allIds.indexOf(productId) < allIds.length * 0.8;
    return { inStock: inCurrent, transferRequired: !inCurrent };
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-slideUp max-w-[calc(100vw-2rem)]">
          <CheckCircle className="w-4 h-4 text-orange-400 shrink-0" /><span>{notification}</span>
        </div>
      )}

      {/* Top bar */}
      <div className="bg-gray-900 text-gray-400 text-[11px] py-2 px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 text-gray-300">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span>Secure Trade Assurance</span>
            <span className="hidden sm:inline ml-4 text-gray-400"><Truck className="w-3.5 h-3.5 inline mr-1" />Direct Site Freight</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrency(currency === "KES" ? "USD" : "KES")} className="bg-gray-800 border border-gray-700 text-orange-400 px-2.5 py-0.5 rounded text-[11px] font-bold">{currency}</button>
            <Link href="/" className="text-[#6C47FF] text-[11px] font-semibold hover:underline hidden sm:block">← Back to Quoex</Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-md py-3 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="cursor-pointer shrink-0" onClick={() => { setActiveTab("shop"); setCategory("All"); setMobileMenuOpen(false); }}>
              <h1 className="text-xl font-black text-white">TONY'S <span className="bg-gray-900 text-orange-400 px-2 py-0.5 rounded text-base">GLOBAL</span></h1>
              <p className="hidden sm:block text-[9px] text-orange-100 font-bold tracking-widest uppercase">Verified B2B Supply Network</p>
            </div>
            <div className="hidden md:flex flex-1 items-center bg-white rounded-lg overflow-hidden border border-orange-200">
              <div className="pl-3 text-gray-400"><Search className="w-4 h-4" /></div>
              <input type="text" placeholder="Search products..." className="w-full p-2.5 text-xs bg-transparent focus:outline-none text-gray-800" value={search} onChange={(e) => setSearch(e.target.value)} />
              {search && <button onClick={() => setSearch("")} className="p-2 text-gray-400"><X className="w-3.5 h-3.5" /></button>}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={() => setShowCartPreview(!showCartPreview)} className="relative p-2 bg-white/20 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-white" />
                {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-gray-900 text-orange-400 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cart.reduce((s,i) => s + i.quantity, 0)}</span>}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 bg-white/20 rounded-lg">
                {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </button>
            </div>
          </div>
          <div className="md:hidden mt-2">
            <div className="flex items-center bg-white rounded-lg overflow-hidden border border-orange-200">
              <div className="pl-3 text-gray-400"><Search className="w-4 h-4" /></div>
              <input type="text" placeholder="Search products..." className="w-full p-2.5 text-xs bg-transparent focus:outline-none text-gray-800" value={search} onChange={(e) => setSearch(e.target.value)} />
              {search && <button onClick={() => setSearch("")} className="p-2 text-gray-400"><X className="w-3.5 h-3.5" /></button>}
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-1 mt-2 overflow-x-auto scrollbar-none">
            {[["shop","Marketplace"],["rfq-board","RFQ Board"],["dashboard","Console"],["admin","Control Desk"],["rankings","Rankings"]].map(([tab, label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition ${activeTab === tab ? "bg-gray-900 text-white" : "text-white hover:bg-orange-600"}`}>{label}</button>
            ))}
            <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1.5 rounded-lg text-xs font-black text-white hover:bg-indigo-600 flex items-center gap-1 whitespace-nowrap">{darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}{darkMode ? "Light" : "Dark"}</button>
            {user ? <button onClick={handleLogout} className="bg-gray-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold">Logout</button> : <button onClick={() => setShowLoginModal(true)} className="bg-white text-orange-600 px-3 py-1.5 rounded-lg text-xs font-black">Sign In</button>}
          </nav>
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-2 border-t border-orange-400/50 pt-3 space-y-1 animate-slideUp">
              {[["shop","Marketplace"],["rfq-board","RFQ Board"],["dashboard","Console"],["admin","Control Desk"],["rankings","Rankings"]].map(([tab, label]) => (
                <button key={tab} onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); }} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold ${activeTab === tab ? "bg-gray-900 text-white" : "text-white hover:bg-orange-600"}`}>{label}</button>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Tab content */}
      {activeTab === "rfq-board" ? (
        <main className="max-w-7xl mx-auto px-4 py-10"><RFQBiddingSystem userRole={user ? "buyer" : null} /></main>
      ) : activeTab === "rankings" ? (
        <main className="max-w-7xl mx-auto px-4 py-8"><SellerRankings /></main>
      ) : activeTab === "dashboard" ? (
        <main className="max-w-7xl mx-auto px-4 py-10">
          <div className="bg-white rounded-xl shadow-md border p-6">
            <h2 className="text-xl font-black text-gray-900 border-b pb-2 mb-4">Buyer Dashboard</h2>
            <p className="text-xs text-gray-500">Account: <span className="font-bold text-gray-700">{user?.email || "Guest"}</span></p>
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Order History</h3>
              {orders.length === 0 ? <p className="text-xs text-gray-400 bg-gray-50 p-4 rounded-lg border border-dashed">No orders yet.</p> : (
                <div className="space-y-2">
                  {orders.map((o) => (
                    <div key={o.id} className="p-4 border rounded-xl bg-gray-50/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-xs">
                      <div><p className="font-black text-gray-900">{o.id} ({o.date})</p><p className="text-gray-500 mt-0.5">{o.items}</p></div>
                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <div className="sm:text-right"><p className="font-black text-gray-900">{formatPrice(o.total)}</p><span className="inline-block px-2 py-0.5 mt-1 rounded bg-orange-100 text-orange-700 text-[9px] font-black uppercase">{o.status}</span></div>
                        <button onClick={() => handleTrackOrder(o.id)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-1 shrink-0"><Navigation className="w-3 h-3" />Track</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      ) : activeTab === "admin" ? (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="border-b pb-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-black text-gray-900">Control Console</h2>
            <button onClick={fetchProducts} className="flex items-center gap-1.5 bg-white border text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-50"><RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-orange-500" : ""}`} />Sync</button>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm border p-5">
              <h3 className="font-black text-xs text-gray-900 uppercase tracking-wider flex items-center gap-1.5 mb-4"><Package className="w-4 h-4 text-orange-500" />{isAdminEditing ? "Edit Product" : "Add Product"}</h3>
              <form onSubmit={handleAdminFormSubmit} className="space-y-4">
                <input type="text" required placeholder="Product name" className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-orange-500" value={adminForm.name} onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} />
                <select className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-gray-50 outline-none" value={adminForm.category} onChange={(e) => setAdminForm({ ...adminForm, category: e.target.value })}>
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <input type="number" required placeholder="Price (KES)" className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-orange-500" value={adminForm.price} onChange={(e) => setAdminForm({ ...adminForm, price: e.target.value })} />
                <input type="url" placeholder="Image URL" className="w-full border border-gray-200 rounded-lg p-2.5 text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-orange-500" value={adminForm.image_url} onChange={(e) => setAdminForm({ ...adminForm, image_url: e.target.value })} />
                <button type="submit" disabled={actionLoading} className={`w-full text-white text-xs font-black py-2.5 rounded-lg uppercase tracking-wider flex justify-center items-center gap-1.5 ${isAdminEditing ? "bg-amber-500 hover:bg-amber-600" : "bg-orange-500 hover:bg-orange-600"} disabled:opacity-50`}>
                  {isAdminEditing ? <><Save className="w-3.5 h-3.5" />Update</> : <><Plus className="w-3.5 h-3.5" />Add Product</>}
                </button>
              </form>
            </div>
            <div className="lg:col-span-2">
              {loading ? <div className="text-center py-20 bg-white rounded-xl border border-dashed"><RefreshCw className="animate-spin h-6 w-6 text-orange-500 mx-auto mb-2" /></div> : (
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-900 text-gray-300 text-[10px] font-black uppercase">
                        <tr><th className="py-3 px-4">Product</th><th className="py-3 px-4">Category</th><th className="py-3 px-4">Price</th><th className="py-3 px-4 text-center">Actions</th></tr>
                      </thead>
                      <tbody className="divide-y">
                        {inventory.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50 transition">
                            <td className="py-3.5 px-4 font-bold text-gray-900">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0 border overflow-hidden relative">
                                  {product.image_url ? <Image src={product.image_url} alt={product.name} fill className="object-cover" /> : <Package className="w-4 h-4 text-gray-400" />}
                                </div>
                                <span className="truncate max-w-[160px]">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4"><span className="bg-orange-50 text-orange-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase">{product.category}</span></td>
                            <td className="py-3.5 px-4 font-mono">KES {product.price.toLocaleString()}</td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center justify-center gap-1.5">
                                <button onClick={() => { setIsAdminEditing(true); setAdminForm({ id: product.id, name: product.name, category: product.category, price: product.price.toString(), image_url: product.image_url || "" }); }} disabled={actionLoading} className="p-1.5 text-gray-500 hover:text-amber-600 rounded border transition"><Edit2 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => executeAdminDelete(product.id)} disabled={actionLoading} className="p-1.5 text-gray-400 hover:text-red-600 rounded border transition"><Trash2 className="w-3.5 h-3.5" /></button>
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
        <>
          <section className="w-full h-40 sm:h-48 relative bg-gray-900 overflow-hidden flex items-center">
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${banners[bannerIndex].image})` }} />
            <div className="max-w-7xl mx-auto px-4 relative z-10 text-white">
              <h2 className="text-xl sm:text-3xl font-black max-w-xl leading-tight">{banners[bannerIndex].text}</h2>
              <p className="text-xs text-orange-300 font-bold mt-1 uppercase tracking-wide">Factory-Direct • Verified Suppliers • B2B Pricing</p>
            </div>
          </section>
          <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:hidden">
                <button onClick={() => setShowFilters(!showFilters)} className="w-full flex items-center justify-between px-4 py-2.5 bg-white border rounded-xl shadow-sm text-xs font-black text-gray-700">
                  <span className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-orange-500" />Filters</span>
                  <span className="text-orange-500">{showFilters ? "Hide" : "Show"}</span>
                </button>
              </div>
              <aside className={`w-full lg:w-60 shrink-0 bg-white border border-gray-100 p-4 rounded-xl shadow-sm h-fit space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
                <div><h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Category</h4>
                  <div className="space-y-0.5">
                    {["All","Cement","Drills","Paint","Electrical","Plumbing"].map((cat) => (
                      <button key={cat} onClick={() => { setCategory(cat); setPage(1); }} className={`w-full text-left px-2 py-1.5 rounded text-xs transition flex justify-between ${category === cat ? "bg-orange-50 font-black text-orange-600" : "text-gray-600 hover:bg-gray-50"}`}>
                        <span>{cat}</span>{category === cat && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div><h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Price</h4>
                  <div className="flex space-x-1">
                    <input type="number" placeholder="Min" className="w-full border p-1.5 text-xs rounded bg-gray-50 outline-none focus:ring-1 focus:ring-orange-500" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                    <input type="number" placeholder="Max" className="w-full border p-1.5 text-xs rounded bg-gray-50 outline-none focus:ring-1 focus:ring-orange-500" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                  </div>
                </div>
                <div><h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Sort</h4>
                  <select className="w-full border p-2 text-xs rounded bg-gray-50 outline-none" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="created_at-desc">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </aside>
              <div className="flex-1">
                {loading ? (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}</div>
                ) : inventory.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-xl border text-gray-400 text-xs">No products found.</div>
                ) : (
                  <>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {inventory.map((product) => {
                        const stockStatus = getWarehouseStock(product.id);
                        return (
                          <div key={product.id} className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col group relative shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300">
                            <div className="absolute top-2 right-2 bg-orange-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full z-10 uppercase">Premium</div>
                            <button onClick={() => toggleWishlist(product.id)} className={`absolute top-2 left-2 z-10 p-1.5 rounded-full transition ${wishlist.has(product.id) ? "bg-pink-500 text-white" : "bg-white/80 text-gray-400 hover:bg-pink-500 hover:text-white"}`}>
                              <Heart className={`w-3.5 h-3.5 ${wishlist.has(product.id) ? "fill-white" : ""}`} />
                            </button>
                            <div className="h-36 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden relative flex items-center justify-center mb-2">
                              {product.image_url ? <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" /> : <Package className="w-8 h-8 text-gray-300" />}
                              {stockStatus.inStock ? <div className="absolute bottom-2 left-2 bg-green-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1"><Zap className="w-2 h-2" />In Stock</div> : <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">Transfer</div>}
                            </div>
                            <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{product.category}</span>
                            <h4 className="font-bold text-xs text-gray-900 truncate mt-0.5">{product.name}</h4>
                            <div className="mt-2 bg-gray-50 rounded p-1.5 border border-gray-100 text-[10px] space-y-0.5">
                              <div className="flex justify-between text-gray-500"><span>1-49 units:</span><span className="font-bold">{formatPrice(product.price)}</span></div>
                              <div className="flex justify-between text-orange-600"><span>50+ units:</span><span>{formatPrice(product.price * 0.9)}</span></div>
                              <div className="flex justify-between text-green-600 font-bold"><span>200+ units:</span><span>{formatPrice(product.price * 0.82)}</span></div>
                            </div>
                            <button onClick={() => addToCart(product)} className="mt-3 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-[11px] font-black py-2 rounded-lg flex justify-center items-center gap-1 shadow-md">
                              <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    {totalPages > 1 && (
                      <div className="mt-8 flex justify-center items-center space-x-1.5 bg-white p-2 border rounded-xl w-fit mx-auto shadow-sm">
                        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="p-1.5 rounded bg-gray-50 disabled:opacity-30"><ChevronLeft className="w-3.5 h-3.5" /></button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                          <button key={num} onClick={() => setPage(num)} className={`w-7 h-7 rounded text-xs font-black ${page === num ? "bg-orange-500 text-white" : "bg-gray-50 text-gray-600"}`}>{num}</button>
                        ))}
                        <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="p-1.5 rounded bg-gray-50 disabled:opacity-30"><ChevronRight className="w-3.5 h-3.5" /></button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Cart Panel */}
      {showCartPreview && cart.length > 0 && (
        <div className="fixed right-0 bottom-0 sm:right-4 sm:bottom-4 bg-white border border-gray-200 rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-sm p-4 z-50 animate-slideUp max-h-[90vh] overflow-y-auto">
          <div className="font-black text-xs uppercase tracking-wider text-gray-900 border-b pb-2 mb-3 flex justify-between items-center">
            <span className="flex items-center gap-1"><ShoppingCart className="w-4 h-4 text-orange-500" />Cart</span>
            <button onClick={() => setShowCartPreview(false)}><X className="w-4 h-4 text-gray-400" /></button>
          </div>
          <div className="max-h-36 overflow-y-auto divide-y space-y-2">
            {cart.map((item) => (
              <div key={item.id} className="pt-2 first:pt-0 text-xs">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-gray-800 truncate max-w-[65%]">{item.name}</p>
                </div>
                <div className="flex justify-between items-center mt-1 text-gray-500">
                  <span>{formatPrice(getTieredUnitPrice(item, item.quantity))} each</span>
                  <div className="flex items-center space-x-1.5 bg-gray-50 p-0.5 rounded border">
                    <button onClick={() => updateCartQuantity(item.id, -1)} className="px-1 text-gray-400 hover:text-red-500 font-bold">-</button>
                    <span className="font-black text-gray-900">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.id, 1)} className="px-1 text-gray-400 hover:text-green-500 font-bold">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs space-y-1 bg-gray-50/50 p-2 rounded border border-dashed text-gray-600">
            <div className="flex justify-between"><span>Items:</span><span className="font-bold">{formatPrice(totalItemsPriceKES)}</span></div>
            <div className="flex justify-between"><span>Freight:</span><span className="font-bold">{formatPrice(freightCostKES)}</span></div>
            <div className="flex justify-between border-t pt-1 font-black text-gray-900 text-sm"><span>Total:</span><span className="text-orange-600">{formatPrice(overallInvoiceTotalKES)}</span></div>
          </div>
          <button onClick={sendWhatsAppOrder} className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 text-xs rounded-lg uppercase flex justify-center items-center gap-1.5"><Phone className="w-4 h-4" />WhatsApp Order</button>
          <button onClick={() => setShowPaymentModal(true)} className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-black py-2.5 text-xs rounded-lg uppercase flex justify-center items-center gap-1.5"><CreditCard className="w-4 h-4" />Pay Online</button>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-black flex items-center gap-2"><CreditCard className="w-5 h-5 text-purple-600" />Payment</h3><button onClick={() => setShowPaymentModal(false)}><X className="w-5 h-5 text-gray-400" /></button></div>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border"><p className="text-xs text-gray-500">Total</p><p className="text-2xl font-black">{formatPrice(overallInvoiceTotalKES)}</p></div>
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {["stripe","paypal","mpesa"].map((m) => (
                  <button key={m} type="button" onClick={() => setSelectedPaymentMethod(m)} className={`p-2 rounded-lg border text-xs font-bold capitalize ${selectedPaymentMethod === m ? "bg-purple-100 border-purple-500 text-purple-700" : "bg-gray-50 border-gray-200 text-gray-600"}`}>{m === "mpesa" ? "M-Pesa" : m.charAt(0).toUpperCase() + m.slice(1)}</button>
                ))}
              </div>
              {selectedPaymentMethod === "mpesa" && <input type="tel" placeholder="+2547XXXXXXXX" value={paymentPhone} onChange={(e) => setPaymentPhone(e.target.value)} className="w-full border rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500" required />}
              <div className="flex items-center gap-2 text-[10px] text-gray-500"><Lock className="w-3 h-3" />Secured by enterprise-grade encryption</div>
              <button type="submit" disabled={paymentProcessing} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-3 rounded-lg uppercase tracking-wider disabled:opacity-50">{paymentProcessing ? "Processing..." : `Pay ${formatPrice(overallInvoiceTotalKES)}`}</button>
            </form>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-sm font-black flex items-center gap-2"><Navigation className="w-4 h-4 text-blue-500" />Track Order {selectedTrackingOrder}</h3>
              <button onClick={() => setShowTrackingModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6">
              {trackingLoading ? <div className="flex items-center justify-center py-12"><RefreshCw className="w-8 h-8 text-orange-500 animate-spin" /></div> : trackingData ? <div className="space-y-4"><OrderTrackingTimeline orderId={selectedTrackingOrder} currentStep={2} /><OrderTrackingMap trackingData={trackingData} /></div> : <p className="text-xs text-gray-400 text-center py-12">No tracking data available</p>}
            </div>
          </div>
        </div>
      )}

      {showBulkUpload && (
        <BulkOrderUpload
          onUpload={(items) => { items.forEach((item) => { const product = inventory.find((p) => p.id === item.sku); if (product) { for (let i = 0; i < item.quantity; i++) addToCart(product); } }); triggerNotification(`Added ${items.length} items`); }}
          onClose={() => setShowBulkUpload(false)}
        />
      )}
    </div>
  );
}
