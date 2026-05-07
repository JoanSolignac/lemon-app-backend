import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResultDto<T> {
  @ApiProperty({
    description: 'Lista de resultados paginados.',
    type: 'array',
    items: { type: 'object' },
  })
  data!: T[];

  @ApiProperty({
    description: 'Metadatos de la paginación.',
    example: {
      page: 1,
      limit: 10,
      total: 25,
    },
  })
  meta!: {
    page: number;
    limit: number;
    total: number;
  };
}
