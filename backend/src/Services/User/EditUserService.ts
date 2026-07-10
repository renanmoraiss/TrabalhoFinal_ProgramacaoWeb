import {prismaClient} from "../../prisma/client"
import { EditUserRequest } from "../../models/user/EditUserRequest"

class EditUserService{
    async execute({userId, username, email}:EditUserRequest){
        if(!userId || !username || !email){
            throw new Error("Informações necessárias pendentes");
        }
        const edit = await prismaClient.user.update({
            where: {
                id: userId
            },
            data: {
                username: username,
                email: email
            },
            select: {
                username: true,
                email: true
            }
        });
        return (edit);
    }
}

export {EditUserService}