import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Discount, DiscountDocument } from './schemas/discount.schema';
import { CreateDiscountDto } from './dto/discount.dto';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectModel(Discount.name) private readonly discountModel: Model<DiscountDocument>,
  ) {}

  async create(dto: CreateDiscountDto) {
    const payload: any = { ...dto };
    if (dto.appliesToProductIds)
      payload.appliesToProductIds = dto.appliesToProductIds.map((id) => new Types.ObjectId(id));
    if (dto.appliesToCategoryIds)
      payload.appliesToCategoryIds = dto.appliesToCategoryIds.map((id) => new Types.ObjectId(id));
    if (dto.validFrom) payload.validFrom = new Date(dto.validFrom);
    if (dto.validTo) payload.validTo = new Date(dto.validTo);
    const created = await this.discountModel.create(payload);
    return created.toObject();
  }

  async findByCode(code: string) {
    const d = await this.discountModel.findOne({ code }).lean();
    if (!d) throw new NotFoundException('Coupon not found');
    return d;
  }

  isValidNow(d: Discount) {
    const now = new Date();
    if (!d.isActive) return false;
    if (d.validFrom && now < new Date(d.validFrom)) return false;
    if (d.validTo && now > new Date(d.validTo)) return false;
    if (d.maxUses && d.usedCount >= d.maxUses) return false;
    return true;
  }
}


