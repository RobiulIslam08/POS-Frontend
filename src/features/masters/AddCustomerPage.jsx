import { useLanguage } from "@/contexts/LanguageContext";
import { Save } from "lucide-react";

export default function AddCustomerPage() {
  const { t, lang } = useLanguage();
  const labels = {
    code: lang === "ar" ? "كود العميل" : "Customer Code",
    name: lang === "ar" ? "اسم العميل" : "Customer Name",
    mobile: lang === "ar" ? "الجوال" : "Mobile",
    email: lang === "ar" ? "البريد الإلكتروني" : "Email",
    credit: lang === "ar" ? "حد الائتمان" : "Credit Limit",
    address: lang === "ar" ? "العنوان" : "Address",
    save: lang === "ar" ? "تسجيل عميل" : "Register Customer",
  };
  return (
    <div className="space-y-4">
      <h2 className="pos-page-title">{t("masters.addCustomer")}</h2>
      <div className="pos-card p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="pos-input" placeholder={labels.code} />
        <input className="pos-input" placeholder={labels.name} />
        <input className="pos-input" placeholder={labels.mobile} />
        <input className="pos-input" placeholder={labels.email} />
        <input className="pos-input" type="number" placeholder={labels.credit} />
        <input className="pos-input" placeholder={labels.address} />
      </div>
      <div className="flex justify-center"><button className="pos-btn-primary gap-1"><Save size={14} /> {labels.save}</button></div>
    </div>
  );
}