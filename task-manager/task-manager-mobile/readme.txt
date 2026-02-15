src/
 ├── api/
 │    ├── graphqlClient.ts
 │    ├── auth.api.ts
 │    ├── task.api.ts
 │
 ├── navigation/
 │    ├── RootNavigator.tsx
 │    ├── PublicTabs.tsx
 │    ├── PrivateTabs.tsx
 │
 ├── screens/
 │    ├── auth/
 │    │     ├── LoginScreen.tsx
 │    │     ├── RegisterScreen.tsx
 │    │
 │    ├── tasks/
 │    │     ├── TasksScreen.tsx
 │    │     ├── CreateTaskScreen.tsx
 │
 ├── hooks/
 │    ├── useAuth.ts
 │    ├── useTasks.ts
 │
 ├── context/
 │    ├── AuthContext.tsx
 │
 ├── types/
 │    ├── auth.types.ts
 │    ├── task.types.ts
 │
 ├── constants/
 │    ├── queryKeys.ts
 │
App.tsx


npx create-expo-app task-manager-mobile --template
✔ Blank (TypeScript)
cd task-manager-mobile
npm install @react-navigation/native
npm install @react-navigation/bottom-tabs
npm install @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
npm install @rneui/themed @rneui/base
npm install react-native-vector-icons
npx expo install expo-font
npm install @tanstack/react-query
npm install graphql-request graphql
npx expo install @react-native-async-storage/async-storage

