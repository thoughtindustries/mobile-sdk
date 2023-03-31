import React, { useState, useEffect } from "react";

import { View, Text, Modal, StyleSheet, Pressable, ScrollView } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { filtersType } from "../../types";
import Checkbox from "./Checkbox";

import Utils from "../helpers/Utils";

const FilterControl = (props: { onFilter(flts: filtersType): void; navigation: any }) => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    props.navigation.setOptions({ tabBarStyle: { display: show ? "none" : "flex", height: 100 } });
  }, [show]);

  const [filters, setFilters] = useState<filtersType>({
    sortDir: "asc",
    duration: "",
    difficulty: "",
    tag: "",
  });

  const hasFilterApplied = () => {
    let applied = 0;
    applied += filters.duration !== "" ? 1 : 0;
    applied += filters.difficulty !== "" ? 1 : 0;
    applied += filters.tag !== "" ? 1 : 0;

    return applied;
  };

  const clearFilter = () => {
    const flts: filtersType = {
      ...filters,
      duration: "",
      difficulty: "",
      tag: "",
      sortDir: "asc",
    };

    setFilters(flts);
    setShow(false);
    props.onFilter(flts);
  };

  const applyFilter = () => {
    setShow(false);
    props.onFilter(filters);
  };

  const CourseFilter = () => {
    return (
      <>
        {show && (
          <View style={{ position: "absolute", top: -70, left: 0, zIndex: 200, width: "100%" }}>
            <View style={styles.filterContainer}>
              <Text style={styles.filterHeading}>Filters</Text>

              <View style={styles.filterBox}>
                <Text style={styles.filterTitle}>Sort By</Text>
                <View style={styles.row}>
                  <Text
                    style={filters.sortDir === "asc" ? styles.sortDirSelected : styles.sortDir}
                    onPress={() => setFilters({ ...filters, sortDir: "asc" })}
                  >
                    A-Z
                  </Text>
                  <Text
                    style={filters.sortDir === "desc" ? styles.sortDirSelected : styles.sortDir}
                    onPress={() => setFilters({ ...filters, sortDir: "desc" })}
                  >
                    Z-A
                  </Text>
                </View>
              </View>

              <ScrollView>
                <View style={styles.filterBox}>
                  <Text style={styles.filterTitle}>Duration</Text>
                  {Utils.filterValues.duration.map((dur, idx) => (
                    <Checkbox
                      key={idx}
                      title={dur}
                      selected={filters.duration === dur}
                      onPress={() =>
                        setFilters({
                          ...filters,
                          duration: filters.duration === dur ? "" : dur,
                        })
                      }
                    />
                  ))}
                </View>
                <View style={styles.filterBox}>
                  <Text style={styles.filterTitle}>Difficulty Level</Text>
                  {Utils.filterValues.difficulty.map((dif, idx) => (
                    <Checkbox
                      key={idx}
                      title={dif}
                      selected={filters.difficulty === dif}
                      onPress={() =>
                        setFilters({
                          ...filters,
                          difficulty: filters.difficulty === dif ? "" : dif,
                        })
                      }
                    />
                  ))}
                </View>
                <View style={styles.filterBox}>
                  <Text style={styles.filterTitle}>Tags</Text>
                  {Utils.filterValues.tags.map((tag, idx) => (
                    <Checkbox
                      key={idx}
                      title={tag}
                      selected={filters.tag === tag}
                      onPress={() =>
                        setFilters({
                          ...filters,
                          tag: filters.tag === tag ? "" : tag,
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
          </View>
        )}
      </>
    );
  };

  return (
    <>
      <Pressable style={styles.filterbtn} onPress={() => setShow(true)}>
        <MaterialCommunityIcons name="filter-variant" size={25} color="#232323" />
      </Pressable>
      {hasFilterApplied() > 0 && (
        <View style={styles.hasFilter}>
          <Text style={styles.filterCount}>{hasFilterApplied()}</Text>
        </View>
      )}
      <CourseFilter />
    </>
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
    paddingTop: 30,
    paddingBottom: 50,
  },

  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
