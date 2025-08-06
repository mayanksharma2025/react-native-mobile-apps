// Import necessary libraries and components
import React, { useState } from 'react'
import {
  View, // Main container for the app
  Text, // Text component for displaying text
  TouchableOpacity, // Touchable component for handling touch events
  StyleSheet, // Stylesheet for styling components
} from 'react-native'

// CustomRadioButton component: A reusable radio button component
const CustomRadioButton = ({ label, selected, onSelect }: any) => (
  <TouchableOpacity
    style={[
      styles.radioButton,
      { backgroundColor: selected ? '#007BFF' : '#FFF' }, // Change background color based on selection
    ]}
    onPress={onSelect} // Trigger onSelect callback when pressed
  >
    <Text
      style={[
        styles.radioButtonText,
        { color: selected ? '#FFF' : '#000' }, // Change text color based on selection
      ]}
    >
      {label} {/* Display the label text */}
    </Text>
  </TouchableOpacity>
)

// Main App component
const App = () => {
  // used to manage the state i.e, selectedValue value and set the default value of selectedValue to null
  const [selectedValue, setSelectedValue] = useState<String | null>(null)

  return (
    <View style={styles.container}>
      {/* Render three CustomRadioButton components with different labels */}
      <CustomRadioButton
        label="ReactJS" // Label for the first option
        selected={selectedValue === 'option1'} // Check if this option is selected
        onSelect={() => setSelectedValue('option1')} // Update state when selected
      />
      <CustomRadioButton
        label="NextJS" // Label for the second option
        selected={selectedValue === 'option2'} // Check if this option is selected
        onSelect={() => setSelectedValue('option2')} // Update state when selected
      />
      <CustomRadioButton
        label="React Native" // Label for the third option
        selected={selectedValue === 'option3'} // Check if this option is selected
        onSelect={() => setSelectedValue('option3')} // Update state when selected
      />
    </View>
  )
}

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the full screen
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    backgroundColor: '#F5F5F5', // Light gray background
  },
  radioButton: {
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 16, // Horizontal padding
    borderRadius: 8, // Rounded corners
    marginVertical: 8, // Vertical margin between buttons
    borderWidth: 1, // Border width
    borderColor: '#007BFF', // Border color
    flexDirection: 'row', // Arrange children in a row
    alignItems: 'center', // Align items vertically in the center
    justifyContent: 'space-between', // Space out children evenly
    width: 280, // Fixed width for the button
  },
  radioButtonText: {
    fontSize: 16, // Font size for the text
  },
})
// Export the App component as default
export default App
