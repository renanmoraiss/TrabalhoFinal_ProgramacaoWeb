import {prismaClient} from "../../prisma/client";
import { AuthRequest } from "../../models/auth/AuthRequest";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

class AuthService {
    async execute({username, passwordHash}: AuthRequest) {
        if(!username || !passwordHash) {
            throw new Error ("Campos obrigatórios não podem estar vazios.")
        }

        if (passwordHash.length < 4) {
            throw new Error("A senha deve ter no mínimo 4 caracteres")
        }

        const user = await prismaClient.user.findUnique({
            where: {
                username: username.trim()
            }
        });

        if(!user) {
            throw new Error ("Usuário ou senha estão incorretos!");
        }

        const senhaHash = await compare(passwordHash, user?.passwordHash);

        if(!senhaHash) {
            throw new Error ("Usuário ou senha estão incorretos!");
        }


        const token = sign(
            {
                username: user.username,
                email: user.email,
            },
            process.env.JWT_SECRET as string,
            {
                subject: user?.id,
                expiresIn: "1d"
            }
        );

        return {
            id: user?.id,
            username: user.username,
            email: user?.email,
            token
        }

    }
}

export { AuthService }