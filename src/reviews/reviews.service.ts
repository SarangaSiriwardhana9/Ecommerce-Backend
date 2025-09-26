import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/review.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>,
    private readonly productsService: ProductsService,
  ) {}

  async create(sessionId: string, dto: CreateReviewDto) {
    // anti-duplication within 24h
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dup = await this.reviewModel.findOne({
      sessionId,
      productId: new Types.ObjectId(dto.productId),
      createdAt: { $gte: since },
    });
    if (dup) throw new BadRequestException('You have recently reviewed this product.');

    // ensure product exists
    await this.productsService.findById(dto.productId);

    const created = await this.reviewModel.create({
      ...dto,
      productId: new Types.ObjectId(dto.productId),
      sessionId,
      status: 'pending',
    });
    return created.toObject();
  }

  async moderate(id: string, status: 'pending' | 'approved' | 'rejected') {
    const updated = await this.reviewModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .lean();
    if (!updated) throw new NotFoundException('Review not found');
    return updated;
  }

  async listForProduct(productId: string) {
    return this.reviewModel
      .find({ productId: new Types.ObjectId(productId), status: 'approved' })
      .sort({ createdAt: -1 })
      .lean();
  }

  async aggregateRating(productId: string) {
    const res = await this.reviewModel.aggregate([
      { $match: { productId: new Types.ObjectId(productId), status: 'approved' } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const avg = res[0]?.avg ?? 0;
    const count = res[0]?.count ?? 0;
    return { average: avg, count };
  }
}


