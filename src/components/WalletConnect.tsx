import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Wallet, ArrowRight, Copy } from "lucide-react";
import { motion } from "framer-motion";

interface WalletConnectProps {
  onConnect: (address: string) => void;
  isConnected: boolean;
  address: string | null;
  addLog: (action: string, details: string) => void;
}

const WalletConnect = ({ onConnect, isConnected, address, addLog }: WalletConnectProps) => {
  const [connecting, setConnecting] = useState(false);

  const connectWallet = async () => {
    try {
      setConnecting(true);
      addLog("Connect Request", "Attempting to connect to OKX wallet");
      
      if (!window.okxwallet) {
        const errorMsg = "OKX Wallet extension not found";
        addLog("Connect Error", errorMsg);
        toast.error(errorMsg, {
          description: "Please install the OKX Wallet extension and refresh the page",
        });
        return;
      }
      
      const result = await window.okxwallet.bitcoin.connect();
      addLog("Connect Response", JSON.stringify(result, null, 2));
      
      if (result?.address) {
        onConnect(result.address);
        toast.success("Wallet connected", {
          description: "Your OKX wallet has been connected successfully",
        });
      }
    } catch (error) {
      console.error("Connection error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      addLog("Connect Error", errorMessage);
      toast.error("Failed to connect wallet", {
        description: errorMessage,
      });
    } finally {
      setConnecting(false);
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      addLog("Copy Address", `Copied address: ${address}`);
      toast.success("Address copied to clipboard");
    }
  };

  const displayAddress = (address: string) => {
    if (!address) return "";
    if (address.length <= 16) return address;
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <Card className="overflow-hidden border-0 shadow-md">
        <CardContent className="p-6">
          {!isConnected ? (
            <div className="flex flex-col items-center justify-center py-4">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Wallet className="mb-4 h-12 w-12 text-primary opacity-80" />
              </motion.div>
              <h3 className="mb-2 text-xl font-medium">Connect Wallet</h3>
              <p className="mb-6 text-center text-muted-foreground">
                Connect your OKX wallet to sign messages
              </p>
              <Button 
                className="w-full transition-all duration-300"
                onClick={connectWallet} 
                disabled={connecting}
              >
                {connecting ? (
                  <span className="flex items-center">
                    <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Connect <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center"
              >
                <Wallet className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-500">Connected</span>
              </motion.div>
              <h3 className="mb-2 mt-3 text-xl font-medium">Your Address</h3>
              <div className="mb-4 mt-2 flex w-full max-w-md items-center justify-between rounded-lg bg-secondary p-3">
                <span className="text-sm font-medium">{displayAddress(address || "")}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={copyAddress}
                  className="h-8 w-8 rounded-full hover:bg-primary/10"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                You can now sign messages with your connected wallet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WalletConnect;
