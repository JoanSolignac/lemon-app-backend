import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class PaginatedResultDto<T>{
    @ApiHideProperty()
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
        page: number,
        limit: number,
        total: number,
    }   
}