import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { getDBConnection, getDiceRolls } from "../services/database";
import { attackMap, defendMap, Dice, RollNumberCount, RootTabParamList } from "../types";
import { RollResult } from "./DiceRoll";
import { Text, View } from "./Themed";
import uuid from "react-native-uuid";
import DiceGraph from "./DiceGraph";

type Props = {
  dice: Dice;
  showGraph: boolean;
  action: keyof RootTabParamList;
};

export default function DiceHistory({ dice, showGraph, action }: Props) {
  const [diceRollHistory, setDiceRollHistory] = useState<RollResult[]>([]);
  const [diceRolls, setDiceRolls] = useState<RollNumberCount[]>([]);
  const [totalRolled, setTotalRolled] = useState<number>(0);
  const getRolls = async () => {
    getDBConnection().then(async (db) => {
      setDiceRollHistory(await getDiceRolls(db, dice.diceName.toString()));
    });
  };

  useMemo(async () => {
    await getRolls();
  }, []);

  React.useEffect(() => {
    const mapping = action === "Attack" ? attackMap : defendMap;
    const isAI = action === "AI" ? true : false;

    let rollCountArray: RollNumberCount[] = [];
    let i = 1;
    while (i <= dice.diceNum) {
      rollCountArray.push({ rollNumber: i.toString(), rollCount: 0 });
      i++;
    }

    diceRollHistory
      .filter((roll) => roll.diceType.diceName === dice.diceName)
      .map((roll) =>
        roll.rolls.map((roll) => {
          return { roll: roll, group: isAI ? roll : mapping[roll] };
        })
      )
      .flat()
      .forEach((roll) => {
        rollCountArray[roll.roll - 1].rollCount += 1 || 0;
      });

    console.log("diceRollHistory: ", diceRollHistory);

    setDiceRolls(rollCountArray);
    setTotalRolled(rollCountArray.reduce((sum, roll) => sum + roll.rollCount, 0));
  }, [diceRollHistory, dice]);

  return showGraph ? (
    <DiceGraph dice={dice} action={action} rollNumberCount={diceRolls} totalRolled={totalRolled} />
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      {diceRolls.map((roll: RollNumberCount) => (
        <View style={styles.row} key={uuid.v4().toString()}>
          <Text style={{ ...styles.text }}>{`Rolled`}</Text>
          <Text style={{ ...styles.text, ...styles.result }}>{`${roll.rollNumber}`}</Text>
          <Text style={{ ...styles.text, ...styles.dash }}>{`------------`}</Text>
          <Text style={{ ...styles.text, ...styles.result }}>{`${roll.rollCount}`}</Text>
          <Text style={{ ...styles.text }}>{`Times`}</Text>
        </View>
      ))}
      <View style={{ ...styles.row, ...styles.totalRow }}>
        <Text style={{ ...styles.text, ...styles.totalText }}>{`Total: `}</Text>
        <Text style={{ ...styles.text, ...styles.total }}>{`${totalRolled}`}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    width: "80%",
    justifyContent: "space-around",
  },
  totalRow: {
    justifyContent: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  result: {
    fontSize: 22,
    color: "teal",
  },
  dash: {
    color: "gray",
  },
  totalText: {
    fontSize: 30,
  },
  total: {
    fontSize: 30,
    color: "teal",
  },
});
