import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { saleService } from "@/services/sale.service";
import { showSuccess, showError } from "@/lib/toast-helpers";

const QUERY_KEY = "sales";

export function useSales(params = {}, options = {}) {
  return useQuery({ queryKey: [QUERY_KEY, params], queryFn: () => saleService.getAll(params), select: (res) => ({ sales: res?.data || [], meta: res?.meta || {} }), ...options });
}
export function useSaleByBillNo(billNo, options = {}) {
  return useQuery({ queryKey: [QUERY_KEY, "bill", billNo], queryFn: () => saleService.getByBillNo(billNo), select: (res) => res?.data, enabled: !!billNo, ...options });
}
export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => saleService.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      qc.invalidateQueries({ queryKey: ["products"] });
      const billNo = res?.data?.billNo;
      showSuccess(`Sale saved successfully ✅${billNo ? ` — Bill #${billNo}` : ""}`);
    },
    onError: (err) => { showError(err, "Failed to save sale"); },
  });
}
export function useCreateSalesReturn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => saleService.createReturn(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY] }); qc.invalidateQueries({ queryKey: ["products"] }); showSuccess("Sales return processed ✅"); },
    onError: (err) => { showError(err, "Failed to process sales return"); },
  });
}
