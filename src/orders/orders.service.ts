import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly cartService: CartService,
    private readonly productsService: ProductsService,
  ) {}

  async createFromCart(sessionId: string, dto: CreateOrderDto) {
    const cart = await this.cartService.getCart(sessionId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate stock
    for (const item of cart.items) {
      const product = await this.productsService.findById(String(item.productId));
      const variant = product.variants.find((v) => v.variantId === item.variantId);
      if (!variant) throw new BadRequestException('Variant not found');
      if (item.quantity > variant.stock)
        throw new BadRequestException('Item exceeds stock, adjust cart');
    }

    // Build order summary
    const orderItems = [] as any[];
    let subtotal = 0;
    for (const item of cart.items) {
      const product = await this.productsService.findById(String(item.productId));
      const variant = product.variants.find((v) => v.variantId === item.variantId)!;
      const unitPrice = variant.price ?? product.price;
      subtotal += unitPrice * item.quantity;
      orderItems.push({
        productId: new Types.ObjectId(String(item.productId)),
        variantId: item.variantId,
        title: product.title,
        quantity: item.quantity,
        unitPrice,
      });
    }

    const total = subtotal; // shipping/taxes placeholders

    // Reserve stock immediately (FR-14 default)
    for (const item of cart.items) {
      const product = await this.productsService.findById(String(item.productId));
      const variant = product.variants.find((v) => v.variantId === item.variantId)!;
      variant.stock -= item.quantity;
      await this.productsService.update(String(product._id), {
        variants: product.variants as any,
      } as any);
    }

    const order = await this.orderModel.create({
      sessionId,
      userId: null,
      shippingName: dto.shippingName,
      phone: dto.phone,
      shippingAddress: dto.shippingAddress,
      notes: dto.notes,
      paymentMethod: 'COD',
      status: 'Pending' as OrderStatus,
      items: orderItems,
      subtotal,
      total,
      couponCode: cart.couponCode || null,
    });

    return order.toObject();
  }

  async updateStatus(id: string, status: OrderStatus, trackingNumber?: string, internalNotes?: string) {
    const updated = await this.orderModel
      .findByIdAndUpdate(
        id,
        { status, trackingNumber: trackingNumber ?? null, internalNotes: internalNotes ?? '' },
        { new: true },
      )
      .lean();
    if (!updated) throw new NotFoundException('Order not found');
    return updated;
  }

  async list() {
    return this.orderModel.find().sort({ createdAt: -1 }).lean();
  }
}


