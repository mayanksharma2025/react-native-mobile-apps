import { Link, Stack } from 'expo-router'
import { Button, StyleSheet } from 'react-native'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useRouter } from 'expo-router'
import { View } from 'react-native'

export default function NotFoundScreen() {
  const router = useRouter()

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">This screen does not exist.</ThemedText>
        <View style={styles.link}>
          <Button
            title="Go to home screen!"
            onPress={() => router.push('/' as any)} // Navigate to the default tab
          ></Button>
        </View>
        {/* <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link> */}
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
})
