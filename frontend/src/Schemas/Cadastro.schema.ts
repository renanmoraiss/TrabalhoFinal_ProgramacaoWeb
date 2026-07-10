import { z } from "zod";

export const cadastroSchema = z.object({
  username: z.string().min(4, "O nome deve ter no mínimo 4 caracteres"),
  email: z.string().email("Email inválido"),
  passwordHash: z.string().min(4, "A senha deve ter no mínimo 4 caracteres"),
});

export type CadastroFormData = z.infer<typeof cadastroSchema>;