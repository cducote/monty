import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useProducts } from '../hooks/useProducts';
import { ProductInventoryCard } from '../components/ui/ProductInventoryCard';
import { ProductDetailScreen } from './ProductDetailScreen';
import { Badge } from '../components/ui/Badge';
import { Product } from '../types/inventory';

export const ProductsScreen: React.FC = () => {
  const { data: products, isLoading, error } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (selectedProduct) {
    return (
      <ProductDetailScreen
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading products</Text>
      </View>
    );
  }

  const harnesses = products?.filter(p => p.category === 'harness') || [];
  const leashes = products?.filter(p => p.category === 'leash') || [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventory</Text>
        <Text style={styles.subtitle}>Tap a product to manage stock</Text>
      </View>

      {/* Harnesses Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Harnesses</Text>
          <Badge text={`${harnesses.length} patterns`} variant="info" />
        </View>
        {harnesses.map((product) => (
          <ProductInventoryCard
            key={product.id}
            product={product}
            onPress={() => setSelectedProduct(product)}
          />
        ))}
      </View>

      {/* Leashes Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Leashes</Text>
          <Badge text={`${leashes.length} patterns`} variant="info" />
        </View>
        {leashes.map((product) => (
          <ProductInventoryCard
            key={product.id}
            product={product}
            onPress={() => setSelectedProduct(product)}
          />
        ))}
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
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
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  loadingText: {
    fontSize: 18,
    color: '#8E8E93',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
  },
  bottomPadding: {
    height: 40,
  },
});
