// App.js

import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { RadioButton } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 15,
    color: '#333',
  },
})

const App = () => {
  const [selectedValue, setSelectedValue] = useState('option1')

  return (
    <View style={styles.container}>
      <View style={styles.radioGroup}>
        <View style={styles.radioButton}>
          <RadioButton.Android
            value="option1"
            status={selectedValue === 'option1' ? 'checked' : 'unchecked'}
            onPress={() => setSelectedValue('option1')}
            color="#007BFF"
          />
          <Text style={styles.radioLabel}>ReactJS</Text>
        </View>

        <View style={styles.radioButton}>
          <RadioButton.Android
            value="option2"
            status={selectedValue === 'option2' ? 'checked' : 'unchecked'}
            onPress={() => setSelectedValue('option2')}
            color="#007BFF"
          />
          <Text style={styles.radioLabel}>NextJs</Text>
        </View>

        <View style={styles.radioButton}>
          <RadioButton.Android
            value="option3"
            status={selectedValue === 'option3' ? 'checked' : 'unchecked'}
            onPress={() => setSelectedValue('option3')}
            color="#007BFF"
          />
          <Text style={styles.radioLabel}>React Native</Text>
        </View>
      </View>
    </View>
  )
}

export default App
