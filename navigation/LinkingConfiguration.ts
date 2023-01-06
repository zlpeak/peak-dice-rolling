/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          d20: {
            screens: {
              D20: "one",
            },
          },
          d12: {
            screens: {
              D12: "two",
            },
          },
          d10: {
            screens: {
              D10: "three",
            },
          },
          d8: {
            screens: {
              D8: "four",
            },
          },
          d6: {
            screens: {
              D6: "five",
            },
          },
          d4: {
            screens: {
              D4: "six",
            },
          },
          d2: {
            screens: {
              D2: "seven",
            },
          },
          d100: {
            screens: {
              D20: "eight",
            },
          },
          NotFound: {
            screens: {
              NotFound: "9",
            },
          },
        },
      },
      Modal: "modal",
      NotFound: "*",
    },
  },
};

export default linking;

