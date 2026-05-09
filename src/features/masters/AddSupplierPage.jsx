import { useLanguage } from "@/contexts/LanguageContext";
import { Save } from "lucide-react";

export default function AddSupplierPage() {
  const { t, lang } = useLanguage();
  const labels = {
    code: lang === "ar" ? "كود المورد" : "Supplier Code",
    name: lang === "ar" ? "اسم المورد" : "Supplier Name",
    contact: lang === "ar" ? "جهة الاتصال" : "Contact Person",
    phone: lang === "ar" ? "الهاتف" : "Phone",
    credit: lang === "ar" ? "حد الائتمان" : "Credit Limit",
    address: lang === "ar" ? "العنوان" : "Address",
    save: lang === "ar" ? "تسجيل مورد" : "Register Supplier",
  };
  return (
    <div className="space-y-4">
      <h2 className="pos-page-title">{t("masters.addSupplier")}</h2>
      <div className="pos-card p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="pos-input" placeholder={labels.code} />
        <input className="pos-input" placeholder={labels.name} />
        <input className="pos-input" placeholder={labels.contact} />
        <input className="pos-input" placeholder={labels.phone} />
        <input className="pos-input" type="number" placeholder={labels.credit} />
        <input className="pos-input" placeholder={labels.address} />
      </div>
      <div className="flex justify-center"><button className="pos-btn-primary gap-1"><Save size={14} /> {labels.save}</button></div>
    </div>
  );
}