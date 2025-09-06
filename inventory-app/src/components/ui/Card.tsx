import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
}

export const Card: React.FC<CardProps> = ({ children, onPress, style }) => {
  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent 
      style={[styles.card, style]} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </CardComponent>
  );
};

interface ProductCardProps {
  name: string;
  category: string;
  pattern?: string;
  stockLevel: number;
  reorderLevel: number;
  imageUrl?: string;
  onPress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  category,
  pattern,
  stockLevel,
  reorderLevel,
  imageUrl,
  onPress,
}) => {
  const isLowStock = stockLevel <= reorderLevel;
  
  return (
    <Card onPress={onPress} style={isLowStock ? styles.lowStockCard : null}>
      <View style={styles.cardContent}>
        {/* Product Image */}
        {imageUrl && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.productImage}
              resizeMode="cover"
            />
          </View>
        )}
        
        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.cardHeader}>
            <Text style={styles.productName}>{name}</Text>
            <Text style={styles.category}>{category.toUpperCase()}</Text>
          </View>
          
          {pattern && (
            <Text style={styles.pattern}>{pattern}</Text>
          )}
          
          <View style={styles.stockInfo}>
            <Text style={styles.stockLabel}>Stock:</Text>
            <Text style={[
              styles.stockValue,
              isLowStock ? styles.lowStockText : styles.normalStockText
            ]}>
              {stockLevel}
            </Text>
          </View>
        </View>
      </View>
      
      {isLowStock && (
        <View style={styles.lowStockBadge}>
          <Text style={styles.lowStockBadgeText}>LOW STOCK</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lowStockCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  cardContent: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
    marginRight: 8,
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pattern: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 8,
    fontWeight: '500',
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stockLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  stockValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  normalStockText: {
    color: '#34C759',
  },
  lowStockText: {
    color: '#FF3B30',
  },
  lowStockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lowStockBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
