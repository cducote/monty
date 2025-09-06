-- Dog Harness & Leash Inventory Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    description TEXT,
    category VARCHAR NOT NULL CHECK (category IN ('harness', 'leash', 'collar')),
    supplier_name VARCHAR,
    base_cost DECIMAL(10,2),
    selling_price DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Product variants (sizes, colors, styles)
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR UNIQUE,
    size VARCHAR, -- XS, S, M, L, XL
    color VARCHAR,
    style VARCHAR,
    current_stock INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 5,
    location VARCHAR, -- shelf/bin location
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inventory transactions
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    transaction_type VARCHAR NOT NULL CHECK (transaction_type IN ('received', 'sold', 'damaged', 'adjustment')),
    quantity INTEGER NOT NULL,
    notes TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Suppliers
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    contact_email VARCHAR,
    phone VARCHAR,
    address TEXT,
    payment_terms VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Matching sets (harness + leash combinations)
CREATE TABLE matching_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    harness_variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    leash_variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    set_name VARCHAR NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
CREATE INDEX idx_product_variants_stock ON product_variants(current_stock);
CREATE INDEX idx_inventory_transactions_variant_id ON inventory_transactions(variant_id);
CREATE INDEX idx_inventory_transactions_date ON inventory_transactions(transaction_date);

-- Row Level Security (RLS) policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_sets ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (you can restrict these later)
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations on product_variants" ON product_variants FOR ALL USING (true);
CREATE POLICY "Allow all operations on inventory_transactions" ON inventory_transactions FOR ALL USING (true);
CREATE POLICY "Allow all operations on suppliers" ON suppliers FOR ALL USING (true);
CREATE POLICY "Allow all operations on matching_sets" ON matching_sets FOR ALL USING (true);

-- Insert some sample data for testing
INSERT INTO suppliers (name, contact_email, phone) VALUES 
('PetGear Solutions', 'orders@petgear.com', '555-0123'),
('Quality Dog Products', 'sales@qualitydog.com', '555-0456');

INSERT INTO products (name, description, category, supplier_name, base_cost, selling_price) VALUES 
('Premium Padded Harness', 'Comfortable padded harness with adjustable straps', 'harness', 'PetGear Solutions', 15.00, 29.99),
('Matching Leather Leash', 'Genuine leather leash with brass hardware', 'leash', 'PetGear Solutions', 12.00, 24.99),
('Basic Nylon Harness', 'Lightweight nylon harness for everyday use', 'harness', 'Quality Dog Products', 8.00, 16.99),
('Retractable Leash', 'Retractable leash with brake button', 'leash', 'Quality Dog Products', 10.00, 19.99);

INSERT INTO product_variants (product_id, sku, size, color, current_stock, reorder_level, location) VALUES 
-- Premium Padded Harness variants
((SELECT id FROM products WHERE name = 'Premium Padded Harness'), 'HAR-S-BLK-001', 'S', 'Black', 8, 3, 'A1-B2'),
((SELECT id FROM products WHERE name = 'Premium Padded Harness'), 'HAR-M-BLK-002', 'M', 'Black', 12, 5, 'A1-B2'),
((SELECT id FROM products WHERE name = 'Premium Padded Harness'), 'HAR-L-BLK-003', 'L', 'Black', 6, 3, 'A1-B2'),
((SELECT id FROM products WHERE name = 'Premium Padded Harness'), 'HAR-M-RED-004', 'M', 'Red', 4, 3, 'A1-B3'),
-- Matching Leather Leash variants
((SELECT id FROM products WHERE name = 'Matching Leather Leash'), 'LEA-6FT-BLK-005', '6ft', 'Black', 10, 4, 'A2-B1'),
((SELECT id FROM products WHERE name = 'Matching Leather Leash'), 'LEA-6FT-RED-006', '6ft', 'Red', 2, 4, 'A2-B1'),
-- Basic Nylon Harness variants  
((SELECT id FROM products WHERE name = 'Basic Nylon Harness'), 'HAR-M-BLU-007', 'M', 'Blue', 15, 5, 'B1-A1'),
((SELECT id FROM products WHERE name = 'Basic Nylon Harness'), 'HAR-L-BLU-008', 'L', 'Blue', 8, 5, 'B1-A1'),
-- Retractable Leash variants
((SELECT id FROM products WHERE name = 'Retractable Leash'), 'LEA-RET-GRY-009', 'One Size', 'Grey', 12, 6, 'B2-A2');

-- Create some matching sets
INSERT INTO matching_sets (harness_variant_id, leash_variant_id, set_name) VALUES 
((SELECT id FROM product_variants WHERE sku = 'HAR-M-BLK-002'), 
 (SELECT id FROM product_variants WHERE sku = 'LEA-6FT-BLK-005'), 
 'Premium Black Set - Medium'),
((SELECT id FROM product_variants WHERE sku = 'HAR-M-RED-004'), 
 (SELECT id FROM product_variants WHERE sku = 'LEA-6FT-RED-006'), 
 'Premium Red Set - Medium');
