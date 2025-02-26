import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const  ProgressBar = ({ progress }) => {
  const progressPercentage = `${progress??0}%`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Completion</Text>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.progressBar,
            { width: progressPercentage, backgroundColor:progress>=90?'green': progress >= 60 ? 'blue' : progress>=40?'#FFC107':'red' },
          ]}
        />
      </View>
      <Text style={styles.percentage}>{progressPercentage} Complete</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  barContainer: {
    height: 12,
    backgroundColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 8,
  },
  percentage: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
    color: '#555',
  },
});

export default  ProgressBar;
