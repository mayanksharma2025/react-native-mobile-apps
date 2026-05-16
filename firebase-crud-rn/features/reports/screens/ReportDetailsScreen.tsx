import React, { useEffect, useState } from "react";

import {
  ScrollView,
  View,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";

import { Card, Text, Button, Chip, Divider } from "react-native-paper";

import { Ionicons } from "@expo/vector-icons";

import { useLocalSearchParams, router } from "expo-router";

import { FirebaseReportRepo } from "../repositories/FirebaseReportRepo";

const repo = new FirebaseReportRepo();

export const ReportDetailsScreen = () => {
  const params = useLocalSearchParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    const data = await repo.getById(id as string);

    setReport(data);
  };

  if (!report) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }

  const FileButton = ({ url, label }: { url: string; label: string }) => (
    <TouchableOpacity
      onPress={() => Linking.openURL(url)}
      style={{
        backgroundColor: "#f5f5f5",
        padding: 14,
        borderRadius: 14,
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Ionicons name="document-attach-outline" size={22} color="#444" />

      <Text
        style={{
          flex: 1,
        }}
      >
        {label}
      </Text>

      <Ionicons name="open-outline" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        gap: 16,
        paddingBottom: 40,
      }}
    >
      <Card
        style={{
          borderRadius: 24,
        }}
      >
        <Card.Content>
          <Text variant="headlineSmall">{report.reportName}</Text>

          <Text
            style={{
              marginTop: 6,
              opacity: 0.7,
            }}
          >
            {report.phoneNumber}
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginTop: 16,
            }}
          >
            <Chip icon={report.isDischarged ? "check-circle" : "clock-outline"}>
              {report.isDischarged ? "Discharged" : "Pending"}
            </Chip>
          </View>
        </Card.Content>
      </Card>

      <Card
        style={{
          borderRadius: 24,
        }}
      >
        <Card.Content>
          <Text variant="titleMedium">Visa Reports</Text>

          <Divider
            style={{
              marginVertical: 14,
            }}
          />

          {report.visaReports?.length ? (
            report.visaReports.map((item: string, index: number) => (
              <FileButton
                key={index}
                url={item}
                label={`Visa Report ${index + 1}`}
              />
            ))
          ) : (
            <Text>No files</Text>
          )}
        </Card.Content>
      </Card>

      <Card
        style={{
          borderRadius: 24,
        }}
      >
        <Card.Content>
          <Text variant="titleMedium">Cost Estimates</Text>

          <Divider
            style={{
              marginVertical: 14,
            }}
          />

          {report.costEstimateFiles?.length ? (
            report.costEstimateFiles.map((item: string, index: number) => (
              <FileButton
                key={index}
                url={item}
                label={`Estimate ${index + 1}`}
              />
            ))
          ) : (
            <Text>No files</Text>
          )}
        </Card.Content>
      </Card>

      <Card
        style={{
          borderRadius: 24,
        }}
      >
        <Card.Content>
          <Text variant="titleMedium">Arrival Photos</Text>

          <Divider
            style={{
              marginVertical: 14,
            }}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {report.arrivalPhotos?.map((item: string, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() => Linking.openURL(item)}
              >
                <Image
                  source={{
                    uri: item,
                  }}
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 18,
                    marginRight: 12,
                  }}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() =>
          router.push({
            pathname: "/edit-report",
            params: { id: report.id },
          })
        }
      >
        Edit Report
      </Button>

      <Button onPress={() => router.back()}>Back</Button>
    </ScrollView>
  );
};
