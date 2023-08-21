import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { VictoryPie } from "victory-native";
import { useQuizContext } from "../context";

const QuizResults = () => {
  const { result, quiz } = useQuizContext();

  return (
    <View>
      <Text style={styles.heading}>Quiz Results</Text>
      <View style={styles.chartBox}>
        <VictoryPie
          data={[
            {
              y: Math.round((result?.correct * 100) / quiz?.questions?.length),
            },
            {
              y: Math.round(
                ((result?.answered - result?.correct) * 100) /
                  quiz?.questions?.length
              ),
            },
            {
              y: Math.round(
                ((quiz?.questions?.length - result?.answered) * 100) /
                  quiz?.questions?.length
              ),
            },
          ]}
          width={250}
          height={250}
          innerRadius={87}
          colorScale={["#326D3C", "#DC2626", "#D1D5DB"]}
          style={{
            labels: {
              display: "none",
            },
          }}
        />
        <View
          style={{
            position: "absolute",
            width: "100%",
            top: "33%",
            alignItems: "center",
          }}
        >
          <Text style={styles.midTextTitle}>{result.grade}%</Text>
          <Text style={styles.midTextNote}>
            {result.correct}/{quiz?.questions?.length} Correct
          </Text>
        </View>

        <View
          style={{
            ...styles.row,
            width: "100%",
            justifyContent: "space-between",
            padding: 10,
            paddingBottom: 20,
          }}
        >
          <View style={styles.row}>
            <View style={{ ...styles.dot, backgroundColor: "#326D3C" }} />
            <Text>Correct</Text>
          </View>
          <View style={styles.row}>
            <View style={{ ...styles.dot, backgroundColor: "#DC2626" }} />
            <Text>Incorrect</Text>
          </View>
          <View style={styles.row}>
            <View style={{ ...styles.dot, backgroundColor: "#D1D5DB" }} />
            <Text>Unanswered</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    textAlign: "center",
    padding: 8,
  },
  chartBox: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  midTextTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    color: "#1F2937",
  },
  midTextNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#000000aa",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dot: {
    borderRadius: 10,
    width: 10,
    height: 10,
    marginLeft: 10,
    marginRight: 5,
  },
  resultBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#FCFCFF",
    padding: 5,
    width: "50%",
    margin: 5,
  },
  resultNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: "#6B7280",
    flexGrow: 0,
  },
  essayText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#1F2937",
  },
});

export default QuizResults;
