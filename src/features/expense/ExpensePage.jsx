import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useExpenses, usePostExpense, useApproveExpense } from "@/hooks/useExpenses";
import { Save, CheckCircle2, Printer, Loader2 } from "lucide-react";

export default function ExpensePage() {
  const { t, lang } = useLanguage();
  const { user } = useAuthContext();
  const operatorRole = user?.role || "cashier";
  const canApprove = operatorRole === "admin" || operatorRole === "manager";

  const [form, setForm] = useState({ voucherNo: "", expenseDate: "", category: "Utility", paidTo: "", amount: "", vat: "15", paymentMode: "Cash", remarks: "" });
  const [errors, setErrors] = useState({});

  const { data, isLoading } = useExpenses();
  const postExpense = usePostExpense();
  const approveExpense = useApproveExpense();
  const entries = data?.expenses || [];

  const netAmount = useMemo(() => { const amt = Number(form.amount) || 0; const vat = Number(form.vat) || 0; return (amt + amt * (vat / 100)).toFixed(2); }, [form.amount, form.vat]);
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const next = {};
    if (!form.voucherNo.trim()) next.voucherNo = lang === "ar" ? "رقم السند مطلوب" : "Voucher number is required";
    if (!form.expenseDate) next.expenseDate = lang === "ar" ? "تاريخ المصروف مطلوب" : "Expense date is required";
    if (!form.paidTo.trim()) next.paidTo = lang === "ar" ? "اسم المستفيد مطلوب" : "Paid to is required";
    if (!form.amount || Number(form.amount) <= 0) next.amount = lang === "ar" ? "المبلغ غير صالح" : "Amount must be greater than 0";
    setErrors(next); return Object.keys(next).length === 0;
  };

  const handlePost = () => {
    if (!validate()) return;
    postExpense.mutate({ voucherNo: form.voucherNo, expenseDate: form.expenseDate, category: form.category, paidTo: form.paidTo, amount: Number(form.amount), vat: Number(form.vat), netAmount: Number(netAmount), paymentMode: form.paymentMode, remarks: form.remarks || undefined, createdBy: user?.username || "system" },
      { onSuccess: () => setForm({ voucherNo: "", expenseDate: "", category: "Utility", paidTo: "", amount: "", vat: "15", paymentMode: "Cash", remarks: "" }) });
  };

  return (<div className="space-y-4">
    <h2 className="pos-page-title">{t("nav.expense")}</h2>
    <div className="pos-card p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
      <div><label className="pos-label">{lang === "ar" ? "الدور الحالي" : "Current Role"}</label><div className="pos-input bg-accent/30 cursor-default">{operatorRole}</div></div>
      <div className="md:col-span-2 text-xs text-muted-foreground rounded-md border border-border px-3 py-2 bg-accent/20">{canApprove ? (lang === "ar" ? "يمكنك ترحيل واعتماد المصروف" : "You can post and approve expenses") : (lang === "ar" ? "يمكنك ترحيل مصروف فقط، الاعتماد للإدارة" : "You can post only, approval is restricted to management")}</div>
    </div>

    <div className="pos-card p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><input className="pos-input" placeholder="Voucher No" value={form.voucherNo} onChange={(e) => update("voucherNo", e.target.value)} />{errors.voucherNo && <p className="text-xs text-destructive mt-1">{errors.voucherNo}</p>}</div>
      <div><input className="pos-input" type="date" value={form.expenseDate} onChange={(e) => update("expenseDate", e.target.value)} />{errors.expenseDate && <p className="text-xs text-destructive mt-1">{errors.expenseDate}</p>}</div>
      <select className="pos-select" value={form.category} onChange={(e) => update("category", e.target.value)}><option>Utility</option><option>Salary</option><option>Rent</option><option>Other</option></select>
      <div><input className="pos-input" placeholder={lang === "ar" ? "مدفوع إلى" : "Paid To"} value={form.paidTo} onChange={(e) => update("paidTo", e.target.value)} />{errors.paidTo && <p className="text-xs text-destructive mt-1">{errors.paidTo}</p>}</div>
      <div><input className="pos-input" type="number" placeholder="Amount" value={form.amount} onChange={(e) => update("amount", e.target.value)} />{errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount}</p>}</div>
      <input className="pos-input" type="number" placeholder="VAT %" value={form.vat} onChange={(e) => update("vat", e.target.value)} />
      <select className="pos-select" value={form.paymentMode} onChange={(e) => update("paymentMode", e.target.value)}><option>Cash</option><option>Card</option><option>Bank Transfer</option></select>
      <input className="pos-input" placeholder="Remarks" value={form.remarks} onChange={(e) => update("remarks", e.target.value)} />
      <div className="md:col-span-2 rounded-md border border-border bg-background/60 px-3 py-2 text-sm flex justify-between"><span>{lang === "ar" ? "الصافي شامل الضريبة" : "Net incl. VAT"}</span><strong>SR {netAmount}</strong></div>
    </div>

    <div className="flex justify-center gap-3">
      <button className="pos-btn-primary gap-1" onClick={handlePost} disabled={postExpense.isPending}>{postExpense.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {lang === "ar" ? "ترحيل المصروف" : "Post Expense"}</button>
      <button className="pos-btn-secondary gap-1" disabled={!canApprove}><CheckCircle2 size={14} /> {lang === "ar" ? "اعتماد المصروف" : "Approve Expense"}</button>
      <button className="pos-btn-secondary gap-1" onClick={() => window.print()}><Printer size={14} /> {lang === "ar" ? "طباعة القسيمة" : "Print Voucher"}</button>
    </div>

    <div className="pos-card overflow-x-auto">
      <table className="pos-table min-w-[900px]">
        <thead><tr><th>Voucher</th><th>Date</th><th>Category</th><th>Paid To</th><th>Net Amount</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {isLoading ? <tr><td colSpan={7} className="text-center py-8"><Loader2 size={20} className="animate-spin inline-block" /></td></tr>
          : entries.length === 0 ? <tr><td colSpan={7} className="text-center text-muted-foreground">{lang === "ar" ? "لا توجد قيود" : "No entries posted yet"}</td></tr>
          : entries.map((e) => <tr key={e._id}><td>{e.voucherNo}</td><td>{new Date(e.expenseDate).toLocaleDateString()}</td><td>{e.category}</td><td>{e.paidTo}</td><td>SR {e.netAmount}</td><td>{e.status}</td><td>{e.status === "Pending" && canApprove && <button className="text-xs text-primary" onClick={() => approveExpense.mutate(e._id)}>Approve</button>}</td></tr>)}
        </tbody>
      </table>
    </div>
  </div>);
}