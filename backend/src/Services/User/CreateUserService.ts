import {prismaClient} from "../../prisma/client"
import { CreateUserRequest } from "../../models/user/CreaeteuserRequest"
import { hash } from "bcrypt";


class CreateUserService{
    async execute({username, email, passwordHash}:CreateUserRequest){
        if(!username || !email || !passwordHash){
            throw new Error("Informações necessárias faltando");
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