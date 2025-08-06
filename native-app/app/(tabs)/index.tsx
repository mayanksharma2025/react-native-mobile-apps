import React, { useState, useRef } from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

// Type for each item in the list
type DataItem = {
  id: string
  title: string
}

// Sample data
const DATA: DataItem[] = [
  { id: '1', title: 'Data Structures' },
  { id: '2', title: 'STL' },
  { id: '3', title: 'C++' },
  { id: '4', title: 'Java' },
  { id: '5', title: 'Python' },
  { id: '6', title: 'CP' },
  { id: '7', title: 'ReactJs' },
  { id: '8', title: 'NodeJs' },
  { id: '9', title: 'MongoDb' },
  { id: '10', title: 'ExpressJs' },
  { id: '11', title: 'PHP' },
  { id: '12', title: 'MySql' },
]

// Render a single list item
const Item = ({ title }: { title: string }) => (
  <View style={styles.item}>
    <Text style={styles.itemText}>{title}</Text>
  </View>
)

const Search: React.FC = () => {
  const [data, setData] = useState<DataItem[]>(DATA)
  const [searchValue, setSearchValue] = useState<string>('')
  const arrayholder = useRef<DataItem[]>(DATA)

  const handleSearch = (text: string): void => {
    const formattedQuery = text.toUpperCase()
    const filteredData = arrayholder.current.filter((item) =>
      item.title.toUpperCase().includes(formattedQuery)
    )
    setData(filteredData)
    setSearchValue(text)
  }

  const clearSearch = () => {
    setSearchValue('')
    setData(arrayholder.current)
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search Here..."
          value={searchValue}
          onChangeText={handleSearch}
          placeholderTextColor="#aaa"
        />
        {searchValue.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <Ionicons name="close-circle" size={20} color="#555" />
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      <FlatList
        data={data}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  item: {
    backgroundColor: 'green',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  itemText: {
    color: 'white',
    fontSize: 18,
  },
})

export default Search
