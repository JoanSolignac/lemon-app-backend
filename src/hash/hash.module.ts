import { Module } from '@nestjs/common';
import { HashService } from './services/hash.service';
import { HASH_STRATEGY } from './constants/hash.constant';
import { Argon2Strategy } from './strategies/argon2.strategy';

@Module({
  providers: [
    HashService,
    {
      provide: HASH_STRATEGY,
      useClass: Argon2Strategy
    },
  ],
  exports: [HashService],
})
export class HashModule {}
