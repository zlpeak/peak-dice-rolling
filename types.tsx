/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type DiceIcons = "dice-d8-outline" | "dice-d6-outline" | "dice-d4-outline" | "octahedron";

export type RollDiceIcons =
  | "hexagon-outline"
  | "square-outline"
  | "checkbox-blank-circle-outline"
  | "triangle-outline"
  | "cards-diamond-outline"
  | "pentagon-outline"
  | "hexagon-multiple-outline"
  | "octagon-outline";

export type NavIcons = "shield-outline" | "sword" | "klingon";

export type Dice = {
  diceNum: number;
  diceName: keyof RootTabParamList;
  defaultDiceCount: number;
  iconName: DiceIcons;
  navIconName: NavIcons;
  rollIconName: RollDiceIcons;
};

export const diceList: Dice[] = [
  {
    diceNum: 8,
    diceName: "Attack",
    iconName: "octahedron",
    defaultDiceCount: 4,
    navIconName: "sword",
    rollIconName: "octagon-outline",
  },
  {
    diceNum: 8,
    diceName: "Defend",
    iconName: "octahedron",
    defaultDiceCount: 4,
    navIconName: "shield-outline",
    rollIconName: "octagon-outline",
  },
  {
    diceNum: 6,
    diceName: "AI",
    iconName: "dice-d6-outline",
    defaultDiceCount: 1,
    navIconName: "klingon",
    rollIconName: "square-outline",
  },
];

export type DiceMapIcons =
  | "alert-octagram-outline"
  | "octagram-outline"
  | "sine-wave"
  | "radioactive-circle-outline"
  | "klingon"
  | "star-four-points"
  | "star-four-points-outline"
  | "target"
  | "octagon-outline"
  | "checkbox-blank-circle-outline";

export const attackMap: { [key: number]: { icon: DiceMapIcons; name: string } } = {
  1: { icon: "star-four-points-outline", name: "Hit" },
  2: { icon: "star-four-points-outline", name: "Hit" },
  3: { icon: "star-four-points-outline", name: "Hit" },
  4: { icon: "alert-octagram-outline", name: "Crit" },
  5: { icon: "target", name: "Station" },
  6: { icon: "target", name: "Station" },
  7: { icon: "checkbox-blank-circle-outline", name: "Blank" },
  8: { icon: "checkbox-blank-circle-outline", name: "Blank" },
};

export const defendMap: { [key: number]: { icon: DiceMapIcons; name: string } } = {
  1: { icon: "sine-wave", name: "Evade" },
  2: { icon: "sine-wave", name: "Evade" },
  3: { icon: "sine-wave", name: "Evade" },
  4: { icon: "target", name: "Station" },
  5: { icon: "target", name: "Station" },
  6: { icon: "checkbox-blank-circle-outline", name: "Blank" },
  7: { icon: "checkbox-blank-circle-outline", name: "Blank" },
  8: { icon: "checkbox-blank-circle-outline", name: "Blank" },
};

export type RootTabParamList = {
  Attack: undefined;
  Defend: undefined;
  AI: undefined;
  NotFound: undefined;
};

export type RollNumberCount = {
  rollNumber: string;
  rollCount: number;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

