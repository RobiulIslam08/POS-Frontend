import { useLanguage } from "@/contexts/LanguageContext";
import { Save } from "lucide-react";

export default function AddFormulationPage() {
  const { t, lang } = useLanguage();
  const groupOptions = lang === "ar" ? ["قرص", "كبسولة", "شراب"] : ["Tablet", "Capsule", "Syrup"];
  return (
    <div className="space-y-4">
      <h2 className="pos-page-title">{t("masters.addFormulation")}</h2>
      <div className="pos-card p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="pos-input" placeholder={lang === "ar" ? "كود التركيبة" : "Formulation Code"} />
        <input className="pos-input" placeholder={lang === "ar" ? "اسم التركيبة" : "Formulation Name"} />
        <select className="pos-select"><option>{lang === "ar" ? "المجموعة" : "Group"}</option>{groupOptions.map((option) => <option key={option}>{option}</option>)}</select>
        <input className="pos-input" placeholder={lang === "ar" ? "التركيز" : "Strength"} />
        <input className="pos-input" placeholder={lang === "ar" ? "الشركة" : "Manufacturer"} />
        <input className="pos-input" placeholder={lang === "ar" ? "ملاحظات" : "Notes"} />
      </div>
      <div className="flex justify-center"><button className="pos-btn-primary gap-1"><Save size={14} /> {lang === "ar" ? "حفظ التركيبة" : "Save Formulation"}</button></div>
    </div>
  );
}