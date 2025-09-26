import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { AddToCartDto } from './dto/cart.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
    private readonly productsService: ProductsService,
  ) {}

  private async getOrCreate(sessionId: string) {
    let cart = await this.cartModel.findOne({ sessionId }).lean();
    if (!cart) {
      const created = await this.cartModel.create({ sessionId, items: [] });
      cart = created.toObject();
    }
    return cart;
  }

  async getCart(sessionId: string) {
    return this.getOrCreate(sessionId);
  }

  async addItem(sessionId: string, dto: AddToCartDto) {
    const product = await this.productsService.findById(dto.productId);
    const variant = product.variants.find((v) => v.variantId === dto.variantId);
    if (!variant) throw new BadRequestException('Variant not found');
    if (dto.quantity > variant.stock)
      throw new BadRequestException('Quantity exceeds stock');

    const price = variant.price ?? product.price;
    const update = await this.cartModel.findOneAndUpdate(
      { sessionId },
      {
        $setOnInsert: { sessionId, items: [] },
        $inc: { 'items.$[match].quantity': dto.quantity },
        $set: { 'items.$[match].priceAtAdd': price },
        $push: {
          items: {
            $each: [
              {
                productId: new Types.ObjectId(dto.productId),
                variantId: dto.variantId,
                quantity: dto.quantity,
                priceAtAdd: price,
              },
            ],
          },
        },
      },
      {
        upsert: true,
        arrayFilters: [
          {
            'match.productId': new Types.ObjectId(dto.productId),
            'match.variantId': dto.variantId,
          },
        ],
        new: true,
      },
    );

    const merged = await this.mergeDuplicates(update.toObject());
    await this.cartModel.updateOne({ sessionId }, { items: merged.items });
    return merged;
  }

  async updateItem(sessionId: string, productId: string, variantId: string, quantity: number) {
    if (quantity < 1) throw new BadRequestException('Quantity must be >= 1');
    const product = await this.productsService.findById(productId);
    const variant = product.variants.find((v) => v.variantId === variantId);
    if (!variant) throw new BadRequestException('Variant not found');
    if (quantity > variant.stock) throw new BadRequestException('Exceeds stock');

    const updated = await this.cartModel
      .findOneAndUpdate(
        { sessionId },
        { $set: { 'items.$[match].quantity': quantity } },
        {
          arrayFilters: [
            {
              'match.productId': new Types.ObjectId(productId),
              'match.variantId': variantId,
            },
          ],
          new: true,
        },
      )
      .lean();
    if (!updated) throw new NotFoundException('Cart not found');
    return updated;
  }

  async removeItem(sessionId: string, productId: string, variantId: string) {
    const updated = await this.cartModel
      .findOneAndUpdate(
        { sessionId },
        {
          $pull: {
            items: {
              productId: new Types.ObjectId(productId),
              variantId,
            },
          },
        },
        { new: true },
      )
      .lean();
    if (!updated) throw new NotFoundException('Cart not found');
    return updated;
  }

  private async mergeDuplicates(cart: any) {
    const key = (i: any) => `${String(i.productId)}::${i.variantId}`;
    const map = new Map<string, any>();
    for (const item of cart.items) {
      const k = key(item);
      if (!map.has(k)) map.set(k, { ...item });
      else map.get(k)!.quantity += item.quantity;
    }
    return { ...cart, items: Array.from(map.values()) };
  }
}


