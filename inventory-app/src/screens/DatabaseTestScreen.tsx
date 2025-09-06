import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface Product {
  id: string;
  name: string;
  category: string;
  supplier_name: string;
  selling_price: number;
}

interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  current_stock: number;
  products: {
    name: string;
    category: string;
  };
}

export const DatabaseTestScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(1);

      if (error) {
        Alert.alert('Connection Error', error.message);
        setConnected(false);
      } else {
        setConnected(true);
        Alert.alert('Success!', 'Connected to Supabase successfully');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to connect to database');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setProducts(data || []);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadVariants = async () => {
    setLoading(true);
    try {
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

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setVariants(data || []);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load variants');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Database Connection Test</Text>
        <Text style={styles.subtitle}>
          Status: {connected ? '✅ Connected' : '❌ Not Connected'}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <Button
          title="Test Connection"
          onPress={testConnection}
          loading={loading}
          style={styles.button}
        />
        <Button
          title="Load Products"
          onPress={loadProducts}
          variant="secondary"
          loading={loading}
          style={styles.button}
        />
      </View>

      <Button
        title="Load Stock Levels"
        onPress={loadVariants}
        variant="secondary"
        loading={loading}
        style={styles.fullButton}
      />

      {products.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Products ({products.length})</Text>
          {products.map((product) => (
            <Card key={product.id} style={styles.card}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDetails}>
                Category: {product.category} | Supplier: {product.supplier_name}
              </Text>
              <Text style={styles.productPrice}>
                Price: ${product.selling_price?.toFixed(2)}
              </Text>
            </Card>
          ))}
        </View>
      )}

      {variants.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stock Levels ({variants.length})</Text>
          {variants.map((variant) => (
            <Card key={variant.id} style={styles.card}>
              <View style={styles.variantHeader}>
                <Text style={styles.variantName}>
                  {variant.products?.name}
                </Text>
                <Text style={[
                  styles.stockLevel,
                  variant.current_stock <= 5 ? styles.lowStock : styles.normalStock
                ]}>
                  {variant.current_stock}
                </Text>
              </View>
              <Text style={styles.variantDetails}>
                SKU: {variant.sku} | Size: {variant.size} | Color: {variant.color}
              </Text>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Modak-Regular',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
  },
  fullButton: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  productDetails: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34C759',
  },
  variantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  variantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
  },
  stockLevel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lowStock: {
    color: '#FF3B30',
  },
  normalStock: {
    color: '#34C759',
  },
  variantDetails: {
    fontSize: 14,
    color: '#8E8E93',
  },
});
