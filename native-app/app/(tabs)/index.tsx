// App.js

import React, { useState, useEffect, useContext, createContext } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const Stack = createStackNavigator()
const BookData = createContext(null)
const BookFetch = ({ children }) => {
  const [storedBooks, setStoredBooks] = useState([])
  const addBook = (book) => {
    setStoredBooks((prevBooks) => [
      ...prevBooks,
      {
        ...book,
        storedId: Math.random().toString(),
        addedDate: new Date().toLocaleDateString(),
      },
    ])
  }
  const removeBook = (id) => {
    setStoredBooks((prevBooks) =>
      prevBooks.filter((book) => book.storedId !== id)
    )
  }
  return (
    <BookData.Provider value={{ storedBooks, addBook, removeBook }}>
      {children}
    </BookData.Provider>
  )
}
const BookListScreen = ({ navigation }) => {
  const [books, setBooks] = useState([])
  const [searchQuery, setSearchQuery] = useState('JavaScript')
  const { addBook, removeBook, storedBooks } = useContext(BookData)

  const fetchBooks = async (query = 'JavaScript') => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`
      )
      const data = await response.json()
      setBooks(data.items || [])
    } catch (error) {
      console.error('Error fetching books:', error)
    }
  }
  useEffect(() => {
    fetchBooks(searchQuery)
  }, [searchQuery])
  const navigateToDetails = (book) => {
    navigation.navigate('BookDetails', { book })
  }
  const renderBookItem = ({ item }) => {
    const bookInfo = item.volumeInfo
    const isBookStored = storedBooks.some(
      (storedBook) => storedBook.id === item.id
    )
    const handleButtonPress = () => {
      if (isBookStored) {
        removeBook(item.id)
        Alert.alert('Book removed successfully!')
      } else {
        addBook({ ...bookInfo, id: item.id })
      }
    }
    return (
      <TouchableOpacity
        style={styles.bookItem}
        onPress={() => navigateToDetails(bookInfo)}
      >
        <Image
          style={styles.bookImage}
          source={{ uri: bookInfo.imageLinks?.thumbnail }}
        />
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{bookInfo.title}</Text>
          <Text style={styles.bookAuthor}>{bookInfo.authors?.join(', ')}</Text>
        </View>
        <TouchableOpacity
          style={isBookStored ? styles.removeButton : styles.storeButton}
          onPress={handleButtonPress}
          disabled={isBookStored}
        >
          <Text style={styles.buttonText}>
            {isBookStored ? 'Added' : 'Store'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }
  return (
    <View style={styles.container}>
      <Text style={styles.header}>GeeksforGeeks Book Store</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search books..."
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />
      <FlatList
        data={books}
        keyExtractor={(item) => item.id || item.etag}
        renderItem={renderBookItem}
      />
      <TouchableOpacity
        style={styles.storedBooksButton}
        onPress={() => navigation.navigate('StoredBooks')}
      >
        <MaterialCommunityIcons name="bookshelf" size={24} color="#4CAF50" />
        {storedBooks.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{storedBooks.length}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}
const BookDetailsScreen = ({ route }) => {
  const { book } = route.params

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Book Details</Text>
      <Image
        style={styles.bookImageDetail}
        source={{ uri: book.imageLinks?.thumbnail }}
      />
      <Text style={styles.bookTitle}>{book.title}</Text>
      <Text style={styles.bookAuthor}>{book.authors?.join(', ')}</Text>
    </ScrollView>
  )
}
const StoredBooksScreen = () => {
  const { storedBooks, removeBook } = useContext(BookData)
  const handleRemoveBook = (storedId) => {
    removeBook(storedId)
    Alert.alert('Book removed successfully!')
  }
  const renderStoredBookItem = ({ item }) => (
    <View style={styles.storedBookItem}>
      <Image
        style={styles.storedBookImage}
        source={{ uri: item.imageLinks?.thumbnail }}
      />
      <View style={styles.storedBookDetails}>
        <Text style={styles.storedBookTitle}>{item.title}</Text>
        <Text style={styles.storedBookPreview}>{item.previewLink}</Text>
        <Text style={styles.storedBookAddedDate}>
          Added on: {item.addedDate}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveBook(item.storedId)}
      >
        <Text style={styles.buttonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  )
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Stored Books</Text>
      {storedBooks.length > 0 ? (
        <FlatList
          data={storedBooks}
          keyExtractor={(item) => item.storedId}
          renderItem={renderStoredBookItem}
        />
      ) : (
        <Text>No stored books yet.</Text>
      )}
    </ScrollView>
  )
}
const App = () => {
  return (
    <Stack.Navigator initialRouteName="BookList">
      <Stack.Screen name="BookList" component={BookListScreen} />
      <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
      <Stack.Screen name="StoredBooks" component={StoredBooksScreen} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4CAF50',
  },
  bookItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  bookImage: {
    width: 80,
    height: 120,
    marginRight: 16,
    borderRadius: 8,
  },
  bookDetails: {
    flex: 1,
  },
  bookImageDetail: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookAuthor: {
    marginTop: 8,
  },
  storeButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
  },
  storedBooksButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#faed39',
    padding: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  storedBookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  storedBookImage: {
    width: 80,
    height: 120,
    marginRight: 16,
    borderRadius: 8,
  },
  storedBookDetails: {
    flex: 1,
  },
  storedBookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  storedBookPreview: {
    marginTop: 8,
    color: '#555',
  },
  storedBookAddedDate: {
    marginTop: 8,
    color: '#888',
  },
})
export default () => (
  <BookFetch>
    <App />
  </BookFetch>
)
