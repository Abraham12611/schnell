'use client';

import React, { type ReactNode } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mantle, mantleSepoliaTestnet } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, cookieToInitialState, type Config, createStorage, cookieStorage } from 'wagmi';

// Ensure the Project ID is loaded from environment variables
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_REOWN_PROJECT_ID is not defined. Please check your .env.local file.');
}

// Set up queryClient
const queryClient = new QueryClient();

// Define metadata for AppKit
const metadata = {
  name: 'Schnell Remittance',
  description: 'Lowest Fees, Fastest Speeds on Mantle for cross-border payments.',
  url: 'https://schnell.finance', // Replace with your actual deployed URL later
  icons: ['/schnell-logo-placeholder.png'], // Replace with your actual logo URL later
};

// Define networks for WagmiAdapter and AppKit
const configuredNetworks = [mantle, mantleSepoliaTestnet];

// Instantiate WagmiAdapter
const wagmiAdapterInstance = new WagmiAdapter({
  projectId,
  networks: configuredNetworks,
  storage: createStorage({ storage: cookieStorage }),
  ssr: true, // Recommended for Next.js SSR
});

// Create the AppKit modal instance
createAppKit({
  adapters: [wagmiAdapterInstance],
  projectId,
  networks: configuredNetworks,
  metadata: metadata,
  features: {
    analytics: true, // Optional: enable analytics based on your Reown Cloud config
    // You can add other features like `connectors` if needed
  },
  themeMode: 'dark', // Match our charcoal theme
});

// Create the ContextProvider component
export default function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapterInstance.wagmiConfig as Config, cookies);

  return (
    <WagmiProvider config={wagmiAdapterInstance.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}