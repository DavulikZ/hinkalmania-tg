import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color = '#FFFFFF',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueContainer}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={[styles.value, {color}]}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    minWidth: 80,
  },
  label: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 5,
    textAlign: 'center',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
    marginRight: 5,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default StatCard; 