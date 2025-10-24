import React, { useContext, useState } from 'react'
import { ScrollView, View } from 'react-native'
import Header from '../components/Header'
import BannerSlider from '../components/BannerSlider'
import FilterBar from '../components/FilterBar'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'
import { AppContext } from '../../_context/AppContext' // ✅ note: correct relative path

export default function Home() {
  const { filteredProducts, addToCart } = useContext(AppContext)
  const [page, setPage] = useState(1)
  const itemsPerPage = 6
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  return (
    <ScrollView style={{ flex: 1 }}>
      <Header title="ShopApp" />
      <BannerSlider />
      <FilterBar />
      <View>
        {paginatedProducts.map((item) => (
          <ProductCard key={item.id} item={item} addToCart={addToCart} />
        ))}
      </View>
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </ScrollView>
  )
}
