import React, { useRef, useEffect, useState } from 'react'
import { ScrollView, Image, Dimensions, View } from 'react-native'

const banners = [
  'https://graphicsfamily.com/wp-content/uploads/edd/2022/06/Free-E-commerce-Product-Banner-Design-with-Green-Colors-scaled.jpg',
  'https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/34a73497496373.68d9f7261f67c.jpg',
  'https://www.zilliondesigns.com/blog/wp-content/uploads/Ecommerce-sales-banner.png',
]

const { width } = Dimensions.get('window')

export default function BannerSlider() {
  const scrollViewRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      })
      setCurrentIndex(nextIndex)
    }, 3000) // change every 3 seconds

    return () => clearInterval(interval)
  }, [currentIndex])

  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.floor(e.nativeEvent.contentOffset.x / width)
          setCurrentIndex(index)
        }}
      >
        {banners.map((banner, i) => (
          <Image
            key={i}
            source={{ uri: banner }}
            style={{ width, height: 200, marginVertical: 10 }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
    </View>
  )
}

// import React from 'react'
// import { ScrollView, Image, Dimensions } from 'react-native'

// const banners = [
//   'https://graphicsfamily.com/wp-content/uploads/edd/2022/06/Free-E-commerce-Product-Banner-Design-with-Green-Colors-scaled.jpg',
//   'https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/34a73497496373.68d9f7261f67c.jpg',
//   'https://www.zilliondesigns.com/blog/wp-content/uploads/Ecommerce-sales-banner.png',
// ]

// const { width } = Dimensions.get('window')

// export default function BannerSlider() {
//   return (
//     <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
//       {banners.map((banner, i) => (
//         <Image
//           key={i}
//           source={{ uri: banner }}
//           style={{ width, height: 200, marginVertical: 10 }}
//         />
//       ))}
//     </ScrollView>
//   )
// }
