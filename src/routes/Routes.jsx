/**
 * Routes Configuration
 * ---------------------
 * All application routes are defined here.
 * Unauthenticated users are redirected to /login.
 */
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";

// Auth
import LoginPage from "@/features/auth/LoginPage";

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

/** Wrapper that requires authentication. */
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}

      <Route path="/login" element={<LoginPage />} />

      {/* Protected — all wrapped in AppLayout */}
      <Route path="/" element={<ProtectedRoute><SalesPage /></ProtectedRoute>} />
      <Route path="/sales-return" element={<ProtectedRoute><SalesReturnPage /></ProtectedRoute>} />
      <Route path="/sales-report" element={<ProtectedRoute><SalesReportPage /></ProtectedRoute>} />

      <Route path="/purchase-invoice" element={<ProtectedRoute><PurchaseInvoicePage /></ProtectedRoute>} />
      <Route path="/view-purchase-invoice" element={<ProtectedRoute><ViewPurchaseInvoicePage /></ProtectedRoute>} />

      <Route path="/add-product" element={<ProtectedRoute><AddProductPage /></ProtectedRoute>} />
      <Route path="/view-products" element={<ProtectedRoute><ViewProductsPage /></ProtectedRoute>} />
      <Route path="/stock" element={<ProtectedRoute><StockPage /></ProtectedRoute>} />
      <Route path="/stock-return" element={<ProtectedRoute><StockReturnPage /></ProtectedRoute>} />
      <Route path="/stock-correction" element={<ProtectedRoute><StockCorrectionPage /></ProtectedRoute>} />
      <Route path="/products-suppliers" element={<ProtectedRoute><ProductsSuppliersPage /></ProtectedRoute>} />
      <Route path="/supplier-credit" element={<ProtectedRoute><SupplierCreditPage /></ProtectedRoute>} />
      <Route path="/customer-credit" element={<ProtectedRoute><CustomerCreditPage /></ProtectedRoute>} />
      <Route path="/cash-adjustment" element={<ProtectedRoute><CashAdjustmentPage /></ProtectedRoute>} />

      <Route path="/add-supplier" element={<ProtectedRoute><AddSupplierPage /></ProtectedRoute>} />
      <Route path="/add-customer" element={<ProtectedRoute><AddCustomerPage /></ProtectedRoute>} />
      <Route path="/add-formulation" element={<ProtectedRoute><AddFormulationPage /></ProtectedRoute>} />
      <Route path="/add-user" element={<ProtectedRoute><AddUserPage /></ProtectedRoute>} />
      <Route path="/link-box" element={<ProtectedRoute><LinkBoxPage /></ProtectedRoute>} />
      <Route path="/delete-products" element={<ProtectedRoute><DeleteProductsPage /></ProtectedRoute>} />
      <Route path="/supplier-credit-master" element={<ProtectedRoute><SupplierCreditMasterPage /></ProtectedRoute>} />
      <Route path="/customer-credit-master" element={<ProtectedRoute><CustomerCreditMasterPage /></ProtectedRoute>} />

      <Route path="/barcode" element={<ProtectedRoute><BarcodePage /></ProtectedRoute>} />
      <Route path="/expense" element={<ProtectedRoute><ExpensePage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/backup" element={<ProtectedRoute><BackupPage /></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
