import React, { useState, useContext } from 'react'
import { View } from 'react-native'
import { TextInput, Button, Title } from 'react-native-paper'
import { useRouter } from 'expo-router'
import axios from 'axios'
import { AppContext } from '../_context/AppContext'

export default function SignIn() {
  const router = useRouter()
  const { setUser } = useContext(AppContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://fakestoreapi.com/auth/login', {
        username,
        password,
      })
      setUser(res.data)
      router.replace('/')
    } catch {
      alert('Invalid username or password')
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Title style={{ textAlign: 'center', marginBottom: 20 }}>Sign In</Title>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button mode="contained" style={{ marginTop: 20 }} onPress={handleLogin}>
        Login
      </Button>
      <Button onPress={() => router.push('/register')}>Create Account</Button>
    </View>
  )
}
