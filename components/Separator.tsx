import { StyleSheet } from "react-native";
import { View } from "./Themed";

export function Separator() {
  return <View style={styles.separator} lightColor="teal" darkColor="teal" />;
}

const styles = StyleSheet.create({
  separator: {
    marginVertical: 10,
    height: 3,
    width: "80%",
  },
});
