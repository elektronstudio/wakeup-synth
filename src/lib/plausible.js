import Plausible from "plausible-tracker";
import { config } from ".";

export const plausible = Plausible({
  domain: config.plausibleDomain,
  trackLocalhost: true,
});
