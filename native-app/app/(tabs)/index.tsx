// app/index.tsx
import React from 'react'
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
} from 'react-native'
import { useRouter } from 'expo-router' // <-- Import router

const featuredDestinations = [
  {
    id: '1',
    name: 'Palaces',
    image:
      'https://media.geeksforgeeks.org/wp-content/uploads/20231201163123/2.jpg',
  },
  {
    id: '2',
    name: 'Mountain Retreat',
    image:
      'https://media.geeksforgeeks.org/wp-content/uploads/20231201163123/1.jpg',
  },
]

const HomeScreen = () => {
  const router = useRouter() // <-- Initialize router

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://media.geeksforgeeks.org/wp-content/uploads/20231201162358/GeekforGeeks-(1).jpg',
        }}
        style={styles.image}
      />
      <Text style={styles.title}>Welcome to Our Travel App</Text>

      <TextInput style={styles.searchBar} placeholder="Search Destinations" />
      <Button
        title="View Destinations"
        onPress={() => router.push('/destination')} // <-- Replace navigation.navigate
      />

      <Text style={styles.featuredTitle}>Featured Destinations</Text>
      <FlatList
        data={featuredDestinations}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.featuredCard}>
            <Image source={{ uri: item.image }} style={styles.featuredImage} />
            <Text style={styles.featuredName}>{item.name}</Text>
          </View>
        )}
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
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchBar: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  featuredCard: {
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  featuredImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },
  featuredName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
})

export default HomeScreen
