import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-9xl font-display font-black tracking-tighter text-foreground leading-none">
          404
        </h1>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-display font-bold uppercase tracking-tight">
            Page Missing
          </h2>
          <p className="text-muted-foreground font-mono text-sm leading-relaxed max-w-md mx-auto">
            The entry you are looking for has been moved, deleted, or never existed in the archive.
          </p>
        </div>

        <div className="pt-8 border-t border-border w-full flex justify-center">
          <Button 
            asChild 
            size="lg" 
            className="rounded-none h-14 px-8 bg-foreground text-background hover:bg-primary hover:text-white font-bold uppercase tracking-widest text-xs transition-colors"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Index
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}