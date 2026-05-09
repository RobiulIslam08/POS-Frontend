import { useLanguage } from "@/contexts/LanguageContext";
import { DatabaseBackup, RotateCcw } from "lucide-react";

export default function BackupPage() {
  const { t, lang } = useLanguage();
  const backupTypeOptions = lang === "ar"
    ? ["نسخة كاملة", "قاعدة البيانات"]
    : ["Full", "Database"];
  const scheduleOptions = lang === "ar"
    ? ["يومي", "أسبوعي", "يدوي"]
    : ["Daily", "Weekly", "Manual"];
  return (
    <div className="space-y-4">
      <h2 className="pos-page-title">{t("nav.backup")}</h2>
      <div className="pos-card p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="pos-input" placeholder={lang === "ar" ? "اسم النسخة" : "Backup Name"} />
        <select className="pos-select"><option>{lang === "ar" ? "نوع النسخة" : "Backup Type"}</option>{backupTypeOptions.map((option) => <option key={option}>{option}</option>)}</select>
        <input className="pos-input" placeholder={lang === "ar" ? "الوجهة" : "Destination"} />
        <select className="pos-select"><option>{lang === "ar" ? "الجدولة" : "Schedule"}</option>{scheduleOptions.map((option) => <option key={option}>{option}</option>)}</select>
      </div>
      <div className="flex justify-center gap-3">
        <button className="pos-btn-secondary gap-1"><RotateCcw size={14} /> {lang === "ar" ? "استعادة" : "Restore"}</button>
        <button className="pos-btn-primary gap-1"><DatabaseBackup size={14} /> {lang === "ar" ? "إنشاء نسخة" : "Create Backup"}</button>
      </div>
    </div>
  );
}