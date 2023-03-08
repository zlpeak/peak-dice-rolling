import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text } from "react-native";
import { getDBConnection, getDiceRolls, saveDiceRolls } from "../services/database";
import { Dice, RollDiceIcons, RootTabParamList } from "../types";
import { View } from "./Themed";
import ResultDice from "./ResultDice";
import uuid from "react-native-uuid";

export type RollResult = {
  date: string;
  diceType: Dice;
  diceCount: number;
  rolls: number[];
  total: number;
};

const diceSize = 80;
const innerIconSize = 50;

export const rollDice = async (diceCount: number, dice: Dice) => {
  let total = 0;
  const rolls: number[] = [];

  for (let i = 0; i < diceCount; i++) {
    const roll = Math.floor(Math.random() * dice.diceNum + 1);
    total += roll;
    rolls.push(roll);
  }

  const diceResults = {
    date: new Date().toISOString(),
    diceType: dice,
    diceCount: diceCount,
    rolls: rolls,
    total: total,
  };

  try {
    const db = await getDBConnection();
    await saveDiceRolls(db, diceResults);
  } catch (error) {
    console.error(error);
  }

  return diceResults;
};

type Props = {
  dice: Dice;
  action: keyof RootTabParamList;
  rollResults: RollResult;
  shape: RollDiceIcons;
};

export function displayDiceResults({ dice, action, rollResults, shape }: Props) {
  const isAttackAction = action === "Attack" ? true : false;

  return (
    <View style={styles.individualContainer}>
      {rollResults.rolls.map((roll) => {
        const total = roll;
        return (
          <View style={styles.individualContainer} key={uuid.v4().toString()}>
            <ResultDice
              dice={dice}
              action={action}
              rollNumber={total}
              shape={shape}
              iconSize={diceSize}
              fontSize={innerIconSize}
              iconColor={isAttackAction ? "red" : "green"}
            />
          </View>
        );
      })}
    </View>
  );
}

export function displayDiceCount(dice: Dice, diceCount: number, shape: RollDiceIcons) {
  return <View style={styles.individualDiceDisplay}>{getDice(dice, diceCount, shape)}</View>;
}

const getDice = (dice: Dice, diceCount: number, shape: RollDiceIcons) => {
  const diceArray: number[] = [];
  for (let i = 0; i < diceCount; i++) {
    diceArray.push(diceCount);
  }

  const response = diceArray.map(() => (
    <View key={uuid.v4().toString()} style={styles.individualDiceDisplay}>
      <MaterialCommunityIcons name={shape} size={diceSize} color={"teal"} />
    </View>
  ));

  return response;
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
  },
  individualContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  individualDiceDisplay: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
});
