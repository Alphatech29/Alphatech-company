import React, { useState } from 'react';
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { loginAdmin } from "../utilities/auths";
import SweetAlert from '../utilities/sweetAlert';
import { useAuth } from "../utilities/authContext";

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      return SweetAlert.alert("Error", "Please enter both email/username and password.", "error");
    }

    setLoading(true);

    try {
      const response = await loginAdmin(identifier, password);

      if (response.success) {
        // Store in context
        login(response.token, response.data);

        await SweetAlert.alert("Success", "Login successful!", "success");

        // Redirect to dashboard or home page
        window.location.href = "/dashboard";
      } else {
        SweetAlert.alert("Error", response.message, "error");
      }
    } catch (err) {
      SweetAlert.alert("Error", "Login failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute w-96 h-96 bg-yellow-400 rounded-full opacity-10 animate-pulse -top-32 -left-32"></div>
        <div className="absolute w-72 h-72 bg-yellow-500 rounded-full opacity-10 animate-pulse -bottom-32 -right-24"></div>
      </div>

      <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl w-full max-w-md sm:mx-3 p-10 z-10">
        <div className="flex justify-center mb-8">
          <img src='/image/favicon.png' alt="AlphaTech Logo" className="h-16 w-auto" />
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Identifier Input */}
          <div>
            <Label htmlFor="identifier" className="text-white">
              Email or Username
            </Label>
            <TextInput
              id="identifier"
              type="text"
              placeholder="you@example.com or username"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Password Input */}
          <div>
            <Label htmlFor="password" className="text-white">
              Your password
            </Label>
            <TextInput
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-white">
              Remember me
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="text-sm text-white/60 text-center mt-6">
          Don't have an account?{' '}
          <a href="#" className="text-yellow-400 hover:text-yellow-300 underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
