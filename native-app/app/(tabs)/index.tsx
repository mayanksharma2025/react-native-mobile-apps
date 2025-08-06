// Import necessary modules from React and React Native
import React, { useState } from 'react'
// Import StyleSheet, Text, View, and Button components from React Native
import { StyleSheet, Text, View, Button } from 'react-native'

// Define the main App component as the default export
export default function App() {
  // Declare a state variable 'count' with an initial value of 0 and a function 'setcount' to update it
  const [count, setcount] = useState(0)

  // Function to increment the count value by 1
  const changeCountPlus = () => {
    setcount(count + 1)
  }
  const changeCountMinus = () => {
    setcount(count - 1)
  }

  // Render the UI
  return (
    <View style={styles.container}>
      {/* Display the current count value */}
      <Text style={styles.text}>{count}</Text>
      {/* Button to trigger the changeCount function when pressed */}
      <Button title={'Add Count'} onPress={changeCountPlus} />
      <Button title={'Remove Count'} color="red" onPress={changeCountMinus} />
    </View>
  )
}

// Define styles for the components
const styles = StyleSheet.create({
  // Style for the main container
  container: {
    flex: 1, // Take up the full height of the screen
    backgroundColor: '#fff', // Set background color to white
    alignItems: 'center', // Center items horizontally
    justifyContent: 'center', // Center items vertically
    gap: 10,
  },
  // Style for the text displaying the count
  text: {
    fontSize: 40, // Set font size to 40
    marginBottom: 30, // Add margin below the text
  },
})
