
import { useState, useCallback } from "react";
import WalletConnect from "@/components/WalletConnect";
import MessageSigner from "@/components/MessageSigner";
import WalletLogs from "@/components/WalletLogs";
import { motion } from "framer-motion";

interface LogEntry {
  id: number;
  timestamp: string;
  action: string;
  details: string;
}

const Index = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((action: string, details: string) => {
    const newLog: LogEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      action,
      details,
    };
    setLogs((prevLogs) => [newLog, ...prevLogs]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const handleConnect = (walletAddress: string) => {
    if (walletAddress === "") {
      setAddress(null);
      setIsConnected(false);
      return;
    }
    setAddress(walletAddress);
    setIsConnected(true);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/30 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Bitcoin Message Signer
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Connect your OKX wallet to sign messages with your Bitcoin address
        </p>
      </motion.div>

      <div className="container grid max-w-3xl gap-8">
        <WalletConnect 
          onConnect={handleConnect} 
          isConnected={isConnected}
          address={address}
          addLog={addLog}
        />
        <MessageSigner 
          isConnected={isConnected} 
          addLog={addLog}
        />
        <WalletLogs logs={logs} onClear={clearLogs} />
      </div>
      
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 text-center text-sm text-muted-foreground"
      >
        <p>OKX Bitcoin Message Signing Application</p>
      </motion.footer>
    </div>
  );
};

export default Index;
