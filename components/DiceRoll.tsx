import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text } from "react-native";
import { getDBConnection, getDiceRolls, saveDiceRolls } from "../services/database";
import { Dice, RollDiceIcons } from "../types";
import { View } from "./Themed";
import { Separator } from "../screens/DicePage";
import ResultDice from "./ResultDice";
import uuid from "react-native-uuid";

export type RollResult = {
  date: string;
  diceType: Dice;
  diceCount: number;
  rolls: number[];
  modifier: number;
  total: number;
};

export const rollDice = async (diceCount: number, dice: Dice, modifier: number) => {
  let total = 0;
  const rolls: number[] = [];

  for (let i = 0; i < diceCount; i++) {
    const roll = Math.floor(Math.random() * dice.diceNum + 1);
    total += roll;
    rolls.push(roll);
  }

  total += modifier;

  const diceResults = {
    date: new Date().toISOString(),
    diceType: dice,
    diceCount: diceCount,
    rolls: rolls,
    modifier: modifier,
    total: total,
  };

  // try {
  //   const db = await getDBConnection();
  //   await saveDiceRolls(db, diceResults);
  // } catch (error) {
  //   console.error(error);
  // }

  return diceResults;
};

type Props = {
  dice: Dice;
  rollResults: RollResult;
  shouldAddRolls: boolean;
  shape: RollDiceIcons;
};

export function displayDiceResults({ dice, rollResults, shouldAddRolls, shape }: Props) {
  return (
    <>
      {shouldAddRolls ? (
        <View style={styles.container}>
          {rollResults.rolls.map((roll) => {
            return (
              <ResultDice
                key={uuid.v4().toString()}
                dice={dice}
                rollNumber={roll}
                shape={shape}
                iconColor={"teal"}
                textColor={"aqua"}
              />
            );
          })}
          <Text style={{ ...styles.result, ...styles.modAdded }}>
            {`${rollResults.modifier < 0 ? "" : " +"}${rollResults.modifier}`}
          </Text>
          <Separator />
          <ResultDice
            dice={dice}
            rollNumber={rollResults.total}
            shape={shape}
            iconColor={"chocolate"}
            textColor={"orange"}
            iconSize={90}
            fontSize={30}
          />
        </View>
      ) : (
        rollResults.rolls.map((roll) => {
          const total = roll + rollResults.modifier;
          return (
            <View style={styles.individualContainer} key={uuid.v4().toString()}>
              <ResultDice
                dice={dice}
                rollNumber={roll}
                shape={shape}
                iconColor={"teal"}
                textColor={"aqua"}
              />
              <Text style={{ ...styles.result, ...styles.modIndividual }}>{`${
                rollResults.modifier < 0 ? "" : "+"
              }${rollResults.modifier} `}</Text>
              <Text style={styles.result}>{"="}</Text>
              <ResultDice
                dice={dice}
                rollNumber={total}
                shape={shape}
                iconColor={"chocolate"}
                textColor={"orange"}
              />
            </View>
          );
        })
      )}
    </>
  );
}

export function displayDiceCount(
  dice: Dice,
  diceCount: number,
  shape: RollDiceIcons,
  addRolls: boolean
) {
  let style = {};
  if (addRolls) {
    style = { ...style, ...styles.addedDiceDisplay };
  } else {
    style = styles.individualDiceDisplay;
  }

  return (
    <>
      <View style={style}>{getDice(dice, diceCount, shape, addRolls)}</View>
    </>
  );
}

const getDice = (dice: Dice, diceCount: number, shape: RollDiceIcons, addRolls: boolean) => {
  const diceArray: number[] = [];
  let response;

  for (let i = 0; i < diceCount; i++) {
    diceArray.push(diceCount);
  }

  if (addRolls) {
    response = diceArray.map(() => (
      <View
        key={uuid.v4().toString()}
        style={dice.diceName === "d10" || dice.diceName === "d8" ? styles.rotate : {}}
      >
        <MaterialCommunityIcons name={shape} size={50} color={"teal"} />
      </View>
    ));
  } else {
    response = diceArray.map(() => (
      <View
        key={uuid.v4().toString()}
        style={dice.diceName === "d10" || dice.diceName === "d8" ? styles.rotate : {}}
      >
        <MaterialCommunityIcons name={shape} size={50} color={"teal"} />
      </View>
    ));
  }

  return response;
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    width: "70%",
  },
  individualContainer: {
    display: "flex",
    flexDirection: "row",
    width: "45%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  result: {
    display: "flex",
    fontSize: 28,
    color: "white",
    justifyContent: "flex-end",
    marginVertical: 5,
  },
  modAdded: { color: "fuchsia", width: "100%", justifyContent: "center" },
  modIndividual: { color: "fuchsia" },
  tot: { color: "orange", fontSize: 30, fontWeight: "bold" },
  resultIcon: {
    display: "flex",
    justifyContent: "flex-end",
  },
  total: {
    fontSize: 40,
    color: "orange",
    fontWeight: "bold",
  },
  rotate: {
    transform: [{ rotate: "45deg" }, { scale: 0.8 }],
  },
  individualDiceDisplay: {
    display: "flex",
    width: "70%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addedDiceDisplay: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    width: "70%",
  },
});
