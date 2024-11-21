import { z } from "zod";

export const createTransferSchema = z.object({
  body: z.object({
    fromAccountId: z.string({required_error:"Invalid From Account Id"}),
    toAccountId: z.string({required_error:"Invalid To Account Id"}),
    files: z.array(z.object({
      name: z.string({required_error: "File name is required"}),
      mimeType: z.string({required_error: "File type is required"}),
      size: z.string({required_error:"File Size is required"}),
      id: z.string({required_error: "File Id is required"})
    })).min(1,"Invalid Files")
  }),
});
