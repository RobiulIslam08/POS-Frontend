import { useLanguage } from "@/contexts/LanguageContext";
import { Save, Search } from "lucide-react";

export default function StockReturnPage() {
  const { t, lang } = useLanguage();
  const reasons = lang === "ar" ? ["منتهي الصلاحية", "تالف"] : ["Expired", "Damaged"];

  return (
    <div className="space-y-4">
      <h2 className="pos-page-title">{t("inv.stockReturn")}</h2>
      <div className="pos-card p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input className="pos-input" placeholder={lang === "ar" ? "فاتورة أو منتج" : "Invoice or Product"} />
        <select className="pos-select"><option>{lang === "ar" ? "سبب الإرجاع" : "Return Reason"}</option>{reasons.map((option) => <option key={option}>{option}</option>)}</select>
        <input className="pos-input" type="date" />
        <button className="pos-btn-primary gap-1"><Search size={14} /> {lang === "ar" ? "بحث" : "Search"}</button>
      </div>
      <div className="pos-card p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="pos-input" placeholder={lang === "ar" ? "رقم الفاتورة" : "Invoice No"} />
        <input className="pos-input" placeholder={lang === "ar" ? "كود المنتج" : "Product Code"} />
        <input className="pos-input" placeholder={lang === "ar" ? "اسم المنتج" : "Product Name"} />
        <input className="pos-input" type="number" placeholder={lang === "ar" ? "كمية الإرجاع" : "Return Qty"} />
        <input className="pos-input md:col-span-2" placeholder={lang === "ar" ? "ملاحظات" : "Remarks"} />
        <div className="md:col-span-2 flex justify-center"><button className="pos-btn-primary gap-1"><Save size={14} /> {lang === "ar" ? "معالجة الإرجاع" : "Process Return"}</button></div>
      </div>
    </div>
  );
}