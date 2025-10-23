// app/destination.tsx
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native'

const destinations = [
  {
    id: '1',
    name: 'Paris',
    image:
      'https://media.geeksforgeeks.org/wp-content/uploads/20231201163123/2.jpg',
  },
  {
    id: '2',
    name: 'New York',
    image:
      'https://media.geeksforgeeks.org/wp-content/uploads/20231201163123/1.jpg',
  },
]

export default function DestinationScreen() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Destinations</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <FlatList
          data={destinations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.destinationCard}>
              <Image
                source={{ uri: item.image }}
                style={styles.destinationImage}
              />
              <Text style={styles.destinationName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  destinationCard: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  destinationImage: { width: 250, height: 200, borderRadius: 10 },
  destinationName: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#3498db',
    color: '#fff',
  },
})
