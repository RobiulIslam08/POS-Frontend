import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search } from "lucide-react";
export default function ViewProductsPage() {
    const { t } = useLanguage();
    const [keyword, setKeyword] = useState("");
    const [searchBy, setSearchBy] = useState("Select");
    return (<div className="space-y-4">
      <h2 className="pos-page-title">{t("viewProducts.title")}</h2>

      <div className="pos-card p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
          <div>
            <label className="pos-label">{t("viewProducts.keyword")}</label>
            <input type="text" className="pos-input w-60" value={keyword} onChange={(e) => setKeyword(e.target.value)}/>
          </div>
          <div>
            <label className="pos-label">{t("viewProducts.searchBy")}</label>
            <select className="pos-select w-40" value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
              <option value="Select">Select</option>
              <option value="name">{t("sales.productName")}</option>
              <option value="code">{t("sales.code")}</option>
            </select>
          </div>
          <button className="pos-btn-primary gap-1">
            <Search size={14}/> {t("viewProducts.search")}
          </button>
        </div>
      </div>

      <div className="pos-card overflow-x-auto">
        <table className="pos-table min-w-[1000px]">
          <thead>
            <tr>
              <th>{t("addProduct.productCode")}</th>
              <th>{t("sales.productName")}</th>
              <th>{t("viewProducts.formulation")}</th>
              <th>{t("addProduct.vat")}</th>
              <th>{t("viewProducts.arabicName")}</th>
              <th>{t("viewProducts.storage")}</th>
              <th>{t("sales.quantity")}</th>
              <th>{t("viewProducts.minQty")}</th>
              <th>{t("viewProducts.mrp")}</th>
              <th>{t("viewProducts.purchasePrice")}</th>
              <th>{t("viewProducts.sellingPrice")}</th>
              <th>{t("viewProducts.edit")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={12} className="text-center text-muted-foreground py-8">
                {t("viewProducts.search")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>);
}
