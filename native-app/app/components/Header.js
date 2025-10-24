import React from "react";
import { Header as RNEHeader, Icon } from "react-native-elements";
import { useRouter } from "expo-router";

export default function Header({ title, showCart = true }) {
  const router = useRouter();

  return (
    <RNEHeader
      centerComponent={{ text: title, style: { color: "#fff", fontSize: 20, fontWeight: "bold" } }}
      rightComponent={
        showCart ? (
          <Icon name="shopping-cart" color="#fff" onPress={() => router.push("/cart")} />
        ) : null
      }
      containerStyle={{ backgroundColor: "#6200ee" }}
    />
  );
}
