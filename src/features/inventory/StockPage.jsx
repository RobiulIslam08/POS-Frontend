import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useStock } from "@/hooks/useStock";
import { Search, ClipboardCheck, Loader2, Printer } from "lucide-react";

export default function StockPage() {
  const { t, lang } = useLanguage();
  const [keyword, setKeyword] = useState("");
  const [warehouse, setWarehouse] = useState("main");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchParams, setSearchParams] = useState({});

  const { data, isLoading } = useStock(searchParams);
  const stockItems = data?.stock || [];

  const handleSearch = () => {
    const p = {};
    if (keyword.trim()) p.searchTerm = keyword;
    if (warehouse) p.warehouse = warehouse;
    if (fromDate) p.fromDate = fromDate;
    if (toDate) p.toDate = toDate;
    setSearchParams(p);
  };

  const handlePrintCountSheet = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <h2 className="pos-page-title">{t("inv.stock")}</h2>
      <div className="pos-card p-4 grid grid-cols-1 md:grid-cols-5 gap-3 print:hidden">
        <input
          className="pos-input"
          placeholder={lang === "ar" ? "كلمة المنتج" : "Product Keyword"}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <select
          className="pos-select"
          value={warehouse}
          onChange={(e) => setWarehouse(e.target.value)}
        >
          <option value="main">Main Warehouse</option>
          <option value="secondary">Secondary Warehouse</option>
        </select>
        <input
          className="pos-input"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          title={lang === "ar" ? "من تاريخ" : "From Date"}
        />
        <input
          className="pos-input"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          title={lang === "ar" ? "إلى تاريخ" : "To Date"}
        />
        <button
          className="pos-btn-primary gap-1"
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          {lang === "ar" ? "بحث" : "Search"}
        </button>
      </div>

      <div className="pos-card overflow-x-auto" id="stock-print-area">
        <div className="hidden print:block p-4 border-b">
          <h1 className="text-xl font-bold text-center">{lang === "ar" ? "ورقة الجرد" : "Stock Count Sheet"}</h1>
          <p className="text-center text-sm">{new Date().toLocaleString()}</p>
          {warehouse && <p className="text-center text-xs">Warehouse: {warehouse}</p>}
        </div>
        <table className="pos-table min-w-[900px]">
          <thead>
            <tr>
              <th>{lang === "ar" ? "الكود" : "Code"}</th>
              <th>{lang === "ar" ? "المنتج" : "Product"}</th>
              <th>{lang === "ar" ? "الدفعة" : "Batch"}</th>
              <th>{lang === "ar" ? "الإكسปاير" : "Expiry"}</th>
              <th>{lang === "ar" ? "الكمية" : "Qty"}</th>
              <th className="print:hidden">{lang === "ar" ? "الموقع" : "Location"}</th>
              <th className="hidden print:table-cell w-32">{lang === "ar" ? "العد الفعلي" : "Actual Count"}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <Loader2 size={20} className="animate-spin inline-block" />
                </td>
              </tr>
            ) : stockItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted-foreground py-8">
                  {lang === "ar" ? "لا توجد بيانات" : "No stock data"}
                </td>
              </tr>
            ) : (
              stockItems.map((s, i) => (
                <tr key={s._id || i}>
                  <td>{s.productCode || s.code}</td>
                  <td>{s.productName || s.product}</td>
                  <td>{s.batch || "—"}</td>
                  <td>{s.expiryDate ? new Date(s.expiryDate).toLocaleDateString() : "—"}</td>
                  <td className="font-bold">{s.quantity}</td>
                  <td className="print:hidden">{s.location || s.storage || "—"}</td>
                  <td className="hidden print:table-cell border-l border-dashed"></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="p-3 flex justify-end print:hidden">
          <button className="pos-btn-secondary gap-1" onClick={handlePrintCountSheet}>
            <ClipboardCheck size={14} /> {lang === "ar" ? "ورقة الجرد" : "Count Sheet"}
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #stock-print-area, #stock-print-area * { visibility: visible; }
          #stock-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}