import { Text } from '@rneui/themed'
import { FlatList, StyleSheet, View } from 'react-native'
import { Icon } from 'react-native-elements'

const data = [
  { id: '1', title: 'Item One' },
  { id: '2', title: 'Item Two' },
  { id: '3', title: 'Item Three' },
]

const App = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ display: 'contents' }}>
            <Text style={styles.item}>{item.title}</Text>
            <Icon name="ios-eye" type="ionicon" color="#C2185B" />
          </View>
        )}
      />
      <Text>Hello</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 0.4,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  item: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
})

export default App
