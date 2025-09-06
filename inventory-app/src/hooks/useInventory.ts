import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { InventoryTransaction, ProductVariant } from '../types/inventory';

// Fetch all inventory transactions
export const useInventoryTransactions = (variantId?: string) => {
  return useQuery({
    queryKey: ['inventory-transactions', variantId],
    queryFn: async (): Promise<InventoryTransaction[]> => {
      let query = supabase
        .from('inventory_transactions')
        .select('*')
        .order('transaction_date', { ascending: false });
      
      if (variantId) {
        query = query.eq('variant_id', variantId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Get current stock levels for all variants
export const useStockLevels = () => {
  return useQuery({
    queryKey: ['stock-levels'],
    queryFn: async (): Promise<ProductVariant[]> => {
      const { data, error } = await supabase
        .from('product_variants')
        .select(`
          *,
          products:product_id (
            name,
            category
          )
        `)
        .order('current_stock', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Get low stock items
export const useLowStock = () => {
  return useQuery({
    queryKey: ['low-stock'],
    queryFn: async (): Promise<ProductVariant[]> => {
      const { data, error } = await supabase
        .from('product_variants')
        .select(`
          *,
          products:product_id (
            name,
            category
          )
        `)
        .filter('current_stock', 'lte', supabase.rpc('reorder_level'))
        .order('current_stock', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
};

// Record inventory transaction and update stock
export const useRecordTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transaction: Omit<InventoryTransaction, 'id' | 'transaction_date'>) => {
      // Start a transaction to ensure data consistency
      const { data: transactionData, error: transactionError } = await supabase
        .from('inventory_transactions')
        .insert([{
          ...transaction,
          transaction_date: new Date().toISOString(),
        }])
        .select()
        .single();
      
      if (transactionError) throw transactionError;
      
      // Update the stock level
      const { data: currentVariant, error: fetchError } = await supabase
        .from('product_variants')
        .select('current_stock')
        .eq('id', transaction.variant_id)
        .single();
      
      if (fetchError) throw fetchError;
      
      let newStock: number;
      switch (transaction.transaction_type) {
        case 'received':
          newStock = currentVariant.current_stock + transaction.quantity;
          break;
        case 'sold':
        case 'damaged':
          newStock = currentVariant.current_stock - transaction.quantity;
          break;
        case 'adjustment':
          // For adjustments, the quantity can be positive or negative
          // It represents the change, not an absolute value
          newStock = currentVariant.current_stock + transaction.quantity;
          break;
        default:
          newStock = currentVariant.current_stock;
      }
      
      const { error: updateError } = await supabase
        .from('product_variants')
        .update({ current_stock: Math.max(0, newStock) })
        .eq('id', transaction.variant_id);
      
      if (updateError) throw updateError;
      
      return transactionData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['stock-levels'] });
      queryClient.invalidateQueries({ queryKey: ['low-stock'] });
      queryClient.invalidateQueries({ queryKey: ['product-variants'] });
    },
  });
};

// Bulk stock adjustment
export const useBulkStockAdjustment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (adjustments: Array<{ variant_id: string; quantity: number; notes?: string }>) => {
      const transactions = adjustments.map(adj => ({
        variant_id: adj.variant_id,
        transaction_type: 'adjustment' as const,
        quantity: adj.quantity,
        notes: adj.notes,
        transaction_date: new Date().toISOString(),
      }));
      
      const { data, error } = await supabase
        .from('inventory_transactions')
        .insert(transactions)
        .select();
      
      if (error) throw error;
      
      // Update stock levels for each variant
      for (const adj of adjustments) {
        const { data: currentVariant, error: fetchError } = await supabase
          .from('product_variants')
          .select('current_stock')
          .eq('id', adj.variant_id)
          .single();
        
        if (fetchError) continue; // Skip this one but continue with others
        
        const newStock = Math.max(0, currentVariant.current_stock + adj.quantity);
        
        await supabase
          .from('product_variants')
          .update({ current_stock: newStock })
          .eq('id', adj.variant_id);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['stock-levels'] });
      queryClient.invalidateQueries({ queryKey: ['low-stock'] });
      queryClient.invalidateQueries({ queryKey: ['product-variants'] });
    },
  });
};
