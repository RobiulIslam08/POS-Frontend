import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCreateFormulation } from "@/hooks/useFormulations";
import { Save, Loader2 } from "lucide-react";

export default function AddFormulationPage() {
  const { t, lang } = useLanguage();
  const createFormulation = useCreateFormulation();
  const groupOptions = lang === "ar" ? ["قرص", "كبسولة", "شراب"] : ["Tablet", "Capsule", "Syrup"];
  const [form, setForm] = useState({ code: "", name: "", group: "", strength: "", manufacturer: "", notes: "" });
  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    createFormulation.mutate({ formulationCode: form.code.trim(), formulationName: form.name.trim(), group: form.group || undefined, strength: form.strength.trim() || undefined, manufacturer: form.manufacturer.trim() || undefined, notes: form.notes.trim() || undefined },
      { onSuccess: () => setForm({ code: "", name: "", group: "", strength: "", manufacturer: "", notes: "" }) });
  };

  return (<div className="space-y-4">
    <h2 className="pos-page-title">{t("masters.addFormulation")}</h2>
    <div className="pos-card p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <input className="pos-input" placeholder={lang === "ar" ? "كود التركيبة" : "Formulation Code"} value={form.code} onChange={(e) => update("code", e.target.value)} />
      <input className="pos-input" placeholder={lang === "ar" ? "اسم التركيبة" : "Formulation Name"} value={form.name} onChange={(e) => update("name", e.target.value)} />
      <select className="pos-select" value={form.group} onChange={(e) => update("group", e.target.value)}><option>{lang === "ar" ? "المجموعة" : "Group"}</option>{groupOptions.map((o) => <option key={o}>{o}</option>)}</select>
      <input className="pos-input" placeholder={lang === "ar" ? "التركيز" : "Strength"} value={form.strength} onChange={(e) => update("strength", e.target.value)} />
      <input className="pos-input" placeholder={lang === "ar" ? "الشركة" : "Manufacturer"} value={form.manufacturer} onChange={(e) => update("manufacturer", e.target.value)} />
      <input className="pos-input" placeholder={lang === "ar" ? "ملاحظات" : "Notes"} value={form.notes} onChange={(e) => update("notes", e.target.value)} />
    </div>
    <div className="flex justify-center"><button className="pos-btn-primary gap-1" onClick={handleSave} disabled={createFormulation.isPending}>{createFormulation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {lang === "ar" ? "حفظ التركيبة" : "Save Formulation"}</button></div>
  </div>);
}