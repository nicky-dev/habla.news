import "@fontsource/unbounded/400.css";
import "@fontsource/unbounded/600.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/source-serif-pro/400.css";

import { useMemo, useEffect } from "react";
import { appWithTranslation } from "next-i18next";
import {
  NDKUser,
  NDKNip07Signer,
  NDKPrivateKeySigner,
} from "@nostr-dev-kit/ndk";
import { AppProps } from "next/app";
import { useAtom } from "jotai";
import { nip19 } from "nostr-tools";

import { createLocalStorageManager, ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import NostrContext from "@habla/nostr/provider";

import theme from "@habla/theme";
import { pubkeyAtom, privkeyAtom, relaysAtom } from "@habla/state";
import { createNdk } from "@habla/nostr";
import cacheAdapter from "@habla/cache/indexeddb";
import Head from "next/head";

// this changes the default local storage key name to ensure that no user has light mode cached in
const colorModeManager = createLocalStorageManager("habla-ui-color");

// react-query client
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const [explicitRelayUrls] = useAtom(relaysAtom);
  const [privkey] = useAtom(privkeyAtom);
  const [, setPubkey] = useAtom(pubkeyAtom);
  const signer = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }
    if (privkey) {
      return new NDKPrivateKeySigner(privkey);
    }
    if (window.nostr) {
      return new NDKNip07Signer();
    }

    return null;
  }, [privkey]);
  const options =
    typeof window === "undefined"
      ? { explicitRelayUrls }
      : {
          explicitRelayUrls,
          outboxRelayUrls: ["wss://purplepag.es"],
          enableOutboxModel: false,
          signer,
          cacheAdapter,
        };

  const ndk = useMemo(() => {
    return createNdk(options);
  }, []);

  return (
    <NostrContext.Provider value={{ ndk }}>
      <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </ChakraProvider>
    </NostrContext.Provider>
  );
}

export default appWithTranslation(MyApp);
