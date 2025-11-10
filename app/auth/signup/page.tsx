"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, Lock, AlertCircle, CheckCircle, PenTool, Loader2, User } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Validation
      if (!name || !email || !password || !confirmPassword) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Name validation
      if (name.trim().length < 2) {
        setError("Name must be at least 2 characters long");
        setLoading(false);
        return;
      }

      // Email format validation (basic)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // Password length validation
      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }

      // Passwords match validation
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      // Attempt to sign up
      // Note: The name is stored in user_metadata and will be used for displaying author information
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Check if email confirmation is required
        if (data.user.identities && data.user.identities.length === 0) {
          setError("This email is already registered. Please sign in instead.");
          toast.error("This email is already registered. Please sign in instead.");
          setLoading(false);
          return;
        }

        // Successful signup - user is automatically logged in by Supabase
        setSuccess(true);
        setLoading(false);
        toast.success("Account Created Successfully! Welcome to Inkwell!");
        
        // Redirect to dashboard immediately
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-paper-cream via-gold-50 to-paper-cream px-4 py-12 dark:from-paper-dark dark:via-paper-dark-elevated dark:to-paper-dark">
      <Card className="w-full max-w-md border-2 p-8 shadow-2xl">
        {/* Logo & Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 transition-colors hover:text-primary">
          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
              <PenTool className="h-5 w-5 sm:h-5 sm:w-5 text-primary -rotate-90" />
          </div>
            <span className="font-bold text-3xl">Inkwell</span>
          </Link>
          <h1 className="mt-6 font-semibold text-2xl">Create your Account</h1>
          <p className="mt-2 text-muted-foreground font-medium">Join Inkwell today</p>
        </div>

        <form onSubmit={handleSignup} className="-mt-8 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>Account created successfully! Redirecting...</span>
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Your Pen Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                disabled={loading || success}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This will be displayed as the author name
            </p>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={loading || success}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                disabled={loading || success}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">At least 6 characters</p>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                disabled={loading || success}
                required
              />
            </div>
          </div>

          {/* Signup Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || success}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : success ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Account created!
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          {/* Footer */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link 
              href="/auth/login" 
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              Log In
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
