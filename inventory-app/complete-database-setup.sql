-- Complete Database Update Script
-- Run this entire script in your Supabase SQL Editor to set up everything

-- Step 1: Add pattern column and image support
ALTER TABLE products ADD COLUMN IF NOT EXISTS pattern VARCHAR;
ALTER TABLE products ADD COLUMN IF NOT EXISTS primary_image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_images JSONB;
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS variant_image_url TEXT;

-- Step 2: Clear existing sample data
DELETE FROM matching_sets;
DELETE FROM inventory_transactions;
DELETE FROM product_variants;
DELETE FROM products;
DELETE FROM suppliers;

-- Step 3: Add real supplier
INSERT INTO suppliers (name, contact_email, phone) VALUES 
('Primary Supplier', 'orders@supplier.com', '555-0123');

-- Step 4: Insert real products with patterns and images
INSERT INTO products (name, description, category, pattern, supplier_name, base_cost, selling_price, primary_image_url) VALUES 
('B/W Checkered Harness', 'Black and white checkered pattern harness', 'harness', 'B/W Checkered', 'Primary Supplier', 12.00, 24.99, 'https://m.media-amazon.com/images/I/71UIQVllJDL._AC_SX679_.jpg'),
('Green Plaid Harness', 'Green plaid pattern harness', 'harness', 'Green Plaid', 'Primary Supplier', 12.00, 24.99, 'https://m.media-amazon.com/images/I/61WMw5oGzwL._AC_SX679_.jpg'),
('Lightning Harness', 'Lightning pattern harness', 'harness', 'Lightning', 'Primary Supplier', 12.00, 24.99, 'https://m.media-amazon.com/images/I/61az4Eue6UL._AC_CR0%2C0%2C0%2C0_SX480_SY360_.jpg'),
('Midnight Forest Harness', 'Midnight forest pattern harness', 'harness', 'Midnight Forest', 'Primary Supplier', 12.00, 24.99, 'https://m.media-amazon.com/images/I/610Zt+bh1HL._AC_SX679_.jpg'),
('Sage Checkered Harness', 'Sage checkered pattern harness', 'harness', 'Sage Checkered', 'Primary Supplier', 12.00, 24.99, 'https://m.media-amazon.com/images/I/71p9G-GwlmL.__AC_SX300_SY300_QL70_FMwebp_.jpg'),
('Tattoo Harness', 'Tattoo pattern harness', 'harness', 'Tattoo', 'Primary Supplier', 12.00, 24.99, 'https://m.media-amazon.com/images/I/71-GeEsYEkL._AC_SX679_.jpg'),
('Tie-Dye Harness', 'Tie-dye pattern harness', 'harness', 'Tie-Dye', 'Primary Supplier', 12.00, 24.99, 'https://m.media-amazon.com/images/I/81L3wHXhobL._AC_SX679_.jpg'),
('Sage Checkered Leash', 'Sage checkered pattern leash', 'leash', 'Sage Checkered', 'Primary Supplier', 8.00, 16.99, 'https://m.media-amazon.com/images/I/71UIQVllJDL._AC_SX679_.jpg'),
('Lightning Leash', 'Lightning pattern leash', 'leash', 'Lightning', 'Primary Supplier', 8.00, 16.99, 'https://m.media-amazon.com/images/I/511AjoOZeUL._AC_SX679_.jpg'),
('B/W Checkered Leash', 'Black and white checkered pattern leash', 'leash', 'B/W Checkered', 'Primary Supplier', 8.00, 16.99, 'https://m.media-amazon.com/images/I/51s7nYrUiML._AC_SX679_.jpg');

-- Step 5: Insert harness variants (Small, Medium, Large for each pattern)
INSERT INTO product_variants (product_id, sku, size, color, current_stock, reorder_level, location, variant_image_url) VALUES 
-- B/W Checkered Harness
((SELECT id FROM products WHERE name = 'B/W Checkered Harness'), 'HAR-BWC-S-001', 'Small', 'B/W Checkered', 0, 3, 'A1-B1', 'https://m.media-amazon.com/images/I/71UIQVllJDL._AC_SX679_.jpg'),
((SELECT id FROM products WHERE name = 'B/W Checkered Harness'), 'HAR-BWC-M-002', 'Medium', 'B/W Checkered', 0, 5, 'A1-B1', 'https://m.media-amazon.com/images/I/71UIQVllJDL._AC_SX679_.jpg'),
((SELECT id FROM products WHERE name = 'B/W Checkered Harness'), 'HAR-BWC-L-003', 'Large', 'B/W Checkered', 0, 3, 'A1-B1', 'https://m.media-amazon.com/images/I/71UIQVllJDL._AC_SX679_.jpg'),

-- Green Plaid Harness
((SELECT id FROM products WHERE name = 'Green Plaid Harness'), 'HAR-GPL-S-004', 'Small', 'Green Plaid', 0, 3, 'A1-B2', 'https://m.media-amazon.com/images/I/61WMw5oGzwL._AC_SX679_.jpg'),
((SELECT id FROM products WHERE name = 'Green Plaid Harness'), 'HAR-GPL-M-005', 'Medium', 'Green Plaid', 0, 5, 'A1-B2', 'https://m.media-amazon.com/images/I/61WMw5oGzwL._AC_SX679_.jpg'),
((SELECT id FROM products WHERE name = 'Green Plaid Harness'), 'HAR-GPL-L-006', 'Large', 'Green Plaid', 0, 3, 'A1-B2', 'https://m.media-amazon.com/images/I/61WMw5oGzwL._AC_SX679_.jpg'),

-- Lightning Harness
((SELECT id FROM products WHERE name = 'Lightning Harness'), 'HAR-LTN-S-007', 'Small', 'Lightning', 0, 3, 'A1-B3', 'https://m.media-amazon.com/images/I/61az4Eue6UL._AC_CR0%2C0%2C0%2C0_SX480_SY360_.jpg'),
((SELECT id FROM products WHERE name = 'Lightning Harness'), 'HAR-LTN-M-008', 'Medium', 'Lightning', 0, 5, 'A1-B3', 'https://m.media-amazon.com/images/I/61az4Eue6UL._AC_CR0%2C0%2C0%2C0_SX480_SY360_.jpg'),
((SELECT id FROM products WHERE name = 'Lightning Harness'), 'HAR-LTN-L-009', 'Large', 'Lightning', 0, 3, 'A1-B3', 'https://m.media-amazon.com/images/I/61az4Eue6UL._AC_CR0%2C0%2C0%2C0_SX480_SY360_.jpg'),

-- Midnight Forest Harness
((SELECT id FROM products WHERE name = 'Midnight Forest Harness'), 'HAR-MDF-S-010', 'Small', 'Midnight Forest', 0, 3, 'A2-B1', 'https://m.media-amazon.com/images/I/610Zt+bh1HL._AC_SX679_.jpg'),
((SELECT id FROM products WHERE name = 'Midnight Forest Harness'), 'HAR-MDF-M-011', 'Medium', 'Midnight Forest', 0, 5, 'A2-B1', 'https://m.media-amazon.com/images/I/610Zt+bh1HL._AC_SX679_.jpg'),
((SELECT id FROM products WHERE name = 'Midnight Forest Harness'), 'HAR-MDF-L-012', 'Large', 'Midnight Forest', 0, 3, 'A2-B1', 'https://m.media-amazon.com/images/I/610Zt+bh1HL._AC_SX679_.jpg'),

-- Sage Checkered Harness
((SELECT id FROM products WHERE name = 'Sage Checkered Harness'), 'HAR-SGC-S-013', 'Small', 'Sage Checkered', 0, 3, 'A2-B2', 'https://m.media-amazon.com/images/I/71p9G-GwlmL.__AC_SX300_SY300_QL70_FMwebp_.jpg'),
((SELECT id FROM products WHERE name = 'Sage Checkered Harness'), 'HAR-SGC-M-014', 'Medium', 'Sage Checkered', 0, 5, 'A2-B2', 'https://m.media-amazon.com/images/I/71p9G-GwlmL.__AC_SX300_SY300_QL70_FMwebp_.jpg'),
((SELECT id FROM products WHERE name = 'Sage Checkered Harness'), 'HAR-SGC-L-015', 'Large', 'Sage Checkered', 0, 3, 'A2-B2', 'https://m.media-amazon.com/images/I/71p9G-GwlmL.__AC_SX300_SY300_QL70_FMwebp_.jpg'),

-- Tattoo Harness
((SELECT id FROM products WHERE name = 'Tattoo Harness'), 'HAR-TAT-S-016', 'Small', 'Tattoo', 0, 3, 'A2-B3', 'https://m.media-amazon.com/images/I/71-GeEsYEkL._AC_SX679_.jpg'),
((SELECT id FROM products WHERE name = 'Tattoo Harness'), 'HAR-TAT-M-017', 'Medium', 'Tattoo', 0, 5, 'A2-B3', 'https://m.media-amazon.com/images/I/71-GeEsYEkL._AC_SX679_.jpg'),
((SELECT id FROM products WHERE name = 'Tattoo Harness'), 'HAR-TAT-L-018', 'Large', 'Tattoo', 0, 3, 'A2-B3', 'https://m.media-amazon.com/images/I/71-GeEsYEkL._AC_SX679_.jpg'),

-- Tie-Dye Harness
((SELECT id FROM products WHERE name = 'Tie-Dye Harness'), 'HAR-TDY-S-019', 'Small', 'Tie-Dye', 0, 3, 'A3-B1', 'https://m.media-amazon.com/images/I/81L3wHXhobL._AC_SX679_.jpg'),
((SELECT id FROM products WHERE name = 'Tie-Dye Harness'), 'HAR-TDY-M-020', 'Medium', 'Tie-Dye', 0, 5, 'A3-B1', 'https://m.media-amazon.com/images/I/81L3wHXhobL._AC_SX679_.jpg'),
((SELECT id FROM products WHERE name = 'Tie-Dye Harness'), 'HAR-TDY-L-021', 'Large', 'Tie-Dye', 0, 3, 'A3-B1', 'https://m.media-amazon.com/images/I/81L3wHXhobL._AC_SX679_.jpg');

-- Step 6: Insert leash variants (One Size for each pattern)
INSERT INTO product_variants (product_id, sku, size, color, current_stock, reorder_level, location, variant_image_url) VALUES 
-- Sage Checkered Leash
((SELECT id FROM products WHERE name = 'Sage Checkered Leash'), 'LEA-SGC-OS-022', 'One Size', 'Sage Checkered', 0, 4, 'B1-A1', 'https://m.media-amazon.com/images/I/71UIQVllJDL._AC_SX679_.jpg'),

-- Lightning Leash
((SELECT id FROM products WHERE name = 'Lightning Leash'), 'LEA-LTN-OS-023', 'One Size', 'Lightning', 0, 4, 'B1-A2', 'https://m.media-amazon.com/images/I/511AjoOZeUL._AC_SX679_.jpg'),

-- B/W Checkered Leash
((SELECT id FROM products WHERE name = 'B/W Checkered Leash'), 'LEA-BWC-OS-024', 'One Size', 'B/W Checkered', 0, 4, 'B1-A3', 'https://m.media-amazon.com/images/I/51s7nYrUiML._AC_SX679_.jpg');

-- Step 7: Create analytics view for pattern tracking
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

-- Step 8: Verify the setup
SELECT 
    name, 
    pattern, 
    category,
    CASE 
        WHEN primary_image_url IS NOT NULL THEN '✓ Has Image'
        ELSE '✗ Missing Image'
    END as image_status,
    (SELECT COUNT(*) FROM product_variants WHERE product_variants.product_id = products.id) as variant_count
FROM products 
ORDER BY category, pattern;
