import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, Trash2 } from "lucide-react";
export default function SalesPage() {
    const { t } = useLanguage();
    const emptyRow = (id) => ({
        id, code: "", productName: "", batchCode: "", expiryDate: "",
        type: "SINGLE", quantity: "", price: "", vat: "", total: "",
    });
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
    const updateRow = (id, field, value) => {
        setRows((prev) => prev.map((r) => {
            if (r.id !== id)
                return r;
            const updated = { ...r, [field]: value };
            const qty = parseFloat(updated.quantity) || 0;
            const price = parseFloat(updated.price) || 0;
            const subtotal = qty * price;
            const vatAmt = subtotal * 0.15;
            updated.vat = vatAmt ? vatAmt.toFixed(3) : "";
            updated.total = subtotal ? (subtotal + vatAmt).toFixed(2) : "";
            return updated;
        }));
    };
    const addRow = () => {
        setRows((prev) => [...prev, emptyRow(prev.length + 1)]);
    };
    const removeRow = (id) => {
        if (rows.length <= 1)
            return;
        setRows((prev) => prev.filter((r) => r.id !== id));
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
        <div className="pos-summary-cell pos-summary-cell-value">
          {t("common.sr")} {totalAmount.toFixed(2)}
        </div>
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
          </select>
          <input type="text" className="pos-input max-w-xs"/>
        </div>
      </div>

      {/* Items Table */}
      <div className="pos-card overflow-x-auto">
        <table className="pos-table min-w-[900px]">
          <thead>
            <tr>
              <th className="w-14">{t("sales.slNo")}</th>
              <th className="w-36">{t("sales.code")}</th>
              <th>{t("sales.productName")}</th>
              <th>{t("sales.batchCode")}</th>
              <th>{t("sales.expiryDate")}</th>
              <th className="w-24">{t("sales.type")}</th>
              <th className="w-20">{t("sales.quantity")}</th>
              <th className="w-24">{t("sales.price")}</th>
              <th className="w-20">{t("sales.vat")}</th>
              <th className="w-24">{t("sales.total")}</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (<tr key={row.id}>
                <td>{row.id}</td>
                <td><input type="text" className="pos-input" value={row.code} onChange={(e) => updateRow(row.id, "code", e.target.value)}/></td>
                <td><input type="text" className="pos-input" value={row.productName} onChange={(e) => updateRow(row.id, "productName", e.target.value)}/></td>
                <td><input type="text" className="pos-input" value={row.batchCode} onChange={(e) => updateRow(row.id, "batchCode", e.target.value)}/></td>
                <td><input type="date" className="pos-input" value={row.expiryDate} onChange={(e) => updateRow(row.id, "expiryDate", e.target.value)}/></td>
                <td>
                  <select className="pos-select" value={row.type} onChange={(e) => updateRow(row.id, "type", e.target.value)}>
                    <option value="SINGLE">{t("sales.single")}</option>
                  </select>
                </td>
                <td><input type="number" className="pos-input" value={row.quantity} onChange={(e) => updateRow(row.id, "quantity", e.target.value)}/></td>
                <td><input type="number" className="pos-input" value={row.price} onChange={(e) => updateRow(row.id, "price", e.target.value)}/></td>
                <td className="text-sm">{row.vat}</td>
                <td className="pos-amount text-sm">{row.total}</td>
                <td>
                  <button onClick={() => removeRow(row.id)} className="text-destructive hover:opacity-70">
                    <Trash2 size={14}/>
                  </button>
                </td>
              </tr>))}
          </tbody>
        </table>

        <div className="flex justify-end p-3">
          <button onClick={addRow} className="pos-btn-secondary gap-1">
            <Plus size={14}/> {t("purchase.addRow")}
          </button>
        </div>

        {/* Total */}
        <div className="flex justify-end px-4 pb-3">
          <div className="text-right">
            <span className="font-semibold mr-3">{t("sales.totalAmount")}</span>
            <span className="pos-amount text-xl">{t("common.sr")} {totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment section */}
      <div className="pos-card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="pos-label">{t("sales.amountPaid")}</label>
            <input type="number" className="pos-input" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)}/>
          </div>
          <div>
            <label className="pos-label">{t("sales.balance")}</label>
            <input type="number" className="pos-input" value={balance} onChange={(e) => setBalance(e.target.value)}/>
          </div>
          <div>
            <label className="pos-label">{t("sales.paymentMode")}</label>
            <select className="pos-select" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
              <option value="CREDIT CARD">{t("sales.creditCard")}</option>
              <option value="CASH">{t("sales.cash")}</option>
            </select>
          </div>
        </div>

        {/* Right side summary */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-border pt-4">
          <div>
            <label className="pos-label">{t("sales.amount")}</label>
            <div className="text-sm">{totalAmount.toFixed(2)} {t("common.sr")}</div>
          </div>
          <div>
            <label className="pos-label">{t("sales.discount")}</label>
            <input type="number" className="pos-input" value={discount} onChange={(e) => setDiscount(e.target.value)}/>
          </div>
          <div>
            <label className="pos-label">{t("sales.vatPercent")}</label>
            <input type="number" className="pos-input" value={vatPercent} onChange={(e) => setVatPercent(e.target.value)}/>
          </div>
          <div>
            <label className="pos-label">{t("sales.netAmount")}</label>
            <div className="text-sm font-semibold">{totalAmount.toFixed(2)}</div>
          </div>
          <div>
            <label className="pos-label">{t("sales.amountPaid")}</label>
            <input type="number" className="pos-input" value={amountPaid} readOnly/>
          </div>
          <div>
            <label className="pos-label">{t("sales.balance")}</label>
            <div className="text-sm">{balance}</div>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-6">
          <button className="pos-btn-secondary">{t("sales.print")}</button>
          <button className="pos-btn-primary">{t("sales.save")}</button>
        </div>
      </div>
    </div>);
}
