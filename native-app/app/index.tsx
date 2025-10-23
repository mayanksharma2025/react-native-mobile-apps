import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'

export default function ResumeForm() {
  const router = useRouter()
  const screenHeight = Dimensions.get('window').height // Get device height

  const [userDetails, setUserDetails] = useState({
    fullName: '',
    avatarUrl: '',
    profTitle: '',
    phoneNo: '',
    email: '',
    website: '',
    company: '',
    jobTitle: '',
    skill: '',
  })

  const handleChange = (key, value) => {
    setUserDetails((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    // Navigate to ShowCV tab and pass params
    router.push({
      // pathname: '/(tabs)/ShowCV',
      pathname: '/ShowCV',
      params: userDetails,
    })
  }

  return (
    <ScrollView style={[styles.container, { maxHeight: screenHeight }]}>
      <Text style={styles.header}>Resume Builder</Text>

      <Text style={styles.sectionTitle}>Personal Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={userDetails.fullName}
        onChangeText={(t) => handleChange('fullName', t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Avatar URL"
        value={userDetails.avatarUrl}
        onChangeText={(t) => handleChange('avatarUrl', t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Professional Title"
        value={userDetails.profTitle}
        onChangeText={(t) => handleChange('profTitle', t)}
      />

      <Text style={styles.sectionTitle}>Contact Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={userDetails.phoneNo}
        onChangeText={(t) => handleChange('phoneNo', t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={userDetails.email}
        onChangeText={(t) => handleChange('email', t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Website"
        value={userDetails.website}
        onChangeText={(t) => handleChange('website', t)}
      />

      <Text style={styles.sectionTitle}>Previous Job</Text>
      <TextInput
        style={styles.input}
        placeholder="Company"
        value={userDetails.company}
        onChangeText={(t) => handleChange('company', t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Job Title"
        value={userDetails.jobTitle}
        onChangeText={(t) => handleChange('jobTitle', t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Skill"
        value={userDetails.skill}
        onChangeText={(t) => handleChange('skill', t)}
      />
      <View style={styles.submit}>
        <Button title="Create Resume" onPress={handleSubmit} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  submit: {
    borderRadius: 5,
    marginBottom: 80,
  },
})
