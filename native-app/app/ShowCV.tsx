import * as React from 'react'
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  Button,
  Dimensions,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

export default function ShowCV() {
  const router = useRouter()
  const dataObj = useLocalSearchParams()

  const screenHeight = Dimensions.get('window').height + 300 // Get device height

  return (
    <ScrollView
      contentContainerStyle={[styles.cont, { maxHeight: screenHeight }]} // ensure scrollable on small screens
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Resume</Text>
      </View>

      {/* Personal Details */}
      <View style={styles.details}>
        <Text style={styles.titleText}>Personal Details</Text>
        {dataObj.avatarUrl && (
          <Image
            source={{ uri: dataObj.avatarUrl } as any}
            style={styles.avatar}
          />
        )}
        <Text style={styles.text}>
          <Text style={styles.key}>Name: </Text>
          {dataObj.fullName}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.key}>Professional Title: </Text>
          {dataObj.profTitle}
        </Text>
      </View>

      {/* Contact Details */}
      <View style={styles.details}>
        <Text style={styles.titleText}>Contact Details</Text>
        <Text style={styles.text}>
          <Text style={styles.key}>Phone Number: </Text>
          {dataObj.phoneNo}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.key}>Email: </Text>
          {dataObj.email}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.key}>Website: </Text>
          {dataObj.website}
        </Text>
      </View>

      {/* Previous Job */}
      <View style={styles.details}>
        <Text style={styles.titleText}>Previous Job</Text>
        <Text style={styles.text}>
          <Text style={styles.key}>Company: </Text>
          {dataObj.company}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.key}>Role: </Text>
          {dataObj.jobTitle}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.key}>Skill: </Text>
          {dataObj.skill}
        </Text>
      </View>

      <Button title="Back to Edit" onPress={() => router.back()} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  cont: {
    padding: 40,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
    alignSelf: 'stretch',
  },
  details: {
    marginBottom: 15,
  },
  headerText: {
    fontSize: 24,
    color: '#000',
    borderBottomColor: '#199187',
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  titleText: {
    fontWeight: 'bold',
    color: 'blue',
    fontSize: 18,
    marginBottom: 10,
  },
  key: {
    fontWeight: 'bold',
  },
  text: {
    marginBottom: 6,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
})
