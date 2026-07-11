import {prismaClient} from "../../prisma/client";

class ListUserStickersService {
    async execute(userId: string) {
        if (!userId) {
            throw new Error("O usuário não foi encontrado.")
        }

        const stickers = await prismaClient.userSticker.findMany({
            where: {
                userId
            },
            include: {
                player: true
            }
        });
        return stickers;
    }
}

export {ListUserStickersService};