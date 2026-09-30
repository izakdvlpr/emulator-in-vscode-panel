import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    ANDROID_HOME: z.string().min(1).optional(),
    ANDROID_SDK_ROOT: z.string().min(1).optional(),
    // Xcode alternativo, como no `xcrun`; sem ele vale o `xcode-select -p`.
    DEVELOPER_DIR: z.string().min(1).optional(),
    LOCALAPPDATA: z.string().min(1).optional(),
    XDG_RUNTIME_DIR: z.string().min(1).optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
