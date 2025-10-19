import React, { useState, useMemo, useCallback } from 'react'
import {
  FlatList,
  View,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { List, Button, Text } from 'react-native-paper'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { fetchUsers, deleteUser } from '../api/queries'
import { PaginatedUsers, User } from '../types'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { useSnackbar } from '../components/SnackbarProvider'

type UsersListNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'UsersList'
>

export default function UsersList() {
  const navigation = useNavigation<UsersListNavProp>()
  const snackbar = useSnackbar()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<PaginatedUsers, Error>({
      queryKey: ['users', search],
      queryFn: ({ pageParam = 0 }) =>
        fetchUsers({ skip: pageParam, limit: 10, search }),
      getNextPageParam: (lastPage: any) => {
        const nextSkip = lastPage.skip + lastPage.limit
        return nextSkip < lastPage.total ? nextSkip : undefined
      },
    } as any)

  const users = useMemo(() => data?.pages.flatMap((p) => p.users) ?? [], [data])

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      qc.invalidateQueries(['users', search] as any)
      snackbar({ message: 'User deleted', type: 'success' })
    },
    onError: () => snackbar({ message: 'Delete failed', type: 'error' }),
  })

  const handleRefresh = useCallback(() => {
    qc.invalidateQueries(['users', search] as any)
  }, [qc, search])

  const keyExtractor = (item: User) => item.id.toString()

  const UserItem = React.memo(({ user, onEdit, onDelete }: any) => (
    <List.Item
      title={`${user.firstName} ${user.lastName}`}
      description={user.email}
      right={() => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Button compact onPress={() => onEdit(user.id)}>
            Edit
          </Button>
          <Button compact onPress={() => onDelete(user.id)}>
            Delete
          </Button>
        </View>
      )}
    />
  ))

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('UserForm', {})}
        >
          Add User
        </Button>
        <TextInput
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
            if (hasNextPage && !isFetchingNextPage) fetchNextPage()
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
              <UserItem
                user={item}
                onEdit={(id: number) => navigation.navigate('UserForm', { id })}
                onDelete={(id: number) => deleteMutation.mutate(id)}
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
