import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const parentId = dto.parentId ? new Types.ObjectId(dto.parentId) : null;
    const created = await this.categoryModel.create({ ...dto, parentId });
    return created.toObject();
  }

  async findAll() {
    return this.categoryModel.find().lean();
  }

  async findById(id: string) {
    const category = await this.categoryModel.findById(id).lean();
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    if (dto.parentId === id) {
      throw new BadRequestException('Category cannot be its own parent');
    }
    const updatePayload: any = { ...dto };
    if (dto.parentId !== undefined) {
      updatePayload.parentId = dto.parentId ? new Types.ObjectId(dto.parentId) : null;
    }
    const updated = await this.categoryModel
      .findByIdAndUpdate(id, updatePayload, { new: true })
      .lean();
    if (!updated) throw new NotFoundException('Category not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.categoryModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Category not found');
  }

  async getTree() {
    const categories = await this.categoryModel.find().lean();
    const byId = new Map<string, any>();
    categories.forEach((c) => byId.set(String(c._id), { ...c, children: [] }));
    const roots: any[] = [];
    for (const c of categories) {
      if (c.parentId) {
        const parent = byId.get(String(c.parentId));
        if (parent) parent.children.push(byId.get(String(c._id)));
      } else {
        roots.push(byId.get(String(c._id)));
      }
    }
    return roots;
  }

  async getDescendantIds(categoryId: string): Promise<string[]> {
    const all = await this.categoryModel.find().select({ _id: 1, parentId: 1 }).lean();
    const childrenMap = new Map<string, string[]>();
    for (const c of all) {
      const parent = c.parentId ? String(c.parentId) : null;
      if (!parent) continue;
      if (!childrenMap.has(parent)) childrenMap.set(parent, []);
      childrenMap.get(parent)!.push(String(c._id));
    }
    const result: string[] = [];
    const stack = [categoryId];
    const visited = new Set<string>();
    while (stack.length) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;
      visited.add(current);
      result.push(current);
      const children = childrenMap.get(current) || [];
      for (const child of children) stack.push(child);
    }
    return result;
  }
}
