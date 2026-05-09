import { useLanguage } from "@/contexts/LanguageContext";
import { Save } from "lucide-react";

export default function CustomerCreditPage() {
  const { t, lang } = useLanguage();
  const customers = lang === "ar" ? ["العميل"] : ["Customer"];
  return (
    <div className="space-y-4">
      <h2 className="pos-page-title">{t("inv.customerCredit")}</h2>
      <div className="pos-card p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <select className="pos-select"><option>{lang === "ar" ? "العميل" : "Customer"}</option>{customers.map((option) => <option key={option}>{option}</option>)}</select>
        <input className="pos-input" placeholder={lang === "ar" ? "رقم الفاتورة" : "Bill No"} />
        <input className="pos-input" type="date" />
      </div>
      <div className="pos-card p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="pos-input" type="number" placeholder={lang === "ar" ? "المبلغ المستحق" : "Due Amount"} />
        <input className="pos-input" type="number" placeholder={lang === "ar" ? "المبلغ المستلم" : "Received Amount"} />
        <input className="pos-input" type="date" placeholder={lang === "ar" ? "تاريخ الدفع" : "Payment Date"} />
        <input className="pos-input" placeholder={lang === "ar" ? "ملاحظات" : "Remarks"} />
        <div className="md:col-span-2 flex justify-center"><button className="pos-btn-primary gap-1"><Save size={14} /> {lang === "ar" ? "استلام دفعة" : "Receive Payment"}</button></div>
      </div>
    </div>
  );
}