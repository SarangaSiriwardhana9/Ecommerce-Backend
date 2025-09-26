import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req: any) {
    return this.cartService.getCart(req.sessionId);
  }

  @Post('items')
  addItem(@Req() req: any, @Body() dto: AddToCartDto) {
    return this.cartService.addItem(req.sessionId, dto);
  }

  @Patch('items/:productId/:variantId')
  updateItem(
    @Req() req: any,
    @Param('productId') productId: string,
    @Param('variantId') variantId: string,
    @Body() body: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(req.sessionId, productId, variantId, body.quantity);
  }

  @Delete('items/:productId/:variantId')
  removeItem(
    @Req() req: any,
    @Param('productId') productId: string,
    @Param('variantId') variantId: string,
  ) {
    return this.cartService.removeItem(req.sessionId, productId, variantId);
  }
}
