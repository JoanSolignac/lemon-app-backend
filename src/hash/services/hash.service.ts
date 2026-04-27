import { Inject, Injectable } from '@nestjs/common';
import { HASH_STRATEGY } from '../constants/hash.constant';
import type { HashStrategy } from '../strategies/hash-strategy.interface';

@Injectable()
export class HashService {
    constructor(
        @Inject(HASH_STRATEGY)
        private readonly strategy: HashStrategy
    ){};

    hash(password: string): Promise<string> {
        return this.strategy.hash(password);
    }

    compare(password: string, hashPassword: string): Promise<boolean> {
        return this.strategy.compare(password, hashPassword);
    }
}
 