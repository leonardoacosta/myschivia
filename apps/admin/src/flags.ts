import { unstable_flag as flag } from "@vercel/flags/next";

export const godMode = flag({
  key: "god-mode",
  decide: () => false,
});
