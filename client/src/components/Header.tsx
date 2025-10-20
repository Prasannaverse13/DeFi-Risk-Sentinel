import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ThemeToggle } from "./ThemeToggle";
import { Shield, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/">
            <a className="flex items-center gap-3 hover-elevate transition-all px-2 py-1 rounded-md">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-none">DeFi Risk Sentinel</h1>
                <p className="text-xs text-muted-foreground leading-none mt-0.5">Somnia Network</p>
              </div>
            </a>
          </Link>
          
          {/* AI Features Link */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2"
            data-testid="button-ai-features"
            asChild
          >
            <Link href="/features">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>7 AI Features</span>
            </Link>
          </Button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <ConnectButton 
            chainStatus="icon"
            showBalance={false}
          />
        </div>
      </div>
    </header>
  );
}
