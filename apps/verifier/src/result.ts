import prisma from "db";

export async function getRecentResults(
    monitorId:string,
    region:string,
    limit:3
){
    return await prisma.checkResult.findMany({
        where:{monitorId,region},
        orderBy:{checkedAt:'desc'},
        take:limit
    })
}