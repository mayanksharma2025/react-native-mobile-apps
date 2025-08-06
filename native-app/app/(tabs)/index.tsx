import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

// Creating a functional component
const MS = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mayank Sharma</Text>
    </View>
  )
}

// Creating a stylesheet
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FC6C85',
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5,
  },
})

// Creating the main App component
export default function App() {
  return (
    // Using the MS component multiple times
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <MS />
      <MS />
      <MS />
    </View>
  )
}
