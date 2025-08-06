// Import React library
import React from 'react'

import {
  View,
  TextInput,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native'

const screenHeight = Dimensions.get('window').height

const screenWidth = Dimensions.get('window').width

const BackgroundImg = () => {
  return (
    <View>
      <ImageBackground
        source={{
          uri: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1JZHht.img?w=768&h=432&m=6',
        }}
        resizeMode="stretch"
        style={styles.img}
      >
        <TextInput placeholder="Mayank Sharma" style={styles.input} />
        <TextInput placeholder="Mayank Sharma" style={styles.input} />
      </ImageBackground>
    </View>
  )
}

// Define the main App component
const App = () => {
  return (
    <View>
      <BackgroundImg />
    </View>
  )
}
export default App

// Define styles for the components
const styles = StyleSheet.create({
  img: {
    // Set the height to the screen height
    height: screenHeight,

    // Set the width to the screen width
    width: screenWidth,

    // Center content vertically
    justifyContent: 'center',

    // Center content horizontally
    alignItems: 'center',
  },
  input: {
    // Set the height of the input field
    height: 40,

    // Add margin around the input field
    margin: 12,

    // Set the border width
    borderWidth: 2,

    // Add padding inside the input field
    padding: 10,

    backgroundColor: '#FC6C85',

    color: '#FFFFFF',

    borderColor: '#FFFFFF',

    textAlign: 'center',
  },
})
