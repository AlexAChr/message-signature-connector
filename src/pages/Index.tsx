
import { useState } from "react";
import WalletConnect from "@/components/WalletConnect";
import MessageSigner from "@/components/MessageSigner";
import { motion } from "framer-motion";

const Index = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = (walletAddress: string) => {
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
        />
        <MessageSigner isConnected={isConnected} />
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
