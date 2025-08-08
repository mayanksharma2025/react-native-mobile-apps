import { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {
  FAB,
  Card,
  Title,
  Paragraph,
  Provider as PaperProvider,
  Appbar,
} from 'react-native-paper'
import { SearchBar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native'

// Home screen
const HomeScreen = ({ navigation }) => {
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [sortOrder, setSortOrder] = useState('asc')
  const fabScale = useSharedValue(1)

  useEffect(() => {
    const defaultEmployees = [
      {
        id: '1',
        empId: 'EMP001',
        name: 'Ramesh',
        position: 'Software Engineer',
      },
      { id: '2', empId: 'EMP002', name: 'Suresh', position: 'Product Manager' },
      { id: '3', empId: 'EMP003', name: 'Naresh', position: 'UI/UX Designer' },
    ]
    setEmployees(defaultEmployees)
  }, [])

  useEffect(() => {
    const filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredEmployees(filtered)
  }, [search, employees])

  const handleSort = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    setSortOrder(newOrder)
    const sortedEmployees = [...employees].sort((a, b) => {
      return newOrder === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    })
    setEmployees(sortedEmployees)
  }

  const deleteEmployee = (id) => {
    const updatedEmployees = employees.filter((employee) => employee.id !== id)
    setEmployees(updatedEmployees)
  }

  const editEmployee = (id, updatedEmployee) => {
    const updatedEmployees = employees.map((employee) =>
      employee.id === id ? updatedEmployee : employee
    )
    setEmployees(updatedEmployees)
  }

  const addEmployee = (newEmployee) => {
    if (employees.some((employee) => employee.empId === newEmployee.empId)) {
      Alert.alert('Error', 'Employee with the same ID already exists.')
    } else {
      setEmployees([...employees, newEmployee])
      navigation.goBack()
    }
  }

  const fabStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: withSpring(fabScale.value) }] }
  })

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Icon name="people" size={24} color="green" style={styles.titleIcon} />
        <Text style={styles.title}>GeeksforGeeks Emp Management</Text>
      </View>

      <Appbar.Header style={styles.appbar}>
        <SearchBar
          placeholder="Search Employees..."
          onChangeText={(text) => setSearch(text)}
          value={search}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
        />
        <Appbar.Action
          icon={() => <Icon name="filter-alt" size={24} color="white" />}
          onPress={handleSort}
        />
      </Appbar.Header>

      {(filteredEmployees.length === 0 && search !== '') ||
      (employees.length === 0 && filteredEmployees.length === 0) ? (
        <View style={styles.noRecordsContainer}>
          <Text>No records found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEmployees}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Title>{item.name}</Title>
                <Paragraph>ID: {item.empId}</Paragraph>
                <Paragraph>Position: {item.position}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Edit', {
                      employee: item,
                      editEmployee,
                      employees,
                    })
                  }
                >
                  <Icon
                    name="edit"
                    size={24}
                    color="#3498db"
                    style={styles.actionIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteEmployee(item.id)}>
                  <Icon
                    name="delete"
                    size={24}
                    color="#3498db"
                    style={styles.actionIcon}
                  />
                </TouchableOpacity>
              </Card.Actions>
            </Card>
          )}
          style={styles.employeeList}
        />
      )}

      <Animated.View style={[styles.fab, fabStyle]}>
        <FAB
          style={styles.fab}
          icon={() => <Icon name="add" size={24} color="white" />}
          onPress={() => {
            fabScale.value = 0.8
            navigation.navigate('Add', { addEmployee, employees })
          }}
        />
      </Animated.View>
    </View>
  )
}

// Add Employee Screen
const AddEmpScreen = ({ route, navigation }) => {
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [empId, setEmpId] = useState('')

  const addEmployee = () => {
    if (!empId || !name || !position) {
      Alert.alert('Error', 'Please fill in all the fields.')
      return
    }

    const existingEmployees = route.params.employees || []
    if (existingEmployees.some((employee) => employee.empId === empId)) {
      Alert.alert('Error', 'Employee with the same ID already exists.')
    } else {
      route.params?.addEmployee({
        id: Date.now().toString(),
        empId,
        name,
        position,
      })
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter Employee ID"
        value={empId}
        onChangeText={setEmpId}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter Position"
        value={position}
        onChangeText={setPosition}
        style={styles.input}
      />
      <Button title="Add Employee" onPress={addEmployee} />
    </View>
  )
}

// Edit Employee Screen
const EditEmpScreen = ({ route, navigation }) => {
  const { employee, editEmployee } = route.params
  const [empId, setEmpId] = useState(employee.empId)
  const [name, setName] = useState(employee.name)
  const [position, setPosition] = useState(employee.position)

  const saveChanges = () => {
    if (!empId || !name || !position) {
      Alert.alert('Error', 'Please fill in all the fields.')
      return
    }

    const existingEmployees = route.params.employees || []
    if (
      existingEmployees.some(
        (emp) => emp.id !== employee.id && emp.empId === empId
      )
    ) {
      Alert.alert('Error', 'Employee with the same ID already exists.')
    } else {
      editEmployee(employee.id, { ...employee, empId, name, position })
      navigation.goBack()
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter Employee ID"
        value={empId}
        onChangeText={setEmpId}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter Position"
        value={position}
        onChangeText={setPosition}
        style={styles.input}
      />
      <Button title="Save Changes" onPress={saveChanges} />
    </View>
  )
}

const Stack = createStackNavigator()

const App = () => {
  return (
    <PaperProvider>
      <>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Add" component={AddEmpScreen} />
          <Stack.Screen name="Edit" component={EditEmpScreen} />
        </Stack.Navigator>
      </>
    </PaperProvider>
  )
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
  },
  titleContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 10,
    marginBottom: 5,
  },
  titleIcon: {
    marginRight: 10,
    color: 'green',
  },
  title: {
    color: 'green',
    fontSize: 20,
    fontWeight: 'bold',
  },
  appbar: {
    backgroundColor: 'green',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  employeeList: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  card: {
    marginBottom: 10,
    elevation: 4,
    borderRadius: 10,
  },
  actionIcon: {
    marginHorizontal: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'green',
    borderRadius: 15,
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    flex: 1,
  },
  searchBarInputContainer: {
    backgroundColor: '#ecf0f1',
  },
  noRecordsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default App
