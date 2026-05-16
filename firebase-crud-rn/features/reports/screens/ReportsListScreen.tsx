import React, { useCallback, useState } from "react";

import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";

import {
  Card,
  Text,
  FAB,
  ActivityIndicator,
  Chip,
  IconButton,
} from "react-native-paper";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { useFocusEffect } from "@react-navigation/native";

import { deleteDoc, doc } from "firebase/firestore";

import { db, auth } from "@/src/core/firebase/firebaseConfig";

import { FirebaseReportRepo } from "../repositories/FirebaseReportRepo";

const repo = new FirebaseReportRepo();

export const ReportsListScreen = () => {
  const [reports, setReports] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const data = await repo.listByUser(user.uid);

      setReports(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, []),
  );

  const deleteReport = async (id: string) => {
    try {
      Alert.alert(
        "Delete Report",
        "Are you sure you want to delete this report?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await deleteDoc(doc(db, "reports", id));

              setReports((prev) => prev.filter((item) => item.id !== id));
            },
          },
        ],
      );
    } catch (e) {
      console.log(e);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f5f5f5",
      }}
    >
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadReports} />
        }
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 120,
        }}
        ListHeaderComponent={
          <View
            style={{
              marginBottom: 20,
            }}
          >
            <Text variant="headlineMedium">My Reports</Text>

            <Text
              style={{
                opacity: 0.6,
                marginTop: 4,
              }}
            >
              Medical reports and uploaded files
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Card
            style={{
              padding: 20,
              borderRadius: 20,
            }}
          >
            <Card.Content
              style={{
                alignItems: "center",
                gap: 10,
              }}
            >
              <Ionicons name="document-text-outline" size={60} color="#999" />

              <Text variant="titleMedium">No Reports Found</Text>

              <Text
                style={{
                  textAlign: "center",
                  opacity: 0.6,
                }}
              >
                Tap the + button to create report
              </Text>
            </Card.Content>
          </Card>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/report/[id]",
                params: {
                  id: item.id,
                },
              })
            }
          >
            <Card
              style={{
                marginBottom: 16,
                borderRadius: 24,
              }}
            >
              <Card.Content>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text variant="titleLarge">{item.reportName}</Text>

                    <Text
                      style={{
                        opacity: 0.7,
                        marginTop: 4,
                      }}
                    >
                      {item.phoneNumber}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <IconButton
                      icon="pencil"
                      onPress={() =>
                        router.push({
                          pathname: "/edit-report",
                          params: {
                            id: item.id,
                          },
                        })
                      }
                    />

                    <IconButton
                      icon="delete"
                      iconColor="red"
                      onPress={() => deleteReport(item.id)}
                    />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                    marginTop: 16,
                  }}
                >
                  <Chip icon="file-document">
                    {item.visaReports?.length || 0} Visa
                  </Chip>

                  <Chip icon="cash">
                    {item.costEstimateFiles?.length || 0} Estimates
                  </Chip>

                  <Chip icon="image">
                    {item.arrivalPhotos?.length || 0} Photos
                  </Chip>

                  <Chip
                    icon={item.isDischarged ? "check-circle" : "clock-outline"}
                  >
                    {item.isDischarged ? "Discharged" : "Pending"}
                  </Chip>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />

      <FAB
        icon="plus"
        onPress={() => router.push("/edit-report")}
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
        }}
      />
    </View>
  );
};
