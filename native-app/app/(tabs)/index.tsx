import React, { useEffect, useState } from 'react'
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import { Icon } from 'react-native-elements'

const App: React.FC = () => {
  const [data, setData] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setTimeout(() => {
      setData([
        'Data Structures',
        'STL',
        'C++',
        'Java',
        'Python',
        'ReactJS',
        'Angular',
        'NodeJs',
        'PHP',
        'MongoDb',
        'MySql',
        'Android',
        'iOS',
        'Hadoop',
        'Ajax',
        'Ruby',
        'Rails',
        '.Net',
        'Perl',
      ])
      setLoading(false)
    }, 3000)
  }, [])

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.row}>
      <Text style={styles.rowText}>{item}</Text>
      <Icon name="eye" type="ionicon" color="#C2185B" />
    </View>
  )

  const keyExtractor = (_: string, index: number) => index.toString()

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="lightgreen" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
  screen: {
    marginTop: 30,
  },
  row: {
    margin: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  rowText: {
    fontSize: 18,
  },
})

export default App
