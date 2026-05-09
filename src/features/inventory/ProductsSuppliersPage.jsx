import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Link2, Save } from "lucide-react";

export default function ProductsSuppliersPage() {
  const { t, lang } = useLanguage();
  const [keyword, setKeyword] = useState("");
  const [supplier, setSupplier] = useState("");
  const supplierGroups = lang === "ar" ? ["محلي", "مستورد"] : ["Local", "Import"];

  return (
    <div className="space-y-4">
      <h2 className="pos-page-title">{t("inv.productsSuppliers")}</h2>

      <div className="pos-card p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="pos-input" placeholder={lang === "ar" ? "منتج أو مورد" : "Product or Supplier"} value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <select className="pos-select" value={supplier} onChange={(e) => setSupplier(e.target.value)}>
            <option value="">{lang === "ar" ? "كل الموردين" : "All Suppliers"}</option>
            {supplierGroups.map((option) => <option key={option} value={option.toLowerCase()}>{option}</option>)}
          </select>
          <button className="pos-btn-primary gap-1"><Search size={14} /> {lang === "ar" ? "بحث" : "Search"}</button>
        </div>
      </div>

      <div className="pos-card p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="pos-input" placeholder={lang === "ar" ? "كود المنتج" : "Product Code"} />
          <input className="pos-input" placeholder={lang === "ar" ? "اسم المنتج" : "Product Name"} />
          <input className="pos-input" placeholder={lang === "ar" ? "اسم المورد" : "Supplier Name"} />
          <input className="pos-input" type="number" placeholder={lang === "ar" ? "سعر الشراء" : "Purchase Price"} />
          <input className="pos-input" type="number" placeholder={lang === "ar" ? "سعر البيع" : "Selling Price"} />
          <input className="pos-input" placeholder={lang === "ar" ? "ملاحظات" : "Notes"} />
        </div>
        <div className="flex justify-center gap-3 mt-6">
          <button className="pos-btn-secondary gap-1"><Link2 size={14} /> {lang === "ar" ? "ربط المورد" : "Link Supplier"}</button>
          <button className="pos-btn-primary gap-1"><Save size={14} /> {t("sales.save")}</button>
        </div>
      </div>
    </div>
  );
}