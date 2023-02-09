import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import DiceHistory from "../components/DiceHistory";
import { displayDiceCount, displayDiceResults, rollDice, RollResult } from "../components/DiceRoll";
import Modifier from "../components/Modifier";
import { Separator } from "../components/Separator";
import { Text, View } from "../components/Themed";
import { Dice } from "../types";

type Props = {
  dice: Dice;
};

type AnimationName =
  | "hexagon-outline"
  | "hexagon-slice-1"
  | "hexagon-slice-2"
  | "hexagon-slice-3"
  | "hexagon-slice-4"
  | "hexagon-slice-5"
  | "hexagon-slice-6";

export default function DicePage({ dice }: Props) {
  const [diceCount, setDiceCount] = useState<number>(1);
  const [modifier, setModifier] = useState<number>(0);
  const [diceResults, setDiceResults] = useState<RollResult | undefined>(undefined);

  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showGraph, setShowGraph] = useState<boolean>(true);
  const [shouldAddRolls, setShouldAddRolls] = useState<boolean>(
    // true
    Boolean(dice.displayType === "add")
  );

  const [animationName, setAnimationName] = useState<AnimationName>("hexagon-outline");

  const buttonSize = 60;
  const headerButtonSize = 30;

  const minDiceCount = 1;
  const maxDiceCountIndividual = 9;
  const maxDiceCountAdded = 25;

  const resetState = () => {
    setDiceCount(1);
    setDiceResults(undefined);
    setModifier(0);
    setShouldAddRolls(Boolean(dice.displayType === "add"));
  };

  const determineMax = () => {
    return (
      (!shouldAddRolls && diceCount === maxDiceCountIndividual) || diceCount === maxDiceCountAdded
    );
  };

  const animateGo = (y: number) => {
    const roll = y;

    if (roll === 1) {
      setAnimationName("hexagon-slice-1");
    } else if (roll === 2) {
      setAnimationName("hexagon-slice-2");
    } else if (roll === 3) {
      setAnimationName("hexagon-slice-3");
    } else if (roll === 4) {
      setAnimationName("hexagon-slice-4");
    } else if (roll === 5) {
      setAnimationName("hexagon-slice-5");
    } else if (roll === 6) {
      setAnimationName("hexagon-slice-6");
    } else {
      setAnimationName("hexagon-outline");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.toggle}>
          <Text style={styles.toggle}>Roll</Text>
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
          <Text style={styles.toggle}>History</Text>
        </View>
        {!showHistory && (
          <View style={styles.toggle}>
            <Pressable
              onPress={() => {
                setShouldAddRolls(!shouldAddRolls);
                if (shouldAddRolls && diceCount > maxDiceCountIndividual)
                  setDiceCount(maxDiceCountIndividual);
              }}
            >
              <MaterialCommunityIcons
                name={shouldAddRolls ? "checkbox-outline" : "checkbox-blank-outline"}
                size={headerButtonSize}
                color={"white"}
              />
            </Pressable>
            <Text style={styles.toggle}>Add Dice</Text>
          </View>
        )}
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
          {
            <DiceHistory
              dice={dice}
              showGraph={showGraph}
              setShowGraph={async (showGraph: boolean) => setShowGraph(showGraph)}
            />
          }
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.rollContainer}>
            {diceResults
              ? displayDiceResults({
                  dice: dice,
                  rollResults: diceResults,
                  shouldAddRolls: shouldAddRolls,
                  shape: dice.rollIconName,
                })
              : displayDiceCount(dice, diceCount, dice.rollIconName, shouldAddRolls)}
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
                color={diceCount === minDiceCount ? "gray" : "maroon"}
              />
            </Pressable>
            <View style={styles.diceCountDisplay}>
              <Pressable
                onPress={async () => {
                  setDiceResults(await rollDice(diceCount, dice, modifier));
                }}
              >
                <MaterialCommunityIcons
                  name={dice.iconName}
                  size={120}
                  color={"teal"}
                  style={styles.buttons}
                />
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
          <Modifier
            modifier={modifier}
            setModifier={async (mod) => setModifier(mod)}
            clearDiceResults={async (val) => {
              setDiceResults(val);
            }}
          />
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
    flex: 1,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    alignItems: "flex-end",
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

