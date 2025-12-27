import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12;

export async function hashPassword(password:string){
    const hash = await bcrypt.hash(password,SALT_ROUNDS);
    return hash;
}

export async function verifyPassword(
    password:string,
    hash:string
){
    return await bcrypt.compare(password,hash);
}