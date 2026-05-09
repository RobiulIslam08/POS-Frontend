import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Save, ShieldCheck, Printer } from "lucide-react";

export default function SettingsPage() {
  const { t, lang } = useLanguage();
  const [operatorRole, setOperatorRole] = useState("admin");
  const [form, setForm] = useState({
    storeName: "Abdullah Plastic Store",
    vatNumber: "301234567890003",
    invoicePrefix: "INV-",
    defaultPayment: "Cash",
    timezone: "Asia/Riyadh",
    supportContact: "+966500000000",
    lowStockAlert: "10",
    allowNegativeStock: "no",
  });
  const [errors, setErrors] = useState({});

  const canSave = operatorRole === "admin";
  const canDiagnose = operatorRole !== "cashier";

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const next = {};
    if (!form.storeName.trim()) next.storeName = lang === "ar" ? "اسم المتجر مطلوب" : "Store name is required";
    if (!/^\d{15}$/.test(form.vatNumber)) next.vatNumber = lang === "ar" ? "الرقم الضريبي السعودي يجب أن يكون 15 رقم" : "Saudi VAT number must be 15 digits";
    if (!form.invoicePrefix.trim()) next.invoicePrefix = lang === "ar" ? "بادئة الفاتورة مطلوبة" : "Invoice prefix is required";
    if (!/^((\+966)|0)?5\d{8}$/.test(form.supportContact)) next.supportContact = lang === "ar" ? "رقم دعم سعودي غير صالح" : "Invalid Saudi support mobile";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!canSave) return;
    validate();
  };

  return (
    <div className="space-y-4">
      <h2 className="pos-page-title">{t("nav.settings")}</h2>

      <div className="pos-card p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="pos-label">{lang === "ar" ? "صلاحية المشغل" : "Operator Role"}</label>
          <select className="pos-select" value={operatorRole} onChange={(e) => setOperatorRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="cashier">Cashier</option>
          </select>
        </div>
        <div className="md:col-span-2 text-xs text-muted-foreground rounded-md border border-border px-3 py-2 bg-accent/20">
          {canSave
            ? (lang === "ar" ? "يمكنك حفظ إعدادات النظام" : "You can save system configuration")
            : (lang === "ar" ? "الحفظ متاح فقط للإدارة" : "Saving settings is restricted to admin")}
        </div>
      </div>

      <div className="pos-card p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input className="pos-input" placeholder="Store Name" value={form.storeName} onChange={(e) => update("storeName", e.target.value)} />
          {errors.storeName && <p className="text-xs text-destructive mt-1">{errors.storeName}</p>}
        </div>
        <div>
          <input className="pos-input" placeholder="VAT Number" value={form.vatNumber} onChange={(e) => update("vatNumber", e.target.value)} />
          {errors.vatNumber && <p className="text-xs text-destructive mt-1">{errors.vatNumber}</p>}
        </div>
        <div>
          <input className="pos-input" placeholder="Invoice Prefix" value={form.invoicePrefix} onChange={(e) => update("invoicePrefix", e.target.value)} />
          {errors.invoicePrefix && <p className="text-xs text-destructive mt-1">{errors.invoicePrefix}</p>}
        </div>
        <select className="pos-select" value={form.defaultPayment} onChange={(e) => update("defaultPayment", e.target.value)}><option>Cash</option><option>Card</option><option>Bank Transfer</option></select>
        <select className="pos-select" value={form.timezone} onChange={(e) => update("timezone", e.target.value)}><option>Asia/Riyadh</option><option>UTC</option></select>
        <div>
          <input className="pos-input" placeholder={lang === "ar" ? "جهة الدعم" : "Support Contact"} value={form.supportContact} onChange={(e) => update("supportContact", e.target.value)} />
          {errors.supportContact && <p className="text-xs text-destructive mt-1">{errors.supportContact}</p>}
        </div>
        <input className="pos-input" type="number" placeholder={lang === "ar" ? "حد تنبيه المخزون" : "Low Stock Alert"} value={form.lowStockAlert} onChange={(e) => update("lowStockAlert", e.target.value)} />
        <select className="pos-select" value={form.allowNegativeStock} onChange={(e) => update("allowNegativeStock", e.target.value)}><option value="no">{lang === "ar" ? "منع المخزون السالب" : "Disallow Negative Stock"}</option><option value="yes">{lang === "ar" ? "السماح بالمخزون السالب" : "Allow Negative Stock"}</option></select>
      </div>

      <div className="flex justify-center gap-3">
        <button className="pos-btn-secondary gap-1" disabled={!canDiagnose}><ShieldCheck size={14} /> {lang === "ar" ? "تشخيص" : "Diagnostics"}</button>
        <button className="pos-btn-primary gap-1" disabled={!canSave} onClick={handleSave}><Save size={14} /> {lang === "ar" ? "حفظ الإعدادات" : "Save Settings"}</button>
        <button className="pos-btn-secondary gap-1" onClick={() => window.print()}><Printer size={14} /> {lang === "ar" ? "طباعة الملخص" : "Print Summary"}</button>
      </div>

      <div className="pos-card p-4 md:p-5 print:shadow-none print:border-none">
        <h3 className="font-semibold mb-3">{lang === "ar" ? "ملخص الإعدادات" : "Configuration Summary"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><strong>Store:</strong> {form.storeName}</div>
          <div><strong>VAT:</strong> {form.vatNumber}</div>
          <div><strong>Invoice Prefix:</strong> {form.invoicePrefix}</div>
          <div><strong>Default Payment:</strong> {form.defaultPayment}</div>
          <div><strong>Timezone:</strong> {form.timezone}</div>
          <div><strong>Support:</strong> {form.supportContact}</div>
        </div>
      </div>
    </div>
  );
}