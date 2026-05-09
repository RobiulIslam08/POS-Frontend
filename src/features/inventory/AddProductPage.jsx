import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
export default function AddProductPage() {
    const { t } = useLanguage();
    const [form, setForm] = useState({
        productId: "4896",
        productCode: "4896",
        productName: "",
        quantity: "",
        packageVal: "",
        arabicName: "",
        vat: "",
        mrp: "",
        purchasePrice: "",
        sellingPrice: "",
        storage: "",
        minQty: "1",
        productType: "SINGLE",
        boxQty: "1",
    });
    const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));
    const handleReset = () => {
        setForm({
            productId: "", productCode: "", productName: "", quantity: "",
            packageVal: "", arabicName: "", vat: "", mrp: "", purchasePrice: "",
            sellingPrice: "", storage: "", minQty: "1", productType: "SINGLE", boxQty: "1",
        });
    };
    return (<div className="space-y-4">
      <h2 className="pos-page-title">{t("addProduct.title")}</h2>

      <div className="pos-card p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <label className="pos-label">{t("addProduct.productId")}</label>
            <input type="text" className="pos-input" value={form.productId} onChange={(e) => update("productId", e.target.value)}/>
          </div>
          <div>
            <label className="pos-label">{t("addProduct.mrp")}</label>
            <input type="number" className="pos-input" value={form.mrp} onChange={(e) => update("mrp", e.target.value)}/>
          </div>
          <div>
            <label className="pos-label">{t("addProduct.productCode")}</label>
            <input type="text" className="pos-input" value={form.productCode} onChange={(e) => update("productCode", e.target.value)}/>
          </div>
          <div className="hidden md:block"></div>
          <div>
            <label className="pos-label">{t("addProduct.productName")}</label>
            <input type="text" className="pos-input" value={form.productName} onChange={(e) => update("productName", e.target.value)}/>
          </div>
          <div>
            <label className="pos-label">{t("addProduct.purchasePrice")}</label>
            <input type="number" className="pos-input" value={form.purchasePrice} onChange={(e) => update("purchasePrice", e.target.value)}/>
          </div>
          <div className="hidden md:block"></div>
          <div>
            <label className="pos-label">{t("addProduct.sellingPrice")}</label>
            <input type="number" className="pos-input" value={form.sellingPrice} onChange={(e) => update("sellingPrice", e.target.value)}/>
          </div>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="pos-label">{t("addProduct.quantity")}</label>
              <input type="number" className="pos-input" value={form.quantity} onChange={(e) => update("quantity", e.target.value)}/>
            </div>
            <div className="w-20">
              <label className="pos-label">{t("addProduct.package")}</label>
              <input type="text" className="pos-input" value={form.packageVal} onChange={(e) => update("packageVal", e.target.value)}/>
            </div>
          </div>
          <div>
            <label className="pos-label">{t("addProduct.storage")}</label>
            <input type="text" className="pos-input" value={form.storage} onChange={(e) => update("storage", e.target.value)}/>
          </div>
          <div>
            <label className="pos-label">{t("addProduct.arabicName")}</label>
            <input type="text" className="pos-input" dir="rtl" value={form.arabicName} onChange={(e) => update("arabicName", e.target.value)}/>
          </div>
          <div>
            <label className="pos-label">{t("addProduct.minQty")}</label>
            <input type="number" className="pos-input" value={form.minQty} onChange={(e) => update("minQty", e.target.value)}/>
          </div>
          <div>
            <label className="pos-label">{t("addProduct.vat")}</label>
            <select className="pos-select" value={form.vat} onChange={(e) => update("vat", e.target.value)}>
              <option value="">{t("addProduct.select")}</option>
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="15">15%</option>
            </select>
          </div>
          <div className="flex items-end gap-4">
            <div>
              <label className="pos-label">{t("addProduct.productType")}</label>
              <select className="pos-select w-32" value={form.productType} onChange={(e) => update("productType", e.target.value)}>
                <option value="SINGLE">{t("sales.single")}</option>
              </select>
            </div>
            <div>
              <label className="pos-label">{t("addProduct.boxQty")}</label>
              <input type="number" className="pos-input w-24" value={form.boxQty} onChange={(e) => update("boxQty", e.target.value)}/>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-8">
          <button className="pos-btn-primary">{t("addProduct.save")}</button>
          <button className="pos-btn-secondary" onClick={handleReset}>{t("addProduct.reset")}</button>
        </div>
      </div>
    </div>);
}
