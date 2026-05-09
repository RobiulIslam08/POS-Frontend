import { useLanguage } from "@/contexts/LanguageContext";
import { Save } from "lucide-react";

export default function CustomerCreditMasterPage() {
  const { t, lang } = useLanguage();
  return (
    <div className="space-y-4">
      <h2 className="pos-page-title">{t("masters.customerCreditMaster")}</h2>
      <div className="pos-card p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="pos-input" placeholder={lang === "ar" ? "مرجع الائتمان" : "Credit Ref"} />
        <input className="pos-input" placeholder={lang === "ar" ? "اسم العميل" : "Customer Name"} />
        <input className="pos-input" placeholder={lang === "ar" ? "رقم الفاتورة" : "Bill No"} />
        <input className="pos-input" type="number" placeholder={lang === "ar" ? "مبلغ الائتمان" : "Credit Amount"} />
        <input className="pos-input" type="number" placeholder={lang === "ar" ? "المبلغ المستلم" : "Received Amount"} />
        <input className="pos-input" placeholder={lang === "ar" ? "ملاحظات" : "Remarks"} />
      </div>
      <div className="flex justify-center"><button className="pos-btn-primary gap-1"><Save size={14} /> {lang === "ar" ? "ترحيل السجل" : "Post Ledger"}</button></div>
    </div>
  );
}