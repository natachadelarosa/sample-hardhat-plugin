import { extendEnvironment } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import wretch from "wretch";

// custom
import { Tally } from "./tally";

// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
import "./type-extensions";

wretch().polyfills({
  fetch: require("node-fetch"),
  FormData: require("form-data"),
  URLSearchParams: require("url").URLSearchParams,
});

extendEnvironment((hre) => {
  // We add a field to the Hardhat Runtime Environment here.
  // We use lazyObject to avoid initializing things until they are actually
  // needed.
  hre.tally = lazyObject(() => new Tally(hre));
});
