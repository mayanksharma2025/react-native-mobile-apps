// App.js
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Linking,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Card, Icon, Overlay } from 'react-native-elements'
import RNPickerSelect from 'react-native-picker-select'

const App = () => {
  const [news, setNews] = useState([])
  const [selectedNews, setSelectedNews] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [selectedCategory])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&category=${selectedCategory}&apiKey=4be2b948f8264319acc73f2ebbb3dd53`
      )
      const result = await response.json()
      setNews(
        result.articles.map((article) => ({
          ...article,
          category: selectedCategory,
        }))
      )
    } catch (error) {
      console.error('Error fetching news:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchNews()
    setRefreshing(false)
  }

  const openNewsLink = () => {
    if (selectedNews?.url) {
      Linking.openURL(selectedNews.url)
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <Card.Title style={styles.cardTitle}>{item.title}</Card.Title>
      <Card.Image source={{ uri: item.urlToImage }} style={styles.cardImage} />
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <View style={styles.categoryContainer}>
          <Icon name="tag" type="font-awesome" color="gray" size={16} />
          <Text style={styles.categoryLabel}>{item.category}</Text>
        </View>
        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={() => {
            setSelectedNews(item)
            setModalVisible(true)
          }}
        >
          <Text style={styles.readMoreButtonText}>Read more</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon name="newspaper-o" type="font-awesome" color="green" size={30} />
        <Text style={styles.header}>GeeksforGeeks News Reader</Text>
      </View>

      <View style={styles.categoryPickerContainer}>
        <Text style={styles.categoryPickerLabel}>Select Category:</Text>
        <RNPickerSelect
          placeholder={{}}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          value={selectedCategory}
          items={[
            { label: 'General', value: 'general' },
            { label: 'Business', value: 'business' },
            { label: 'Technology', value: 'technology' },
            { label: 'Sports', value: 'sports' },
          ]}
          style={pickerSelectStyles}
        />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#3498db"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={news}
          renderItem={renderItem}
          keyExtractor={(item) => item.url}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* ✅ Only Overlay, not Modal */}
      <Overlay
        isVisible={modalVisible}
        overlayStyle={styles.modalContainer}
        onBackdropPress={() => setModalVisible(false)}
      >
        {selectedNews && (
          <View style={styles.cardContainer}>
            <Card.Title style={styles.cardTitle}>
              {selectedNews.title}
            </Card.Title>
            <Card.Image
              source={{ uri: selectedNews.urlToImage }}
              style={styles.cardImage}
            />
            <Text style={styles.description}>{selectedNews.content}</Text>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={openNewsLink}
            >
              <Text style={styles.readMoreButtonText}>Read Full Article</Text>
            </TouchableOpacity>
          </View>
        )}
      </Overlay>
    </View>
  )
}

export default App

// --- STYLES ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  categoryPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryPickerLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  cardContainer: {
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff', // Light card background
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Android shadow
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardImage: {
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  description: {
    marginVertical: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryLabel: {
    color: 'gray',
    marginLeft: 5,
  },
  readMoreButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  readMoreButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '90%',
    borderRadius: 10,
    padding: 10,
  },
  modalCard: {
    borderRadius: 10,
    overflow: 'hidden',
  },
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
})
