import { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const App = () => {
  const [joke, setJoke] = useState('')

  const getJoke = async () => {
    try {
      const response = await fetch('https://icanhazdadjoke.com/', {
        headers: {
          Accept: 'application/json',
        },
      })

      const data = await response?.json()

      setJoke(data.joke)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Random Jokes Generator</Text>

      <View style={styles.jokeContainer}>
        <Text>{joke}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={getJoke}>
        <Text style={styles.buttonText}>Get a Joke</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333739',
    marginBottom: 24,
  },
  jokeContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowRadius: 15,
    shadowOpacity: 1,
    elevation: 4,
  },

  button: {
    padding: 16,
    backgroundColor: '#FC6C85',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 1,
    elevation: 4,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
})

export default App
