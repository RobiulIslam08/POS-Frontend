import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Printer, Wand2, ShieldCheck } from "lucide-react";

export default function BarcodePage() {
  const { t, lang } = useLanguage();
  const [operatorRole, setOperatorRole] = useState("admin");
  const [form, setForm] = useState({
    productCode: "",
    barcodeValue: "",
    labelCount: "12",
    paperSize: "40x25",
    printType: "Sticker",
    printer: "Zebra-ZD220",
  });
  const [errors, setErrors] = useState({});
  const [generatedAt, setGeneratedAt] = useState("");

  const canPrint = operatorRole !== "cashier";

  const labels = useMemo(() => {
    const count = Math.min(Math.max(Number(form.labelCount) || 0, 0), 80);
    if (!generatedAt || count === 0) return [];
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      code: form.productCode || "N/A",
      value: form.barcodeValue || `${form.productCode}-${1000 + i}`,
    }));
  }, [form.barcodeValue, form.labelCount, form.productCode, generatedAt]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const next = {};
    if (!form.productCode.trim()) next.productCode = lang === "ar" ? "كود المنتج مطلوب" : "Product code is required";
    if (!form.labelCount || Number(form.labelCount) <= 0) next.labelCount = lang === "ar" ? "عدد الملصقات غير صالح" : "Label count must be greater than 0";
    if (!form.printer.trim()) next.printer = lang === "ar" ? "اسم الطابعة مطلوب" : "Printer name is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleGenerate = () => {
    if (!validate()) return;
    setGeneratedAt(new Date().toISOString());
  };

  const handlePrint = () => {
    if (!canPrint) return;
    window.print();
  };

  return (
    <div className="space-y-4">
      <h2 className="pos-page-title">{t("nav.barcode")}</h2>

      <div className="pos-card p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="pos-label">{lang === "ar" ? "الدور الحالي" : "Current Role"}</label>
          <select className="pos-select" value={operatorRole} onChange={(e) => setOperatorRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="cashier">Cashier</option>
          </select>
        </div>
        <div className="md:col-span-2 rounded-md border border-border bg-accent/20 px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
          <ShieldCheck size={14} />
          {canPrint
            ? (lang === "ar" ? "يمكنك التوليد والطباعة" : "You can generate and print labels")
            : (lang === "ar" ? "يمكنك التوليد فقط، الطباعة للإدارة" : "You can generate only, printing is restricted to management")}
        </div>
      </div>

      <div className="pos-card p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input className="pos-input" placeholder="Product Code" value={form.productCode} onChange={(e) => update("productCode", e.target.value)} />
          {errors.productCode && <p className="text-destructive text-xs mt-1">{errors.productCode}</p>}
        </div>
        <input className="pos-input" placeholder="Barcode Value" value={form.barcodeValue} onChange={(e) => update("barcodeValue", e.target.value)} />
        <div>
          <input className="pos-input" type="number" placeholder="Label Count" value={form.labelCount} onChange={(e) => update("labelCount", e.target.value)} />
          {errors.labelCount && <p className="text-destructive text-xs mt-1">{errors.labelCount}</p>}
        </div>
        <select className="pos-select" value={form.paperSize} onChange={(e) => update("paperSize", e.target.value)}><option>40x25</option><option>50x25</option><option>A4</option></select>
        <select className="pos-select" value={form.printType} onChange={(e) => update("printType", e.target.value)}><option>Sticker</option><option>Sheet</option><option>Roll</option></select>
        <div>
          <input className="pos-input" placeholder={lang === "ar" ? "الطابعة" : "Printer"} value={form.printer} onChange={(e) => update("printer", e.target.value)} />
          {errors.printer && <p className="text-destructive text-xs mt-1">{errors.printer}</p>}
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button className="pos-btn-secondary gap-1" onClick={handleGenerate}><Wand2 size={14} /> {lang === "ar" ? "توليد" : "Generate"}</button>
        <button className="pos-btn-primary gap-1" onClick={handlePrint} disabled={!canPrint || labels.length === 0}><Printer size={14} /> {lang === "ar" ? "طباعة" : "Print"}</button>
      </div>

      <div className="pos-card overflow-x-auto print:shadow-none print:border-none" id="barcode-print-area">
        <div className="p-4 border-b border-border text-sm text-muted-foreground">
          {lang === "ar" ? "معاينة الباركود" : "Barcode Preview"} | {form.paperSize} | {form.printType}
        </div>
        <table className="pos-table min-w-[760px]">
          <thead>
            <tr><th>#</th><th>{lang === "ar" ? "كود المنتج" : "Product"}</th><th>{lang === "ar" ? "قيمة الباركود" : "Barcode Value"}</th></tr>
          </thead>
          <tbody>
            {labels.length === 0 && <tr><td colSpan={3} className="text-center text-muted-foreground">{lang === "ar" ? "لا يوجد ملصقات بعد" : "No labels generated yet"}</td></tr>}
            {labels.map((item) => (
              <tr key={item.id}><td>{item.id}</td><td>{item.code}</td><td>{item.value}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}