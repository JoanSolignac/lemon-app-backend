import { HashStrategy } from "./hash-strategy.interface";
import * as argon2 from 'argon2'

export class Argon2Strategy implements HashStrategy {
    hash(password: string): Promise<string> {
        return argon2.hash(password);
    }
    compare(password: string, hashPassword: string): Promise<boolean> {
        return argon2.verify(hashPassword, password);
    }
}