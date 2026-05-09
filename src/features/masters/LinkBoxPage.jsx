import { useLanguage } from "@/contexts/LanguageContext";
import { Link2 } from "lucide-react";

export default function LinkBoxPage() {
  const { t, lang } = useLanguage();
  return (
    <div className="space-y-4">
      <h2 className="pos-page-title">{t("masters.linkBox")}</h2>
      <div className="pos-card p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="pos-input" placeholder={lang === "ar" ? "كود منتج العبوة" : "Box Product Code"} />
        <input className="pos-input" placeholder={lang === "ar" ? "كود المنتج الفردي" : "Single Product Code"} />
        <input className="pos-input" placeholder={lang === "ar" ? "اسم منتج العبوة" : "Box Product Name"} />
        <input className="pos-input" placeholder={lang === "ar" ? "اسم المنتج الفردي" : "Single Product Name"} />
        <input className="pos-input" type="number" placeholder={lang === "ar" ? "كمية التحويل" : "Conversion Qty"} />
        <input className="pos-input" placeholder={lang === "ar" ? "ملاحظات" : "Remark"} />
      </div>
      <div className="flex justify-center"><button className="pos-btn-primary gap-1"><Link2 size={14} /> {lang === "ar" ? "ربط المنتج" : "Link Product"}</button></div>
    </div>
  );
}