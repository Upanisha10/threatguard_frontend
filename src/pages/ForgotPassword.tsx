import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { apiService } from "../services/api";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await apiService.forgotPassword(email);

      setMessage(
        "If the email exists, a reset link has been sent."
      );

    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-slate-900 rounded-full">
              <Shield className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Forgot Password
          </h1>
          <p className="text-gray-600 mt-2">
            Enter your email to receive a reset link
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your registered email"
              required
            />
          </div>

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>

          {message && (
            <div className="text-center text-sm text-gray-600 mt-4">
              {message}
            </div>
          )}

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Back to Login
            </button>
          </div>

        </form>
      </Card>
    </div>
  );
}
