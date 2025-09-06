-- Update Sage Checkered Leash Image
-- Run this in your Supabase SQL Editor to update the image URL

-- Update the primary_image_url for the sage checkered leash
UPDATE products 
SET primary_image_url = 'https://m.media-amazon.com/images/I/518CaGZo6HL._AC_SX679_.jpg'
WHERE pattern ILIKE '%sage%' 
  AND pattern ILIKE '%check%' 
  AND category = 'leash';

-- Alternative: If you know the exact pattern name
-- UPDATE products 
-- SET primary_image_url = 'https://m.media-amazon.com/images/I/518CaGZo6HL._AC_SX679_.jpg'
-- WHERE pattern = 'Sage Checkered' 
--   AND category = 'leash';

-- Check the result
SELECT id, name, pattern, primary_image_url 
FROM products 
WHERE pattern ILIKE '%sage%' 
  AND pattern ILIKE '%check%' 
  AND category = 'leash';
