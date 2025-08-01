import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Text from '../components/Text';

const Spinner = ({ textContent = '加载中...' }) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#1E90FF" />
    <Text size={12} bold>{textContent}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

export default Spinner;
