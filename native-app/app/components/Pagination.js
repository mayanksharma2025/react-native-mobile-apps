import React from 'react'
import { View, Button } from 'react-native'

export default function Pagination({ page, setPage, totalPages }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
      }}
    >
      <Button
        title="Prev"
        disabled={page === 1}
        onPress={() => setPage(page - 1)}
      />
      <Button
        title="Next"
        disabled={page === totalPages}
        onPress={() => setPage(page + 1)}
      />
    </View>
  )
}
