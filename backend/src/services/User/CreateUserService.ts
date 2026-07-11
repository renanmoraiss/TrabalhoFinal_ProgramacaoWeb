import {prismaClient} from "../../prisma/client"
import { CreateUserRequest } from "../../models/user/CreateUserRequest"
import { hash } from "bcrypt";

class CreateUserService{
    async execute({username, email, passwordHash}:CreateUserRequest){
        if(!username || !email || !passwordHash){
            throw new Error("Os campos obrigatórios não podem estar vazios.");
        }

        if (username.trim().length < 4) {
            throw new Error("O usuário deve ter no mínimo 4 caracteres")
        }

        if(passwordHash.length < 4) {
            throw new Error("A senha deve ter no mínimo 4 caracteres")
        }

        const emailExiste = await prismaClient.user.findUnique({
            where: {
                email: email
            }
        });

        if(emailExiste) {
            throw new Error("Email já cadastrado no sistema")
        }

        const usernameExiste = await prismaClient.user.findUnique({
            where: {
                username: username.trim()
            }
        });

        if (usernameExiste) {
            throw new Error("Usuário já cadastrado no sistema")
        }

        const passwordHashed = await hash(passwordHash, 8);

        const user = await prismaClient.user.create({
            data: {
                username: username.trim(),
                email: email,
                passwordHash: passwordHashed
            },
            select: {
                id: true,
                username: true,
                email: true
            }
        });
        return user;
    }
}

export {CreateUserService}