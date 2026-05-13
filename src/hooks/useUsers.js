import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { authService } from "@/services/auth.service";
import { showSuccess, showError } from "@/lib/toast-helpers";

const QUERY_KEY = "users";

export function useUsers(params = {}, options = {}) {
  return useQuery({ queryKey: [QUERY_KEY, params], queryFn: () => userService.getAll(params), select: (res) => ({ users: res?.data || [], meta: res?.meta || {} }), ...options });
}
export function useRegisterUser() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data) => authService.register(data), onSuccess: () => { qc.invalidateQueries({ queryKey: [QUERY_KEY] }); showSuccess("User created successfully ✅"); }, onError: (err) => { showError(err, "Failed to create user"); } });
}
