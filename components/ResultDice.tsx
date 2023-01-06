import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Dice, RollDiceIcons } from "../types";
import { Text, View } from "./Themed";

type Props = {
  dice: Dice;
  rollNumber: number;
  shape: RollDiceIcons;
  iconColor?: string;
  textColor?: string;
  iconSize?: number;
  fontSize?: number;
};

export default function ResultDice({
  dice,
  rollNumber,
  shape,
  iconColor = "teal",
  textColor = "aqua",
  iconSize = 50,
  fontSize = 20,
}: Props) {
  let iconStyles = { ...styles.view, ...styles.icon };
  if (dice.diceName === "d10" || dice.diceName === "d8")
    iconStyles = { ...iconStyles, ...styles.rotate };

  return (
    <View style={{ ...styles.view }}>
      <MaterialCommunityIcons
        style={iconStyles}
        name={shape}
        color={iconColor}
        size={iconSize}
      ></MaterialCommunityIcons>
      <Text
        style={{ ...styles.view, ...styles.iconText, ...{ color: textColor, fontSize: fontSize } }}
      >
        {rollNumber}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  iconText: {
    position: "absolute",
    zIndex: 1,
  },
  rotate: {
    transform: [{ rotate: "45deg" }, { scale: 0.8 }],
  },
});
