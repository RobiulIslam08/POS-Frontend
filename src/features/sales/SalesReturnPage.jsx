import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import { useCreateSalesReturn } from "@/hooks/useSales";
import { Trash2, Plus, Loader2 } from "lucide-react";

export default function SalesReturnPage() {
  const { t, lang } = useLanguage();
  const { user } = useAuthContext();
  const { data: prodData } = useProducts({ limit: 5000 });
  const createReturn = useCreateSalesReturn();
  const allProducts = prodData?.products || [];

  const emptyRow = (id) => ({ id, code: "", productName: "", batchCode: "", expiryDate: "", type: "SINGLE", quantity: "", price: "", total: "" });
  const [rows, setRows] = useState([emptyRow(1)]);
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [discount, setDiscount] = useState("");
  const [vatPercent, setVatPercent] = useState("15");
  const [amountPaid, setAmountPaid] = useState("");
  const [balance, setBalance] = useState("");
  const totalAmount = rows.reduce((sum, r) => sum + (parseFloat(r.total) || 0), 0);
  const discountAmt = parseFloat(discount) || 0;
  const vatAmt = (totalAmount - discountAmt) * (parseFloat(vatPercent) / 100);
  const netAmount = totalAmount - discountAmt + vatAmt;

  // Auto-calculate balance
  useEffect(() => {
    const amtPaid = parseFloat(amountPaid) || 0;
    const bal = amtPaid - netAmount;
    setBalance(bal.toFixed(2));
  }, [netAmount, amountPaid]);

  // Sync rows' product names when language changes
  useEffect(() => {
    if (!allProducts.length) return;
    setRows((prev) =>
      prev.map((row) => {
        if (!row.code) return row;
        const found = allProducts.find((p) => p.productCode === row.code || p.productId === row.code);
        if (found) {
          const translatedName = lang === "ar" ? (found.arabicName || found.productName) : found.productName;
          return { ...row, productName: translatedName };
        }
        return row;
      })
    );
  }, [lang, allProducts]);

  const updateRow = (id, field, value) => {
    setRows((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: value };
      if (field === "code") {
        const found = allProducts.find((p) => p.productCode === value || p.productId === value);
        if (found) { 
          updated.productName = lang === "ar" ? (found.arabicName || found.productName) : found.productName; 
          updated.price = String(found.sellingPrice || ""); 
          updated.batchCode = found.batchCode || "";
          updated.expiryDate = found.expiryDate ? new Date(found.expiryDate).toISOString().split("T")[0] : "";
        } else {
          updated.batchCode = "";
          updated.expiryDate = "";
        }
      }
      const qty = parseFloat(updated.quantity) || 0;
      const price = parseFloat(updated.price) || 0;
      updated.total = (qty * price).toFixed(2);
      return updated;
    }));
  };

  const handleSave = () => {
    const validItems = rows.filter((r) => r.code && r.quantity && r.price);
    if (validItems.length === 0) return;
    createReturn.mutate({
      items: validItems.map((r) => ({ code: r.code, productName: r.productName, batchCode: r.batchCode || undefined, expiryDate: r.expiryDate || undefined, type: r.type, quantity: Number(r.quantity), price: Number(r.price), total: Number(r.total) })),
      totalAmount, discount: discountAmt, vatPercent: Number(vatPercent), netAmount,
      amountPaid: Number(amountPaid) || 0, balance: Number(balance) || 0, paymentMode, createdBy: user?.username || "system",

    }, { onSuccess: () => { setRows([emptyRow(1)]); setAmountPaid(""); setBalance(""); setDiscount(""); } });
  };

  return (<div className="space-y-4">
    <h2 className="pos-page-title">{t("salesReturn.title")}</h2>
    <div className="pos-summary-bar"><div className="pos-summary-cell pos-summary-cell-header">{t("sales.grandTotal")}</div><div className="pos-summary-cell pos-summary-cell-header">{t("sales.productName")}</div><div className="pos-summary-cell pos-summary-cell-header hidden md:block">{t("sales.productPrice")}</div><div className="pos-summary-cell pos-summary-cell-header hidden md:block">{t("sales.remainingQty")}</div></div>
    <div className="pos-summary-bar"><div className="pos-summary-cell pos-summary-cell-value">{t("common.sr")} {totalAmount.toFixed(2)}</div><div className="pos-summary-cell pos-summary-cell-value text-sm"></div><div className="pos-summary-cell pos-summary-cell-value text-sm hidden md:block"></div><div className="pos-summary-cell pos-summary-cell-value text-sm hidden md:block"></div></div>

    <div className="pos-card overflow-x-auto">
      <table className="pos-table min-w-[800px]">
        <thead><tr><th className="w-14">{t("sales.slNo")}</th><th className="w-36">{t("sales.code")}</th><th>{t("sales.productName")}</th><th>{t("sales.batchCode")}</th><th>{t("sales.expiryDate")}</th><th className="w-24">{t("sales.type")}</th><th className="w-20">{t("sales.quantity")}</th><th className="w-24">{t("sales.price")}</th><th className="w-24">{t("sales.total")}</th><th className="w-10"></th></tr></thead>
        <tbody>{rows.map((row) => (<tr key={row.id}><td>{row.id}</td><td><input type="text" className="pos-input" value={row.code} onChange={(e) => updateRow(row.id, "code", e.target.value)} /></td><td><input type="text" className="pos-input" value={row.productName} onChange={(e) => updateRow(row.id, "productName", e.target.value)} /></td><td><input type="text" className="pos-input" value={row.batchCode} onChange={(e) => updateRow(row.id, "batchCode", e.target.value)} /></td><td><input type="date" className="pos-input" value={row.expiryDate} onChange={(e) => updateRow(row.id, "expiryDate", e.target.value)} /></td><td><select className="pos-select" value={row.type} onChange={(e) => updateRow(row.id, "type", e.target.value)}><option value="SINGLE">{t("sales.single")}</option></select></td><td><input type="number" className="pos-input" value={row.quantity} onChange={(e) => updateRow(row.id, "quantity", e.target.value)} /></td><td><input type="number" className="pos-input" value={row.price} onChange={(e) => updateRow(row.id, "price", e.target.value)} /></td><td className="pos-amount text-sm">{row.total}</td><td><button onClick={() => rows.length > 1 && setRows((p) => p.filter((r) => r.id !== row.id))} className="text-destructive hover:opacity-70"><Trash2 size={14} /></button></td></tr>))}</tbody>
      </table>
      <div className="flex justify-between items-center p-3"><button onClick={() => setRows((p) => [...p, emptyRow(p.length + 1)])} className="pos-btn-secondary gap-1"><Plus size={14} /> {t("purchase.addRow")}</button><div><span className="font-semibold mr-3">{t("sales.totalAmount")}</span><span className="pos-amount text-xl">{t("common.sr")} {totalAmount.toFixed(2)}</span></div></div>
    </div>

    <div className="pos-card p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div><label className="pos-label">{t("sales.paymentMode")}</label><select className="pos-select" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}><option value="CASH">{t("sales.cash")}</option><option value="CREDIT CARD">{t("sales.creditCard")}</option></select></div>
        <div><label className="pos-label">{t("sales.discount")}</label><input type="number" className="pos-input" value={discount} onChange={(e) => setDiscount(e.target.value)} /></div>
        <div><label className="pos-label">{t("sales.vatPercent")}</label><input type="number" className="pos-input" value={vatPercent} onChange={(e) => setVatPercent(e.target.value)} /></div>
        <div><label className="pos-label">{t("sales.netAmount")}</label><div className="text-sm font-semibold">{netAmount.toFixed(2)}</div></div>
        <div><label className="pos-label">{t("sales.amountPaid")}</label><input type="number" className="pos-input" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} /></div>
        <div><label className="pos-label">{t("sales.balance")}</label><input type="number" className="pos-input" value={balance} onChange={(e) => setBalance(e.target.value)} /></div>
      </div>
      <div className="flex justify-center gap-3 mt-6">
        <button onClick={() => window.print()} className="pos-btn-secondary">{t("sales.print")}</button>
        <button className="pos-btn-primary gap-1" onClick={handleSave} disabled={createReturn.isPending}>{createReturn.isPending && <Loader2 size={14} className="animate-spin" />} {t("sales.save")}</button>
      </div>
    </div>
  </div>);
}
