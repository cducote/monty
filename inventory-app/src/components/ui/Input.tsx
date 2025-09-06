import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  disabled?: boolean;
  style?: any;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error,
  disabled = false,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          error && styles.inputError,
          disabled && styles.inputDisabled,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={!disabled}
        placeholderTextColor="#8E8E93"
      />
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Specialized input for numbers with increment/decrement buttons
interface NumberInputProps {
  label?: string;
  value: number;
  onChangeValue: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  style?: any;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChangeValue,
  min = 0,
  max = 9999,
  step = 1,
  disabled = false,
  style,
}) => {
  const handleIncrement = () => {
    const newValue = Math.min(value + step, max);
    onChangeValue(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min);
    onChangeValue(newValue);
  };

  const handleTextChange = (text: string) => {
    const numValue = parseInt(text) || 0;
    const clampedValue = Math.max(min, Math.min(max, numValue));
    onChangeValue(clampedValue);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.numberInputContainer}>
        <TouchableOpacity
          style={[styles.numberButton, disabled && styles.buttonDisabled]}
          onPress={handleDecrement}
          disabled={disabled || value <= min}
        >
          <Text style={styles.numberButtonText}>-</Text>
        </TouchableOpacity>
        
        <TextInput
          style={[styles.numberInput, disabled && styles.inputDisabled]}
          value={value.toString()}
          onChangeText={handleTextChange}
          keyboardType="numeric"
          editable={!disabled}
          textAlign="center"
        />
        
        <TouchableOpacity
          style={[styles.numberButton, disabled && styles.buttonDisabled]}
          onPress={handleIncrement}
          disabled={disabled || value >= max}
        >
          <Text style={styles.numberButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  inputDisabled: {
    backgroundColor: '#F2F2F7',
    color: '#8E8E93',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
  numberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  numberInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  numberButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  numberButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
  },
});
