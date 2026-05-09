import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search } from "lucide-react";
export default function ViewPurchaseInvoicePage() {
    const { t } = useLanguage();
    const [searchType, setSearchType] = useState("date");
    const [fromDate, setFromDate] = useState("2026-03-01");
    const [toDate, setToDate] = useState("2026-03-28");
    const [invoiceNo, setInvoiceNo] = useState("");
    const [supplierName, setSupplierName] = useState("");
    const [purchaseOrderNo, setPurchaseOrderNo] = useState("");
    return (<div className="space-y-4">
      <h2 className="pos-page-title">{t("viewPurchase.title")}</h2>

      <div className="pos-card p-4">
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input type="radio" name="searchType" value="date" checked={searchType === "date"} onChange={() => setSearchType("date")} className="accent-primary"/>
            <span className="text-sm">{t("viewPurchase.selectDate")}</span>
            <input type="date" className="pos-input w-40 ml-2" value={fromDate} onChange={(e) => setFromDate(e.target.value)}/>
            <span className="text-sm">{t("viewPurchase.to")}</span>
            <input type="date" className="pos-input w-40" value={toDate} onChange={(e) => setToDate(e.target.value)}/>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="searchType" value="invoice" checked={searchType === "invoice"} onChange={() => setSearchType("invoice")} className="accent-primary"/>
            <span className="text-sm">{t("viewPurchase.invoiceNo")}</span>
            <input type="text" className="pos-input w-48 ml-2" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)}/>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="searchType" value="supplier" checked={searchType === "supplier"} onChange={() => setSearchType("supplier")} className="accent-primary"/>
            <span className="text-sm">{t("viewPurchase.supplierName")}</span>
            <select className="pos-select w-48 ml-2" value={supplierName} onChange={(e) => setSupplierName(e.target.value)}>
              <option value="">{t("purchase.selectSupplier")}</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="searchType" value="po" checked={searchType === "po"} onChange={() => setSearchType("po")} className="accent-primary"/>
            <span className="text-sm">{t("viewPurchase.purchaseOrderNo")}</span>
            <input type="text" className="pos-input w-48 ml-2" value={purchaseOrderNo} onChange={(e) => setPurchaseOrderNo(e.target.value)}/>
          </label>
          <button className="pos-btn-primary gap-1 mt-2">
            <Search size={14}/> {t("viewPurchase.search")}
          </button>
        </div>
      </div>

      <div className="pos-card overflow-x-auto">
        <table className="pos-table">
          <thead>
            <tr>
              <th className="w-14">{t("viewPurchase.no")}</th>
              <th>{t("viewPurchase.invoiceNo")}</th>
              <th>{t("purchase.invoiceDate")}</th>
              <th>{t("purchase.supplier")}</th>
              <th>{t("viewPurchase.purchaseOrderNo")}</th>
              <th>{t("viewPurchase.totalAmount")}</th>
              <th>{t("viewPurchase.viewEdit")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} className="text-center text-muted-foreground py-8">
                {t("viewPurchase.search")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>);
}
