"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

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
        toast.success("Account created successfully!");
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-24 bg-background order-2 lg:order-1 border-r border-border">
        <div className="w-full max-w-md space-y-16">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center text-[10px] font-bold font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group">
              <ArrowLeft className="mr-2 h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Return Home
            </Link>
            <h2 className="text-5xl font-display font-black tracking-tighter uppercase">Application</h2>
          </div>

          <form onSubmit={handleSignup} className="space-y-12">
            {error && (
              <div className="flex items-center gap-3 rounded-none bg-destructive/5 p-4 text-xs font-mono uppercase tracking-wide text-destructive border-l-2 border-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="space-y-8">
              <div className="group relative">
                <label 
                  htmlFor="name" 
                  className="absolute -top-3 left-0 text-[10px] font-bold font-mono uppercase tracking-widest text-muted-foreground group-focus-within:text-foreground transition-colors"
                >
                  Pen Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="This name will appear publicly when you publish"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 w-full border-0 border-b border-border bg-transparent px-0 py-2 text-xl font-medium placeholder:text-foreground/20 focus-visible:ring-0 focus-visible:border-foreground focus-visible:border-b-2 rounded-none transition-all font-sans"
                  disabled={loading}
                />
              </div>

              <div className="group relative">
                <label 
                  htmlFor="email" 
                  className="absolute -top-3 left-0 text-[10px] font-bold font-mono uppercase tracking-widest text-muted-foreground group-focus-within:text-foreground transition-colors"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="writer@inkwell.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 w-full border-0 border-b border-border bg-transparent px-0 py-2 text-xl font-medium placeholder:text-foreground/20 focus-visible:ring-0 focus-visible:border-foreground focus-visible:border-b-2 rounded-none transition-all font-sans"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="group relative">
                  <label 
                    htmlFor="password" 
                    className="absolute -top-3 left-0 text-[10px] font-bold font-mono uppercase tracking-widest text-muted-foreground group-focus-within:text-foreground transition-colors"
                  >
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 w-full border-0 border-b border-border bg-transparent px-0 py-2 text-xl font-medium placeholder:text-foreground/20 focus-visible:ring-0 focus-visible:border-foreground focus-visible:border-b-2 rounded-none transition-all font-sans"
                    disabled={loading}
                  />
                </div>

                <div className="group relative">
                  <label 
                    htmlFor="confirmPassword" 
                    className="absolute -top-3 left-0 text-[10px] font-bold font-mono uppercase tracking-widest text-muted-foreground group-focus-within:text-foreground transition-colors"
                  >
                    Confirm
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-12 w-full border-0 border-b border-border bg-transparent px-0 py-2 text-xl font-medium placeholder:text-foreground/20 focus-visible:ring-0 focus-visible:border-foreground focus-visible:border-b-2 rounded-none transition-all font-sans"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Button 
                type="submit" 
                className="w-full h-16 rounded-none text-base uppercase tracking-widest font-bold bg-foreground text-background hover:bg-foreground/80 transition-all border border-transparent cursor-pointer" 
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Inititate Membership"}
              </Button>
              
              <div className="flex justify-center">
                <Link href="/auth/login" className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground border-b border-transparent hover:border-foreground pb-0.5 transition-all">
                  Access Existing Account
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex w-1/2 section-inverted items-center justify-center p-12 relative overflow-hidden order-1 lg:order-2">
        <div className="relative z-10 w-full max-w-lg text-right">
          <div className="border-r-4 border-current pr-8">
            <h2 className="text-9xl text-background! font-display font-black mb-0 leading-none tracking-tighter">
              JOIN<br/>US.
            </h2>
          </div>
          <p className="mt-12 text-xl font-mono leading-relaxed uppercase tracking-widest opacity-80 border-t border-current/20 pt-8">
            The Collective<br/>Awaits Your Voice
          </p>
        </div>
      </div>
    </div>
  );
}