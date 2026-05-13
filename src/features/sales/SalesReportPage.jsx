import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSales, useSaleByBillNo } from "@/hooks/useSales";
import { Search, Eye, Printer, Loader2 } from "lucide-react";

export default function SalesReportPage() {
  const { t, lang } = useLanguage();
  const [user, setUser] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchParams, setSearchParams] = useState({});
  const [viewBillNo, setViewBillNo] = useState(null);

  const { data, isLoading } = useSales(searchParams);
  const { data: saleDetail } = useSaleByBillNo(viewBillNo);
  const sales = data?.sales || [];

  const handleSearch = () => {
    const params = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    if (user) params.createdBy = user;
    setSearchParams(params);
  };

  return (<div className="space-y-4">
    <h2 className="pos-page-title">{t("report.salesReport")}</h2>
    <div className="pos-card p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 flex-wrap">
        <div><label className="pos-label">{t("report.selectUser")}</label><select className="pos-select w-40" value={user} onChange={(e) => setUser(e.target.value)}><option value="">{lang === "ar" ? "اختر المستخدم" : "Select User"}</option></select></div>
        <div><label className="pos-label">{t("report.from")}</label><input type="date" className="pos-input w-40" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></div>
        <div><label className="pos-label">{t("report.to")}</label><input type="date" className="pos-input w-40" value={toDate} onChange={(e) => setToDate(e.target.value)} /></div>
        <button className="pos-btn-primary gap-1" onClick={handleSearch} disabled={isLoading}>{isLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />} {t("report.submit")}</button>
      </div>
    </div>

    <div className="pos-card overflow-x-auto">
      <table className="pos-table">
        <thead><tr><th className="w-14">{t("sales.slNo")}</th><th>{t("report.billNo")}</th><th>{t("report.billDate")}</th><th>{t("report.amount")}</th><th>{t("report.paymentMode")}</th><th className="w-16">{t("report.view")}</th><th className="w-16">{t("report.print")}</th></tr></thead>
        <tbody>
          {isLoading ? (<tr><td colSpan={7} className="text-center py-8"><Loader2 size={20} className="animate-spin inline-block" /></td></tr>)
          : sales.length === 0 ? (<tr><td colSpan={7} className="text-center text-muted-foreground py-8">{lang === "ar" ? "لا توجد مبيعات" : "No sales found"}</td></tr>)
          : sales.map((rec, i) => (<tr key={rec._id || i}>
            <td>{i + 1}</td><td>{rec.billNo}</td><td>{new Date(rec.createdAt).toLocaleString()}</td><td>{rec.netAmount}</td><td>{rec.paymentMode}</td>
            <td><button className="text-primary hover:opacity-70" onClick={() => setViewBillNo(rec.billNo)}><Eye size={16} /></button></td>
            <td><button className="text-muted-foreground hover:opacity-70" onClick={() => window.print()}><Printer size={16} /></button></td>
          </tr>))}
        </tbody>
      </table>
    </div>

    {saleDetail && viewBillNo && (<div className="pos-card p-4">
      <h3 className="font-semibold mb-2">Bill #{saleDetail.billNo}</h3>
      <table className="pos-table"><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
        <tbody>{(saleDetail.items || []).map((item, i) => (<tr key={i}><td>{item.productName}</td><td>{item.quantity}</td><td>{item.price}</td><td>{item.total}</td></tr>))}</tbody>
      </table>
      <div className="mt-2 text-right font-semibold">Net: SR {saleDetail.netAmount}</div>
      <button className="pos-btn-secondary mt-2" onClick={() => setViewBillNo(null)}>Close</button>
    </div>)}
  </div>);
}
