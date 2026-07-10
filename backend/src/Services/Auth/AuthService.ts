import {prismaClient} from "../../prisma/client";
import { AuthRequest } from "../../models/atuh/AuthRequest";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

class AuthService {
    async execute({email, senha}: AuthRequest) {
        if(!email || !senha) {
            throw new Error ("Campos obrigatórios não podem estar vazios.")
        }

        const user = await prismaClient.user.findUnique({
            where: {
                email: email
            }
        });

        if(!user) {
            throw new Error ("Email ou senha estão incorretos!");
        }

        const senhaHash = await compare(senha, user?.passwordHash);

        if(!senhaHash) {
            throw new Error ("Email ou senha estão incorretos!");
        }


        const token = sign(
            {
                email: user?.email
            },
            process.env.JWT_SECRET as string,
            {
                subject: user?.id,
                expiresIn: "1d"
            }
        );

        return {
            id: user?.id,
            email: user?.email,
            token
        }

    }
}

export { AuthService }