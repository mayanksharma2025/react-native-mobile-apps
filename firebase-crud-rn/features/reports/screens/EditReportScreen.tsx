import React, { useEffect, useState } from "react";

import { ScrollView, View, Image, Alert, TouchableOpacity } from "react-native";

import {
  TextInput,
  Button,
  Checkbox,
  Text,
  Card,
  IconButton,
  Divider,
} from "react-native-paper";

import * as DocumentPicker from "expo-document-picker";

import * as ImagePicker from "expo-image-picker";

import { useLocalSearchParams, router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { auth } from "@/src/core/firebase/firebaseConfig";

import { FirebaseReportRepo } from "../repositories/FirebaseReportRepo";

const repo = new FirebaseReportRepo();

export const EditReportScreen = () => {
  const params = useLocalSearchParams();

  const editId = Array.isArray(params.id) ? params.id[0] : params.id;

  const user = auth.currentUser;

  const [loading, setLoading] = useState(false);

  const [reportName, setReportName] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

  const [isDischarged, setIsDischarged] = useState(false);

  const [visaReports, setVisaReports] = useState<any[]>([]);

  const [costEstimateFiles, setCostEstimateFiles] = useState<any[]>([]);

  const [arrivalPhotos, setArrivalPhotos] = useState<any[]>([]);

  useEffect(() => {
    if (editId) {
      loadReport();
    }
  }, [editId]);

  const loadReport = async () => {
    try {
      const data = await repo.getById(editId as string);

      if (!data) return;

      setReportName(data.reportName || "");

      setPhoneNumber(data.phoneNumber || "");

      setIsDischarged(data.isDischarged || false);

      setVisaReports(
        (data.visaReports || []).map((url: string) => ({
          uri: url,
          uploaded: true,
        })),
      );

      setCostEstimateFiles(
        (data.costEstimateFiles || []).map((url: string) => ({
          uri: url,
          uploaded: true,
        })),
      );

      setArrivalPhotos(
        (data.arrivalPhotos || []).map((url: string) => ({
          uri: url,
          uploaded: true,
        })),
      );
    } catch (e) {
      console.log(e);
    }
  };

  const removeFile = (index: number, setter: any, files: any[]) => {
    const updated = [...files];

    updated.splice(index, 1);

    setter(updated);
  };

  const pickVisaFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
    });

    if (!result.canceled) {
      setVisaReports((prev) => [...prev, ...result.assets]);
    }
  };

  const pickEstimateFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
    });

    if (!result.canceled) {
      setCostEstimateFiles((prev) => [...prev, ...result.assets]);
    }
  };

  const pickArrivalPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setArrivalPhotos((prev) => [...prev, ...result.assets]);
    }
  };

  const uploadMixedFiles = async (files: any[], folder: string) => {
    const urls: string[] = [];

    for (const file of files) {
      if (file.uploaded) {
        urls.push(file.uri);

        continue;
      }

      const url = await repo.uploadFile(
        file.uri,
        `reports/${user?.uid}/${folder}/${Date.now()}`,
      );

      urls.push(url);
    }

    return urls;
  };

  const saveReport = async () => {
    try {
      if (!user) return;

      setLoading(true);

      const visaUrls = await uploadMixedFiles(visaReports, "visas");

      const estimateUrls = await uploadMixedFiles(
        costEstimateFiles,
        "estimates",
      );

      const arrivalUrls = await uploadMixedFiles(arrivalPhotos, "arrivals");

      const payload = {
        reportName,

        phoneNumber,

        isDischarged,

        visaReports: visaUrls,

        costEstimateFiles: estimateUrls,

        arrivalPhotos: arrivalUrls,

        userId: user.uid,

        updatedAt: Date.now(),
      };

      if (editId) {
        await repo.update(editId as string, payload);
      } else {
        await repo.create({
          ...payload,
          createdAt: Date.now(),
        });
      }

      Alert.alert("Success", editId ? "Report updated" : "Report created");

      router.back();
    } catch (e: any) {
      console.log(e);

      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const FilePreview = ({ item, index, onDelete }: any) => (
    <Card
      style={{
        marginTop: 10,
      }}
    >
      <Card.Content
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            flex: 1,
          }}
        >
          <Ionicons name="document-text-outline" size={22} color="#555" />

          <Text numberOfLines={1}>
            {item.name || `Uploaded File ${index + 1}`}
          </Text>
        </View>

        <IconButton icon="delete" iconColor="red" onPress={onDelete} />
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        gap: 18,
        paddingBottom: 40,
      }}
    >
      <Text variant="headlineMedium">
        {editId ? "Edit Report" : "Create Report"}
      </Text>

      <Card>
        <Card.Content
          style={{
            gap: 16,
          }}
        >
          <TextInput
            label="Report Name"
            value={reportName}
            onChangeText={setReportName}
            mode="outlined"
          />

          <TextInput
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            mode="outlined"
          />

          <Checkbox.Item
            label="Discharged"
            status={isDischarged ? "checked" : "unchecked"}
            onPress={() => setIsDischarged(!isDischarged)}
          />
        </Card.Content>
      </Card>

      <Card>
        <Card.Content>
          <Text variant="titleMedium">Visa Reports</Text>

          <Button
            mode="outlined"
            style={{
              marginTop: 14,
            }}
            onPress={pickVisaFiles}
          >
            Add Files
          </Button>

          {visaReports.map((item, index) => (
            <FilePreview
              key={index}
              item={item}
              index={index}
              onDelete={() => removeFile(index, setVisaReports, visaReports)}
            />
          ))}
        </Card.Content>
      </Card>

      <Card>
        <Card.Content>
          <Text variant="titleMedium">Cost Estimate Files</Text>

          <Button
            mode="outlined"
            style={{
              marginTop: 14,
            }}
            onPress={pickEstimateFiles}
          >
            Add Files
          </Button>

          {costEstimateFiles.map((item, index) => (
            <FilePreview
              key={index}
              item={item}
              index={index}
              onDelete={() =>
                removeFile(index, setCostEstimateFiles, costEstimateFiles)
              }
            />
          ))}
        </Card.Content>
      </Card>

      <Card>
        <Card.Content>
          <Text variant="titleMedium">Arrival Photos</Text>

          <Button
            mode="outlined"
            style={{
              marginTop: 14,
              marginBottom: 16,
            }}
            onPress={pickArrivalPhotos}
          >
            Add Photos
          </Button>

          <ScrollView horizontal>
            {arrivalPhotos.map((item, index) => (
              <View
                key={index}
                style={{
                  marginRight: 12,
                  position: "relative",
                }}
              >
                <Image
                  source={{
                    uri: item.uri,
                  }}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 16,
                  }}
                />

                <TouchableOpacity
                  onPress={() =>
                    removeFile(index, setArrivalPhotos, arrivalPhotos)
                  }
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    backgroundColor: "white",
                    borderRadius: 20,
                  }}
                >
                  <Ionicons name="close-circle" size={28} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        loading={loading}
        onPress={saveReport}
        style={{
          borderRadius: 12,
          paddingVertical: 6,
        }}
      >
        {editId ? "Update Report" : "Save Report"}
      </Button>
    </ScrollView>
  );
};
