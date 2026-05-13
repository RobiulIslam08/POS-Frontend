import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { DatabaseBackup, RotateCcw, Download, Upload, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { apiGet } from "@/services/api";
import { showSuccess, showError } from "@/lib/toast-helpers";

export default function BackupPage() {
  const { t, lang } = useLanguage();
  const { user } = useAuthContext();
  const isAdmin = user?.role === "admin";
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    backupName: "",
    backupType: "Full",
    destination: "Local Download",
    schedule: "Manual",
  });
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState(null);
  const [restoreFile, setRestoreFile] = useState(null);
  const [restorePreview, setRestorePreview] = useState(null);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // Collections to backup
  const collections = [
    { key: "products", endpoint: "/products", label: "Products" },
    { key: "suppliers", endpoint: "/suppliers", label: "Suppliers" },
    { key: "customers", endpoint: "/customers", label: "Customers" },
    { key: "formulations", endpoint: "/formulations", label: "Formulations" },
    { key: "sales", endpoint: "/sales", label: "Sales" },
    { key: "purchases", endpoint: "/purchases", label: "Purchases" },
    { key: "expenses", endpoint: "/expenses", label: "Expenses" },
    { key: "credits_supplier", endpoint: "/credits/supplier", label: "Supplier Credits" },
    { key: "credits_customer", endpoint: "/credits/customer", label: "Customer Credits" },
  ];

  const handleBackup = async () => {
    if (!isAdmin) {
      showError(null, lang === "ar" ? "فقط المسؤول يمكنه إنشاء نسخة احتياطية" : "Only admins can create backups");
      return;
    }
    setIsBackingUp(true);

    try {
      const backup = {
        meta: {
          name: form.backupName || `POS_Backup_${new Date().toISOString().slice(0, 10)}`,
          type: form.backupType,
          createdAt: new Date().toISOString(),
          createdBy: user?.username || user?.fullName || "admin",
          version: "1.0",
        },
        data: {},
      };

      // Fetch each collection
      const targets = form.backupType === "Full" ? collections : collections.slice(0, 4); // DB = masters only
      for (const col of targets) {
        try {
          const res = await apiGet(col.endpoint, { limit: 10000 });
          backup.data[col.key] = res?.data || [];
        } catch {
          backup.data[col.key] = [];
        }
      }

      // Count total records
      const totalRecords = Object.values(backup.data).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
      backup.meta.totalRecords = totalRecords;
      backup.meta.collections = Object.keys(backup.data).length;

      // Download as JSON
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${backup.meta.name.replace(/\s+/g, "_")}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setLastBackup({
        name: backup.meta.name,
        date: backup.meta.createdAt,
        records: totalRecords,
        collections: backup.meta.collections,
        type: form.backupType,
      });

      showSuccess(lang === "ar" ? `تم النسخ الاحتياطي — ${totalRecords} سجل` : `Backup complete — ${totalRecords} records exported ✅`);
    } catch (err) {
      showError(err, lang === "ar" ? "فشل النسخ الاحتياطي" : "Backup failed");
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestoreFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRestoreFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (!parsed.meta || !parsed.data) {
          showError(null, lang === "ar" ? "ملف غير صالح" : "Invalid backup file format");
          setRestorePreview(null);
          return;
        }
        setRestorePreview({
          name: parsed.meta.name,
          date: parsed.meta.createdAt,
          records: parsed.meta.totalRecords,
          collections: Object.keys(parsed.data).length,
          collectionNames: Object.keys(parsed.data),
        });
      } catch {
        showError(null, lang === "ar" ? "خطأ في قراءة الملف" : "Failed to parse backup file");
        setRestorePreview(null);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <h2 className="pos-page-title">{t("nav.backup")}</h2>

      {/* Role Info */}
      {!isAdmin && (
        <div className="pos-card p-3 flex items-center gap-2 text-sm text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30">
          <AlertTriangle size={16} />
          {lang === "ar" ? "النسخ الاحتياطي متاح للمسؤولين فقط" : "Backup/Restore is available to admins only"}
        </div>
      )}

      {/* Backup Form */}
      <div className="pos-card p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="pos-label">{lang === "ar" ? "اسم النسخة" : "Backup Name"}</label>
          <input className="pos-input" placeholder={lang === "ar" ? "مثال: نسخة مايو" : "e.g. May 2026 Backup"} value={form.backupName} onChange={(e) => update("backupName", e.target.value)} />
        </div>
        <div>
          <label className="pos-label">{lang === "ar" ? "نوع النسخة" : "Backup Type"}</label>
          <select className="pos-select" value={form.backupType} onChange={(e) => update("backupType", e.target.value)}>
            <option value="Full">{lang === "ar" ? "نسخة كاملة" : "Full (All Data)"}</option>
            <option value="Database">{lang === "ar" ? "البيانات الأساسية" : "Masters Only"}</option>
          </select>
        </div>
        <div>
          <label className="pos-label">{lang === "ar" ? "الوجهة" : "Destination"}</label>
          <input className="pos-input bg-accent/30 cursor-default" value={lang === "ar" ? "تحميل محلي (JSON)" : "Local Download (JSON)"} readOnly />
        </div>
        <div>
          <label className="pos-label">{lang === "ar" ? "الجدولة" : "Schedule"}</label>
          <select className="pos-select" value={form.schedule} onChange={(e) => update("schedule", e.target.value)}>
            <option value="Manual">{lang === "ar" ? "يدوي" : "Manual"}</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-3">
        <button className="pos-btn-secondary gap-1" onClick={() => fileInputRef.current?.click()} disabled={!isAdmin}>
          <RotateCcw size={14} /> {lang === "ar" ? "استعادة" : "Restore"}
        </button>
        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleRestoreFileChange} />
        <button className="pos-btn-primary gap-1" onClick={handleBackup} disabled={isBackingUp || !isAdmin}>
          {isBackingUp ? <Loader2 size={14} className="animate-spin" /> : <DatabaseBackup size={14} />}
          {lang === "ar" ? "إنشاء نسخة" : "Create Backup"}
        </button>
      </div>

      {/* Last Backup Info */}
      {lastBackup && (
        <div className="pos-card p-4 flex items-start gap-3">
          <CheckCircle2 size={20} className="text-emerald-500 mt-0.5 shrink-0" />
          <div className="text-sm space-y-1">
            <div className="font-semibold">{lang === "ar" ? "آخر نسخة احتياطية" : "Last Backup"}</div>
            <div className="text-muted-foreground">
              <strong>{lastBackup.name}</strong> — {lastBackup.type} — {lastBackup.records} {lang === "ar" ? "سجل" : "records"} ({lastBackup.collections} {lang === "ar" ? "جدول" : "collections"})
            </div>
            <div className="text-xs text-muted-foreground">{new Date(lastBackup.date).toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Restore Preview */}
      {restorePreview && (
        <div className="pos-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Upload size={16} className="text-primary" />
            <span className="font-semibold text-sm">{lang === "ar" ? "معاينة الاستعادة" : "Restore Preview"}</span>
          </div>
          <div className="text-sm space-y-1 text-muted-foreground">
            <p><strong>{lang === "ar" ? "الاسم:" : "Name:"}</strong> {restorePreview.name}</p>
            <p><strong>{lang === "ar" ? "التاريخ:" : "Date:"}</strong> {new Date(restorePreview.date).toLocaleString()}</p>
            <p><strong>{lang === "ar" ? "السجلات:" : "Records:"}</strong> {restorePreview.records}</p>
            <p><strong>{lang === "ar" ? "الجداول:" : "Collections:"}</strong> {restorePreview.collectionNames.join(", ")}</p>
          </div>
          <div className="mt-3 p-2 rounded border border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-xs text-amber-700">
            <AlertTriangle size={12} className="inline mr-1" />
            {lang === "ar" ? "ملاحظة: الاستعادة تتطلب الوصول المباشر إلى قاعدة البيانات. استخدم هذا الملف مع mongoimport أو أداة إدارة MongoDB." : "Note: Restore requires direct database access. Use this file with mongoimport or a MongoDB management tool."}
          </div>
        </div>
      )}

      {/* Backup Guide */}
      <div className="pos-card p-4">
        <div className="text-sm font-semibold mb-2">{lang === "ar" ? "دليل النسخ الاحتياطي" : "Backup Guide"}</div>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• <strong>{lang === "ar" ? "نسخة كاملة" : "Full"}</strong>: {lang === "ar" ? "تشمل جميع البيانات (المنتجات، المبيعات، المشتريات، المصاريف، الائتمان)" : "Includes all data (Products, Sales, Purchases, Expenses, Credits)"}</p>
          <p>• <strong>{lang === "ar" ? "البيانات الأساسية" : "Masters Only"}</strong>: {lang === "ar" ? "تشمل فقط البيانات الأساسية (المنتجات، الموردين، العملاء، التركيبات)" : "Only master data (Products, Suppliers, Customers, Formulations)"}</p>
          <p>• {lang === "ar" ? "يتم تصدير البيانات بتنسيق JSON يمكن استخدامه للاستعادة" : "Data is exported as JSON which can be used for restoration"}</p>
          <p>• {lang === "ar" ? "يُنصح بإنشاء نسخة احتياطية كاملة أسبوعيًا على الأقل" : "It's recommended to create a full backup at least weekly"}</p>
        </div>
      </div>
    </div>
  );
}