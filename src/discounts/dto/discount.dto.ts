import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateDiscountDto {
  @ApiProperty() @IsString() @IsNotEmpty() code: string;
  @ApiProperty({ enum: ['percentage', 'fixed'] }) @IsEnum(['percentage', 'fixed']) type: 'percentage' | 'fixed';
  @ApiProperty() @IsNumber() @Min(0) value: number;
  @ApiPropertyOptional({ type: [String] }) @IsArray() @IsMongoId({ each: true }) @IsOptional() appliesToProductIds?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsArray() @IsMongoId({ each: true }) @IsOptional() appliesToCategoryIds?: string[];
  @ApiPropertyOptional() @IsBoolean() @IsOptional() appliesToOrder?: boolean;
  @ApiPropertyOptional() @IsNumber() @Min(0) @IsOptional() minOrderValue?: number;
  @ApiPropertyOptional() @IsNumber() @Min(1) @IsOptional() maxUses?: number;
  @ApiPropertyOptional() @IsDateString() @IsOptional() validFrom?: string;
  @ApiPropertyOptional() @IsDateString() @IsOptional() validTo?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isActive?: boolean;
}

export class ApplyCouponDto {
  @ApiProperty() @IsString() @IsNotEmpty() code: string;
}


