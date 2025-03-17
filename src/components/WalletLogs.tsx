
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, XCircle } from "lucide-react";

interface LogEntry {
  id: number;
  timestamp: string;
  action: string;
  details: string;
}

interface WalletLogsProps {
  logs: LogEntry[];
  onClear: () => void;
}

const WalletLogs = ({ logs, onClear }: WalletLogsProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center text-lg font-medium">
            <Terminal className="mr-2 h-5 w-5 text-primary/80" />
            Wallet Interaction Logs
          </CardTitle>
          <button 
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground rounded-full p-1 transition-colors"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full rounded-md border bg-secondary/30 p-2">
            {logs.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No wallet interactions logged yet
              </div>
            ) : (
              <AnimatePresence>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-2 rounded-md bg-background p-2 text-xs"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-medium text-primary/80">{log.action}</span>
                      <span className="text-muted-foreground">{log.timestamp}</span>
                    </div>
                    <pre className="whitespace-pre-wrap break-all font-mono text-xs">
                      {log.details}
                    </pre>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WalletLogs;
