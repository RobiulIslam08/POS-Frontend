import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, ClipboardCheck } from "lucide-react";

export default function StockPage() {
  const { t, lang } = useLanguage();
  const [warehouse, setWarehouse] = useState("main");

  return (
    <div className="space-y-4">
      <h2 className="pos-page-title">{t("inv.stock")}</h2>

      <div className="pos-card p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input className="pos-input" placeholder={lang === "ar" ? "كلمة المنتج" : "Product Keyword"} />
        <select className="pos-select" value={warehouse} onChange={(e) => setWarehouse(e.target.value)}>
          <option value="main">Main Warehouse</option>
          <option value="secondary">Secondary Warehouse</option>
        </select>
        <input className="pos-input" type="date" />
        <button className="pos-btn-primary gap-1"><Search size={14} /> {lang === "ar" ? "بحث" : "Search"}</button>
      </div>

      <div className="pos-card overflow-x-auto">
        <table className="pos-table min-w-[900px]">
          <thead>
            <tr>
              <th>Code</th><th>Product</th><th>Batch</th><th>Expiry</th><th>Qty</th><th>Location</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, i) => (
              <tr key={i}><td>P-{100 + i}</td><td>Item {i + 1}</td><td>B-{10 + i}</td><td>2026-12-{10 + i}</td><td>{50 - i}</td><td>R-{i + 1}</td></tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 flex justify-end">
          <button className="pos-btn-secondary gap-1"><ClipboardCheck size={14} /> {lang === "ar" ? "ورقة الجرد" : "Count Sheet"}</button>
        </div>
      </div>
    </div>
  );
}