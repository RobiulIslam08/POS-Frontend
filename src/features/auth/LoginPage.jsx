/**
 * Login Page
 * Professional login screen for POS system with JWT authentication.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import { showSuccess, showError } from "@/lib/toast-helpers";

export default function LoginPage() {
  const { login } = useAuthContext();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const labels = {
    title: lang === "ar" ? "نقطة البيع" : "POS System",
    subtitle: lang === "ar" ? "تسجيل الدخول إلى حسابك" : "Sign in to your account",
    username: lang === "ar" ? "اسم المستخدم" : "Username",
    password: lang === "ar" ? "كلمة المرور" : "Password",
    login: lang === "ar" ? "تسجيل الدخول" : "Sign In",
    loading: lang === "ar" ? "جارِ التحقق..." : "Signing in...",
    errorGeneric: lang === "ar" ? "فشل تسجيل الدخول" : "Login failed",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username.trim() || !form.password.trim()) {
      setError(lang === "ar" ? "جميع الحقول مطلوبة" : "All fields are required");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(form);
      showSuccess(lang === "ar" ? "تم تسجيل الدخول بنজاح" : "Login successful ✅");
      navigate("/", { replace: true });
    } catch (err) {
      const msg = err?.message || labels.errorGeneric;
      setError(msg);
      showError(err, labels.errorGeneric);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-icon">
            <LogIn size={28} />
          </div>
          <h1 className="login-title">{labels.title}</h1>
          <p className="login-subtitle">{labels.subtitle}</p>
        </div>

        {/* Error */}
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label className="pos-label">{labels.username}</label>
            <input
              type="text"
              className="pos-input"
              value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              placeholder={labels.username}
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="pos-label">{labels.password}</label>
            <div className="login-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="pos-input"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder={labels.password}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword((p) => !p)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="pos-btn-primary login-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {labels.loading}
              </>
            ) : (
              <>
                <LogIn size={16} />
                {labels.login}
              </>
            )}
          </button>
        </form>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, hsl(220 25% 10%) 0%, hsl(220 25% 18%) 100%);
          padding: 1rem;
        }
        .login-card {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 1rem;
          padding: 2rem;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .login-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .login-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          margin-bottom: 0.75rem;
        }
        .login-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: hsl(var(--foreground));
          margin: 0;
        }
        .login-subtitle {
          font-size: 0.875rem;
          color: hsl(var(--muted-foreground));
          margin: 0.25rem 0 0;
        }
        .login-error {
          background: hsl(var(--destructive) / 0.15);
          color: hsl(var(--destructive));
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.85rem;
          text-align: center;
          margin-bottom: 1rem;
          border: 1px solid hsl(var(--destructive) / 0.3);
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .login-password-wrapper {
          position: relative;
        }
        .login-password-wrapper .pos-input {
          padding-right: 2.5rem;
        }
        .login-password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: hsl(var(--muted-foreground));
          cursor: pointer;
          padding: 0;
          display: flex;
        }
        .login-password-toggle:hover {
          color: hsl(var(--foreground));
        }
        .login-submit {
          width: 100%;
          margin-top: 0.5rem;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          gap: 0.5rem;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
