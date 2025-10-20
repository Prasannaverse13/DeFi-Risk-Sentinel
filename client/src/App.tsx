import { Switch, Route } from "wouter";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { config } from "./lib/wagmi";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "./components/Header";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import AIFeatures from "./pages/AIFeatures";
import NotFound from "@/pages/not-found";
import { useAccount } from "wagmi";

function Router() {
  const { isConnected } = useAccount();

  return (
    <Switch>
      <Route path="/">
        {isConnected ? <Dashboard /> : <Landing />}
      </Route>
      <Route path="/features" component={AIFeatures} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "hsl(280, 85%, 60%)",
            accentColorForeground: "white",
            borderRadius: "medium",
          })}
          coolMode
          appInfo={{
            appName: "DeFi Risk Sentinel",
            learnMoreUrl: "https://docs.somnia.network/",
          }}
        >
          <ThemeProvider defaultTheme="dark" storageKey="defi-sentinel-theme">
            <TooltipProvider>
              <div className="min-h-screen bg-background text-foreground">
                <Header />
                <Router />
              </div>
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
