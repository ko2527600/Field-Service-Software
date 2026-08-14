import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.firearmour.app",
  appName: "Fire Armour",
  webDir: "dist",
  android: {
    allowMixedContent: false,
  },
};

export default config;
