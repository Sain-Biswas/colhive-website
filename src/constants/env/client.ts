import { createEnv } from "@t3-oss/env-nextjs";

const envClient = createEnv({
  client: {},

  runtimeEnv: {},

  emptyStringAsUndefined: true,
});

export default envClient;
