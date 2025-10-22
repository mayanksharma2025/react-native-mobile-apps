// Import StyleSheet from react-native for creating styles
import { StyleSheet } from 'react-native'

// Create a StyleSheet object to hold all styles
const styles = StyleSheet.create({
  // Main container style
  container: {
    flex: 1, // Take up the full screen
    padding: 30, // Padding around the content
    backgroundColor: '#f7f7f7', // Light gray background
  },
  // Title text style
  title: {
    fontSize: 28, // Large font size
    fontWeight: 'bold', // Bold text
    marginBottom: 20, // Space below the title
    color: '#333', // Dark text color
    textAlign: 'center', // Center the text
  },
  // Task list container style
  taskList: {
    flex: 1, // Take up available space
  },
  // Individual task item style
  taskItem: {
    flexDirection: 'row', // Arrange children in a row
    justifyContent: 'space-between', // Space between children
    alignItems: 'center', // Center items vertically
    backgroundColor: '#fff', // White background
    marginBottom: 10, // Space below each task
    padding: 15, // Padding inside the task item
    borderRadius: 10, // Rounded corners
  },
  // Container for task text
  taskTextContainer: {
    flex: 1, // Take up available space
  },
  // Main task text style
  taskText: {
    fontSize: 18, // Medium font size
    fontWeight: 'bold', // Bold text
    color: '#333', // Dark text color
  },
  // Style for completed task text
  completedTaskText: {
    textDecorationLine: 'line-through', // Strike-through text
    color: 'gray', // Gray color for completed tasks
  },
  // Task description text style
  taskDescription: {
    fontSize: 16, // Slightly smaller font
    color: '#666', // Medium gray color
  },
  // Task time text style
  taskTime: {
    fontSize: 14, // Small font size
    color: '#666', // Medium gray color
  },
  // Task status text style
  taskStatus: {
    fontSize: 16, // Medium font size
    color: '#666', // Medium gray color
  },
  // Container for buttons (edit, complete, delete)
  buttonContainer: {
    flexDirection: 'column', // Arrange buttons vertically
    marginVertical: 2, // Vertical margin between buttons
  },
  // Edit button style
  editButton: {
    backgroundColor: '#007BFF', // Blue background
    borderRadius: 5, // Rounded corners
    padding: 10, // Padding inside the button
    marginRight: 10, // Space to the right of the button
    width: 110, // Fixed width
  },
  // Generic button style
  button: {
    marginBottom: 10, // Space below the button
  },
  // Complete button style
  completeButton: {
    backgroundColor: '#4CAF50', // Green background
    borderRadius: 5, // Rounded corners
    padding: 10, // Padding inside the button
    marginRight: 10, // Space to the right of the button
    width: 110, // Fixed width
  },
  // Style for completed (disabled) button
  completedButton: {
    backgroundColor: '#808080', // Gray background
  },
  // Button text style
  buttonText: {
    color: '#fff', // White text
    fontSize: 15, // Medium font size
  },
  // Delete button style
  deleteButton: {
    backgroundColor: '#FF9500', // Orange background
    borderRadius: 5, // Rounded corners
    padding: 10, // Padding inside the button
    width: 110, // Fixed width
  },
  // Add button style (for adding new tasks)
  addButton: {
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    backgroundColor: '#007BFF', // Blue background
    paddingVertical: 15, // Vertical padding
    borderRadius: 10, // Rounded corners
    marginTop: 20, // Space above the button
  },
  // Add button text style
  addButtonText: {
    color: '#fff', // White text
    fontSize: 18, // Large font size
    fontWeight: 'bold', // Bold text
  },
  // Modal container style
  modalContainer: {
    flex: 1, // Take up the full screen
    padding: 20, // Padding around the content
    backgroundColor: '#fff', // White background
  },
  // Input field style
  input: {
    borderWidth: 1, // Border width
    borderColor: '#ccc', // Light gray border
    padding: 10, // Padding inside the input
    marginBottom: 20, // Space below the input
    borderRadius: 5, // Rounded corners
    fontSize: 16, // Medium font size
  },
  // Input label style
  inputLabel: {
    fontSize: 16, // Medium font size
    fontWeight: 'bold', // Bold text
  },
  // Error text style
  errorText: {
    color: '#FF3B30', // Red color for errors
    fontSize: 16, // Medium font size
    marginBottom: 10, // Space below the error text
  },
  // Task deadline text style
  taskDeadline: {
    color: '#FF3B12', // Orange-red color for deadlines
  },
  // Task created-at text style
  taskCreatedAt: {
    color: '#5497FF', // Blue color for creation time
  },
})

// Export the styles object for use in other files
export default styles
