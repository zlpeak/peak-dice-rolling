import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { attackMap, defendMap, Dice, RollDiceIcons, RootTabParamList } from "../types";
import { Text, View } from "./Themed";

type Props = {
  dice: Dice;
  action: keyof RootTabParamList;
  rollNumber: number;
  shape: RollDiceIcons;
  iconColor?: string;
  textColor?: string;
  iconSize?: number;
  fontSize?: number;
};

export default function ResultDice({
  dice,
  shape,
  action,
  rollNumber,
  iconColor = "teal",
  iconSize = 80,
  fontSize = 40,
}: Props) {
  const iconStyles = { ...styles.view, ...styles.icon };

  const mapping = action === "Attack" ? attackMap : defendMap;

  return (
    <View style={{ ...styles.view }}>
      <MaterialCommunityIcons
        style={iconStyles}
        name={shape}
        color={dice.diceName == "AI" ? "teal" : iconColor}
        size={iconSize}
      ></MaterialCommunityIcons>
      {Boolean(mapping[rollNumber] && mapping[rollNumber].icon) &&
        (dice.diceName == "AI" ? (
          <Text
            style={{
              ...styles.view,
              ...styles.iconText,
              ...{ color: "white", fontSize: fontSize },
            }}
          >
            {rollNumber}
          </Text>
        ) : (
          <MaterialCommunityIcons
            style={{ ...styles.view, ...styles.iconText }}
            name={mapping[rollNumber].icon || "circle-outline"}
            size={fontSize}
            color="white"
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    display: "flex",
    flexDirection: "column",
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
});
