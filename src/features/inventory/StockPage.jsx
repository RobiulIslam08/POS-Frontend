import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useStock } from "@/hooks/useStock";
import { Search, ClipboardCheck, Loader2 } from "lucide-react";

export default function StockPage() {
  const { t, lang } = useLanguage();
  const [keyword, setKeyword] = useState("");
  const [warehouse, setWarehouse] = useState("main");
  const [searchParams, setSearchParams] = useState({});

  const { data, isLoading } = useStock(searchParams);
  const stockItems = data?.stock || [];

  const handleSearch = () => {
    const p = {};
    if (keyword.trim()) p.searchTerm = keyword;
    if (warehouse) p.warehouse = warehouse;
    setSearchParams(p);
  };

  return (<div className="space-y-4">
    <h2 className="pos-page-title">{t("inv.stock")}</h2>
    <div className="pos-card p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
      <input className="pos-input" placeholder={lang === "ar" ? "كلمة المنتج" : "Product Keyword"} value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
      <select className="pos-select" value={warehouse} onChange={(e) => setWarehouse(e.target.value)}><option value="main">Main Warehouse</option><option value="secondary">Secondary Warehouse</option></select>
      <input className="pos-input" type="date" />
      <button className="pos-btn-primary gap-1" onClick={handleSearch} disabled={isLoading}>{isLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />} {lang === "ar" ? "بحث" : "Search"}</button>
    </div>
    <div className="pos-card overflow-x-auto">
      <table className="pos-table min-w-[900px]">
        <thead><tr><th>Code</th><th>Product</th><th>Batch</th><th>Expiry</th><th>Qty</th><th>Location</th></tr></thead>
        <tbody>
          {isLoading ? <tr><td colSpan={6} className="text-center py-8"><Loader2 size={20} className="animate-spin inline-block" /></td></tr>
          : stockItems.length === 0 ? <tr><td colSpan={6} className="text-center text-muted-foreground py-8">{lang === "ar" ? "لا توجد بيانات" : "No stock data"}</td></tr>
          : stockItems.map((s, i) => <tr key={s._id || i}><td>{s.productCode || s.code}</td><td>{s.productName || s.product}</td><td>{s.batch || "—"}</td><td>{s.expiryDate ? new Date(s.expiryDate).toLocaleDateString() : "—"}</td><td>{s.quantity}</td><td>{s.location || s.storage || "—"}</td></tr>)}
        </tbody>
      </table>
      <div className="p-3 flex justify-end"><button className="pos-btn-secondary gap-1"><ClipboardCheck size={14} /> {lang === "ar" ? "ورقة الجرد" : "Count Sheet"}</button></div>
    </div>
  </div>);
}