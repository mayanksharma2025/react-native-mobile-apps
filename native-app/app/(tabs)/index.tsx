// Import necessary libraries
import React, { useState } from 'react'
// Import components from React Native
import { StyleSheet, Text, View, Button } from 'react-native'
// Import AsyncStorage for local storage
import AsyncStorage from '@react-native-async-storage/async-storage'

// Main App component
const App: React.FC = () => {
  // State to store retrieved data
  const [data, setdata] = useState('')

  // Function to add data to AsyncStorage
  const add = async () => {
    try {
      // Store key-value pair in AsyncStorage
      await AsyncStorage.setItem(
        'data',
        `Mayank ${Math.floor(Math.random() * 50)}`
      )
    } catch (e) {
      // Log any errors
      console.error(e)
    }
  }

  // Function to retrieve data from AsyncStorage
  const get = async () => {
    try {
      // Retrieve value by key
      const value = await AsyncStorage.getItem('data')
      if (value !== null) {
        // Update state with retrieved value
        setdata(value)
      }
    } catch (e) {
      // Log any errors
      console.error(e)
    }
  }

  return (
    <View style={styles.container}>
      {/* Display retrieved data */}
      <Text style={styles.text}>{data}</Text>
      {/* Button to add data */}
      <View style={styles.button}>
        <Button title={'add'} onPress={add} />
      </View>
      {/* Button to get data */}
      <View style={styles.button}>
        <Button title={'get'} onPress={get} />
      </View>
    </View>
  )
}

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 40,
    marginBottom: 30,
  },
  button: {
    margin: 20,
    width: 250,
  },
})

export default App
