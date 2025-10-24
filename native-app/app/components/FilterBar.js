import React, { useContext } from 'react'
import { View, ScrollView } from 'react-native'
import { Button } from 'react-native-elements'
import { AppContext } from '../../_context/AppContext'

export default function FilterBar() {
  const { categories, products, setFilteredProducts } = useContext(AppContext)

  const filterCategory = (cat) => {
    if (cat === 'all') setFilteredProducts(products)
    else setFilteredProducts(products.filter((p) => p.category === cat))
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginVertical: 10 }}
    >
      <Button
        title="All"
        onPress={() => filterCategory('all')}
        containerStyle={{ marginHorizontal: 5 }}
      />
      {categories.map((cat) => (
        <Button
          key={cat}
          title={cat}
          onPress={() => filterCategory(cat)}
          containerStyle={{ marginHorizontal: 5 }}
        />
      ))}
    </ScrollView>
  )
}
