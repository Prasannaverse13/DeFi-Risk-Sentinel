import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AlertData {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
}

export function AlertBanner() {
  const { address } = useAccount();
  
  const { data: alerts } = useQuery<AlertData[]>({
    queryKey: ["/api/alerts", address],
    queryFn: async () => {
      const response = await fetch(`/api/alerts?wallet=${address || ""}`);
      if (!response.ok) throw new Error("Failed to fetch alerts");
      return response.json();
    },
    enabled: !!address,
  });

  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const activeAlerts = alerts?.filter(
    (alert) => !dismissedAlerts.includes(alert.id)
  );

  if (!activeAlerts || activeAlerts.length === 0) {
    return null;
  }

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-5 h-5" />;
      case "warning":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertVariant = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "warning":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {activeAlerts.map((alert) => (
        <Alert
          key={alert.id}
          variant={getAlertVariant(alert.severity)}
          className="relative pr-12"
          data-testid={`alert-${alert.severity}`}
        >
          {getAlertIcon(alert.severity)}
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={() => setDismissedAlerts([...dismissedAlerts, alert.id])}
            data-testid={`button-dismiss-alert-${alert.id}`}
          >
            <X className="w-4 h-4" />
          </Button>
        </Alert>
      ))}
    </div>
  );
}
