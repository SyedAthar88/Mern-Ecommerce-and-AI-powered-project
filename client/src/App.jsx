import { useState } from "react";
import { useAuth } from "./hooks/useAuth.js";

function App() {
  const { user, loading, login, logout } = useAuth();
  const [email, setEmail] = useState("ali@test.com");
  const [password, setPassword] = useState("NewPass456!");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-primary-600 mb-6">
          Phase 11 — Auth Test
        </h1>

        {user ? (
          // ============== LOGGED IN ==============
          <div>
            <p className="text-green-600 mb-2">✅ Logged in</p>
            <pre className="bg-gray-100 p-4 rounded text-sm mb-4 overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          // ============== NOT LOGGED IN ==============
          <div>
            <p className="text-gray-600 mb-4">Not logged in</p>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;