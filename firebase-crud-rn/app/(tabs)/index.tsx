import { View, Button } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../src/core/firebase/firebaseConfig";

export default function Home() {
  const testFirestore = async () => {
    await addDoc(collection(db, "test"), {
      name: "Working",
      createdAt: new Date(),
    });
    console.log("Firestore working");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Test Firestore" onPress={testFirestore} />
    </View>
  );
}
