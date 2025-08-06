import React from 'react'
import { StyleSheet, Button, Text, Alert, View } from 'react-native'

function App() {
  return (
    <View style={styles.setMargin}>
      <Text style={styles.header}>Simple Button</Text>
      <Button
        title="Press me"
        onPress={() => Alert.alert('Simple Button pressed')}
      />
      <Text style={styles.header}>Coloured Button</Text>
      <Button
        title="Press me"
        color="#f194ff"
        onPress={() => Alert.alert('Coloured Button pressed')}
      />
      <Text style={styles.header}>Disabled Button</Text>
      <Button
        title="Press me"
        disabled
        onPress={() => Alert.alert('Cannot press this one')}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  setMargin: {
    marginTop: 50,
  },
})
export default App
