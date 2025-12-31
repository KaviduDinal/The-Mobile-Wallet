import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import SafeScreen from "@/components/SafeScreen";
import * as SecureStore from "expo-secure-store";

const tokenCache = {
  async getToken(key) { return SecureStore.getItemAsync(key); },
  async saveToken(key, value) { return SecureStore.setItemAsync(key, value); },
  async deleteToken(key) { return SecureStore.deleteItemAsync(key); },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
console.log("PUBLISHABLE_KEY:", publishableKey);

export default function RootLayout() {
  if (!publishableKey) {
    console.warn("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY for native");
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </ClerkProvider>
  );
}
