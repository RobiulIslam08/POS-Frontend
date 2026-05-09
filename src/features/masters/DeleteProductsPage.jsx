import { useLanguage } from "@/contexts/LanguageContext";
import { Trash2 } from "lucide-react";

export default function DeleteProductsPage() {
  const { t, lang } = useLanguage();
  const deleteReasons = lang === "ar" ? ["مكرر", "متوقف", "إدخال خاطئ"] : ["Duplicate", "Discontinued", "Wrong Entry"];
  return (
    <div className="space-y-4">
      <h2 className="pos-page-title">{t("masters.deleteProducts")}</h2>
      <div className="pos-card p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="pos-input" placeholder={lang === "ar" ? "كود المنتج" : "Product Code"} />
        <input className="pos-input" placeholder={lang === "ar" ? "اسم المنتج" : "Product Name"} />
        <input className="pos-input" type="number" placeholder={lang === "ar" ? "الكمية الحالية" : "Current Qty"} />
        <select className="pos-select"><option>{lang === "ar" ? "سبب الحذف" : "Delete Reason"}</option>{deleteReasons.map((option) => <option key={option}>{option}</option>)}</select>
        <input className="pos-input" placeholder={lang === "ar" ? "اعتمد بواسطة" : "Approved By"} />
        <input className="pos-input" placeholder={lang === "ar" ? "ملاحظات" : "Remarks"} />
      </div>
      <div className="flex justify-center"><button className="pos-btn-destructive gap-1"><Trash2 size={14} /> {lang === "ar" ? "طلب حذف" : "Request Delete"}</button></div>
    </div>
  );
}