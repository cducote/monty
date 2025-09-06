import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  text: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'small' | 'medium' | 'large';
}

export const Badge: React.FC<BadgeProps> = ({ 
  text, 
  variant = 'default', 
  size = 'medium' 
}) => {
  const getBadgeStyle = () => {
    let style: any[] = [styles.badge, styles[size]];
    
    switch (variant) {
      case 'success':
        style.push(styles.success);
        break;
      case 'warning':
        style.push(styles.warning);
        break;
      case 'danger':
        style.push(styles.danger);
        break;
      case 'info':
        style.push(styles.info);
        break;
      default:
        style.push(styles.default);
    }
    
    return style;
  };

  const getTextStyle = () => {
    let style: any[] = [styles.text];
    
    switch (variant) {
      case 'success':
        style.push(styles.successText);
        break;
      case 'warning':
        style.push(styles.warningText);
        break;
      case 'danger':
        style.push(styles.dangerText);
        break;
      case 'info':
        style.push(styles.infoText);
        break;
      default:
        style.push(styles.defaultText);
    }
    
    return style;
  };

  return (
    <View style={getBadgeStyle()}>
      <Text style={getTextStyle()}>{text}</Text>
    </View>
  );
};

// Stock Level Indicator Component
interface StockLevelIndicatorProps {
  currentStock: number;
  reorderLevel: number;
  size?: 'small' | 'medium' | 'large';
}

export const StockLevelIndicator: React.FC<StockLevelIndicatorProps> = ({
  currentStock,
  reorderLevel,
  size = 'medium',
}) => {
  const getStockStatus = (): { variant: 'success' | 'warning' | 'danger'; text: string } => {
    if (currentStock === 0) {
      return { variant: 'danger', text: 'OUT OF STOCK' };
    } else if (currentStock <= reorderLevel) {
      return { variant: 'warning', text: 'LOW STOCK' };
    } else {
      return { variant: 'success', text: 'IN STOCK' };
    }
  };

  const status = getStockStatus();

  return (
    <Badge 
      text={status.text} 
      variant={status.variant} 
      size={size} 
    />
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  medium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  large: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  success: {
    backgroundColor: '#E8F5E8',
  },
  warning: {
    backgroundColor: '#FFF3CD',
  },
  danger: {
    backgroundColor: '#F8D7DA',
  },
  info: {
    backgroundColor: '#D1ECF1',
  },
  default: {
    backgroundColor: '#F2F2F7',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  successText: {
    color: '#34C759',
  },
  warningText: {
    color: '#FF9F0A',
  },
  dangerText: {
    color: '#FF3B30',
  },
  infoText: {
    color: '#007AFF',
  },
  defaultText: {
    color: '#8E8E93',
  },
});
