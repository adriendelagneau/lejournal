import { z } from 'zod';


export const ZLoginSchema = z.object({
  email: z.string().email(),
})
