import React from 'react'
import { Card, Button, Text } from 'react-native-elements'
import { useRouter } from 'expo-router'

export default function ProductCard({ item, addToCart }) {
  const router = useRouter()

  return (
    <Card>
      <Card.Image source={{ uri: item.image }} style={{ height: 150 }} />
      <Text style={{ marginVertical: 5, fontWeight: 'bold' }}>
        {item.title}
      </Text>
      <Text>${item.price}</Text>
      <Card.Divider />
      <Button
        title="Details"
        onPress={() => router.push(`/product/${item.id}`)}
        containerStyle={{ marginVertical: 5 }}
      />
      <Button
        title="Add to Cart"
        onPress={() => addToCart(item)}
        containerStyle={{ marginVertical: 5 }}
      />
    </Card>
  )
}
