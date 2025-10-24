import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, Image } from 'react-native'
import { Title, Paragraph, Button } from 'react-native-paper'
import { AppContext } from '../../_context/AppContext'
import axios from 'axios'
import { useLocalSearchParams, useRouter } from 'expo-router'

export default function ProductDetail() {
  const { id } = useLocalSearchParams()
  const router = useRouter()

  const { addToCart } = useContext(AppContext)
  const [item, setItem] = useState(null)

  useEffect(() => {
    axios
      .get(`https://fakestoreapi.com/products/${id}`)
      .then((res) => setItem(res.data))
      .catch(console.error)
  }, [id])

  if (!item) return null

  return (
    <ScrollView style={{ padding: 20 }}>
      <Image
        source={{ uri: item.image }}
        style={{ width: '100%', height: 250 }}
        resizeMode="contain"
      />
      <Title>{item.title}</Title>
      <Paragraph>{item.description}</Paragraph>
      <Paragraph style={{ fontWeight: 'bold' }}>${item.price}</Paragraph>
      <Button mode="contained" onPress={() => addToCart(item)}>
        Add to Cart
      </Button>

      <Button
        mode="outlined"
        onPress={() => router.push('/')}
        style={{ marginTop: 20 }}
      >
        Back
      </Button>
    </ScrollView>
  )
}
