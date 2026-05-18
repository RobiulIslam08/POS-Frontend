import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUsers, useRegisterUser } from "@/hooks/useUsers";
import { Save, UserPlus, Loader2 } from "lucide-react";

export default function AddUserPage() {
  const { t, lang } = useLanguage();
  const { user: currentUser } = useAuthContext();
  const operatorRole = currentUser?.role || "cashier";
  const canCreate = operatorRole === "admin";

  const { data, isLoading } = useUsers();
  const registerUser = useRegisterUser();
  const users = data?.users || [];

  const [form, setForm] = useState({ userId: "", fullName: "", email: "", role: "cashier", mobile: "", username: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});

  const roleLabels = { admin: lang === "ar" ? "مدير" : "Admin", manager: lang === "ar" ? "مدير فرع" : "Manager", cashier: lang === "ar" ? "كاشير" : "Cashier" };
  const roleOptions = useMemo(() => (canCreate ? ["admin", "manager", "cashier"] : ["cashier"]), [canCreate]);
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const next = {};
    if (!form.userId.trim()) next.userId = lang === "ar" ? "معرف المستخدم مطلوب" : "User ID is required";
    if (!form.fullName.trim()) next.fullName = lang === "ar" ? "الاسم مطلوب" : "Full name is required";
    if (!form.email.trim()) next.email = lang === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = lang === "ar" ? "بريد إلكتروني غير صالح" : "Invalid email address";
    if (!form.username.trim()) next.username = lang === "ar" ? "اسم المستخدم مطلوب" : "Username is required";
    if (!form.mobile.trim()) next.mobile = lang === "ar" ? "رقم الجوال مطلوب" : "Mobile number is required";
    if (!form.password || form.password.length < 6) next.password = lang === "ar" ? "كلمة المرور 6 أحرف على الأقل" : "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) next.confirmPassword = lang === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match";
    setErrors(next); return Object.keys(next).length === 0;
  };

  const handleCreate = () => {
    if (!canCreate || !validate()) return;
    registerUser.mutate({ userId: form.userId, fullName: form.fullName, email: form.email, role: form.role, mobile: form.mobile, username: form.username, password: form.password },
      { onSuccess: () => setForm({ userId: "", fullName: "", email: "", role: "cashier", mobile: "", username: "", password: "", confirmPassword: "" }) });
  };

  return (<div className="space-y-4">
    <h2 className="pos-page-title">{t("masters.addUser")}</h2>
    <div className="pos-card p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
      <div><label className="pos-label">{lang === "ar" ? "الدور الحالي" : "Current Role"}</label><div className="pos-input bg-accent/30 cursor-default">{operatorRole}</div></div>
      <div className="md:col-span-2 rounded-md border border-border bg-accent/20 px-3 py-2 text-xs text-muted-foreground">{canCreate ? (lang === "ar" ? "يمكنك إنشاء مستخدمين وتعيين الصلاحيات" : "You can create users and assign roles") : (lang === "ar" ? "إنشاء المستخدمين متاح فقط للإدارة" : "User creation is restricted to admin")}</div>
    </div>

    <div className="pos-card p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><label className="pos-label">{lang === "ar" ? "معرف المستخدم" : "User ID"}</label><input className="pos-input" value={form.userId} onChange={(e) => update("userId", e.target.value)} />{errors.userId && <p className="text-xs text-destructive mt-1">{errors.userId}</p>}</div>
      <div><label className="pos-label">{lang === "ar" ? "الاسم الكامل" : "Full Name"}</label><input className="pos-input" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />{errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}</div>
      <div><label className="pos-label">{lang === "ar" ? "البريد الإلكتروني" : "Email"}</label><input className="pos-input" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />{errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}</div>
      <div><label className="pos-label">{lang === "ar" ? "الدور" : "Role"}</label><select className="pos-select" value={form.role} onChange={(e) => update("role", e.target.value)}>{roleOptions.map((r) => <option key={r} value={r}>{roleLabels[r]}</option>)}</select></div>
      <div><label className="pos-label">{lang === "ar" ? "الجوال" : "Mobile"}</label><input className="pos-input" value={form.mobile} onChange={(e) => update("mobile", e.target.value)} />{errors.mobile && <p className="text-xs text-destructive mt-1">{errors.mobile}</p>}</div>
      <div><label className="pos-label">{lang === "ar" ? "اسم المستخدم" : "Username"}</label><input className="pos-input" value={form.username} onChange={(e) => update("username", e.target.value)} />{errors.username && <p className="text-xs text-destructive mt-1">{errors.username}</p>}</div>
      <div><label className="pos-label">{lang === "ar" ? "كلمة المرور" : "Password"}</label><input className="pos-input" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} />{errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}</div>
      <div className="md:col-span-2"><label className="pos-label">{lang === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}</label><input className="pos-input" type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} />{errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}</div>
    </div>

    <div className="flex justify-center gap-3">
      <button className="pos-btn-secondary gap-1" onClick={() => setForm({ userId: "", fullName: "", email: "", role: "cashier", mobile: "", username: "", password: "", confirmPassword: "" })}>{lang === "ar" ? "إعادة تعيين" : "Reset"}</button>
      <button className="pos-btn-primary gap-1" onClick={handleCreate} disabled={!canCreate || registerUser.isPending}>{registerUser.isPending ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />} {lang === "ar" ? "إنشاء مستخدم" : "Create User"}</button>
    </div>

    <div className="pos-card overflow-x-auto">
      <table className="pos-table min-w-[760px]">
        <thead><tr><th>{lang === "ar" ? "معرف المستخدم" : "User ID"}</th><th>{lang === "ar" ? "الاسم" : "Name"}</th><th>{lang === "ar" ? "البريد" : "Email"}</th><th>{lang === "ar" ? "الدور" : "Role"}</th><th>{lang === "ar" ? "الجوال" : "Mobile"}</th><th>{lang === "ar" ? "اسم المستخدم" : "Username"}</th></tr></thead>
        <tbody>
          {isLoading ? <tr><td colSpan={6} className="text-center py-8"><Loader2 size={20} className="animate-spin inline-block" /></td></tr>
          : users.map((u) => <tr key={u._id || u.userId}><td>{u.userId}</td><td>{u.fullName}</td><td>{u.email || "—"}</td><td>{roleLabels[String(u.role).toLowerCase()] || u.role}</td><td>{u.mobile || "—"}</td><td>{u.username}</td></tr>)}
        </tbody>
      </table>
    </div>
  </div>);
}