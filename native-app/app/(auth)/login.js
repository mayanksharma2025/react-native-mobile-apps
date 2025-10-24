import React, { useContext, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Input, Button, Text } from 'react-native-elements'
import { AppContext } from '../../_context/AppContext'
import { router } from 'expo-router'

export default function Login() {
  const { login } = useContext(AppContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    if (email && password) {
      login({ email })
      router.replace('(tabs)/home')
    }
  }

  return (
    <View style={styles.container}>
      <Text h3 style={{ marginBottom: 20 }}>
        Login
      </Text>
      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title="Login"
        onPress={handleLogin}
        containerStyle={{ width: '100%' }}
      />
      <Button
        type="clear"
        title="Go to Register"
        onPress={() => router.push('register')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
})
