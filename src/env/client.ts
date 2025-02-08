import { createEnv } from "@t3-oss/env-nextjs";

const envServer = createEnv({
  server: {},

  runtimeEnv: {},

  emptyStringAsUndefined: true,
});

export default envServer;

