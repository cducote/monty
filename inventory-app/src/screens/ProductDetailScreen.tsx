import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useProductVariants } from '../hooks/useProducts';
import { useRecordTransaction } from '../hooks/useInventory';
import { Product, ProductVariant } from '../types/inventory';
import { Button } from '../components/ui/Button';
import { NumberInput } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

interface ProductDetailScreenProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ product, onBack }) => {
  const { data: variants, isLoading } = useProductVariants(product.id);
  const recordTransaction = useRecordTransaction();
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  const [newStock, setNewStock] = useState<number>(0);

  const handleEditStock = (variant: ProductVariant) => {
    setEditingVariant(variant.id);
    setNewStock(variant.current_stock);
  };

  const handleSaveStock = async () => {
    if (!editingVariant) return;
    
    const variant = variants?.find(v => v.id === editingVariant);
    if (!variant) return;

    const difference = newStock - variant.current_stock;
    
    try {
      await recordTransaction.mutateAsync({
        variant_id: editingVariant,
        transaction_type: difference >= 0 ? 'adjustment' : 'adjustment',
        quantity: Math.abs(difference),
        notes: `Stock adjustment from ${variant.current_stock} to ${newStock}`,
      });
      
      setEditingVariant(null);
      Alert.alert('Success', 'Stock updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update stock');
    }
  };

  const handleCancelEdit = () => {
    setEditingVariant(null);
    setNewStock(0);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  const totalStock = variants?.reduce((sum, v) => sum + v.current_stock, 0) || 0;
  const isLowStock = variants?.some(v => v.current_stock <= v.reorder_level) || false;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        {/* Product Image and Info */}
        <View style={styles.productHeader}>
          <View style={styles.imageContainer}>
            {product.primary_image_url ? (
              <Image 
                source={{ uri: product.primary_image_url }} 
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
            )}
          </View>
          
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.pattern}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
            
            <View style={styles.infoRow}>
              <Badge text={product.category.toUpperCase()} variant="info" />
              {isLowStock && <Badge text="LOW STOCK" variant="warning" />}
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.price}>${product.selling_price?.toFixed(2)}</Text>
              <Text style={styles.totalStock}>Total Stock: {totalStock}</Text>
            </View>
          </View>
        </View>

        {/* Variants Section */}
        <View style={styles.variantsSection}>
          <Text style={styles.sectionTitle}>Inventory by Size</Text>
          
          {variants?.map((variant) => (
            <View key={variant.id} style={styles.variantCard}>
              <View style={styles.variantHeader}>
                <View style={styles.variantInfo}>
                  <Text style={styles.variantSize}>{variant.size}</Text>
                  <Text style={styles.variantSku}>SKU: {variant.sku}</Text>
                  <Text style={styles.variantLocation}>Location: {variant.location}</Text>
                </View>
                
                <View style={styles.stockSection}>
                  {editingVariant === variant.id ? (
                    <View style={styles.editingContainer}>
                      <NumberInput
                        value={newStock}
                        onChangeValue={setNewStock}
                        min={0}
                        style={styles.stockInput}
                      />
                      <View style={styles.editButtons}>
                        <Button
                          title="Save"
                          onPress={handleSaveStock}
                          size="small"
                          loading={recordTransaction.isPending}
                        />
                        <Button
                          title="Cancel"
                          onPress={handleCancelEdit}
                          variant="secondary"
                          size="small"
                        />
                      </View>
                    </View>
                  ) : (
                    <View style={styles.stockDisplay}>
                      <Text style={[
                        styles.stockValue,
                        variant.current_stock <= variant.reorder_level ? styles.lowStockValue : styles.normalStockValue
                      ]}>
                        {variant.current_stock}
                      </Text>
                      <Text style={styles.stockLabel}>in stock</Text>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditStock(variant)}
                      >
                        <Text style={styles.editButtonText}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
              
              <View style={styles.variantFooter}>
                <Text style={styles.reorderText}>
                  Reorder when below {variant.reorder_level}
                </Text>
                {variant.current_stock <= variant.reorder_level && (
                  <Badge text="NEEDS REORDER" variant="danger" size="small" />
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  headerSpacer: {
    width: 80,
  },
  content: {
    flex: 1,
  },
  productHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    flexDirection: 'row',
    marginBottom: 20,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginRight: 20,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 16,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#34C759',
  },
  totalStock: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  variantsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  variantCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  variantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  variantInfo: {
    flex: 1,
  },
  variantSize: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  variantSku: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  variantLocation: {
    fontSize: 14,
    color: '#8E8E93',
  },
  stockSection: {
    alignItems: 'flex-end',
  },
  stockDisplay: {
    alignItems: 'center',
  },
  stockValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  normalStockValue: {
    color: '#34C759',
  },
  lowStockValue: {
    color: '#FF3B30',
  },
  stockLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  editingContainer: {
    alignItems: 'center',
    gap: 8,
  },
  stockInput: {
    width: 120,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  variantFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
  },
  reorderText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  loadingText: {
    fontSize: 18,
    color: '#8E8E93',
  },
});
