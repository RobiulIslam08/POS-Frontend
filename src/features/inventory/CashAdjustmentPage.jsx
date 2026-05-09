import { useLanguage } from "@/contexts/LanguageContext";
import { Save } from "lucide-react";

export default function CashAdjustmentPage() {
  const { t, lang } = useLanguage();
  const adjustmentTypes = lang === "ar" ? ["داخل", "خارج"] : ["In", "Out"];
  return (
    <div className="space-y-4">
      <h2 className="pos-page-title">{t("inv.cashAdjustment")}</h2>
      <div className="pos-card p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="pos-input" placeholder={lang === "ar" ? "رقم التعديل" : "Adjustment No"} />
        <select className="pos-select"><option>{lang === "ar" ? "النوع" : "Type"}</option>{adjustmentTypes.map((option) => <option key={option}>{option}</option>)}</select>
        <input className="pos-input" type="number" placeholder={lang === "ar" ? "المبلغ" : "Amount"} />
        <input className="pos-input" placeholder={lang === "ar" ? "الحساب" : "Account"} />
        <input className="pos-input" type="date" />
        <input className="pos-input" placeholder={lang === "ar" ? "ملاحظات" : "Remarks"} />
        <div className="md:col-span-2 flex justify-center"><button className="pos-btn-primary gap-1"><Save size={14} /> {lang === "ar" ? "ترحيل التعديل" : "Post Adjustment"}</button></div>
      </div>
    </div>
  );
}