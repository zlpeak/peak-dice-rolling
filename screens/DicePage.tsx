import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { displayDiceCount, displayDiceResults, rollDice, RollResult } from "../components/DiceRoll";
import Modifier from "../components/Modifier";

import { Text, View } from "../components/Themed";
import { getDBConnection, getDiceRolls } from "../services/database";
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

  const getTitle = (diceName: string) => {
    return `Rolling: ${diceName.toUpperCase()}${diceCount > 1 ? "s" : ""}`;
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
        {/* <View style={styles.toggle}>
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
          <Text style={styles.toggle}>Graph</Text>
        </View> */}
        {!showHistory && (
          <View style={styles.toggle}>
            <Pressable
              onPress={() => {
                setShouldAddRolls(!shouldAddRolls);
                if (shouldAddRolls) setDiceCount(maxDiceCountIndividual);
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
        {!showHistory && (
          <Pressable
            onPress={() => {
              resetState();
            }}
          >
            <MaterialCommunityIcons name="refresh" size={headerButtonSize} color={"white"} />
          </Pressable>
        )}
      </View>
      <Separator />

      {showHistory ? (
        <View style={styles.container}>
          <Text style={styles.title}>{`${dice.diceName} Graph`}</Text>
          <Separator />
        </View>
      ) : (
        <>
          {/* ANIMATION TESTING */}
          {/* <View>
            <MaterialCommunityIcons name={animationName} size={buttonSize} color={"orange"} />
          </View> */}
          <View style={styles.rollContainer}>
            {diceResults
              ? displayDiceResults({
                  dice: dice,
                  rollResults: diceResults,
                  shouldAddRolls: shouldAddRolls,
                  shape: dice.rollIconName,
                })
              : displayDiceCount(dice, diceCount, dice.rollIconName, shouldAddRolls)}
          </View>
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
              {/* TEXT DISPLAY FOR DICE COUNT */}
              {/* <Text style={styles.diceCount}>{`x${diceCount}`}</Text> */}
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

export function Separator() {
  return <View style={styles.separator} lightColor="teal" darkColor="teal" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    marginTop: "10%",
  },
  rollContainer: {
    flex: 1,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "scroll",
  },
  title: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: "bold",
  },
  result: {
    fontSize: 30,
  },
  separator: {
    marginVertical: 10,
    height: 3,
    width: "80%",
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
  },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
    fontSize: 18,
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

