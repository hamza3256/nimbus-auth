"use client";

import { useState, useEffect } from "react";
import {
  getProviders,
  LiteralUnion,
  ClientSafeProvider,
} from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";

export function useOAuthProviders() {
  const [oauthProviders, setOauthProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const providers = await getProviders();
        if (providers) {
          const filteredProviders = Object.values(providers).filter(
            (p) => p.type === "oauth",
          );
          const oauthProviderMap = filteredProviders.reduce(
            (acc, provider) => {
              acc[provider.id] = provider;
              return acc;
            },
            {} as Record<
              LiteralUnion<BuiltInProviderType, string>,
              ClientSafeProvider
            >,
          );
          setOauthProviders(oauthProviderMap);
        }
      } catch (error) {
        console.error("Failed to fetch OAuth providers:", error);
        setOauthProviders(null); // Set to null or an empty object on error
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { oauthProviders, isLoadingProviders: isLoading };
}
