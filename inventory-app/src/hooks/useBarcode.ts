import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { ProductVariant } from '../types/inventory';

export interface BarcodeResult {
  type: string;
  data: string;
}

// Custom hook for barcode scanning functionality
export const useBarcode = () => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Look up product variant by SKU/barcode
  const { data: scannedProduct, isLoading: isLookingUp, error } = useQuery({
    queryKey: ['product-lookup', scannedCode],
    queryFn: async (): Promise<ProductVariant | null> => {
      if (!scannedCode) return null;
      
      const { data, error } = await supabase
        .from('product_variants')
        .select(`
          *,
          products:product_id (
            name,
            category,
            description
          )
        `)
        .eq('sku', scannedCode)
        .single();
      
      if (error) {
        // If no exact SKU match, try partial matching or search in description
        console.log('No exact SKU match found:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!scannedCode,
  });

  const handleBarcodeScanned = (result: BarcodeResult) => {
    setScannedCode(result.data);
    setIsScanning(false);
  };

  const startScanning = () => {
    setIsScanning(true);
    setScannedCode(null);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const clearScannedCode = () => {
    setScannedCode(null);
  };

  return {
    scannedCode,
    scannedProduct,
    isScanning,
    isLookingUp,
    error,
    startScanning,
    stopScanning,
    handleBarcodeScanned,
    clearScannedCode,
  };
};

// Hook for managing SKU generation and validation
export const useSKU = () => {
  const generateSKU = (category: string, size?: string, color?: string): string => {
    const categoryCode = category.toUpperCase().substring(0, 3);
    const sizeCode = size ? size.toUpperCase() : 'UNI';
    const colorCode = color ? color.toUpperCase().substring(0, 3) : 'STD';
    const timestamp = Date.now().toString().slice(-4);
    
    return `${categoryCode}-${sizeCode}-${colorCode}-${timestamp}`;
  };

  const validateSKU = async (sku: string): Promise<boolean> => {
    const { data } = await supabase
      .from('product_variants')
      .select('id')
      .eq('sku', sku)
      .single();
    
    return !data; // Returns true if SKU doesn't exist (valid for new product)
  };

  return {
    generateSKU,
    validateSKU,
  };
};
