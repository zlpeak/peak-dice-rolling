import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import DiceHistory from "../components/DiceHistory";
import { displayDiceCount, displayDiceResults, rollDice, RollResult } from "../components/DiceRoll";
import { Separator } from "../components/Separator";
import { Text, View } from "../components/Themed";
import { Dice } from "../types";
import BadgeEmblem from "../components/BadgeEmblem";

type Props = {
  dice: Dice;
  showHistory: boolean;
  setShowHistory: (showHistory: boolean) => {};
  refresh: boolean;
  setRefresh: () => {};
};

export default function DicePage({
  dice,
  showHistory,
  setShowHistory,
  refresh,
  setRefresh,
}: Props) {
  const [diceCount, setDiceCount] = useState<number>(dice.defaultDiceCount);
  const [diceResults, setDiceResults] = useState<RollResult | undefined>(undefined);

  const [showGraph, setShowGraph] = useState<boolean>(true);

  const buttonSize = 60;
  const submitButtonSize = 120;
  const headerButtonSize = 30;

  const minDiceCount = 1;
  const maxDiceCountIndividual = 20;

  const resetState = () => {
    setRefresh();
  };

  const determineMax = (): boolean => {
    return diceCount === maxDiceCountIndividual;
  };

  useEffect(() => {
    setDiceCount(dice.defaultDiceCount);
    setDiceResults(undefined);
    setShowGraph(true);
  }, [refresh]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.toggle}>
          <Text style={styles.toggle}>Roll Dice</Text>
          <Pressable
            onPress={() => {
              setShowHistory(!showHistory);
            }}
          >
            <MaterialCommunityIcons
              name={showHistory ? "toggle-switch-outline" : "toggle-switch-off-outline"}
              size={headerButtonSize}
              color={"white"}
            />
          </Pressable>
          <Text style={styles.toggle}>See Stats</Text>
        </View>
        {!showHistory ? (
          <Pressable
            onPress={() => {
              resetState();
            }}
          >
            <MaterialCommunityIcons name="refresh" size={headerButtonSize} color={"white"} />
          </Pressable>
        ) : (
          <View style={styles.toggle}>
            <Text style={styles.toggle}>List</Text>
            <Pressable
              onPress={() => {
                setShowGraph(!showGraph);
              }}
            >
              <MaterialCommunityIcons
                name={showGraph ? "toggle-switch-outline" : "toggle-switch-off-outline"}
                size={headerButtonSize}
                color={"white"}
              />
            </Pressable>
            <Text style={styles.toggle}>Graph</Text>
          </View>
        )}
      </View>
      <Separator />

      {showHistory ? (
        <View style={styles.container}>
          {<DiceHistory dice={dice} showGraph={showGraph} action={dice.diceName} />}
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.rollContainer}>
            {diceResults
              ? displayDiceResults({
                  dice: dice,
                  action: dice.diceName,
                  rollResults: diceResults,
                  shape: dice.rollIconName,
                })
              : displayDiceCount(dice, diceCount, dice.rollIconName)}
          </ScrollView>
          <View style={styles.mainButtonContainer}>
            <Pressable
              disabled={diceCount === minDiceCount}
              onPress={() => {
                setDiceResults(undefined);
                setDiceCount(diceCount - 1);
              }}
            >
              <MaterialCommunityIcons
                name="minus-box-outline"
                size={buttonSize}
                color={diceCount === minDiceCount ? "gray" : "red"}
              />
            </Pressable>
            <View style={styles.diceCountDisplay}>
              <Pressable
                onPress={async () => {
                  setDiceResults(await rollDice(diceCount, dice));
                }}
              >
                {dice.diceName == "AI" ? (
                  <MaterialCommunityIcons
                    name={dice.navIconName}
                    size={submitButtonSize}
                    color={"teal"}
                    style={styles.buttons}
                  />
                ) : (
                  <BadgeEmblem
                    fill="teal"
                    width={submitButtonSize}
                    height={submitButtonSize}
                    style={styles.buttons}
                  />
                )}
              </Pressable>
            </View>
            <Pressable
              disabled={determineMax()}
              onPress={() => {
                setDiceResults(undefined);
                setDiceCount(diceCount + 1);
              }}
            >
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={buttonSize}
                color={determineMax() ? "gray" : "green"}
              />
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
  rollContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "center",
  },
  title: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: "bold",
  },
  result: {
    fontSize: 30,
  },
  mainButtonContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  header: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "10%",
  },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    marginHorizontal: 3,
    fontSize: 15,
  },
  buttons: {
    display: "flex",
  },
  diceCount: {
    fontSize: 30,
  },
  diceCountDisplay: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});

