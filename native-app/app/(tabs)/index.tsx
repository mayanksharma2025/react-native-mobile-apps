import * as React from 'react'

// Importing components from react-native library.
import { Alert, Button, Text, View } from 'react-native'

export default function App() {
  function onPressButton() {
    Alert.alert('Welcome Mayank')
  }
  return (
    // Using react-natives built in components.
    <>
      <View
        style={{
          flex: 0.2,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FC6C85',
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 42,
          }}
        >
          Mayank Sharma
        </Text>
      </View>
      <Button onPress={onPressButton} title="Press Me" color="#FC6C85" />
      <View
        style={{
          marginTop: 4,
          flex: 0.1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FC6C85',
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 42,
          }}
        >
          Nisha Sharma
        </Text>
      </View>
    </>
  )
}
