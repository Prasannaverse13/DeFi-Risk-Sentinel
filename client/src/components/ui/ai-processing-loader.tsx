import { Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AIProcessingLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function AIProcessingLoader({ message = "AI is analyzing...", size = "md" }: AIProcessingLoaderProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      {/* Animated pulsing gradient orb */}
      <div className="relative">
        <motion.div
          className={`${sizeClasses[size]} aspect-square rounded-full bg-gradient-to-r from-primary via-cyan-500 to-primary bg-[length:200%_100%]`}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            scale: [1, 1.1, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Rotating sparkle icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Sparkles className="w-1/2 h-1/2 text-white" data-testid="icon-ai-sparkle" />
        </motion.div>
      </div>

      {/* Processing message with dot animation */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <motion.span
          animate={{
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          data-testid="text-ai-processing"
        >
          {message}
        </motion.span>
        <motion.div
          className="flex gap-1"
          data-testid="dots-loading"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 bg-primary rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Shimmer progress bar */}
      <div className="w-full max-w-xs h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-transparent via-primary to-transparent"
          animate={{
            x: ["-100%", "200%"]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
}
