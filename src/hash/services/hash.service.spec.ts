import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { HASH_STRATEGY } from '../constants/hash.constant';
import type { HashStrategy } from '../strategies/hash-strategy.interface';
import { HashService } from './hash.service';

describe('HashService', () => {
  let hashService: HashService;

  const hashStrategy: jest.Mocked<HashStrategy> = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashService,
        {
          provide: HASH_STRATEGY,
          useValue: hashStrategy,
        },
      ],
    }).compile();

    hashService = module.get<HashService>(HashService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hash', () => {
    it('debe delegar el hasheo a la estrategia configurada', async () => {
      const password = 'mi-clave-secreta';
      const hashPassword = '$argon2id$hash-generado';
      hashStrategy.hash.mockResolvedValue(hashPassword);

      const result = await hashService.hash(password);

      expect(hashStrategy.hash).toHaveBeenCalledWith(password);
      expect(hashStrategy.hash).toHaveBeenCalledTimes(1);
      expect(result).toBe(hashPassword);
    });
  });

  describe('compare', () => {
    it('debe delegar la comparación a la estrategia configurada', async () => {
      const password = 'mi-clave-secreta';
      const hashPassword = '$argon2id$hash-generado';
      hashStrategy.compare.mockResolvedValue(true);

      const result = await hashService.compare(password, hashPassword);

      expect(hashStrategy.compare).toHaveBeenCalledWith(password, hashPassword);
      expect(hashStrategy.compare).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('debe retornar false cuando la estrategia indica que no coincide', async () => {
      const password = 'mi-clave-secreta';
      const hashPassword = '$argon2id$hash-generado';
      hashStrategy.compare.mockResolvedValue(false);

      const result = await hashService.compare(password, hashPassword);

      expect(hashStrategy.compare).toHaveBeenCalledWith(password, hashPassword);
      expect(hashStrategy.compare).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });
  });
});
