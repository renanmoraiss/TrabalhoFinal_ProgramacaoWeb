import {prismaClient} from "../../prisma/client";

class DeleteUserService{
    async execute(userId: string){
        if(!userId){
            throw new Error("usuario nao encontrado");
        }
        const removed = await prismaClient.user.delete({
            where: {
                id: userId
            },
            select: {
                username: true,
                email: true
            }
        });
        return removed;
    }
}

export {DeleteUserService}