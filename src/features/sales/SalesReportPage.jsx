import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSales, useSaleByBillNo } from "@/hooks/useSales";
import { useUsers } from "@/hooks/useUsers";
import { Search, Eye, Printer, Loader2, X, ReceiptText, RotateCcw, AlertCircle } from "lucide-react";

const TAB_SALES = "SALE";
const TAB_RETURNS = "RETURN";

export default function SalesReportPage() {
  const { t, lang } = useLanguage();

  // Tabs
  const [activeTab, setActiveTab] = useState(TAB_SALES);

  // Filters
  const [user, setUser] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchParams, setSearchParams] = useState({ type: TAB_SALES });

  // Bill detail viewer
  const [viewBillNo, setViewBillNo] = useState(null);

  // Data
  const { data, isLoading, isError, error } = useSales(searchParams);
  const { data: userData } = useUsers();
  const users = userData?.users || [];

  const { data: saleDetail, isLoading: detailLoading } = useSaleByBillNo(viewBillNo);
  const records = data?.sales || [];

  const handleSearch = () => {
    const params = { type: activeTab };
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    if (user) params.createdBy = user;
    setSearchParams(params);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setViewBillNo(null);
    const params = { type: tab };
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    if (user) params.createdBy = user;
    setSearchParams(params);
  };

  const handlePrint = (billNo) => {
    setViewBillNo(billNo);
    // small delay so modal opens, then print
    setTimeout(() => window.print(), 300);
  };

  const isSaleTab = activeTab === TAB_SALES;

  return (
    <div className="space-y-4">
      <h2 className="pos-page-title">{t("report.salesReport")}</h2>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border">
        <button
          id="tab-sales"
          onClick={() => switchTab(TAB_SALES)}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            isSaleTab
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ReceiptText size={15} />
          {lang === "ar" ? "المبيعات" : "Sales"}
        </button>
        <button
          id="tab-returns"
          onClick={() => switchTab(TAB_RETURNS)}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            !isSaleTab
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <RotateCcw size={15} />
          {lang === "ar" ? "مرتجعات المبيعات" : "Sales Returns"}
        </button>
      </div>

      {/* Filters */}
      <div className="pos-card p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 flex-wrap">
          <div>
            <label className="pos-label">{t("report.selectUser")}</label>
            <select
              className="pos-select w-40"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            >
              <option value="">{lang === "ar" ? "الكل" : "All Users"}</option>
              {users.map((u) => (
                <option key={u._id} value={u.userId}>
                  {u.username}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="pos-label">{t("report.from")}</label>
            <input
              type="date"
              className="pos-input w-40"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <label className="pos-label">{t("report.to")}</label>
            <input
              type="date"
              className="pos-input w-40"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <button
            id="btn-search-report"
            className="pos-btn-primary gap-1"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            {t("report.submit")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="pos-card overflow-x-auto">
        {/* Tab badge */}
        <div className="px-4 py-2 border-b border-border flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isSaleTab
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
            }`}
          >
            {isSaleTab
              ? lang === "ar" ? "مبيعات" : "SALES"
              : lang === "ar" ? "مرتجعات" : "RETURNS"}
          </span>
          <span className="text-xs text-muted-foreground">
            {records.length} {lang === "ar" ? "سجل" : "record(s)"}
          </span>
        </div>

        <table className="pos-table">
          <thead>
            <tr>
              <th className="w-14">{t("sales.slNo")}</th>
              <th>{t("report.billNo")}</th>
              <th>{t("report.billDate")}</th>
              <th>{lang === "ar" ? "العميل" : "Customer"}</th>
              <th>{t("report.amount")}</th>
              <th>{t("report.paymentMode")}</th>
              <th>{lang === "ar" ? "بواسطة" : "Created By"}</th>
              <th className="w-16">{t("report.view")}</th>
              <th className="w-16">{t("report.print")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="text-center py-8">
                  <Loader2 size={20} className="animate-spin inline-block" />
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-destructive bg-destructive/5">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle size={24} />
                    <p className="font-semibold">{lang === "ar" ? "فشل تحميل البيانات" : "Failed to load data"}</p>
                    <p className="text-xs opacity-70">{error?.message || "Unknown error"}</p>
                  </div>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center text-muted-foreground py-8">
                  {isSaleTab
                    ? lang === "ar" ? "لا توجد مبيعات" : "No sales found"
                    : lang === "ar" ? "لا توجد مرتجعات" : "No returns found"}
                </td>
              </tr>
            ) : (

              records.map((rec, i) => (
                <tr key={rec._id || i}>
                  <td>{i + 1}</td>
                  <td className="font-medium">{rec.billNo}</td>
                  <td>{new Date(rec.createdAt).toLocaleString()}</td>
                  <td>{rec.customer?.customerName || rec.customer || "—"}</td>
                  <td className="pos-amount">{rec.netAmount}</td>
                  <td>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      rec.paymentMode === "CASH" || rec.paymentMode === "Cash"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      {rec.paymentMode}
                    </span>
                  </td>
                  <td className="text-xs text-muted-foreground">{rec.createdBy || "—"}</td>
                  <td>
                    <button
                      id={`btn-view-${rec.billNo}`}
                      className="text-primary hover:opacity-70"
                      onClick={() => setViewBillNo(rec.billNo)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                  <td>
                    <button
                      className="text-muted-foreground hover:opacity-70"
                      onClick={() => handlePrint(rec.billNo)}
                    >
                      <Printer size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Totals footer */}
        {records.length > 0 && (
          <div className="px-4 py-3 border-t border-border flex justify-end gap-6 text-sm">
            <span className="text-muted-foreground">
              {lang === "ar" ? "الإجمالي:" : "Total:"}
            </span>
            <span className="font-bold text-primary">
              SR {records.reduce((s, r) => s + (parseFloat(r.netAmount) || 0), 0).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {viewBillNo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 print:hidden" id="report-detail-backdrop">
          <div className="bg-card w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-lg shadow-xl flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-primary text-primary-foreground">
              <h3 className="font-bold">
                {isSaleTab
                  ? lang === "ar" ? "تفاصيل الفاتورة" : "Invoice Details"
                  : lang === "ar" ? "تفاصيل المرتجع" : "Return Details"}
                {" "}— #{viewBillNo}
              </h3>
              <button
                id="btn-close-detail"
                onClick={() => setViewBillNo(null)}
                className="hover:opacity-70"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 overflow-y-auto flex-1">
              {detailLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={24} className="animate-spin" />
                </div>
              ) : saleDetail ? (
                <div className="space-y-4">
                  {/* Meta info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">{lang === "ar" ? "رقم الفاتورة" : "Bill No"}</p>
                      <p className="font-semibold">{saleDetail.billNo}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">{lang === "ar" ? "التاريخ" : "Date"}</p>
                      <p className="font-semibold">{new Date(saleDetail.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">{lang === "ar" ? "طريقة الدفع" : "Payment"}</p>
                      <p className="font-semibold">{saleDetail.paymentMode}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">{lang === "ar" ? "بواسطة" : "By"}</p>
                      <p className="font-semibold">{saleDetail.createdBy || "—"}</p>
                    </div>
                  </div>

                  {/* Items table */}
                  <table className="pos-table text-xs">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{lang === "ar" ? "المنتج" : "Product"}</th>
                        <th>{lang === "ar" ? "الكمية" : "Qty"}</th>
                        <th>{lang === "ar" ? "السعر" : "Price"}</th>
                        <th>{lang === "ar" ? "الإجمالي" : "Total"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(saleDetail.items || []).map((item, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{item.productName || item.code}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price}</td>
                          <td className="pos-amount">{item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div className="flex flex-col items-end gap-1 border-t border-border pt-3 text-sm">
                    <div className="flex gap-12">
                      <span className="text-muted-foreground">{lang === "ar" ? "المجموع" : "Sub Total"}</span>
                      <span>SR {saleDetail.totalAmount}</span>
                    </div>
                    {saleDetail.discount > 0 && (
                      <div className="flex gap-12">
                        <span className="text-muted-foreground">{lang === "ar" ? "الخصم" : "Discount"}</span>
                        <span>SR {saleDetail.discount}</span>
                      </div>
                    )}
                    <div className="flex gap-12 text-primary font-bold text-base">
                      <span>{lang === "ar" ? "الصافي" : "Net Amount"}</span>
                      <span>SR {saleDetail.netAmount}</span>
                    </div>
                    {/* {saleDetail.balance !== undefined && (
                      <div className="flex gap-12">
                        <span className="text-muted-foreground">{lang === "ar" ? "الباقي" : "Balance"}</span>
                        <span>SR {saleDetail.balance}</span>
                      </div>
                    )} */}
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {lang === "ar" ? "لا توجد بيانات" : "No data found"}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex justify-end gap-2">
              <button
                className="pos-btn-secondary gap-1"
                onClick={() => window.print()}
              >
                <Printer size={14} /> {lang === "ar" ? "طباعة" : "Print"}
              </button>
              <button
                className="pos-btn-primary"
                onClick={() => setViewBillNo(null)}
              >
                {lang === "ar" ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
