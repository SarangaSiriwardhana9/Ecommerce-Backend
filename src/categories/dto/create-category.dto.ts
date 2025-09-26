import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ nullable: true })
  @IsMongoId()
  @IsOptional()
  parentId?: string | null;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}


