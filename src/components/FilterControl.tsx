import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Checkbox from "./Checkbox";
import { ExploreCatalogContext } from "../context";
import { GlobalTypes } from "../graphql";

const FilterControl = () => {
  const [show, setShow] = useState<boolean>(false);
  const { filters: appliedFilters, setFilters: setAppliedFilters } = useContext(
    ExploreCatalogContext
  );

  const CourseFilter = () => {
    const [filters, setFilters] = useState({
      sortDir: appliedFilters.sortDir,
      duration: [
        {
          title: "1 Hour",
          selected: appliedFilters?.values?.includes("1 Hour"),
        },
        {
          title: "3 - 8 Hours",
          selected: appliedFilters?.values?.includes("3 - 8 Hours"),
        },
        {
          title: "9 - 16 Hours",
          selected: appliedFilters?.values?.includes("9 - 16 Hours"),
        },
        {
          title: "A couple of days",
          selected: appliedFilters?.values?.includes("A couple of days"),
        },
      ],
      difficulty: [
        {
          title: "Beginner",
          selected: appliedFilters?.values?.includes("Beginner"),
        },
        {
          title: "Intermediate",
          selected: appliedFilters?.values?.includes("Intermediate"),
        },
        {
          title: "Advanced",
          selected: appliedFilters?.values?.includes("Advanced"),
        },
      ],
      tags: [
        {
          title: "QuickStart",
          selected: appliedFilters?.values?.includes("QuickStart"),
        },
        {
          title: "Business",
          selected: appliedFilters?.values?.includes("Business"),
        },
      ],
      myLearningsEvent: [
        { title: "All", selected: false },
        { title: "Offline", selected: false },
      ],
    });

    const clearFilter = () => {
      setAppliedFilters({
        ...appliedFilters,
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
        durationLabel = "Level of Difficulty";
      }

      // Tag Filter
      let tags: string[] = [];
      filters.tags.forEach((item) => {
        if (item.selected) {
          tags.push(item.title);
        }
      });

      if (difficulty.length > 0) {
        durationLabel = "Level of Difficulty";
      }

      setAppliedFilters({
        ...appliedFilters,
        sortDir: filters.sortDir,
        values: [
          ...new Set(durations),
          ...new Set(difficulty),
          ...new Set(tags),
        ],
        labels: [durationLabel, difficultyLabel],
      });
      setShow(false);
    };

    return (
      <Modal transparent={false} visible={show}>
        <View style={styles.filterContainer}>
          <Text style={styles.filterHeading}>Filters</Text>
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
            <View style={styles.filterBox}>
              <Text style={styles.filterTitle}>Tags</Text>
              {filters.tags.map((tag, idx) => (
                <Checkbox
                  key={idx}
                  title={tag.title}
                  selected={tag.selected}
                  onPress={() =>
                    setFilters({
                      ...filters,
                      tags: filters.tags.map((item) => {
                        return tag.title === item.title
                          ? {
                              ...item,
                              selected: !filters.tags[idx].selected,
                            }
                          : item;
                      }),
                    })
                  }
                />
              ))}
            </View>
          </ScrollView>

          <View style={styles.row}>
            <Pressable style={styles.clearbtn} onPress={clearFilter}>
              <Text style={styles.clearbtntxt}>Clear All</Text>
            </Pressable>

            <Pressable style={styles.applybtn} onPress={applyFilter}>
              <Text style={styles.applybtntxt}>Apply Filter</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View>
      <Pressable style={styles.filterbtn} onPress={() => setShow(true)}>
        <MaterialCommunityIcons
          name="filter-variant"
          size={25}
          color="#232323"
        />
      </Pressable>
      <CourseFilter />
    </View>
  );
};

const styles = StyleSheet.create({
  filterbtn: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    borderRadius: 5,
    padding: 10,
    width: 50,
    height: 50,
    marginLeft: 5,
    alignSelf: "center",
  },

  filterContainer: {
    backgroundColor: "#fff",
    height: "99%",
    paddingTop: 10,
    borderRadius: 20,
  },

  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: Dimensions.get("window").height < 700 ? 10 : 20,
  },

  filterHeading: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#1F2937",
    fontFamily: "Poppins_700Bold",
  },

  filterBox: {
    borderBottomWidth: 1,
    padding: 20,
    paddingTop: 0,
    borderBottomColor: "#D1D5DB",
  },

  filterTitle: {
    fontSize: 16,
    lineHeight: 24,
    paddingTop: 16,
    color: "#1F2937",
    fontFamily: "Poppins_400Regular",
  },

  clearbtn: {
    flexGrow: 1,
    margin: 2,
  },

  clearbtntxt: {
    color: "#3B1FA3",
    textAlign: "center",
    lineHeight: 40,
    fontFamily: "Inter_700Bold",
  },

  applybtn: {
    flexGrow: 1,
    backgroundColor: "#3B1FA3",
    borderRadius: 4,
    margin: 2,
    marginRight: 15,
  },

  applybtntxt: {
    color: "#fff",
    textAlign: "center",
    lineHeight: 40,
    fontFamily: "Inter_700Bold",
  },

  sortDir: {
    width: "50%",
    margin: 2,
    lineHeight: 30,
    textAlign: "center",
  },
  sortDirSelected: {
    fontSize: 14,
    width: "50%",
    margin: 2,
    lineHeight: 30,
    textAlign: "center",
    backgroundColor: "#3B1FA3",
    color: "#fff",
    fontFamily: "Inter_700Bold",
    borderRadius: 5,
  },

  hasFilter: {
    height: 24,
    width: 24,
    borderRadius: 24,
    backgroundColor: "#3B1FA3",
    marginLeft: -15,
    marginTop: -5,
  },

  filterCount: {
    textAlign: "center",
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    lineHeight: 24,
    color: "#ffffff",
  },
});

export default FilterControl;
