import { Text, View } from "./Themed";
import { Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RollResult } from "./DiceRoll";

type Props = {
  modifier: number;
  setModifier: (modifier: number) => {};
  clearDiceResults: (val: undefined) => {};
};

export default function Modifier({ modifier, setModifier, clearDiceResults }: Props) {
  const modifierButtonSize = 30;

  const getModifierTitle = (modifier: number) => {
    return `Mod: ${modifier}`;
  };

  return (
    <View style={styles.modifierContainer}>
      <Pressable
        onPress={() => {
          clearDiceResults(undefined);
          setModifier(modifier - 1);
        }}
      >
        <MaterialCommunityIcons
          name="minus-box-outline"
          size={modifierButtonSize}
          color={"maroon"}
        />
      </Pressable>
      <Text style={styles.title}>{getModifierTitle(modifier)}</Text>
      <Pressable
        onPress={() => {
          clearDiceResults(undefined);
          setModifier(modifier + 1);
        }}
      >
        <MaterialCommunityIcons
          name="plus-circle-outline"
          size={modifierButtonSize}
          color={"green"}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    marginHorizontal: "5%",
    color: "fuchsia",
  },
  modifierContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    justifyContent: "center",
    marginBottom: 15,
  },
});
