import { z } from "zod";

export const getFilesFromAccountIdSchema = z.object({
  params: z.object({
    accountId: z.string({required_error:"Invalid Account Id"})
  }),
});
