import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProducts } from "@/hooks/useProducts";
import { useProcessStockCorrection } from "@/hooks/useStock";
import { Trash2, Plus, Loader2 } from "lucide-react";

export default function StockCorrectionPage() {
  const { t } = useLanguage();
  const { data: prodData } = useProducts({ limit: 5000 });
  const processCorrection = useProcessStockCorrection();
  const allProducts = prodData?.products || [];

  const emptyRow = (id) => ({ id, code: "", productName: "", batchCode: "", expiryDate: "", quantity: "", price: "", total: "" });
  const [rows, setRows] = useState([emptyRow(1), emptyRow(2)]);
  const totalAmount = rows.reduce((sum, r) => sum + (parseFloat(r.total) || 0), 0);

  const updateRow = (id, field, value) => {
    setRows((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: value };
      if (field === "code") {
        const found = allProducts.find((p) => p.productCode === value || p.productId === value);
        if (found) { updated.productName = found.productName; updated.price = String(found.sellingPrice || ""); }
      }
      const qty = parseFloat(updated.quantity) || 0;
      const price = parseFloat(updated.price) || 0;
      updated.total = (qty * price).toFixed(2);
      return updated;
    }));
  };

  const handleSave = () => {
    const validItems = rows.filter((r) => r.code && r.quantity);
    if (validItems.length === 0) return;
    processCorrection.mutate({ items: validItems.map((r) => ({ code: r.code, productName: r.productName, batchCode: r.batchCode || undefined, expiryDate: r.expiryDate || undefined, quantity: Number(r.quantity), price: Number(r.price) || 0, total: Number(r.total) || 0 })), totalAmount },
      { onSuccess: () => setRows([emptyRow(1), emptyRow(2)]) });
  };

  return (<div className="space-y-4">
    <h2 className="pos-page-title">{t("stockCorrection.title")}</h2>
    <div className="pos-summary-bar"><div className="pos-summary-cell pos-summary-cell-header">{t("sales.grandTotal")}</div><div className="pos-summary-cell pos-summary-cell-header">{t("sales.productName")}</div><div className="pos-summary-cell pos-summary-cell-header hidden md:block">{t("sales.productPrice")}</div><div className="pos-summary-cell pos-summary-cell-header hidden md:block">{t("stockCorrection.totalQty")}</div></div>
    <div className="pos-summary-bar"><div className="pos-summary-cell pos-summary-cell-value">{t("common.sr")} {totalAmount.toFixed(2)}</div><div className="pos-summary-cell pos-summary-cell-value text-sm"></div><div className="pos-summary-cell pos-summary-cell-value text-sm hidden md:block"></div><div className="pos-summary-cell pos-summary-cell-value text-sm hidden md:block"></div></div>

    <div className="pos-card overflow-x-auto">
      <table className="pos-table min-w-[700px]">
        <thead><tr><th className="w-14">{t("sales.slNo")}</th><th className="w-36">{t("sales.code")}</th><th>{t("sales.productName")}</th><th>{t("sales.batchCode")}</th><th>{t("sales.expiryDate")}</th><th className="w-20">{t("sales.quantity")}</th><th className="w-24">{t("sales.price")}</th><th className="w-24">{t("sales.total")}</th><th className="w-10"></th></tr></thead>
        <tbody>{rows.map((row) => (<tr key={row.id}><td>{row.id}</td><td><input type="text" className="pos-input" value={row.code} onChange={(e) => updateRow(row.id, "code", e.target.value)} /></td><td><input type="text" className="pos-input" value={row.productName} onChange={(e) => updateRow(row.id, "productName", e.target.value)} /></td><td><input type="text" className="pos-input" value={row.batchCode} onChange={(e) => updateRow(row.id, "batchCode", e.target.value)} /></td><td><input type="date" className="pos-input" value={row.expiryDate} onChange={(e) => updateRow(row.id, "expiryDate", e.target.value)} /></td><td><input type="number" className="pos-input" value={row.quantity} onChange={(e) => updateRow(row.id, "quantity", e.target.value)} /></td><td><input type="number" className="pos-input" value={row.price} onChange={(e) => updateRow(row.id, "price", e.target.value)} /></td><td className="pos-amount text-sm">{row.total}</td><td><button onClick={() => rows.length > 1 && setRows((p) => p.filter((r) => r.id !== row.id))} className="text-destructive hover:opacity-70"><Trash2 size={14} /></button></td></tr>))}</tbody>
      </table>
      <div className="flex justify-between items-center p-3"><button onClick={() => setRows((p) => [...p, emptyRow(p.length + 1)])} className="pos-btn-secondary gap-1"><Plus size={14} /> {t("purchase.addRow")}</button><div><span className="font-semibold mr-3">{t("sales.totalAmount")}</span><span className="pos-amount text-xl">{t("common.sr")} {totalAmount.toFixed(2)}</span></div></div>
      <div className="flex justify-end p-3"><button className="pos-btn-primary gap-1" onClick={handleSave} disabled={processCorrection.isPending}>{processCorrection.isPending && <Loader2 size={14} className="animate-spin" />} {t("sales.save")}</button></div>
    </div>
  </div>);
}
