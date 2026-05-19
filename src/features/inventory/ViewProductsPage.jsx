import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProducts, useUpdateProduct } from "@/hooks/useProducts";
import { useFormulations } from "@/hooks/useFormulations";
import { Search, Pencil, Check, X, Loader2 } from "lucide-react";

export default function ViewProductsPage() {
  const { t } = useLanguage();
  const [keyword, setKeyword] = useState("");
  const [searchBy, setSearchBy] = useState("Select");
  const [searchParams, setSearchParams] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const { data, isLoading, isFetching } = useProducts(searchParams);
  const { data: formulationData } = useFormulations();
  const updateProduct = useUpdateProduct();
  const products = data?.products || [];
  const formulations = formulationData?.formulations || [];

  const handleSearch = () => {
    if (!keyword.trim() || searchBy === "Select") { setSearchParams({}); return; }
    const p = {};
    if (searchBy === "name") p.searchTerm = keyword;
    else if (searchBy === "code") p.productCode = keyword;
    setSearchParams(p);
  };

  const startEdit = useCallback((product) => {
    setEditingId(product._id);
    setEditForm({ productName: product.productName, formulation: product.formulation || "", arabicName: product.arabicName || "", vat: product.vat, mrp: product.mrp, purchasePrice: product.purchasePrice, sellingPrice: product.sellingPrice, quantity: product.quantity, minQty: product.minQty, storage: product.storage || "", batchCode: product.batchCode || "", expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().split("T")[0] : "" });
  }, []);

  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const saveEdit = () => {
    updateProduct.mutate({ id: editingId, data: { productName: editForm.productName, formulation: editForm.formulation || undefined, arabicName: editForm.arabicName || undefined, vat: Number(editForm.vat), mrp: Number(editForm.mrp), purchasePrice: Number(editForm.purchasePrice), sellingPrice: Number(editForm.sellingPrice), quantity: Number(editForm.quantity), minQty: Number(editForm.minQty), storage: editForm.storage || undefined, batchCode: editForm.batchCode || undefined, expiryDate: editForm.expiryDate || undefined } }, { onSuccess: cancelEdit });
  };

  const ef = (key, val) => setEditForm((f) => ({ ...f, [key]: val }));

  return (<div className="space-y-4">
    <h2 className="pos-page-title">{t("viewProducts.title")}</h2>
    <div className="pos-card p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
        <div><label className="pos-label">{t("viewProducts.keyword")}</label><input type="text" className="pos-input w-60" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} /></div>
        <div><label className="pos-label">{t("viewProducts.searchBy")}</label><select className="pos-select w-40" value={searchBy} onChange={(e) => setSearchBy(e.target.value)}><option value="Select">Select</option><option value="name">{t("sales.productName")}</option><option value="code">{t("sales.code")}</option></select></div>
        <button className="pos-btn-primary gap-1" onClick={handleSearch} disabled={isFetching}>{isFetching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />} {t("viewProducts.search")}</button>
      </div>
    </div>
    <div className="pos-card overflow-x-auto">
      <table className="pos-table min-w-[1400px]">
        <thead><tr><th>{t("addProduct.productCode")}</th><th>{t("sales.productName")}</th><th>{t("viewProducts.formulation")}</th><th>{t("addProduct.vat")}</th><th>{t("viewProducts.arabicName")}</th><th>{t("viewProducts.storage")}</th><th>{t("sales.batchCode")}</th><th>{t("sales.expiryDate")}</th><th>{t("sales.quantity")}</th><th>{t("viewProducts.minQty")}</th><th>{t("viewProducts.mrp")}</th><th>{t("viewProducts.purchasePrice")}</th><th>{t("viewProducts.sellingPrice")}</th><th>{t("viewProducts.edit")}</th></tr></thead>
        <tbody>
          {isLoading ? (<tr><td colSpan={14} className="text-center py-8"><Loader2 size={20} className="animate-spin inline-block" /></td></tr>)
          : products.length === 0 ? (<tr><td colSpan={14} className="text-center text-muted-foreground py-8">{t("viewProducts.search")}</td></tr>)
          : products.map((p) => (<tr key={p._id}>
            <td>{p.productCode}</td>
            <td>{editingId === p._id ? <input className="pos-input" value={editForm.productName} onChange={(e) => ef("productName", e.target.value)} /> : p.productName}</td>
            <td>
              {editingId === p._id ? (
                <select className="pos-select" value={editForm.formulation} onChange={(e) => ef("formulation", e.target.value)}>
                  <option value="">—</option>
                  {formulations.map((f) => <option key={f._id} value={f.formulationName}>{f.formulationName}</option>)}
                </select>
              ) : (
                p.formulation || "—"
              )}
            </td>
            <td>{editingId === p._id ? <select className="pos-select" value={editForm.vat} onChange={(e) => ef("vat", e.target.value)}><option value="0">0%</option><option value="5">5%</option><option value="15">15%</option></select> : `${p.vat}%`}</td>
            <td>{editingId === p._id ? <input className="pos-input" dir="rtl" value={editForm.arabicName} onChange={(e) => ef("arabicName", e.target.value)} /> : p.arabicName || "—"}</td>
            <td>{editingId === p._id ? <input className="pos-input" value={editForm.storage} onChange={(e) => ef("storage", e.target.value)} /> : p.storage || "—"}</td>
            <td>{editingId === p._id ? <input className="pos-input w-28" type="text" placeholder="Batch" value={editForm.batchCode} onChange={(e) => ef("batchCode", e.target.value)} /> : p.batchCode || "—"}</td>
            <td>{editingId === p._id ? <input className="pos-input w-32" type="date" value={editForm.expiryDate} onChange={(e) => ef("expiryDate", e.target.value)} /> : (p.expiryDate ? new Date(p.expiryDate).toISOString().split("T")[0] : "—")}</td>
            <td>{editingId === p._id ? <input className="pos-input w-20" type="number" value={editForm.quantity} onChange={(e) => ef("quantity", e.target.value)} /> : p.quantity}</td>
            <td>{editingId === p._id ? <input className="pos-input w-20" type="number" value={editForm.minQty} onChange={(e) => ef("minQty", e.target.value)} /> : p.minQty}</td>
            <td>{editingId === p._id ? <input className="pos-input w-24" type="number" value={editForm.mrp} onChange={(e) => ef("mrp", e.target.value)} /> : p.mrp}</td>
            <td>{editingId === p._id ? <input className="pos-input w-24" type="number" value={editForm.purchasePrice} onChange={(e) => ef("purchasePrice", e.target.value)} /> : p.purchasePrice}</td>
            <td>{editingId === p._id ? <input className="pos-input w-24" type="number" value={editForm.sellingPrice} onChange={(e) => ef("sellingPrice", e.target.value)} /> : p.sellingPrice}</td>
            <td>{editingId === p._id ? (<div className="flex gap-1"><button onClick={saveEdit} className="text-green-500 hover:opacity-70" disabled={updateProduct.isPending}>{updateProduct.isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}</button><button onClick={cancelEdit} className="text-destructive hover:opacity-70"><X size={14} /></button></div>) : (<button onClick={() => startEdit(p)} className="text-primary hover:opacity-70"><Pencil size={14} /></button>)}</td>
          </tr>))}
        </tbody>
      </table>
    </div>
  </div>);
}
