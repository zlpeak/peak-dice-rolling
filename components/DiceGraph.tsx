import React from "react";
import { StyleSheet, View } from "react-native";
import { Defs, LinearGradient, Stop } from "react-native-svg";
import { BarChart, Grid, YAxis } from "react-native-svg-charts";
import { Dice, RollNumberCount } from "../types";
import * as scale from "d3-scale";
import { Text } from "./Themed";

type Props = {
  dice: Dice;
  rollNumberCount: RollNumberCount[];
  totalRolled: number;
};

export default function DiceGraph({ dice, rollNumberCount, totalRolled }: Props) {
  const data = dice.diceName == "d100" ? getBatchedData(rollNumberCount) : rollNumberCount;

  return (
    <View style={styles.graphContainer}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          height: "90%",
          width: "80%",
          paddingVertical: 5,
        }}
      >
        <YAxis
          svg={{ fill: "white", fontSize: 20 }}
          data={data}
          yAccessor={({ index }) => index}
          scale={scale.scaleBand}
          contentInset={{ top: 10, bottom: 10 }}
          spacingInner={0.3}
          formatLabel={(_, index) => data[index].rollNumber}
        />
        <BarChart
          style={{ flex: 1, marginLeft: 10 }}
          data={data}
          horizontal={true}
          yAccessor={({ item }) => item.rollCount}
          svg={{ fill: "url(#gradient)" }}
          spacingInner={0.2}
          gridMin={0}
        >
          <Grid direction={Grid.Direction.VERTICAL} svg={{ stroke: "gray", strokeOpacity: 150 }} />
          <Gradient />
        </BarChart>
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.total}>{`Total: ${totalRolled}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  graphContainer: {
    alignItems: "center",
  },
  totalContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  total: {
    fontSize: 30,
    color: "teal",
  },
});

export const Gradient = () => (
  <Defs>
    <LinearGradient id={"gradient"} x1={"0%"} y1={"0%"} x2={"0%"} y2={"100%"}>
      <Stop offset={"0%"} stopColor={"rgb(0, 128, 128)"} stopOpacity={0.8} />
      <Stop offset={"100%"} stopColor={"rgb(0, 128, 128)"} stopOpacity={0.2} />
    </LinearGradient>
  </Defs>
);

export const getBatchedData = (data: RollNumberCount[]) => {
  const batchSize = 10;

  let totalRollCount: number = 0;
  let minRange = 1;
  let maxRange = 10;

  let response: RollNumberCount[] = [];

  data.forEach((d) => {
    if (parseInt(d.rollNumber) % 10 === 0) {
      response.push({ rollCount: d.rollCount, rollNumber: `${minRange}-${maxRange}` });
      minRange += batchSize;
      maxRange += batchSize;
      totalRollCount = 0;
    } else {
      totalRollCount += d.rollCount;
    }
  });

  return response;
};
