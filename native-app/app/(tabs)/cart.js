import React, { useContext } from 'react'
import { View, ScrollView } from 'react-native'
import { Card, Text, Button, Icon } from 'react-native-elements'
import { AppContext } from '../../_context/AppContext'
import { useRouter } from 'expo-router'

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(AppContext)
  const router = useRouter()

  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)

  if (!cart.length)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text h4>Your cart is empty</Text>
      </View>
    )

  return (
    <ScrollView style={{ padding: 20 }}>
      {cart.map((item) => (
        <Card key={item.id}>
          <Card.Title>{item.title}</Card.Title>
          <Card.Image source={{ uri: item.image }} />
          <Text>${item.price}</Text>
          <Button
            icon={<Icon name="delete" color="white" />}
            title="Remove"
            onPress={() => removeFromCart(item.id)}
          />
        </Card>
      ))}

      {cart.length > 0 && (
        <>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginVertical: 10,
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            Total: ${total}
          </Text>
          <Button title="Checkout" onPress={() => router.push('/checkout')} />
        </>
      )}
      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <Button title="Clear Cart" onPress={clearCart} />
      </View>
    </ScrollView>
  )
}
