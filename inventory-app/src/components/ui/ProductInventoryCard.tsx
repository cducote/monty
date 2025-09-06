import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useProductVariants } from '../../hooks/useProducts';
import { Product, ProductVariant } from '../../types/inventory';

interface ProductInventoryCardProps {
  product: Product;
  onPress?: () => void;
}

export const ProductInventoryCard: React.FC<ProductInventoryCardProps> = ({ product, onPress }) => {
  const { data: variants } = useProductVariants(product.id);

  const handlePress = () => {
    onPress?.();
  };

  // Calculate stock by size for harnesses or total for leashes
  const getStockDisplay = () => {
    if (!variants) return null;

    if (product.category === 'harness') {
      const smallStock = variants.find((v: ProductVariant) => v.size === 'Small')?.current_stock || 0;
      const mediumStock = variants.find((v: ProductVariant) => v.size === 'Medium')?.current_stock || 0;
      const largeStock = variants.find((v: ProductVariant) => v.size === 'Large')?.current_stock || 0;

      return (
        <View style={styles.sizeStockContainer}>
          <View style={[styles.sizeChip, styles.smallChip]}>
            <Text style={styles.sizeLabel}>S</Text>
            <Text style={styles.stockCount}>{smallStock}</Text>
          </View>
          <View style={[styles.sizeChip, styles.mediumChip]}>
            <Text style={styles.sizeLabel}>M</Text>
            <Text style={styles.stockCount}>{mediumStock}</Text>
          </View>
          <View style={[styles.sizeChip, styles.largeChip]}>
            <Text style={styles.sizeLabel}>L</Text>
            <Text style={styles.stockCount}>{largeStock}</Text>
          </View>
        </View>
      );
    } else {
      // For leashes, just show total stock
      const totalStock = variants.reduce((sum: number, v: ProductVariant) => sum + v.current_stock, 0);
      return (
        <View style={styles.leashStockContainer}>
          <View style={[styles.sizeChip, styles.leashChip]}>
            <Text style={styles.sizeLabel}>Total</Text>
            <Text style={styles.stockCount}>{totalStock}</Text>
          </View>
        </View>
      );
    }
  };

  // Calculate if any variant is low stock
  const isLowStock = variants?.some((v: ProductVariant) => v.current_stock <= v.reorder_level) || false;
  const totalStock = variants?.reduce((sum: number, v: ProductVariant) => sum + v.current_stock, 0) || 0;

  return (
    <TouchableOpacity style={[styles.card, isLowStock && styles.lowStockCard]} onPress={handlePress}>
      <View style={styles.cardContent}>
        {/* Product Image */}
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

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.headerRow}>
            <Text style={styles.productName}>{product.pattern}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.productDescription}>{product.description}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.selling_price?.toFixed(2)}</Text>
            <Text style={styles.totalStock}>Total: {totalStock}</Text>
          </View>

          {/* Size Stock Display */}
          {getStockDisplay()}
        </View>
      </View>

      {/* Low Stock Warning */}
      {isLowStock && (
        <View style={styles.lowStockBanner}>
          <Text style={styles.lowStockText}>⚠️ Low Stock</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  lowStockCard: {
    borderWidth: 2,
    borderColor: '#FF9F0A',
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 16,
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
    fontSize: 12,
  },
  productInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  productDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#34C759',
  },
  totalStock: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  sizeStockContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  leashStockContainer: {
    flexDirection: 'row',
  },
  sizeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  smallChip: {
    backgroundColor: '#E8F4FD',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  mediumChip: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#34C759',
  },
  largeChip: {
    backgroundColor: '#FFF4E6',
    borderWidth: 1,
    borderColor: '#FF9F0A',
  },
  leashChip: {
    backgroundColor: '#F5F5F7',
    borderWidth: 1,
    borderColor: '#8E8E93',
  },
  sizeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  stockCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  lowStockBanner: {
    backgroundColor: '#FF9F0A',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  lowStockText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
