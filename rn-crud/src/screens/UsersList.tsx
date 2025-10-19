// src/screens/UsersList.tsx
import React, { useMemo, useState } from 'react'
import {
  FlatList,
  View,
  ActivityIndicator,
  StyleSheet,
  TextInput as RNTextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { List, Button, Text } from 'react-native-paper'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { fetchUsers, deleteUser } from '../api/queries'
import { User } from '../types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../navigation/types'
import { useSnackbar } from '../components/SnackbarProvider'

type UsersListNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'UsersList'
>

type PaginatedUsers = {
  data: User[]
  page: number
  total: number
  totalPages: number
}

export default function UsersList() {
  const navigation = useNavigation<UsersListNavProp>()
  const snackbar = useSnackbar()
  const qc = useQueryClient()

  const [search, setSearch] = useState<string>('')

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['users', search],
    queryFn: ({ pageParam = 1 }) =>
      fetchUsers({ page: pageParam, limit: 10, search }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60,
  })

  const users = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data])

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onMutate: async (id: number) => {
      await qc.cancelQueries({ queryKey: ['users'] })
      const previous = qc.getQueryData<User[]>(['users'])
      qc.setQueryData<User[]>(['users'], (old = []) =>
        old.filter((u) => u.id !== id)
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        qc.setQueryData<User[]>(['users'], context.previous)
      snackbar({ message: 'Delete failed', type: 'error' })
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['users'] }),
    onSuccess: () => snackbar({ message: 'User deleted', type: 'success' }),
  })

  const handleRefresh = async () => {
    await qc.setQueryData(['users', search], undefined) // reset pages
    refetch({
      refetchPage: (_page: number, index: number) => index === 0,
    } as any)
  }

  const keyExtractor = (item: User | undefined, index: number) =>
    (item?.id ?? index).toString()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('UserForm', {})}
        >
          Add User
        </Button>
        <RNTextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          value={search}
          onChangeText={(text) => {
            setSearch(text)
            handleRefresh()
          }}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : users.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text>No users found</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={keyExtractor}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage()
          }}
          onEndReachedThreshold={0.5}
          refreshing={isLoading || isFetchingNextPage}
          onRefresh={handleRefresh}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator style={{ margin: 12 }} />
            ) : null
          }
          renderItem={({ item }) => {
            if (!item) return null
            return (
              <List.Item
                title={item.name}
                description={item.email}
                right={() => (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Button
                      compact
                      onPress={() =>
                        navigation.navigate('UserForm', { id: item.id })
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      compact
                      onPress={() => deleteMutation.mutate(item.id)}
                    >
                      Delete
                    </Button>
                  </View>
                )}
              />
            )
          }}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  emptyBox: { marginTop: 24, alignItems: 'center' },
})
