"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      toast.success("Welcome back");
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left: Brand / Visual */}
      <div className="hidden lg:flex w-1/2 section-inverted items-center justify-center p-12 relative overflow-hidden border-r border-border">
        <div className="relative z-10 w-full max-w-lg">
          <div className="border-l-4 border-current pl-8">
            <h1 className="text-9xl text-background! font-display font-black mb-0 leading-none tracking-tighter">
              INK<br/>WELL.
            </h1>
          </div>
          <p className="mt-12 text-xl font-mono leading-relaxed uppercase tracking-widest opacity-80 border-t border-current/20 pt-8">
            Studio Access<br/>
            Authorized Personnel Only
          </p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-24 bg-background">
        <div className="w-full max-w-md space-y-16">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center text-[10px] font-bold font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group">
              <ArrowLeft className="mr-2 h-3 w-3 group-hover:-translate-x-1 transition-transform" /> Return Home
            </Link>
            <h2 className="text-5xl font-display font-black tracking-tighter uppercase">Identifier</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-12">
            <div className="space-y-8">
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
                  placeholder="editor@inkwell.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 w-full border-0 border-b border-border bg-transparent px-0 py-2 text-xl font-medium placeholder:text-foreground/20 focus-visible:ring-0 focus-visible:border-foreground focus-visible:border-b-2 rounded-none transition-all font-sans"
                  disabled={loading}
                />
              </div>

              <div className="group relative">
                <div className="flex items-center justify-between absolute -top-3 left-0 w-full">
                  <label 
                    htmlFor="password" 
                    className="text-[10px] font-bold font-mono uppercase tracking-widest text-foreground group-focus-within:text-foreground transition-colors"
                  >
                    Password
                  </label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 w-full border-0 border-b border-border bg-transparent px-0 py-2 text-xl font-medium placeholder:text-muted-foreground/20 focus-visible:ring-0 focus-visible:border-foreground focus-visible:border-b-2 rounded-none transition-all font-sans"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-6">
              <Button 
                type="submit" 
                className="w-full h-16 rounded-none text-base uppercase tracking-widest font-bold bg-foreground text-background hover:bg-foreground/80 transition-all border border-transparent cursor-pointer" 
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Access Studio"}
              </Button>
              
              <div className="flex justify-center">
                <Link href="/auth/signup" className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground border-b border-transparent hover:border-foreground pb-0.5 transition-all">
                  Apply for Membership
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}