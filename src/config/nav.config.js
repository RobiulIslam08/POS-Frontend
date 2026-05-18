/**
 * Navigation Configuration
 * -------------------------
 * Defines all navigation menu items and their structure.
 * To add a new menu item, just add it here — no other file needs to change.
 */

/**
 * Build navigation items using the translation function.
 * @param {Function} t - Translation function from LanguageContext
 * @returns {Array} Navigation items
 */
export function getNavItems(t) {
  return [
    {
      key: "sales",
      label: t("nav.sales"),
      children: [
        { key: "newSales", label: t("sales.title"), path: "/" },
        { key: "salesReturn", label: t("salesReturn.title"), path: "/sales-return" },
      ],
    },
    {
      key: "purchase",
      label: t("nav.purchase"),
      children: [
        { key: "newPurchase", label: t("purchase.title"), path: "/purchase-invoice" },
        { key: "viewPurchase", label: t("viewPurchase.title"), path: "/view-purchase-invoice" },
      ],
    },
    {
      key: "inventory",
      label: t("nav.inventory"),
      children: [
        { key: "addProduct", label: t("inv.addProducts"), path: "/add-product" },
        { key: "viewProducts", label: t("inv.viewProducts"), path: "/view-products" },
        { key: "productsSuppliers", label: t("inv.productsSuppliers"), path: "/products-suppliers" },
        { key: "stock", label: t("inv.stock"), path: "/stock" },
        { key: "stockReturn", label: t("inv.stockReturn"), path: "/stock-return" },
        { key: "stockCorrection", label: t("inv.stockCorrection"), path: "/stock-correction" },
        { key: "supplierCredit", label: t("inv.supplierCredit"), path: "/supplier-credit" },
        { key: "customerCredit", label: t("inv.customerCredit"), path: "/customer-credit" },
        { key: "cashAdjustment", label: t("inv.cashAdjustment"), path: "/cash-adjustment" },
      ],
    },
    {
      key: "barcode",
      label: t("nav.barcode"),
      path: "/barcode",
    },
    {
      key: "expense",
      label: t("nav.expense"),
      path: "/expense",
    },
    {
      key: "masters",
      label: t("nav.masters"),
      children: [
        { key: "addSupplier", label: t("masters.addSupplier"), path: "/add-supplier" },
        { key: "addCustomer", label: t("masters.addCustomer"), path: "/add-customer" },
        { key: "addFormulation", label: t("masters.addFormulation"), path: "/add-formulation" },
        { key: "addUser", label: t("masters.addUser"), path: "/add-user" },
        { key: "linkBox", label: t("masters.linkBox"), path: "/link-box" },
        { key: "deleteProducts", label: t("masters.deleteProducts"), path: "/delete-products" },
        { key: "supplierCreditMaster", label: t("masters.supplierCreditMaster"), path: "/supplier-credit-master" },
        { key: "customerCreditMaster", label: t("masters.customerCreditMaster"), path: "/customer-credit-master" },
      ],
    },
    {
      key: "settings",
      label: t("nav.settings"),
      path: "/settings",
    },
    {
      key: "reports",
      label: t("nav.reports"),
      path: "/sales-report",
    },
    {
      key: "backup",
      label: t("nav.backup"),
      path: "/backup",
    },
    // {
    //   key: "help",
    //   label: t("nav.help"),
    //   path: "/help",
    // },
  ];
}
