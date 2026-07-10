import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Usuário é obrigatório."),
  passwordHash: z.string().min(4, "A senha deve ter no mínimo 4 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;