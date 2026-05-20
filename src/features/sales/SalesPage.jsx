import { useState, useCallback, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useCustomers } from "@/hooks/useCustomers";
import { useProducts } from "@/hooks/useProducts";
import { useCreateSale } from "@/hooks/useSales";
import { useSettings } from "@/hooks/useSettings";
import { Plus, Trash2, Loader2 } from "lucide-react";
import QRCode from "qrcode";

export default function SalesPage() {
  const { t, lang } = useLanguage();
  const { user } = useAuthContext();
  const { data: custData } = useCustomers();
  const { data: prodData } = useProducts({ limit: 5000 });
  const { data: settings } = useSettings();
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

  const [printData, setPrintData] = useState(null);
  const [qrBase64, setQrBase64] = useState("");

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
          updated.batchCode = foundProduct.batchCode || "";
          updated.expiryDate = foundProduct.expiryDate ? new Date(foundProduct.expiryDate).toISOString().split("T")[0] : "";
        } else if (field === "code" && !foundProduct) {
          updated.productName = "";
          updated.dbPrice = "";
          updated.batchCode = "";
          updated.expiryDate = "";
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
        const qty = parseFloat(updated.quantity) || 1;
        const unitPriceWithoutVat = regularPrice / qty;
        updated.price = unitPriceWithoutVat ? unitPriceWithoutVat.toFixed(2) : "";

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

  // ZATCA Base64 TLV QR Code Generator
  const generateZatcaTlv = (sellerName, vatNumber, timestamp, totalAmount, vatAmount) => {
    const encoder = new TextEncoder();
    
    const getTlv = (tag, value) => {
      const valueBytes = encoder.encode(String(value));
      const tagByte = tag;
      const lengthByte = valueBytes.length;
      const tlv = new Uint8Array(2 + lengthByte);
      tlv[0] = tagByte;
      tlv[1] = lengthByte;
      tlv.set(valueBytes, 2);
      return tlv;
    };

    const formattedTotal = Number(totalAmount).toFixed(2);
    const formattedVat = Number(vatAmount).toFixed(2);

    let formattedTime = timestamp;
    try {
      formattedTime = new Date(timestamp).toISOString();
    } catch (e) {
      formattedTime = new Date().toISOString();
    }

    const tag1 = getTlv(1, sellerName);
    const tag2 = getTlv(2, vatNumber);
    const tag3 = getTlv(3, formattedTime);
    const tag4 = getTlv(4, formattedTotal);
    const tag5 = getTlv(5, formattedVat);

    const totalLength = tag1.length + tag2.length + tag3.length + tag4.length + tag5.length;
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    [tag1, tag2, tag3, tag4, tag5].forEach((tag) => {
      combined.set(tag, offset);
      offset += tag.length;
    });

    let binary = "";
    for (let i = 0; i < combined.byteLength; i++) {
      binary += String.fromCharCode(combined[i]);
    }
    return btoa(binary);
  };

  const handleSave = (shouldPrint = false) => {
    const validItems = rows.filter((r) => r.code && r.quantity && r.price);
    if (validItems.length === 0) return;
    
    const paidAmt = parseFloat(amountPaid) || 0;
    const finalBalance = parseFloat(balance) || 0;

    const payload = {
      customer: customer || undefined,
      items: validItems.map((r) => ({
        code: r.code,
        productName: r.productName,
        batchCode: r.batchCode || undefined,
        expiryDate: r.expiryDate || undefined,
        type: r.type,
        quantity: Number(r.quantity),
        price: Number(r.price),
        vat: Number(r.vat) || 0,
        total: Number(r.total)
      })),
      totalAmount,
      discount: discountAmt,
      vatPercent: Number(vatPercent),
      netAmount,
      amountPaid: paidAmt || netAmount,
      balance: finalBalance,
      paymentMode,
      createdBy: user?.username || user?.fullName || "system",
    };

    createSale.mutate(payload, {
      onSuccess: async (res) => {
        const savedSale = res?.data || payload;
        
        // Auto-assign properties if backend leaves them empty
        if (!savedSale.billNo) {
          savedSale.billNo = "TEMP-" + Math.floor(Math.random() * 90000 + 10000);
        }
        if (!savedSale.createdAt) {
          savedSale.createdAt = new Date().toISOString();
        }

        if (shouldPrint) {
          // 1. Generate ZATCA QR Base64
          try {
            const storeName = settings?.storeName ;
            const vatNo = settings?.vatNumber;
            const vatRate = Number(savedSale.vatPercent || 15);
            const saleVatAmt = (Number(savedSale.netAmount) / (100 + vatRate)) * vatRate;
            
            const qrTlv = generateZatcaTlv(storeName, vatNo, savedSale.createdAt, savedSale.netAmount, saleVatAmt);
            const qrCodeUrl = await QRCode.toDataURL(qrTlv, { width: 140, margin: 1 });
            setQrBase64(qrCodeUrl);
          } catch (err) {
            console.error("ZATCA QR Generation Failed", err);
          }

          // 2. Set Print details
          const matchedCust = customers.find(c => c._id === customer);
          setPrintData({
            ...savedSale,
            customerName: matchedCust ? matchedCust.customerName : (customer || "")
          });

          // 3. Print receipt and reset forms after window triggers
          setTimeout(() => {
            window.print();
            setPrintData(null);
            setQrBase64("");
            resetForm();
          }, 400);
        } else {
          resetForm();
        }
      },
    });
  };

  const resetForm = () => {
    setRows([emptyRow(1)]);
    setCustomer("");
    setAmountPaid("");
    setBalance("");
    setDiscount("");
    setSummaryProductName("");
    setSummaryPrice("");
    setSummaryRemaining("");
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

    {/* Totals & Cash Payment inputs (Discount, Amount Paid, Balance) */}
    <div className="pos-card p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="pos-label">{t("sales.discount")} (SR)</label>
          <input
            type="number"
            className="pos-input animate-pulse focus:animate-none"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="0.00"
            min="0"
          />
        </div>
        <div>
          <label className="pos-label">{t("sales.paymentMode")}</label>
          <select className="pos-select" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
            <option value="CREDIT CARD">{t("sales.creditCard")}</option>
            <option value="CASH">{t("sales.cash")}</option>
          </select>
        </div>
        <div>
          <label className="pos-label">{t("sales.amountPaid")} (SR)</label>
          <input
            type="number"
            className="pos-input"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            placeholder="0.00"
            min="0"
          />
        </div>
        <div>
          <label className="pos-label">{lang === "ar" ? "المتبقي" : "Change / Balance"} (SR)</label>
          <div className="pos-input bg-accent/20 font-bold flex items-center h-10 px-3 cursor-default rounded-md border border-input">
            <span className={parseFloat(balance) >= 0 ? "text-success" : "text-destructive"}>
              {t("common.sr")} {balance}
            </span>
          </div>
        </div>
      </div>
      
      <div className="border-t border-border mt-6 pt-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-4 flex-wrap text-sm text-muted-foreground">
          <div>
            <span>{t("sales.totalAmount")}: </span>
            <span className="font-semibold text-foreground">{t("common.sr")} {totalAmount.toFixed(2)}</span>
          </div>
          <div>
            <span>{t("sales.discount")}: </span>
            <span className="font-semibold text-destructive">{t("common.sr")} {discountAmt.toFixed(2)}</span>
          </div>
          <div>
            <span>{lang === "ar" ? "الضريبة المضافة" : "VAT (15%)"}: </span>
            <span className="font-semibold text-foreground">{t("common.sr")} {vatAmt.toFixed(2)}</span>
          </div>
        </div>
        <div className="text-center md:text-right">
          <p className="pos-label mb-0">{t("sales.netAmount")}</p>
          <p className="text-3xl font-extrabold text-primary">{t("common.sr")} {netAmount.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="flex justify-center gap-3 mt-6 border-t border-border pt-4">
        <button
          onClick={() => handleSave(true)}
          className="pos-btn-secondary gap-1"
          disabled={createSale.isPending}
        >
          {t("sales.print")}
        </button>
        <button
          className="pos-btn-primary gap-1"
          onClick={() => handleSave(false)}
          disabled={createSale.isPending}
        >
          {createSale.isPending && <Loader2 size={14} className="animate-spin" />} {t("sales.save")}
        </button>
      </div>
    </div>

    {/* ZATCA Compliant Arabic Thermal Invoice (Fatura) Print-Only Container */}
    {printData && (
      <div id="print-receipt" dir="rtl">
        <div className="thank-you-vertical">** شكرا لزيارتكم **</div>
        <div className="receipt-header">
          <h2 className="receipt-store-name">{settings?.storeName || "اسواق نبع الشلال للمواد الغذائية"}</h2>
          <p className="receipt-subtext">{settings?.storeAddress || "خميس مشيط - مخطط الحسام - الصناعية القديم"}</p>
          <p className="receipt-subtext">السجل التجاري : {settings?.crNumber || "7006133065"}</p>
          <p className="receipt-subtext">الرقم الضريبي : {settings?.vatNumber || "311465715100003"}</p>
          <p className="receipt-subtext">جوال : {settings?.supportContact || "0555917189"}</p>
        </div>
        
        <div className="receipt-divider-arrow">------------------------------------------</div>
        
        <div className="receipt-invoice-box">
          <div className="receipt-invoice-title">فاتورة ضريبية مبسطة</div>
          <div className="receipt-invoice-row">
            <span>رقم الفاتورة التسلسلي :</span>
            <span className="font-bold">{printData.billNo}</span>
          </div>
          <div className="receipt-invoice-row">
            <span>التاريخ :</span>
            <span>{new Date(printData.createdAt).toLocaleDateString("en-GB").replace(/\//g, "/")}</span>
          </div>
          <div className="receipt-invoice-row">
            <span>الوقت :</span>
            <span>{new Date(printData.createdAt).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
          </div>
          <div className="receipt-invoice-row">
            <span>نوع الفاتورة :</span>
            <span>مبيعات</span>
          </div>
          <div className="receipt-invoice-row">
            <span>طريقة الدفع :</span>
            <span>{printData.paymentMode === "CASH" ? "نقدا" : "شبكة"}</span>
          </div>
        </div>

        {printData.customerName && (
          <>
            <div className="receipt-divider">------------------------------------------</div>
            <div className="receipt-invoice-row">
              <span>اسم العميل :</span>
              <span className="font-semibold">{printData.customerName}</span>
            </div>
          </>
        )}

        <div className="receipt-divider">------------------------------------------</div>

        <table className="receipt-items-table">
          <thead>
            <tr>
              <th className="text-right">الصنف</th>
              <th className="text-center">العدد</th>
              <th className="text-center">سعر الوحدة</th>
              <th className="text-left">المجموع شامل الضريبة</th>
            </tr>
          </thead>
          <tbody>
            {printData.items.map((item, idx) => (
              <tr key={idx}>
                <td className="text-right">{item.productName}</td>
                <td className="text-center">{Number(item.quantity).toFixed(1)}</td>
                <td className="text-center">{Number(item.price).toFixed(2)}</td>
                <td className="text-left">{Number(item.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="receipt-divider">------------------------------------------</div>

        <div className="receipt-summary-box">
          <div className="receipt-summary-row">
            <span>اجمالي قيمة الفاتورة</span>
            <span>{Number(printData.totalAmount || 0).toFixed(2)}</span>
          </div>
          <div className="receipt-summary-row">
            <span>إجمالي الخصومات</span>
            <span>{Number(printData.discount || 0).toFixed(2)}</span>
          </div>
          <div className="receipt-summary-row font-semibold">
            <span>الإجمالي بدون الضريبة</span>
            <span>{(printData.netAmount / (1 + (Number(printData.vatPercent || 15) / 100))).toFixed(2)}</span>
          </div>
          <div className="receipt-summary-row">
            <span>الضريبة المضافة {Number(printData.vatPercent || 15)}٪</span>
            <span>{((printData.netAmount / (1 + (Number(printData.vatPercent || 15) / 100))) * (Number(printData.vatPercent || 15) / 100)).toFixed(2)}</span>
          </div>
          <div className="receipt-summary-row font-bold text-lg border-t border-dashed pt-1 mt-1">
            <span>إجمالي المبلغ المستحق</span>
            <span>{Number(printData.netAmount).toFixed(2)}</span>
          </div>
          <div className="receipt-summary-row text-xs opacity-80 mt-1">
            <span>TOTAL Quantity / إجمالي الكميات</span>
            <span>{printData.items.reduce((sum, item) => sum + Number(item.quantity), 0).toFixed(1)}</span>
          </div>
        </div>

        <div className="receipt-divider">------------------------------------------</div>

        <div className="receipt-payment-row font-semibold">
          <span>المدفوع</span>
          <span>{Number(printData.amountPaid || printData.netAmount).toFixed(2)}</span>
        </div>
        <div className="receipt-payment-row">
          <span>المتبقي</span>
          <span>{Number(printData.balance || 0).toFixed(2)}</span>
        </div>

        <div className="receipt-qr-section">
          {qrBase64 && <img src={qrBase64} alt="ZATCA QR" className="receipt-qr-img" />}
          <div className="receipt-qr-text">رمز الاستجابة السريعة QR CODE</div>
        </div>
      </div>
    )}

    <style>{`
      /* Hide standard app elements when printing */
      @media print {
        body * {
          visibility: hidden !important;
        }
        #print-receipt, #print-receipt * {
          visibility: visible !important;
        }
        #print-receipt {
          position: absolute;
          left: 0;
          top: 0;
          width: 72mm;
          padding: 2mm 3mm;
          margin: 0;
          background: #fff !important;
          color: #000 !important;
          font-family: 'IBM Plex Sans Arabic', 'Inter', sans-serif !important;
          box-sizing: border-box;
          font-size: 11px !important;
          line-height: 1.3 !important;
        }
        @page {
          size: auto;
          margin: 0mm;
        }
      }

      /* Receipt Screen styling for debugging/rendering */
      #print-receipt {
        display: none;
      }
      @media print {
        #print-receipt {
          display: block !important;
        }
      }

      /* Inner elements */
      .thank-you-vertical {
        position: absolute;
        left: -32px;
        top: 50%;
        transform: rotate(-90deg) translateY(-50%);
        font-size: 9px;
        font-weight: bold;
        letter-spacing: 1.5px;
        white-space: nowrap;
        opacity: 0.8;
      }
      .receipt-header {
        text-align: center;
        margin-bottom: 2px;
      }
      .receipt-store-name {
        font-size: 15px;
        font-weight: 800;
        margin: 0 0 2px 0;
      }
      .receipt-subtext {
        font-size: 10px;
        margin: 0 0 1px 0;
        opacity: 0.9;
      }
      .receipt-divider-arrow {
        text-align: center;
        margin: 1px 0;
        letter-spacing: -1px;
        font-size: 10px;
      }
      .receipt-divider {
        text-align: center;
        margin: 2px 0;
        letter-spacing: -1px;
        font-size: 10px;
      }
      .receipt-invoice-box {
        border: 1px solid #000;
        padding: 4px;
        margin: 4px 0;
        border-radius: 4px;
      }
      .receipt-invoice-title {
        font-weight: bold;
        font-size: 12px;
        text-align: center;
        margin-bottom: 3px;
        border-bottom: 1px dashed #000;
        padding-bottom: 2px;
      }
      .receipt-invoice-row {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        margin-bottom: 1px;
      }
      .receipt-items-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 10px;
        margin: 4px 0;
      }
      .receipt-items-table th {
        font-weight: bold;
        border-bottom: 1px solid #000;
        padding-bottom: 2px;
        font-size: 9px;
      }
      .receipt-items-table td {
        padding: 3px 0;
      }
      .receipt-summary-box {
        border: 1px solid #000;
        padding: 4px;
        margin: 4px 0;
        border-radius: 4px;
      }
      .receipt-summary-row {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        margin-bottom: 1px;
      }
      .receipt-payment-row {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        margin-bottom: 1px;
        padding: 0 4px;
      }
      .receipt-qr-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 8px;
        text-align: center;
      }
      .receipt-qr-img {
        width: 110px;
        height: 110px;
      }
      .receipt-qr-text {
        font-size: 9px;
        margin-top: 2px;
        font-weight: bold;
      }
    `}</style>
  </div>);
}
