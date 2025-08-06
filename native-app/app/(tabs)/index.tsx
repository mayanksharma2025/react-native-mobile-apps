import React from 'react'
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native'

function App() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="lightgreen" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
  },
})
export default App
