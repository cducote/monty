import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useProductVariants } from '../hooks/useProducts';
import { useRecordTransaction } from '../hooks/useInventory';
import { Product, ProductVariant } from '../types/inventory';
import { Badge } from '../components/ui/Badge';

interface ProductDetailScreenProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ product, onBack }) => {
  const { data: variants, isLoading } = useProductVariants(product.id);
  const recordTransaction = useRecordTransaction();
  const confettiRef = useRef<any>(null);

  const handleEditStock = (variant: ProductVariant) => {
    Alert.prompt(
      'Update Stock',
      `Current stock: ${variant.current_stock}\nEnter new stock amount:`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: (newStockText) => handleSaveStock(variant, newStockText),
        },
      ],
      'plain-text',
      variant.current_stock.toString(),
      'numeric'
    );
  };

  const handleSaveStock = async (variant: ProductVariant, newStockText?: string) => {
    if (!newStockText || newStockText.trim() === '') {
      Alert.alert('Error', 'Please enter a valid number');
      return;
    }
    
    const newStock = parseInt(newStockText, 10);
    
    if (isNaN(newStock) || newStock < 0) {
      Alert.alert('Error', 'Please enter a valid number (0 or greater)');
      return;
    }

    const difference = newStock - variant.current_stock;
    
    // Only record a transaction if there's actually a change
    if (difference === 0) {
      return;
    }
    
    try {
      await recordTransaction.mutateAsync({
        variant_id: variant.id,
        transaction_type: 'adjustment',
        quantity: difference, // This can be positive or negative
        notes: `Stock adjustment from ${variant.current_stock} to ${newStock}`,
      });
      
      // Trigger confetti celebration instead of alert
      if (confettiRef.current) {
        confettiRef.current.start();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update stock');
    }
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
      {/* Confetti Cannon - positioned absolutely to cover screen */}
      <ConfettiCannon
        ref={confettiRef}
        count={150}
        origin={{x: -10, y: 0}}
        autoStart={false}
        fadeOut={true}
        fallSpeed={3000}
        explosionSpeed={350}
        colors={['#34C759', '#007AFF', '#FF9F0A', '#FF3B30', '#AF52DE']}
      />
      
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
