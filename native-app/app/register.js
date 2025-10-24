import React, { useState } from 'react'
import { View } from 'react-native'
import { TextInput, Button, Title } from 'react-native-paper'
import axios from 'axios'
import { useRouter } from 'expo-router'

export default function Register() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async () => {
    try {
      await axios.post('https://fakestoreapi.com/users', { username, password })
      alert('Registration successful!')
      router.push('/signin')
    } catch {
      alert('Registration failed')
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Title style={{ textAlign: 'center', marginBottom: 20 }}>Register</Title>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        mode="contained"
        style={{ marginTop: 20 }}
        onPress={handleRegister}
      >
        Register
      </Button>
    </View>
  )
}
