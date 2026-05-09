import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Eye, Printer } from "lucide-react";
export default function SalesReportPage() {
  const { t, lang } = useLanguage();
    const [user, setUser] = useState("");
    const [fromDate, setFromDate] = useState("2026-01-28");
    const [toDate, setToDate] = useState("2026-03-28");
  const records = useMemo(() => {
    const localizedPaymentMode = lang === "ar" ? "بطاقة ائتمان" : "CREDIT CARD";
    return [
      { slNo: 1, billNo: "8498", billDate: "28-03-2026  09:31 AM", amount: 154, paymentMode: localizedPaymentMode },
      { slNo: 2, billNo: "8497", billDate: "27-03-2026  05:18 PM", amount: 20, paymentMode: localizedPaymentMode },
      { slNo: 3, billNo: "8496", billDate: "27-03-2026  04:30 PM", amount: 6, paymentMode: localizedPaymentMode },
      { slNo: 4, billNo: "8495", billDate: "27-03-2026  02:12 PM", amount: 45, paymentMode: localizedPaymentMode },
      { slNo: 5, billNo: "8494", billDate: "27-03-2026  02:10 PM", amount: 73, paymentMode: localizedPaymentMode },
      { slNo: 6, billNo: "8493", billDate: "26-03-2026  11:44 PM", amount: 20, paymentMode: localizedPaymentMode },
      { slNo: 7, billNo: "8492", billDate: "26-03-2026  08:27 PM", amount: 15, paymentMode: localizedPaymentMode },
      { slNo: 8, billNo: "8491", billDate: "26-03-2026  05:28 PM", amount: 45, paymentMode: localizedPaymentMode },
      { slNo: 9, billNo: "8490", billDate: "25-03-2026  12:28 PM", amount: 50, paymentMode: localizedPaymentMode },
      { slNo: 10, billNo: "8489", billDate: "24-03-2026  07:12 PM", amount: 6, paymentMode: localizedPaymentMode },
    ];
  }, [lang]);
    return (<div className="space-y-4">
      <h2 className="pos-page-title">{t("report.salesReport")}</h2>

      <div className="pos-card p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 flex-wrap">
          <div>
            <label className="pos-label">{t("report.selectUser")}</label>
            <select className="pos-select w-40" value={user} onChange={(e) => setUser(e.target.value)}>
              <option value="">{lang === "ar" ? "اختر المستخدم" : "Select User"}</option>
            </select>
          </div>
          <div>
            <label className="pos-label">{t("report.from")}</label>
            <input type="date" className="pos-input w-40" value={fromDate} onChange={(e) => setFromDate(e.target.value)}/>
          </div>
          <div>
            <label className="pos-label">{t("report.to")}</label>
            <input type="date" className="pos-input w-40" value={toDate} onChange={(e) => setToDate(e.target.value)}/>
          </div>
          <button className="pos-btn-primary gap-1">
            <Search size={14}/> {t("report.submit")}
          </button>
        </div>
      </div>

      <div className="pos-card overflow-x-auto">
        <table className="pos-table">
          <thead>
            <tr>
              <th className="w-14">{t("sales.slNo")}</th>
              <th>{t("report.billNo")}</th>
              <th>{t("report.billDate")}</th>
              <th>{t("report.amount")}</th>
              <th>{t("report.paymentMode")}</th>
              <th className="w-16">{t("report.view")}</th>
              <th className="w-16">{t("report.print")}</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (<tr key={rec.slNo}>
                <td>{rec.slNo}</td>
                <td>{rec.billNo}</td>
                <td>{rec.billDate}</td>
                <td>{rec.amount}</td>
                <td>{rec.paymentMode}</td>
                <td>
                  <button className="text-primary hover:opacity-70"><Eye size={16}/></button>
                </td>
                <td>
                  <button className="text-muted-foreground hover:opacity-70"><Printer size={16}/></button>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>);
}
