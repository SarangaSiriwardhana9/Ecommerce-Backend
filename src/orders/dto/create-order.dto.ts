import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @ApiProperty() @IsString() @IsNotEmpty() line1: string;
  @ApiPropertyOptional() @IsString() @IsOptional() line2?: string;
  @ApiProperty() @IsString() @IsNotEmpty() city: string;
  @ApiProperty() @IsString() @IsNotEmpty() state: string;
  @ApiProperty() @IsString() @IsNotEmpty() postalCode: string;
  @ApiProperty() @IsString() @IsNotEmpty() country: string;
}

export class CreateOrderDto {
  @ApiProperty() @IsString() @IsNotEmpty() shippingName: string;
  @ApiProperty() @IsString() @IsNotEmpty() phone: string; // keep generic to avoid strict locale
  @ApiProperty({ type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;
  @ApiPropertyOptional() @IsString() @IsOptional() notes?: string;
  @ApiPropertyOptional() @IsEmail() @IsOptional() email?: string;
}


