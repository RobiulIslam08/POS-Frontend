import { useState, useCallback, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useCustomers } from "@/hooks/useCustomers";
import { useProducts } from "@/hooks/useProducts";
import { useCreateSale } from "@/hooks/useSales";
import { Plus, Trash2, Loader2 } from "lucide-react";

export default function SalesPage() {
  const { t, lang } = useLanguage();
  const { user } = useAuthContext();
  const { data: custData } = useCustomers();
  const { data: prodData } = useProducts({ limit: 5000 });
  const createSale = useCreateSale();

  const customers = custData?.customers || [];
  const allProducts = prodData?.products || [];

  const emptyRow = (id) => ({ id, code: "", productName: "", batchCode: "", expiryDate: "", type: "SINGLE", quantity: "", dbPrice: "", price: "", vat: "", total: "" });
  const [rows, setRows] = useState([emptyRow(1)]);
  const [customer, setCustomer] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [balance, setBalance] = useState("");
  const [paymentMode, setPaymentMode] = useState("CREDIT CARD");
  const [discount, setDiscount] = useState("");
  const [vatPercent, setVatPercent] = useState("15");
  const [summaryProductName, setSummaryProductName] = useState("");
  const [summaryPrice, setSummaryPrice] = useState("");
  const [summaryRemaining, setSummaryRemaining] = useState("");

  const totalAmount = rows.reduce((sum, r) => sum + (parseFloat(r.total) || 0), 0);
  const discountAmt = parseFloat(discount) || 0;
  // Since row totals are inclusive of VAT, netAmount is simply totalAmount - discountAmt
  const netAmount = totalAmount - discountAmt;
  const vatAmt = (netAmount / (100 + parseFloat(vatPercent))) * parseFloat(vatPercent);
  
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
    if (summaryProductName) {
      const found = allProducts.find((p) => p.productName === summaryProductName || p.arabicName === summaryProductName);
      if (found) {
        setSummaryProductName(lang === "ar" ? (found.arabicName || found.productName) : found.productName);
      }
    }
  }, [lang, allProducts]);

  const updateRow = (id, field, value) => {
    let foundProduct = null;
    if (field === "code") {
      foundProduct = allProducts.find((p) => p.productCode === value || p.productId === value);
      if (foundProduct) {
        setSummaryProductName(lang === "ar" ? (foundProduct.arabicName || foundProduct.productName) : foundProduct.productName);
        setSummaryPrice(String(foundProduct.sellingPrice));
        setSummaryRemaining(String(foundProduct.quantity));
      } else {
        setSummaryProductName("");
        setSummaryPrice("");
        setSummaryRemaining("");
      }
    }

    setRows((prev) => {
      const newRows = prev.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, [field]: value };

        if (field === "code" && foundProduct) {
          updated.productName = lang === "ar" ? (foundProduct.arabicName || foundProduct.productName) : foundProduct.productName;
          updated.dbPrice = String(foundProduct.sellingPrice || "");
        } else if (field === "code" && !foundProduct) {
          updated.productName = "";
          updated.dbPrice = "";
        }

        if (field === "quantity" || field === "code") {
          const qty = parseFloat(updated.quantity) || 0;
          const dbP = parseFloat(updated.dbPrice) || 0;
          const calculatedTotal = qty * dbP;
          updated.total = calculatedTotal ? calculatedTotal.toFixed(2) : "";
        } else if (field === "total") {
          updated.total = value;
        }

        const currentTotal = parseFloat(updated.total) || 0;
        const currentVatRate = parseFloat(vatPercent) || 15;
        const x = currentTotal / (100 + currentVatRate);
        const vatVal = x * currentVatRate;
        const regularPrice = x * 100;
        
        updated.vat = vatVal ? vatVal.toFixed(3) : "";
        updated.price = regularPrice ? regularPrice.toFixed(2) : "";

        return updated;
      });

      if (field === "code" && foundProduct && newRows[newRows.length - 1].id === id) {
        const nextId = newRows.length > 0 ? Math.max(...newRows.map(r => r.id)) + 1 : 1;
        newRows.push(emptyRow(nextId));
      }

      return newRows;
    });
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow(prev.length > 0 ? Math.max(...prev.map(r => r.id)) + 1 : 1)]);
  const removeRow = (id) => { if (rows.length <= 1) return; setRows((prev) => prev.filter((r) => r.id !== id)); };

  const handleSave = () => {
    const validItems = rows.filter((r) => r.code && r.quantity && r.price);
    if (validItems.length === 0) return;
    const payload = {
      customer: customer || undefined,
      items: validItems.map((r) => ({ code: r.code, productName: r.productName, batchCode: r.batchCode || undefined, expiryDate: r.expiryDate || undefined, type: r.type, quantity: Number(r.quantity), price: Number(r.price), vat: Number(r.vat) || 0, total: Number(r.total) })),
      totalAmount, discount: discountAmt, vatPercent: Number(vatPercent), netAmount,
      amountPaid: Number(amountPaid) || 0, balance: Number(balance) || 0,
      paymentMode, createdBy: user?.username || user?.fullName || "system",
    };
    createSale.mutate(payload, {
      onSuccess: () => {
        setRows([emptyRow(1)]); setCustomer(""); setAmountPaid(""); setBalance(""); setDiscount("");
        setSummaryProductName(""); setSummaryPrice(""); setSummaryRemaining("");
      },
    });
  };

  return (<div className="space-y-4">
    {/* Summary Bar */}
    <div className="pos-summary-bar">
      <div className="pos-summary-cell pos-summary-cell-header">{t("sales.grandTotal")}</div>
      <div className="pos-summary-cell pos-summary-cell-header">{t("sales.productName")}</div>
      <div className="pos-summary-cell pos-summary-cell-header hidden md:block">{t("sales.productPrice")}</div>
      <div className="pos-summary-cell pos-summary-cell-header hidden md:block">{t("sales.remainingQty")}</div>
    </div>
    <div className="pos-summary-bar">
      <div className="pos-summary-cell pos-summary-cell-value">{t("common.sr")} {netAmount.toFixed(2)}</div>
      <div className="pos-summary-cell pos-summary-cell-value text-foreground text-sm">{summaryProductName}</div>
      <div className="pos-summary-cell pos-summary-cell-value text-foreground text-sm hidden md:block">{summaryPrice}</div>
      <div className="pos-summary-cell pos-summary-cell-value text-foreground text-sm hidden md:block">{summaryRemaining}</div>
    </div>

    {/* Customer Selection */}
    <div className="pos-card p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <label className="pos-label whitespace-nowrap mb-0">{t("sales.customer")}</label>
        <select value={customer} onChange={(e) => setCustomer(e.target.value)} className="pos-select max-w-sm">
          <option value="">—</option>
          {customers.map((c) => <option key={c._id} value={c._id}>{c.customerName} ({c.customerCode})</option>)}
        </select>
      </div>
    </div>

    {/* Items Table */}
    <div className="pos-card overflow-x-auto">
      <table className="pos-table min-w-[900px]">
        <thead><tr>
          <th className="w-14">{t("sales.slNo")}</th><th className="w-36">{t("sales.code")}</th><th>{t("sales.productName")}</th><th>{t("sales.batchCode")}</th><th>{t("sales.expiryDate")}</th><th className="w-24">{t("sales.type")}</th><th className="w-20">{t("sales.quantity")}</th><th className="w-24">{t("sales.price")}</th><th className="w-20">{t("sales.vat")}</th><th className="w-24">{t("sales.total")}</th><th className="w-10"></th>
        </tr></thead>
        <tbody>
          {rows.map((row) => (<tr key={row.id}>
            <td>{row.id}</td>
            <td><input type="text" className="pos-input" value={row.code} onChange={(e) => updateRow(row.id, "code", e.target.value)} /></td>
            <td><input type="text" className="pos-input" value={row.productName} onChange={(e) => updateRow(row.id, "productName", e.target.value)} /></td>
            <td><input type="text" className="pos-input" value={row.batchCode} onChange={(e) => updateRow(row.id, "batchCode", e.target.value)} /></td>
            <td><input type="date" className="pos-input" value={row.expiryDate} onChange={(e) => updateRow(row.id, "expiryDate", e.target.value)} /></td>
            <td><select className="pos-select" value={row.type} onChange={(e) => updateRow(row.id, "type", e.target.value)}><option value="SINGLE">{t("sales.single")}</option><option value="BOX">BOX</option></select></td>
            <td><input type="number" className="pos-input" value={row.quantity} onChange={(e) => updateRow(row.id, "quantity", e.target.value)} /></td>
            <td><input type="number" className="pos-input" value={row.price} readOnly /></td>
            <td className="text-sm">{row.vat}</td>
            <td className="pos-amount"><input type="number" className="pos-input" value={row.total} onChange={(e) => updateRow(row.id, "total", e.target.value)} /></td>
            <td><button onClick={() => removeRow(row.id)} className="text-destructive hover:opacity-70"><Trash2 size={14} /></button></td>
          </tr>))}
        </tbody>
      </table>
      <div className="flex justify-end p-3"><button onClick={addRow} className="pos-btn-secondary gap-1"><Plus size={14} /> {t("purchase.addRow")}</button></div>
      <div className="flex justify-end px-4 pb-3"><div className="text-right"><span className="font-semibold mr-3">{t("sales.totalAmount")}</span><span className="pos-amount text-xl">{t("common.sr")} {totalAmount.toFixed(2)}</span></div></div>
    </div>

    {/* Payment section */}
    <div className="pos-card p-4">
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div><label className="pos-label">{t("sales.amountPaid")}</label><input type="number" className="pos-input" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} /></div>
        <div><label className="pos-label">{t("sales.balance")}</label><input type="number" className="pos-input" value={balance} onChange={(e) => setBalance(e.target.value)} /></div>
        <div><label className="pos-label">{t("sales.paymentMode")}</label><select className="pos-select" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}><option value="CREDIT CARD">{t("sales.creditCard")}</option><option value="CASH">{t("sales.cash")}</option></select></div>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-border pt-4">
        <div><label className="pos-label">{t("sales.amount")}</label><div className="text-sm">{totalAmount.toFixed(2)} {t("common.sr")}</div></div>
        <div><label className="pos-label">{t("sales.discount")}</label><input type="number" className="pos-input" value={discount} onChange={(e) => setDiscount(e.target.value)} /></div>
        <div><label className="pos-label">{t("sales.vatPercent")}</label><input type="number" className="pos-input" value={vatPercent} onChange={(e) => setVatPercent(e.target.value)} /></div>
        <div><label className="pos-label">{t("sales.netAmount")}</label><div className="text-sm font-semibold">{netAmount.toFixed(2)}</div></div>
        <div><label className="pos-label">{t("sales.amountPaid")}</label><input type="number" className="pos-input" value={amountPaid} readOnly /></div>
        <div><label className="pos-label">{t("sales.balance")}</label><div className="text-sm">{balance}</div></div>
      </div> */}
      <div className="flex justify-center gap-3 mt-6">
        <button onClick={() => window.print()} className="pos-btn-secondary">{t("sales.print")}</button>
        <button className="pos-btn-primary gap-1" onClick={handleSave} disabled={createSale.isPending}>
          {createSale.isPending && <Loader2 size={14} className="animate-spin" />} {t("sales.save")}
        </button>
      </div>
    </div>
  </div>);
}
