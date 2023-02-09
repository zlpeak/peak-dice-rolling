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

export type DisplayType = "add" | "individual";

export type DiceIcons =
  | "dice-d20-outline"
  | "dice-d12-outline"
  | "dice-d10-outline"
  | "dice-d8-outline"
  | "dice-d6-outline"
  | "dice-d4-outline"
  | "numeric-2-circle-outline"
  | "ticket-percent-outline";

export type RollDiceIcons =
  | "hexagon-outline"
  | "square-outline"
  | "checkbox-blank-circle-outline"
  | "triangle-outline"
  | "cards-diamond-outline"
  | "pentagon-outline"
  | "hexagon-multiple-outline";

export type Dice = {
  diceNum: number;
  diceName: keyof RootTabParamList;
  displayType: DisplayType;
  iconName: DiceIcons;
  rollIconName: RollDiceIcons;
};

export const diceList: Dice[] = [
  {
    diceNum: 2,
    diceName: "d2",
    displayType: "add",
    iconName: "numeric-2-circle-outline",
    rollIconName: "checkbox-blank-circle-outline",
  },
  {
    diceNum: 4,
    diceName: "d4",
    displayType: "add",
    iconName: "dice-d4-outline",
    rollIconName: "triangle-outline",
  },
  {
    diceNum: 6,
    diceName: "d6",
    displayType: "add",
    iconName: "dice-d6-outline",
    rollIconName: "square-outline",
  },
  {
    diceNum: 8,
    diceName: "d8",
    displayType: "add",
    iconName: "dice-d8-outline",
    rollIconName: "square-outline",
  },
  {
    diceNum: 10,
    diceName: "d10",
    displayType: "add",
    iconName: "dice-d10-outline",
    rollIconName: "square-outline",
  },
  {
    diceNum: 12,
    diceName: "d12",
    displayType: "add",
    iconName: "dice-d12-outline",
    rollIconName: "pentagon-outline",
  },
  {
    diceNum: 20,
    diceName: "d20",
    displayType: "individual",
    iconName: "dice-d20-outline",
    rollIconName: "hexagon-outline",
  },
  {
    diceNum: 100,
    diceName: "d100",
    displayType: "individual",
    iconName: "ticket-percent-outline",
    rollIconName: "hexagon-outline",
  },
];

export type RootTabParamList = {
  d20: undefined;
  d12: undefined;
  d10: undefined;
  d8: undefined;
  d6: undefined;
  d4: undefined;
  d2: undefined;
  d100: undefined;
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

