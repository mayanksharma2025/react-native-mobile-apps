import React, { useState, useContext } from 'react'
import { ScrollView, View } from 'react-native'
import { Input, Button, Text } from 'react-native-elements'
import Header from './components/Header'
import { AppContext } from '../_context/AppContext'
import { useRouter } from 'expo-router'

export default function Checkout() {
  const { clearCart } = useContext(AppContext)
  const router = useRouter()
  const [name, setName] = useState('')
  const [card, setCard] = useState('')
  const [address, setAddress] = useState('')

  const handlePayment = () => {
    if (!name || !card || !address) return alert('Fill all fields')
    alert('Payment Successful!')
    clearCart()
    router.replace('/')
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <Header title="Checkout" showCart={false} />
      <View style={{ padding: 20 }}>
        <Input placeholder="Full Name" value={name} onChangeText={setName} />
        <Input
          placeholder="Card Number"
          value={card}
          onChangeText={setCard}
          keyboardType="numeric"
        />
        <Input
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <Button
          title="Pay Now"
          onPress={handlePayment}
          containerStyle={{ marginTop: 20 }}
        />
      </View>
    </ScrollView>
  )
}
