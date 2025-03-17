
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { MessageSquare, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MessageSignerProps {
  isConnected: boolean;
}

const MessageSigner = ({ isConnected }: MessageSignerProps) => {
  const [message, setMessage] = useState("");
  const [signatureType, setSignatureType] = useState<"ecdsa" | "bip322-simple">("ecdsa");
  const [signature, setSignature] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);
  const [copied, setCopied] = useState(false);

  const signMessage = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty", {
        description: "Please enter a message to sign",
      });
      return;
    }

    if (!window.okxwallet) {
      toast.error("OKX Wallet extension not found", {
        description: "Please install the OKX Wallet extension and refresh the page",
      });
      return;
    }

    try {
      setSigning(true);
      const signedMessage = await window.okxwallet.bitcoin.signMessage(message, signatureType);
      setSignature(signedMessage);
      toast.success("Message signed successfully");
    } catch (error) {
      console.error("Signing error:", error);
      toast.error("Failed to sign message", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setSigning(false);
    }
  };

  const copySignature = () => {
    if (signature) {
      navigator.clipboard.writeText(signature);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Signature copied to clipboard");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="overflow-hidden border-0 shadow-md">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-primary opacity-80" />
            <h3 className="text-xl font-medium">Sign Message</h3>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">Message</label>
            <Textarea
              placeholder="Enter the message you want to sign"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px] transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              disabled={!isConnected}
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">Signature Type</label>
            <Select
              disabled={!isConnected}
              value={signatureType}
              onValueChange={(value) => setSignatureType(value as "ecdsa" | "bip322-simple")}
            >
              <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Select signature type" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-sm">
                <SelectItem value="ecdsa">ECDSA</SelectItem>
                <SelectItem value="bip322-simple">BIP322 Simple</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={signMessage}
            disabled={!isConnected || signing || !message.trim()}
            className="w-full transition-all duration-300"
          >
            {signing ? (
              <span className="flex items-center">
                <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing...
              </span>
            ) : (
              "Sign Message"
            )}
          </Button>

          <AnimatePresence>
            {signature && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 overflow-hidden"
              >
                <div className="rounded-lg border bg-secondary/50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Signature</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copySignature}
                      className="h-8 w-8 rounded-full p-0 hover:bg-primary/10"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="max-h-24 overflow-auto rounded bg-background/80 p-2 text-xs font-mono break-all">
                    {signature}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MessageSigner;
