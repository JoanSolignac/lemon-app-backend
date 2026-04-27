export interface HashStrategy{
    hash(password: string): Promise<string>;
    compare(password: string, hashPassword: string): Promise<boolean>;
}