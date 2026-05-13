import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import { Trash2, Search, Loader2 } from "lucide-react";

export default function DeleteProductsPage() {
  const { t, lang } = useLanguage();
  const deleteProduct = useDeleteProduct();
  const [code, setCode] = useState("");
  const [foundProduct, setFoundProduct] = useState(null);
  const [reason, setReason] = useState("Duplicate");
  const [remarks, setRemarks] = useState("");

  const { data: prodData } = useProducts({ limit: 5000 });
  const allProducts = prodData?.products || [];

  const handleSearch = () => {
    const found = allProducts.find((p) => p.productCode === code || p.productId === code);
    setFoundProduct(found || null);
  };

  const handleDelete = () => {
    if (!foundProduct) return;
    deleteProduct.mutate(foundProduct._id, { onSuccess: () => { setFoundProduct(null); setCode(""); setRemarks(""); } });
  };

  return (<div className="space-y-4">
    <h2 className="pos-page-title">{t("masters.deleteProducts")}</h2>
    <div className="pos-card p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex gap-2"><input className="pos-input flex-1" placeholder={lang === "ar" ? "كود المنتج" : "Product Code"} value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} /><button className="pos-btn-primary gap-1" onClick={handleSearch}><Search size={14} /></button></div>
      <input className="pos-input" placeholder={lang === "ar" ? "اسم المنتج" : "Product Name"} value={foundProduct?.productName || ""} readOnly />
      <input className="pos-input" type="number" placeholder={lang === "ar" ? "الكمية الحالية" : "Current Qty"} value={foundProduct?.quantity ?? ""} readOnly />
      <select className="pos-select" value={reason} onChange={(e) => setReason(e.target.value)}><option value="Duplicate">{lang === "ar" ? "مكرر" : "Duplicate"}</option><option value="Discontinued">{lang === "ar" ? "متوقف" : "Discontinued"}</option><option value="Wrong Entry">{lang === "ar" ? "إدخال خاطئ" : "Wrong Entry"}</option></select>
      <input className="pos-input md:col-span-2" placeholder={lang === "ar" ? "ملاحظات" : "Remarks"} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
    </div>
    <div className="flex justify-center"><button className="pos-btn-primary gap-1" style={{ background: "hsl(var(--destructive))" }} onClick={handleDelete} disabled={!foundProduct || deleteProduct.isPending}>{deleteProduct.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} {lang === "ar" ? "طلب حذف" : "Request Delete"}</button></div>
  </div>);
}