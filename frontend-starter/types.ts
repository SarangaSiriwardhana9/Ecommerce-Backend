// Shared types aligned with backend DTOs and schemas

export type UserRole = 'customer' | 'admin';

export interface User {
  _id: string;
  email: string;
  name?: string;
  role: UserRole;
}

export interface ProductImage { url: string; altText?: string; isMain?: boolean }
export interface VariantAttributes { size?: string; color?: string; material?: string }
export interface ProductVariant {
  variantId: string;
  attributes: VariantAttributes;
  price: number;
  stock: number;
  imageUrl?: string;
}

export interface Product {
  _id: string;
  title: string;
  mainDescription?: string;
  subDescription?: string;
  sku: string;
  tags: string[];
  categoryIds: string[];
  variants: ProductVariant[];
  images: ProductImage[];
  price: number;
  discountPrice?: number;
  archived?: boolean;
  createdAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  description?: string;
  children?: Category[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  priceAtAdd: number;
}
export interface Cart {
  _id?: string;
  sessionId: string;
  userId?: string | null;
  items: CartItem[];
  couponCode?: string | null;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';

export interface OrderItem {
  productId: string;
  variantId: string;
  title: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  sessionId: string;
  userId?: string | null;
  shippingName: string;
  phone: string;
  shippingAddress: OrderAddress;
  notes?: string;
  paymentMethod: 'COD';
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  total: number;
  couponCode?: string | null;
  trackingNumber?: string | null;
  internalNotes?: string;
}

export type DiscountType = 'percentage' | 'fixed';
export interface Discount {
  _id: string;
  code: string;
  type: DiscountType;
  value: number;
  appliesToProductIds?: string[];
  appliesToCategoryIds?: string[];
  appliesToOrder?: boolean;
  minOrderValue?: number;
  maxUses?: number | null;
  validFrom?: string | null;
  validTo?: string | null;
  isActive: boolean;
  usedCount?: number;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export interface Review {
  _id: string;
  productId: string;
  rating: number;
  title?: string;
  body: string;
  authorName?: string;
  authorEmail?: string;
  sessionId: string;
  userId?: string | null;
  status: ReviewStatus;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}


