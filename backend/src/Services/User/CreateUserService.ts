import {prismaClient} from "../../prisma/client"
import { CreateUserRequest } from "../../models/user/CreateUserRequest"
import { hash } from "bcrypt";


class CreateUserService{
    async execute({username, email, passwordHash}:CreateUserRequest){
        if(!username || !email || !passwordHash){
            throw new Error("Os campos obrigatórios não podem estar vazios.");
        }

        if (username.length < 4) {
            throw new Error("O usuário deve ter no mínimo 4 caracteres")
        }

        if(passwordHash.length < 4) {
            throw new Error("A senha deve ter no mínimo 4 caracteres")
        }

        const userExiste = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        });

        if(userExiste){
            throw new Error("Usuario já Cadastrado no sistema")
        }

        const passwordHashed = await hash(passwordHash, 8);

        const user = await prismaClient.user.create({
            data: {
                username: username,
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