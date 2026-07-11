import { z } from "zod";

export const cadastroSchema = z.object({
  username: z.string().min(4, "O usuário deve ter no mínimo 4 caracteres"),
  email: z.string().email("Email inválido"),
  passwordHash: z.string().min(4, "A senha deve ter no mínimo 4 caracteres"),
  confirmPassword: z.string().min(4, "A confirmação de senha deve ter no mínimo 4 caracteres"),
}).refine((data) => data.passwordHash === data.confirmPassword, {
  message: "As senhas são diferentes",
  path: ["confirmPassword"],
});

export type CadastroFormData = z.infer<typeof cadastroSchema>;