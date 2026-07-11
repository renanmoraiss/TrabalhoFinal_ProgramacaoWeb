import {prismaClient} from "../../prisma/client";

class ListUserService{
    async execute(userId: string){
        if(!userId){
            throw new Error("Usuario nao encontrado");
        }
        const user = await prismaClient.user.findUnique({
            where: {
                id: userId
            },
            select: {
                username: true,
                email: true
            }
        });
        return user;
    }
}

export {ListUserService}