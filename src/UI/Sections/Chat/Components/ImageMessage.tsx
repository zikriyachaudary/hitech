import { View, StyleSheet, Image } from "react-native";
import React from "react";

const ImageMessage = (props: any) => {
  return (
    <View pointerEvents="none" style={styles.container}>
      <Image source={{ uri: props?.content?.imageURL }} style={styles.image} />
    </View>
  );
};

export default ImageMessage;

const styles = StyleSheet.create({
  container: {
    maxWidth: "80%",
    alignItems: "flex-start",
    padding: 10,
    marginHorizontal: 12,
    marginTop: 8,
  },
  image: {
    width: 200,
    borderRadius: 16,
    backgroundColor: "#eee",
    height: 230,
  },
});
