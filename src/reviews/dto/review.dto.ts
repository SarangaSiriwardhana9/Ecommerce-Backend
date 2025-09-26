import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty() @IsMongoId() productId: string;
  @ApiProperty() @IsNumber() @Min(1) @Max(5) rating: number;
  @ApiPropertyOptional() @IsString() @IsOptional() title?: string;
  @ApiProperty() @IsString() @IsNotEmpty() body: string;
  @ApiPropertyOptional() @IsString() @IsOptional() authorName?: string;
  @ApiPropertyOptional() @IsEmail() @IsOptional() authorEmail?: string;
}

export class ModerateReviewDto {
  @ApiProperty() @IsString() @IsNotEmpty() status: 'pending' | 'approved' | 'rejected';
}
