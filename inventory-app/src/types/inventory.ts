export interface Product {
  id: string;
  name: string;
  description?: string;
  category: 'harness' | 'leash' | 'collar';
  pattern?: string;
  supplier_name?: string;
  base_cost?: number;
  selling_price?: number;
  primary_image_url?: string;
  gallery_images?: string[];
  is_active: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku?: string;
  size?: string;
  color?: string;
  style?: string;
  current_stock: number;
  reorder_level: number;
  location?: string;
  variant_image_url?: string;
  created_at: string;
}

export interface InventoryTransaction {
  id: string;
  variant_id: string;
  transaction_type: 'received' | 'sold' | 'damaged' | 'adjustment';
  quantity: number;
  notes?: string;
  transaction_date: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  payment_terms?: string;
  created_at: string;
}

// For the specific business context of dog harnesses and leashes
export type HarnessSize = 'Small' | 'Medium' | 'Large';
export type LeashLength = 'One Size';

export interface HarnessProduct extends Product {
  category: 'harness';
}

export interface LeashProduct extends Product {
  category: 'leash';
}

export interface MatchingSet {
  id: string;
  harness_variant_id: string;
  leash_variant_id: string;
  set_name: string;
  is_available: boolean;
}
