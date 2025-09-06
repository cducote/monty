import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useProducts, useCreateProduct, useUpdateProduct } from '../hooks/useProducts';
import { Product } from '../types/inventory';
import { ProductInventoryCard } from '../components/ui/ProductInventoryCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

type SettingsView = 'main' | 'add-product' | 'update-products' | 'edit-product';

interface SettingsScreenProps {}

export const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { data: products } = useProducts();

  const renderMainSettings = () => (
    <ScrollView style={styles.container}>
      <View style={styles.mainHeader}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage products and inventory</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => setCurrentView('add-product')}
        >
          <View style={styles.optionIcon}>
            <Text style={styles.iconText}>➕</Text>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Add New Product</Text>
            <Text style={styles.optionDescription}>Create a new harness or leash</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => setCurrentView('update-products')}
        >
          <View style={styles.optionIcon}>
            <Text style={styles.iconText}>✏️</Text>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Update Existing Products</Text>
            <Text style={styles.optionDescription}>Edit product details and information</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderUpdateProducts = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentView('main')} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Product to Update</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        {products?.map((product) => (
          <ProductInventoryCard
            key={product.id}
            product={product}
            onPress={() => {
              setSelectedProduct(product);
              setCurrentView('edit-product');
            }}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'main':
        return renderMainSettings();
      case 'add-product':
        return (
          <AddProductForm 
            onBack={() => setCurrentView('main')}
          />
        );
      case 'update-products':
        return renderUpdateProducts();
      case 'edit-product':
        return selectedProduct ? (
          <EditProductForm 
            product={selectedProduct}
            onBack={() => setCurrentView('update-products')}
          />
        ) : renderMainSettings();
      default:
        return renderMainSettings();
    }
  };

  return renderCurrentView();
};

// Add Product Form Component
interface AddProductFormProps {
  onBack: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onBack }) => {
  const [productType, setProductType] = useState<'harness' | 'leash'>('harness');
  const [patternName, setPatternName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');

  const createProduct = useCreateProduct();

  const handleSubmit = async () => {
    if (!patternName.trim()) {
      Alert.alert('Error', 'Please enter a pattern name');
      return;
    }

    if (!imageUrl.trim()) {
      Alert.alert('Error', 'Please enter an image URL');
      return;
    }

    try {
      await createProduct.mutateAsync({
        category: productType,
        pattern: patternName.trim(),
        name: patternName.trim(),
        description: description.trim() || undefined,
        primary_image_url: imageUrl.trim(),
        selling_price: parseFloat(sellingPrice) || undefined,
        is_active: true,
      });

      Alert.alert('Success', 'Product created successfully!', [
        {
          text: 'OK',
          onPress: onBack,
        },
      ]);
      
      // Reset form
      setPatternName('');
      setImageUrl('');
      setDescription('');
      setSellingPrice('');
    } catch (error) {
      console.error('Error creating product:', error);
      Alert.alert('Error', 'Failed to create product');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          {/* Product Type Selection */}
          <View style={styles.typeSelection}>
            <Text style={styles.label}>Product Type</Text>
            <View style={styles.typeButtons}>
              <Button
                title="Harness"
                onPress={() => setProductType('harness')}
                variant={productType === 'harness' ? 'primary' : 'secondary'}
                size="small"
              />
              <Button
                title="Leash"
                onPress={() => setProductType('leash')}
                variant={productType === 'leash' ? 'primary' : 'secondary'}
                size="small"
              />
            </View>
          </View>

          <Input
            label="Pattern Name"
            value={patternName}
            onChangeText={setPatternName}
            placeholder="e.g. Rainbow Checkers, Blue Stripes"
          />

          <Input
            label="Product Image URL"
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="https://example.com/image.jpg"
            keyboardType="default"
          />

          <Input
            label="Description (Optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Brief description of the product"
            multiline
            numberOfLines={3}
          />

          <Input
            label="Selling Price (Optional)"
            value={sellingPrice}
            onChangeText={setSellingPrice}
            placeholder="0.00"
            keyboardType="numeric"
          />

          <Button
            title="Create Product"
            onPress={handleSubmit}
            loading={createProduct.isPending}
            style={styles.submitButton}
          />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

// Edit Product Form Component  
interface EditProductFormProps {
  product: Product;
  onBack: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ product, onBack }) => {
  const [patternName, setPatternName] = useState(product.pattern || '');
  const [imageUrl, setImageUrl] = useState(product.primary_image_url || '');
  const [description, setDescription] = useState(product.description || '');
  const [sellingPrice, setSellingPrice] = useState(product.selling_price?.toString() || '');

  const updateProduct = useUpdateProduct();

  const handleSubmit = async () => {
    if (!patternName.trim()) {
      Alert.alert('Error', 'Please enter a pattern name');
      return;
    }

    try {
      await updateProduct.mutateAsync({
        id: product.id,
        updates: {
          pattern: patternName.trim(),
          name: patternName.trim(),
          description: description.trim() || undefined,
          primary_image_url: imageUrl.trim() || undefined,
          selling_price: parseFloat(sellingPrice) || undefined,
        }
      });

      Alert.alert('Success', 'Product updated successfully!', [
        {
          text: 'OK',
          onPress: onBack,
        },
      ]);
    } catch (error) {
      console.error('Error updating product:', error);
      Alert.alert('Error', 'Failed to update product');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Product</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Edit {product.category}</Text>
          
          <Input
            label="Pattern Name"
            value={patternName}
            onChangeText={setPatternName}
            placeholder="e.g. Rainbow Checkers, Blue Stripes"
          />

          <Input
            label="Product Image URL"
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="https://example.com/image.jpg"
            keyboardType="default"
          />

          <Input
            label="Description (Optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Brief description of the product"
            multiline
            numberOfLines={3}
          />

          <Input
            label="Selling Price (Optional)"
            value={sellingPrice}
            onChangeText={setSellingPrice}
            placeholder="0.00"
            keyboardType="numeric"
          />

          <Button
            title="Update Product"
            onPress={handleSubmit}
            loading={updateProduct.isPending}
            style={styles.submitButton}
          />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainHeader: {
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
  optionsContainer: {
    padding: 20,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  chevron: {
    fontSize: 20,
    color: '#C7C7CC',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  typeSelection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  submitButton: {
    marginTop: 20,
  },
  bottomPadding: {
    height: 100,
  },
});
