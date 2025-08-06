import React from 'react' // Import React library
import {
  View, // Import View component for layout
  Text, // Import Text component for displaying text
  TouchableOpacity, // Import TouchableOpacity for button functionality
  StyleSheet, // Import StyleSheet for styling components
  Image, // Import Image component for displaying images
} from 'react-native' // Import React Native components
import Animated, { // Import Animated from react-native-reanimated to create animations
  useSharedValue, // Hook to create shared values for animations
  withTiming, // Function to create a timing animation
  Easing, // Easing function for smooth animations
  useAnimatedStyle, // Hook to create animated styles
} from 'react-native-reanimated' // Import animation utilities from react-native-reanimated

// Define the main App component
const App = () => {
  // Shared value to control the opacity of the image
  const fadeInOpacity = useSharedValue(0)

  // Function to animate the fade-in effect
  const fadeIn = () => {
    fadeInOpacity.value = withTiming(1, {
      duration: 1000, // Animation duration in milliseconds
      easing: Easing.linear, // Linear easing for smooth animation
    })
  }

  // Function to animate the fade-out effect
  const fadeOut = () => {
    fadeInOpacity.value = withTiming(0, {
      duration: 1000, // Animation duration in milliseconds
      easing: Easing.linear, // Linear easing for smooth animation
    })
  }

  // Animated style to bind the opacity value to the image container
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeInOpacity.value, // Use the shared value for opacity
    }
  })

  // URL of the image to display
  const imageUrl =
    'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1JZHht.img?w=768&h=432&m=6'

  // Render the UI
  return (
    <View style={styles.container}>
      {/* Animated container for the image */}
      <Animated.View
        style={[
          styles.imageContainer, // Static styles
          animatedStyle, // Animated styles
        ]}
      >
        {/* Display the image */}
        <Image
          source={{ uri: imageUrl }} // Load image from the URL
          style={styles.image} // Apply styles to the image
        />
      </Animated.View>

      {/* Button to trigger the fade-in animation */}
      <TouchableOpacity
        onPress={fadeIn} // Call fadeIn function on press
        style={styles.button} // Apply button styles
      >
        <Text style={styles.buttonText}>Fade In</Text>
      </TouchableOpacity>

      {/* Button to trigger the fade-out animation */}
      <TouchableOpacity
        onPress={fadeOut} // Call fadeOut function on press
        style={styles.button} // Apply button styles
      >
        <Text style={styles.buttonText}>Fade Out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default App

// Define styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the full screen
    alignItems: 'center', // Center items horizontally
    justifyContent: 'center', // Center items vertically
    backgroundColor: '#f0f0f0', // Light gray background color
  },
  imageContainer: {
    alignItems: 'center', // Center the image horizontally
  },
  image: {
    width: 200, // Image width
    height: 200, // Image height
    borderRadius: 10, // Rounded corners for the image
  },
  button: {
    marginTop: 20, // Space above the button
    backgroundColor: 'blue', // Button background color
    paddingVertical: 10, // Vertical padding inside the button
    paddingHorizontal: 20, // Horizontal padding inside the button
    borderRadius: 5, // Rounded corners for the button
    shadowColor: 'black', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.4, // Shadow opacity
    shadowRadius: 4, // Shadow blur radius
    elevation: 4, // Elevation for Android shadow
  },
  buttonText: {
    color: 'white', // Text color
    fontWeight: 'bold', // Bold text
    fontSize: 16, // Font size
  },
})
