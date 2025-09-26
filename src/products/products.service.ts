import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const hasMain = dto.images?.some((i) => i.isMain) ?? false;
    if (!hasMain && dto.images && dto.images.length > 0) {
      dto.images[0].isMain = true;
    }
    const created = await this.productModel.create({
      ...dto,
      categoryIds: dto.categoryIds.map((id) => new Types.ObjectId(id)),
    });
    return created.toObject();
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).lean();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    if (dto.categoryIds) {
      (dto as any).categoryIds = dto.categoryIds.map((cid) => new Types.ObjectId(cid));
    }
    const updated = await this.productModel.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  async archive(id: string): Promise<Product> {
    const updated = await this.productModel
      .findByIdAndUpdate(id, { archived: true }, { new: true })
      .lean();
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const res = await this.productModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Product not found');
  }

  async search(params: {
    q?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
    color?: string;
    rating?: number; // placeholder for future aggregation
    page?: number;
    limit?: number;
    sort?: 'price_asc' | 'price_desc' | 'newest';
  }) {
    const { q, categoryId, minPrice, maxPrice, size, color, page = 1, limit = 20, sort } = params;
    const filter: FilterQuery<ProductDocument> = { archived: false };

    if (q) {
      filter.$text = { $search: q } as any;
    }
    if (categoryId) {
      filter.categoryIds = new Types.ObjectId(categoryId);
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {} as any;
      if (minPrice !== undefined) (filter.price as any).$gte = minPrice;
      if (maxPrice !== undefined) (filter.price as any).$lte = maxPrice;
    }
    if (size) {
      (filter as any)['variants.attributes.size'] = size;
    }
    if (color) {
      (filter as any)['variants.attributes.color'] = color;
    }

    const sortBy = (() => {
      switch (sort) {
        case 'price_asc':
          return { price: 1 } as any;
        case 'price_desc':
          return { price: -1 } as any;
        case 'newest':
          return { createdAt: -1 } as any;
        default:
          return { createdAt: -1 } as any;
      }
    })();

    const [items, total] = await Promise.all([
      this.productModel
        .find(filter)
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.productModel.countDocuments(filter),
    ]);

    return { items, total, page, limit };
  }
}
