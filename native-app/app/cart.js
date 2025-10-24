import React, { useContext } from 'react'
import { ScrollView, View } from 'react-native'
import { Card, Button, Text } from 'react-native-elements'
import Header from './components/Header'
import { AppContext } from '../_context/AppContext'
import { useRouter } from 'expo-router'

export default function Cart() {
  const { cart, removeFromCart } = useContext(AppContext)
  const router = useRouter()

  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)

  return (
    <ScrollView style={{ flex: 1 }}>
      <Header title="Cart" showCart={false} />
      <View style={{ padding: 10 }}>
        {cart.map((item) => (
          <Card key={item.id}>
            <Card.Title>{item.title}</Card.Title>
            <Text>${item.price}</Text>
            <Button
              title="Remove"
              onPress={() => removeFromCart(item.id)}
              containerStyle={{ marginTop: 5 }}
            />
          </Card>
        ))}

        {cart.length > 0 && (
          <>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}
            >
              Total: ${total}
            </Text>
            <Button title="Checkout" onPress={() => router.push('/checkout')} />
          </>
        )}
      </View>
    </ScrollView>
  )
}
