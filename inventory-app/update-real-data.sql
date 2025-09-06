-- Update existing database with your real products
-- Run this in your Supabase SQL Editor

-- First, add a pattern column to products table if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS pattern VARCHAR;

-- Clear existing sample data
DELETE FROM matching_sets;
DELETE FROM inventory_transactions;
DELETE FROM product_variants;
DELETE FROM products;
DELETE FROM suppliers;

-- Add real supplier (you can update this later with actual supplier info)
INSERT INTO suppliers (name, contact_email, phone) VALUES 
('Primary Supplier', 'orders@supplier.com', '555-0123');

-- Insert real harness products with patterns
INSERT INTO products (name, description, category, pattern, supplier_name, base_cost, selling_price) VALUES 
('B/W Checkered Harness', 'Black and white checkered pattern harness', 'harness', 'B/W Checkered', 'Primary Supplier', 12.00, 24.99),
('Green Plaid Harness', 'Green plaid pattern harness', 'harness', 'Green Plaid', 'Primary Supplier', 12.00, 24.99),
('Lightning Harness', 'Lightning pattern harness', 'harness', 'Lightning', 'Primary Supplier', 12.00, 24.99),
('Midnight Forest Harness', 'Midnight forest pattern harness', 'harness', 'Midnight Forest', 'Primary Supplier', 12.00, 24.99),
('Sage Checkered Harness', 'Sage checkered pattern harness', 'harness', 'Sage Checkered', 'Primary Supplier', 12.00, 24.99),
('Tattoo Harness', 'Tattoo pattern harness', 'harness', 'Tattoo', 'Primary Supplier', 12.00, 24.99),
('Tie-Dye Harness', 'Tie-dye pattern harness', 'harness', 'Tie-Dye', 'Primary Supplier', 12.00, 24.99);

-- Insert real leash products with patterns
INSERT INTO products (name, description, category, pattern, supplier_name, base_cost, selling_price) VALUES 
('Sage Checkered Leash', 'Sage checkered pattern leash', 'leash', 'Sage Checkered', 'Primary Supplier', 8.00, 16.99),
('Lightning Leash', 'Lightning pattern leash', 'leash', 'Lightning', 'Primary Supplier', 8.00, 16.99),
('B/W Checkered Leash', 'Black and white checkered pattern leash', 'leash', 'B/W Checkered', 'Primary Supplier', 8.00, 16.99);

-- Insert harness variants (Small, Medium, Large for each pattern)
INSERT INTO product_variants (product_id, sku, size, color, current_stock, reorder_level, location) VALUES 
-- B/W Checkered Harness
((SELECT id FROM products WHERE name = 'B/W Checkered Harness'), 'HAR-BWC-S-001', 'Small', 'B/W Checkered', 0, 3, 'A1-B1'),
((SELECT id FROM products WHERE name = 'B/W Checkered Harness'), 'HAR-BWC-M-002', 'Medium', 'B/W Checkered', 0, 5, 'A1-B1'),
((SELECT id FROM products WHERE name = 'B/W Checkered Harness'), 'HAR-BWC-L-003', 'Large', 'B/W Checkered', 0, 3, 'A1-B1'),

-- Green Plaid Harness
((SELECT id FROM products WHERE name = 'Green Plaid Harness'), 'HAR-GPL-S-004', 'Small', 'Green Plaid', 0, 3, 'A1-B2'),
((SELECT id FROM products WHERE name = 'Green Plaid Harness'), 'HAR-GPL-M-005', 'Medium', 'Green Plaid', 0, 5, 'A1-B2'),
((SELECT id FROM products WHERE name = 'Green Plaid Harness'), 'HAR-GPL-L-006', 'Large', 'Green Plaid', 0, 3, 'A1-B2'),

-- Lightning Harness
((SELECT id FROM products WHERE name = 'Lightning Harness'), 'HAR-LTN-S-007', 'Small', 'Lightning', 0, 3, 'A1-B3'),
((SELECT id FROM products WHERE name = 'Lightning Harness'), 'HAR-LTN-M-008', 'Medium', 'Lightning', 0, 5, 'A1-B3'),
((SELECT id FROM products WHERE name = 'Lightning Harness'), 'HAR-LTN-L-009', 'Large', 'Lightning', 0, 3, 'A1-B3'),

-- Midnight Forest Harness
((SELECT id FROM products WHERE name = 'Midnight Forest Harness'), 'HAR-MDF-S-010', 'Small', 'Midnight Forest', 0, 3, 'A2-B1'),
((SELECT id FROM products WHERE name = 'Midnight Forest Harness'), 'HAR-MDF-M-011', 'Medium', 'Midnight Forest', 0, 5, 'A2-B1'),
((SELECT id FROM products WHERE name = 'Midnight Forest Harness'), 'HAR-MDF-L-012', 'Large', 'Midnight Forest', 0, 3, 'A2-B1'),

-- Sage Checkered Harness
((SELECT id FROM products WHERE name = 'Sage Checkered Harness'), 'HAR-SGC-S-013', 'Small', 'Sage Checkered', 0, 3, 'A2-B2'),
((SELECT id FROM products WHERE name = 'Sage Checkered Harness'), 'HAR-SGC-M-014', 'Medium', 'Sage Checkered', 0, 5, 'A2-B2'),
((SELECT id FROM products WHERE name = 'Sage Checkered Harness'), 'HAR-SGC-L-015', 'Large', 'Sage Checkered', 0, 3, 'A2-B2'),

-- Tattoo Harness
((SELECT id FROM products WHERE name = 'Tattoo Harness'), 'HAR-TAT-S-016', 'Small', 'Tattoo', 0, 3, 'A2-B3'),
((SELECT id FROM products WHERE name = 'Tattoo Harness'), 'HAR-TAT-M-017', 'Medium', 'Tattoo', 0, 5, 'A2-B3'),
((SELECT id FROM products WHERE name = 'Tattoo Harness'), 'HAR-TAT-L-018', 'Large', 'Tattoo', 0, 3, 'A2-B3'),

-- Tie-Dye Harness
((SELECT id FROM products WHERE name = 'Tie-Dye Harness'), 'HAR-TDY-S-019', 'Small', 'Tie-Dye', 0, 3, 'A3-B1'),
((SELECT id FROM products WHERE name = 'Tie-Dye Harness'), 'HAR-TDY-M-020', 'Medium', 'Tie-Dye', 0, 5, 'A3-B1'),
((SELECT id FROM products WHERE name = 'Tie-Dye Harness'), 'HAR-TDY-L-021', 'Large', 'Tie-Dye', 0, 3, 'A3-B1');

-- Insert leash variants (One Size for each pattern)
INSERT INTO product_variants (product_id, sku, size, color, current_stock, reorder_level, location) VALUES 
-- Sage Checkered Leash
((SELECT id FROM products WHERE name = 'Sage Checkered Leash'), 'LEA-SGC-OS-022', 'One Size', 'Sage Checkered', 0, 4, 'B1-A1'),

-- Lightning Leash
((SELECT id FROM products WHERE name = 'Lightning Leash'), 'LEA-LTN-OS-023', 'One Size', 'Lightning', 0, 4, 'B1-A2'),

-- B/W Checkered Leash
((SELECT id FROM products WHERE name = 'B/W Checkered Leash'), 'LEA-BWC-OS-024', 'One Size', 'B/W Checkered', 0, 4, 'B1-A3');

-- Create analytics view for pattern tracking
CREATE OR REPLACE VIEW pattern_analytics AS
SELECT 
    pattern,
    COUNT(CASE WHEN category = 'harness' THEN 1 END) as harness_count,
    COUNT(CASE WHEN category = 'leash' THEN 1 END) as leash_count,
    COUNT(*) as total_products
FROM products 
WHERE is_active = true
GROUP BY pattern
ORDER BY pattern;
