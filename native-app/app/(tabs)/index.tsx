// Import the useState hook from React for managing state in functional components
import { useState } from 'react'
// Import core React Native components for building the UI
import {
  View, // Container component for layout
  Button, // Button component for user actions
  TextInput, // Input field for text entry
  Text, // Component for displaying text
  FlatList, // Efficient list view for rendering posts
  StyleSheet, // Utility for creating component styles
  TouchableOpacity, // Wrapper for making views touchable
} from 'react-native'

// Define initial blog post data as an array of objects
const data = [
  {
    id: 1, // Unique identifier for the post
    title: 'React', // Title of the post
    content: `ReactJS is a declarative, efficient, and flexible JavaScript library for building user interfaces.`, // Content of the post
  },
  {
    id: 2, // Unique identifier for the post
    title: 'React Native', // Title of the post
    content: `It is a framework developed by Facebook for creating native-style apps for iOS & Android.`, // Content of the post
  },
  // Add more blog posts here if needed
]

const App = () => {
  // State for the currently selected post (for viewing details)
  const [selectedPost, setSelectedPost] = useState(null)
  // State for the new post's title input
  const [newPostTitle, setNewPostTitle] = useState('')
  // State for the new post's content input
  const [newPostContent, setNewPostContent] = useState('')
  // State for the list of posts
  const [posts, setPosts] = useState(data)
  // State for error messages
  const [error, setError] = useState('')

  // State for the post being edited (null if not editing)
  const [editingPost, setEditingPost] = useState(null)
  // State for the editing post's title input
  const [editingTitle, setEditingTitle] = useState('')
  // State for the editing post's content input
  const [editingContent, setEditingContent] = useState('')

  // Function to add a new post to the list
  const addNewPost = () => {
    // Validate that title and content are not empty
    if (newPostTitle.trim() === '' || newPostContent.trim() === '') {
      setError('Title and content cannot be empty')
      return
    } else {
      setError('')
    }

    // Generate a unique id for the new post
    const id = posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1
    // Create the new post object
    const newPost = {
      id,
      title: newPostTitle,
      content: newPostContent,
    }
    // Add the new post to the posts array
    setPosts([...posts, newPost])
    // Clear the input fields
    setNewPostTitle('')
    setNewPostContent('')
  }

  // Function to delete a post by its id
  const deletePost = (postId) => {
    // Filter out the post with the given id
    const updatedPosts = posts.filter((post) => post.id !== postId)
    // Update the posts state
    setPosts(updatedPosts)
  }

  // Function to update a post's title and content
  const updatePost = (postId, updatedTitle, updatedContent) => {
    // Map through posts and update the matching post
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, title: updatedTitle, content: updatedContent }
          : post
      )
    )
  }

  // Function to start editing a post
  const handleEdit = (post) => {
    setEditingPost(post) // Set the post being edited
    setEditingTitle(post.title) // Set the editing title input
    setEditingContent(post.content) // Set the editing content input
    setError('') // Clear any error
  }

  // Function to save the edited post
  const handleSaveEdit = () => {
    // Validate that title and content are not empty
    if (editingTitle.trim() === '' || editingContent.trim() === '') {
      setError('Title and content cannot be empty')
      return
    }
    // Update the post in the posts array
    updatePost(editingPost.id, editingTitle, editingContent)
    // Reset editing states
    setEditingPost(null)
    setEditingTitle('')
    setEditingContent('')
    setError('')
  }

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingPost(null) // Clear editing post
    setEditingTitle('') // Clear editing title
    setEditingContent('') // Clear editing content
    setError('') // Clear error
  }

  // Function to render each post item in the FlatList
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedPost(item)} // Show post details on press
    >
      <View style={styles.postContainer}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <View style={{ width: 280 }}>
          <Text style={styles.postContent}>{item.content}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-end',
          }}
        >
          {/* Edit button */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.editButtonText}>Edit .</Text>
          </TouchableOpacity>
          {/* Delete button */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deletePost(item.id)}
          >
            <Text style={styles.deleteButtonText}>Delete .</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )

  // Main render
  return (
    <View style={styles.container}>
      {/* App heading */}
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Blog App</Text>
      </View>
      {/* List of posts (only if not viewing or editing) */}
      {!selectedPost && !editingPost ? (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : null}
      {/* Selected post details view */}
      {selectedPost && !editingPost && (
        <View style={styles.selectedPostContainer}>
          <Text style={styles.selectedPostTitle}>{selectedPost.title}</Text>
          <Text style={styles.selectedPostContent}>{selectedPost.content}</Text>
          {/* Back button to return to list */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedPost(null)}
          >
            <Text style={styles.backButtonText}>Back .</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Edit post form */}
      {editingPost && (
        <View style={styles.formContainer}>
          <Text style={styles.heading}>Edit Post</Text>
          {/* Error message */}
          {error !== '' && <Text style={styles.errorText}>{error}</Text>}
          {/* Title input */}
          <TextInput
            style={styles.input}
            placeholder="Enter Title"
            value={editingTitle}
            onChangeText={setEditingTitle}
          />
          {/* Content input */}
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter Content"
            value={editingContent}
            onChangeText={setEditingContent}
            multiline={true}
          />
          {/* Save and Cancel buttons */}
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Button title="Save" onPress={handleSaveEdit} />
            <Button title="Cancel" color="grey" onPress={handleCancelEdit} />
          </View>
        </View>
      )}
      {/* Add new post form (only if not viewing or editing) */}
      {selectedPost === null && editingPost === null && (
        <View style={styles.formContainer}>
          {/* Error message */}
          {error !== '' && <Text style={styles.errorText}>{error}</Text>}
          {/* Title input */}
          <TextInput
            style={styles.input}
            placeholder="Enter Title"
            value={newPostTitle}
            onChangeText={setNewPostTitle}
          />
          {/* Content input */}
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter Content"
            value={newPostContent}
            onChangeText={setNewPostContent}
            multiline={true}
          />
          {/* Add post button */}
          <Button title="Add New Post" onPress={() => addNewPost()} />
        </View>
      )}
    </View>
  )
}

// Define styles for the components using StyleSheet.create
const styles = StyleSheet.create({
  // Main container style for the app
  container: {
    flex: 1, // Take up the full screen
    paddingTop: 40, // Space from the top
    paddingHorizontal: 20, // Space on left and right
  },
  // Container for the heading section
  headingContainer: {
    backgroundColor: '#3498db', // Blue background
    padding: 10, // Padding inside the container
    borderRadius: 10, // Rounded corners
    marginBottom: 20, // Space below the heading
  },
  // Style for the main heading text
  heading: {
    fontSize: 24, // Large font size
    fontWeight: 'bold', // Bold text
    textAlign: 'center', // Centered text
    color: 'white', // White text color
  },
  // Container for each blog post
  postContainer: {
    borderWidth: 1, // Border thickness
    borderColor: '#ccc', // Light gray border color
    padding: 20, // Padding inside the post
    marginBottom: 20, // Space below each post
    borderRadius: 10, // Rounded corners
  },
  // Style for the post title
  postTitle: {
    fontSize: 18, // Medium-large font size
    fontWeight: 'bold', // Bold text
    marginBottom: 10, // Space below the title
  },
  // Style for the post content text
  postContent: {
    fontSize: 14, // Normal font size
    textAlign: 'left', // Left-aligned text
  },
  // Style for the delete/edit button container
  deleteButton: {
    alignSelf: 'flex-end', // Align to the right
    marginTop: 10, // Space above the button
  },
  // Style for the edit button text
  editButtonText: {
    color: 'green', // Green text color
  },
  // Style for the delete button text
  deleteButtonText: {
    color: 'red', // Red text color
  },
  // Container for the selected post view
  selectedPostContainer: {
    padding: 20, // Padding inside the container
    marginBottom: 20, // Space below the container
    borderWidth: 1, // Border thickness
    borderColor: '#ccc', // Light gray border color
    borderRadius: 10, // Rounded corners
  },
  // Style for the selected post's title
  selectedPostTitle: {
    fontSize: 24, // Large font size
    fontWeight: 'bold', // Bold text
    marginBottom: 10, // Space below the title
  },
  // Style for the selected post's content
  selectedPostContent: {
    fontSize: 16, // Slightly larger font size
    textAlign: 'justify', // Justified text alignment
  },
  // Style for the back button in the selected post view
  backButton: {
    alignSelf: 'flex-end', // Align to the right
    marginTop: 20, // Space above the button
  },
  // Style for the back button text
  backButtonText: {
    color: 'blue', // Blue text color
    fontSize: 16, // Medium font size
  },
  // Container for the form (add/edit post)
  formContainer: {
    padding: 20, // Padding inside the form
    borderWidth: 1, // Border thickness
    borderColor: '#ccc', // Light gray border color
    borderRadius: 10, // Rounded corners
    marginBottom: 20, // Space below the form
  },
  // Style for text input fields
  input: {
    borderWidth: 1, // Border thickness
    borderColor: '#ccc', // Light gray border color
    padding: 10, // Padding inside the input
    marginBottom: 10, // Space below the input
    borderRadius: 5, // Slightly rounded corners
  },
  // Additional style for multi-line text area
  textArea: {
    height: 100, // Set height for text area
  },
  // Style for error messages
  errorText: {
    color: 'red', // Red text color
    textAlign: 'center', // Centered text
    marginBottom: 10, // Space below the error message
  },
})

export default App
