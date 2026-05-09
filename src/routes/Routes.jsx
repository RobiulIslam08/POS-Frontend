/**
 * Routes Configuration
 * ---------------------
 * All application routes are defined here.
 * To add a new page: import it and add a route entry.
 */
import { Routes, Route } from "react-router-dom";

// Sales
import SalesPage from "@/features/sales/SalesPage";
import SalesReturnPage from "@/features/sales/SalesReturnPage";
import SalesReportPage from "@/features/sales/SalesReportPage";

// Purchase
import PurchaseInvoicePage from "@/features/purchase/PurchaseInvoicePage";
import ViewPurchaseInvoicePage from "@/features/purchase/ViewPurchaseInvoicePage";

// Inventory
import AddProductPage from "@/features/inventory/AddProductPage";
import ViewProductsPage from "@/features/inventory/ViewProductsPage";
import StockPage from "@/features/inventory/StockPage";
import StockReturnPage from "@/features/inventory/StockReturnPage";
import StockCorrectionPage from "@/features/inventory/StockCorrectionPage";
import ProductsSuppliersPage from "@/features/inventory/ProductsSuppliersPage";
import SupplierCreditPage from "@/features/inventory/SupplierCreditPage";
import CustomerCreditPage from "@/features/inventory/CustomerCreditPage";
import CashAdjustmentPage from "@/features/inventory/CashAdjustmentPage";

// Masters
import AddSupplierPage from "@/features/masters/AddSupplierPage";
import AddCustomerPage from "@/features/masters/AddCustomerPage";
import AddFormulationPage from "@/features/masters/AddFormulationPage";
import AddUserPage from "@/features/masters/AddUserPage";
import LinkBoxPage from "@/features/masters/LinkBoxPage";
import DeleteProductsPage from "@/features/masters/DeleteProductsPage";
import SupplierCreditMasterPage from "@/features/masters/SupplierCreditMasterPage";
import CustomerCreditMasterPage from "@/features/masters/CustomerCreditMasterPage";

// Others
import BarcodePage from "@/features/barcode/BarcodePage";
import ExpensePage from "@/features/expense/ExpensePage";
import SettingsPage from "@/features/settings/SettingsPage";
import BackupPage from "@/features/backup/BackupPage";
import HelpPage from "@/features/help/HelpPage";
import NotFound from "@/features/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Sales */}
      <Route path="/" element={<SalesPage />} />
      <Route path="/sales-return" element={<SalesReturnPage />} />
      <Route path="/sales-report" element={<SalesReportPage />} />

      {/* Purchase */}
      <Route path="/purchase-invoice" element={<PurchaseInvoicePage />} />
      <Route path="/view-purchase-invoice" element={<ViewPurchaseInvoicePage />} />

      {/* Inventory */}
      <Route path="/add-product" element={<AddProductPage />} />
      <Route path="/view-products" element={<ViewProductsPage />} />
      <Route path="/stock" element={<StockPage />} />
      <Route path="/stock-return" element={<StockReturnPage />} />
      <Route path="/stock-correction" element={<StockCorrectionPage />} />
      <Route path="/products-suppliers" element={<ProductsSuppliersPage />} />
      <Route path="/supplier-credit" element={<SupplierCreditPage />} />
      <Route path="/customer-credit" element={<CustomerCreditPage />} />
      <Route path="/cash-adjustment" element={<CashAdjustmentPage />} />

      {/* Masters */}
      <Route path="/add-supplier" element={<AddSupplierPage />} />
      <Route path="/add-customer" element={<AddCustomerPage />} />
      <Route path="/add-formulation" element={<AddFormulationPage />} />
      <Route path="/add-user" element={<AddUserPage />} />
      <Route path="/link-box" element={<LinkBoxPage />} />
      <Route path="/delete-products" element={<DeleteProductsPage />} />
      <Route path="/supplier-credit-master" element={<SupplierCreditMasterPage />} />
      <Route path="/customer-credit-master" element={<CustomerCreditMasterPage />} />

      {/* Others */}
      <Route path="/barcode" element={<BarcodePage />} />
      <Route path="/expense" element={<ExpensePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/backup" element={<BackupPage />} />
      <Route path="/help" element={<HelpPage />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
