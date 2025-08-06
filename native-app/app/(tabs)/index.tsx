import React from 'react' // Import React library to use React components and hooks
import {
  View, // Import View component to create a container
  Text, // Import Text component to display text
} from 'react-native' // Import components from react-native library

// Define the main App component as the default export
export default function App() {
  // Return the UI of the App component
  return (
    <View
      style={{
        flex: 1, // Set flex to 1 to fill the entire screen
        justifyContent: 'center', // Center align items vertically
        alignItems: 'center', // Center align items horizontally
      }}
    >
      {/* Outer container view */}
      <View
        style={{
          backgroundColor: '#FC6C85', // Set background color to green
          height: 200, // Set height of the container to 200
          width: 200, // Set width of the container to 200
          justifyContent: 'center', // Center align items vertically
          alignItems: 'center', // Center align items horizontally
        }}
      >
        <Text
          style={{
            fontSize: 20, // Set font size of the text to 20
            color: 'white', // Set text color to white
            textAlign: 'center', // Center align the text
            margin: 10, // Add margin around the text
          }}
        >
          Mayank Sharma {/* Text to be displayed */}
        </Text>
      </View>
    </View>
  )
}
