import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { VictoryPie } from "victory-native";
import { useQuizContext } from "../context";
import { fonts, scaleDimension, theme } from "../utils";

const QuizResults = () => {
  const { result, quiz } = useQuizContext();

  return (
    <View>
      <Text style={styles.heading}>Quiz Results</Text>
      <View style={styles.chartBox}>
        <VictoryPie
          data={[
            {
              y: Math.round(
                ((result?.correct || 0) * 100) / quiz?.questions?.length
              ),
            },
            {
              y: Math.round(
                (((result?.answered || 0) - (result?.correct || 0)) * 100) /
                  quiz?.questions?.length
              ),
            },
            {
              y: Math.round(
                ((quiz?.questions?.length - (result?.answered || 0)) * 100) /
                  quiz?.questions?.length
              ),
            },
          ]}
          width={scaleDimension(275, true)}
          height={scaleDimension(275, true)}
          innerRadius={87}
          colorScale={[
            theme.border["border-success"],
            theme.border["border-error"],
            theme.border["border-200"],
          ]}
          style={{
            labels: {
              display: "none",
            },
          }}
        />
        <View style={styles.grade}>
          <Text style={styles.midTextTitle}>{result?.grade}%</Text>
          <Text style={styles.midTextNote}>
            {result?.correct}/{quiz?.questions?.length} Correct
          </Text>
        </View>

        <View style={styles.legend}>
          <View style={styles.row}>
            <View
              style={[
                styles.dot,
                { backgroundColor: theme.border["border-success"] },
              ]}
            />
            <Text>Correct</Text>
          </View>
          <View style={styles.row}>
            <View
              style={[
                styles.dot,
                { backgroundColor: theme.border["border-error"] },
              ]}
            />
            <Text>Incorrect</Text>
          </View>
          <View style={styles.row}>
            <View
              style={[
                styles.dot,
                { backgroundColor: theme.border["border-200"] },
              ]}
            />
            <Text>Unanswered</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontFamily: fonts.poppins.bold,
    fontSize: scaleDimension(24, true),
    textAlign: "center",
    padding: scaleDimension(8, true),
  },
  chartBox: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scaleDimension(10, true),
    borderColor: theme.border["border-200"],
    borderWidth: 1,
  },
  midTextTitle: {
    fontFamily: fonts.poppins.bold,
    fontSize: scaleDimension(24, true),
    color: theme.text["text-primary"],
  },
  midTextNote: {
    fontFamily: fonts.inter.regular,
    fontSize: scaleDimension(16, true),
    color: theme.text["text-secondary"],
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dot: {
    borderRadius: scaleDimension(10, true),
    width: scaleDimension(10, true),
    height: scaleDimension(10, true),
    marginLeft: scaleDimension(10, true),
    marginRight: scaleDimension(5, true),
  },
  grade: {
    position: "absolute",
    width: "100%",
    top: "33%",
    alignItems: "center",
  },
  legend: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: scaleDimension(10, true),
    paddingBottom: scaleDimension(20, true),
  },
});

export default QuizResults;
