import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { TypingText } from "./typing-text";

interface AIResponseCardProps {
  title: string;
  description: string;
  severity?: "info" | "warning" | "critical" | "success";
  recommendations?: string;
  animated?: boolean;
  delay?: number;
}

const severityConfig = {
  info: {
    icon: Info,
    badge: "Info",
    color: "text-blue-500 dark:text-blue-400"
  },
  warning: {
    icon: AlertTriangle,
    badge: "Warning",
    color: "text-yellow-500 dark:text-yellow-400"
  },
  critical: {
    icon: AlertTriangle,
    badge: "Critical",
    color: "text-destructive"
  },
  success: {
    icon: CheckCircle2,
    badge: "Success",
    color: "text-green-500 dark:text-green-400"
  }
};

export function AIResponseCard({
  title,
  description,
  severity = "info",
  recommendations,
  animated = true,
  delay = 0
}: AIResponseCardProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20, scale: 0.95 } : {}}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: "easeOut"
      }}
      data-testid="card-ai-response"
    >
      <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-card/80 hover-elevate">
        <CardHeader className="gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Sparkles className="w-5 h-5 text-primary" data-testid="icon-ai-sparkle-card" />
              </motion.div>
              <Badge variant="outline" className={config.color} data-testid={`badge-${severity}`}>
                <Icon className="w-3 h-3 mr-1" />
                {config.badge}
              </Badge>
            </div>
          </div>
          
          <CardTitle className="text-lg" data-testid="text-ai-title">
            {animated ? (
              <TypingText text={title} speed={20} />
            ) : (
              title
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <CardDescription className="text-base leading-relaxed" data-testid="text-ai-description">
            {animated ? (
              <TypingText text={description} speed={15} />
            ) : (
              description
            )}
          </CardDescription>

          {recommendations && (
            <motion.div
              initial={animated ? { opacity: 0, height: 0 } : {}}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ delay: animated ? 1.5 : 0, duration: 0.3 }}
              className="pt-3 border-t border-border"
            >
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                AI Recommendations
              </h4>
              <p className="text-sm text-muted-foreground" data-testid="text-ai-recommendations">
                {animated ? (
                  <TypingText text={recommendations} speed={15} />
                ) : (
                  recommendations
                )}
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
