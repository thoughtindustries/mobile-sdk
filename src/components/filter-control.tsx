import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { ListFilter } from "lucide-react-native";
import Checkbox from "./checkbox";
import { FilterContext } from "../context";
import { GlobalTypes } from "../graphql";
import { fonts, scaleDimension, theme } from "../utils";

const FilterControl = () => {
  const [show, setShow] = useState<boolean>(false);
  const { filters: contextFilters, setFilters: setContextFilters } =
    useContext(FilterContext);

  const CourseFilter = () => {
    const [filters, setFilters] = useState({
      sortDir: contextFilters.sortDir,
      duration: [
        {
          title: "1 Hour",
          selected: contextFilters?.values?.includes("1 Hour"),
        },
        {
          title: "3 - 8 Hours",
          selected: contextFilters?.values?.includes("3 - 8 Hours"),
        },
        {
          title: "9 - 16 Hours",
          selected: contextFilters?.values?.includes("9 - 16 Hours"),
        },
        {
          title: "A couple of days",
          selected: contextFilters?.values?.includes("A couple of days"),
        },
      ],
      difficulty: [
        {
          title: "Beginner",
          selected: contextFilters?.values?.includes("Beginner"),
        },
        {
          title: "Intermediate",
          selected: contextFilters?.values?.includes("Intermediate"),
        },
        {
          title: "Advanced",
          selected: contextFilters?.values?.includes("Advanced"),
        },
      ],
      myLearningsEvent: [
        { title: "All", selected: false },
        { title: "Offline", selected: false },
      ],
    });

    const clearFilter = () => {
      setContextFilters({
        ...contextFilters,
        sortDir: GlobalTypes.SortDirection.Asc,
        values: [],
        labels: [],
      });
      setShow(false);
    };

    const applyFilter = () => {
      // Durations Filter
      let durations: string[] = [];
      let durationLabel = "";
      filters.duration.forEach((item) => {
        if (item.selected) {
          durations.push(item.title);
        }
      });

      if (durations.length > 0) {
        durationLabel = "Duration";
      }

      // Difficulty Filter
      let difficulty: string[] = [];
      let difficultyLabel = "";
      filters.difficulty.forEach((item) => {
        if (item.selected) {
          difficulty.push(item.title);
        }
      });

      if (difficulty.length > 0) {
        difficultyLabel = "Level of Difficulty";
      }

      if (difficulty.length > 0) {
        difficultyLabel = "Level of Difficulty";
      }

      setContextFilters({
        ...contextFilters,
        sortDir: filters.sortDir,
        values: [...new Set(durations), ...new Set(difficulty)],
        labels: [durationLabel, difficultyLabel],
      });
      setShow(false);
    };

    return (
      <Modal transparent={false} visible={show}>
        <View style={styles.filterContainer}>
          <View style={styles.filterBox}>
            <Text style={styles.filterTitle}>Sort By</Text>
            <View style={styles.row}>
              <Text
                style={
                  filters.sortDir === GlobalTypes.SortDirection.Asc
                    ? styles.sortDirSelected
                    : styles.sortDir
                }
                onPress={() =>
                  setFilters({
                    ...filters,
                    sortDir: GlobalTypes.SortDirection.Asc,
                  })
                }
              >
                A-Z
              </Text>
              <Text
                style={
                  filters.sortDir === GlobalTypes.SortDirection.Desc
                    ? styles.sortDirSelected
                    : styles.sortDir
                }
                onPress={() =>
                  setFilters({
                    ...filters,
                    sortDir: GlobalTypes.SortDirection.Desc,
                  })
                }
              >
                Z-A
              </Text>
            </View>
          </View>
          <ScrollView>
            <View style={styles.filterBox}>
              <Text style={styles.filterTitle}>Duration</Text>
              {filters.duration.map((duration, idx) => {
                return (
                  <Checkbox
                    key={idx}
                    title={duration.title}
                    selected={duration.selected}
                    onPress={() => {
                      setFilters({
                        ...filters,
                        duration: filters.duration.map((item) => {
                          return duration.title === item.title
                            ? {
                                ...item,
                                selected: !filters.duration[idx].selected,
                              }
                            : item;
                        }),
                      });
                    }}
                  />
                );
              })}
            </View>
            <View style={styles.filterBox}>
              <Text style={styles.filterTitle}>Difficulty Level</Text>
              {filters.difficulty.map((difficulty, idx) => (
                <Checkbox
                  key={idx}
                  title={difficulty.title}
                  selected={difficulty.selected}
                  onPress={() =>
                    setFilters({
                      ...filters,
                      difficulty: filters.difficulty.map((item) => {
                        return difficulty.title === item.title
                          ? {
                              ...item,
                              selected: !filters.difficulty[idx].selected,
                            }
                          : item;
                      }),
                    })
                  }
                />
              ))}
            </View>
          </ScrollView>

          <View style={styles.filterButtons}>
            <TouchableOpacity style={styles.clearbtn} onPress={clearFilter}>
              <Text style={styles.clearbtntxt}>Clear All</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applybtn} onPress={applyFilter}>
              <Text style={styles.applybtntxt}>Apply Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View>
      <TouchableOpacity style={styles.filterbtn} onPress={() => setShow(true)}>
        <ListFilter size={25} color={theme.text["text-primary"]} />
      </TouchableOpacity>
      <CourseFilter />
    </View>
  );
};

const styles = StyleSheet.create({
  filterbtn: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.border["border-100"],
    backgroundColor: theme.interface["ui-quaternary"],
    borderRadius: scaleDimension(10, true),
    width: scaleDimension(56, true),
    height: scaleDimension(56, true),
    marginLeft: scaleDimension(12, true),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    backgroundColor: theme.surface["surface-100"],
    height: "100%",
    paddingTop: scaleDimension(30, true),
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: scaleDimension(20, false),
  },
  filterBox: {
    borderBottomWidth: 1,
    borderBottomColor: theme.border["border-200"],
    padding: scaleDimension(12, false),
  },
  filterTitle: {
    fontSize: scaleDimension(20, true),
    lineHeight: scaleDimension(28, true),
    color: theme.text["text-primary"],
    fontFamily: fonts.poppins.regular,
  },
  clearbtn: {
    flexGrow: 1,
    margin: 2,
  },
  clearbtntxt: {
    color: theme.brand["brand-primary"],
    textAlign: "center",
    lineHeight: scaleDimension(40, true),
    fontFamily: fonts.inter.bold,
    fontSize: scaleDimension(16, true),
  },
  applybtn: {
    flexGrow: 1,
    backgroundColor: theme.brand["brand-primary"],
    borderRadius: scaleDimension(4, true),
    padding: scaleDimension(6, true),
  },
  applybtntxt: {
    color: theme.text["text-inverse"],
    textAlign: "center",
    lineHeight: scaleDimension(40, true),
    fontFamily: fonts.inter.bold,
    fontSize: scaleDimension(16, true),
  },
  sortDir: {
    width: "50%",
    lineHeight: scaleDimension(30, true),
    textAlign: "center",
  },
  sortDirSelected: {
    fontSize: scaleDimension(16, true),
    width: "50%",
    lineHeight: scaleDimension(30, true),
    textAlign: "center",
    backgroundColor: theme.brand["brand-primary"],
    color: theme.text["text-inverse"],
    fontFamily: fonts.inter.bold,
    borderRadius: scaleDimension(5, true),
    padding: scaleDimension(6, true),
  },
  filterButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: scaleDimension(20, false),
    paddingHorizontal: scaleDimension(12, false),
  },
});

export default FilterControl;
