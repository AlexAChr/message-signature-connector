
export interface OkxWalletResponse {
  address: string;
  publicKey: string;
}

export interface Window {
  okxwallet?: {
    bitcoin: {
      connect: () => Promise<OkxWalletResponse>;
      signMessage: (message: string, type: "ecdsa" | "bip322-simple") => Promise<string>;
    };
  };
}

declare global {
  interface Window {
    okxwallet?: {
      bitcoin: {
        connect: () => Promise<OkxWalletResponse>;
        signMessage: (message: string, type: "ecdsa" | "bip322-simple") => Promise<string>;
      };
    };
  }
}
