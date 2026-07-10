import { z } from "zod";

export const cadastroSchema = z.object({
  username: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  passwordHash: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type CadastroFormData = z.infer<typeof cadastroSchema>;