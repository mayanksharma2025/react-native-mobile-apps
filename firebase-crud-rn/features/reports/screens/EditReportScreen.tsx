import React, { useState } from "react";

import { ScrollView, View, Image, Alert } from "react-native";

import { TextInput, Button, Checkbox, Text, Card } from "react-native-paper";

import * as DocumentPicker from "expo-document-picker";

import * as ImagePicker from "expo-image-picker";

import { auth } from "@/src/core/firebase/firebaseConfig";

import { FirebaseReportRepo } from "../repositories/FirebaseReportRepo";

const repo = new FirebaseReportRepo();

export const EditReportScreen = () => {
  const user = auth.currentUser;

  const [loading, setLoading] = useState(false);

  const [reportName, setReportName] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

  const [isDischarged, setIsDischarged] = useState(false);

  const [visaReports, setVisaReports] = useState<any[]>([]);

  const [costEstimateFiles, setCostEstimateFiles] = useState<any[]>([]);

  const [arrivalPhotos, setArrivalPhotos] = useState<any[]>([]);

  const pickVisaFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
    });

    if (!result.canceled) {
      setVisaReports(result.assets);
    }
  };

  const pickEstimateFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
    });

    if (!result.canceled) {
      setCostEstimateFiles(result.assets);
    }
  };

  const pickArrivalPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,

      quality: 0.7,
    });

    if (!result.canceled) {
      setArrivalPhotos(result.assets);
    }
  };

  const saveReport = async () => {
    try {
      if (!user) return;

      setLoading(true);

      const visaUrls: string[] = [];

      const estimateUrls: string[] = [];

      const arrivalUrls: string[] = [];

      for (const file of visaReports) {
        const url = await repo.uploadFile(
          file.uri,

          `reports/${user.uid}/visas/${Date.now()}-${file.name}`,
        );

        visaUrls.push(url);
      }

      for (const file of costEstimateFiles) {
        const url = await repo.uploadFile(
          file.uri,

          `reports/${user.uid}/estimates/${Date.now()}-${file.name}`,
        );

        estimateUrls.push(url);
      }

      for (const file of arrivalPhotos) {
        const url = await repo.uploadFile(
          file.uri,

          `reports/${user.uid}/arrivals/${Date.now()}.jpg`,
        );

        arrivalUrls.push(url);
      }

      await repo.create({
        reportName,

        phoneNumber,

        isDischarged,

        visaReports: visaUrls,

        costEstimateFiles: estimateUrls,

        arrivalPhotos: arrivalUrls,

        userId: user.uid,

        createdAt: Date.now(),

        updatedAt: Date.now(),
      });

      Alert.alert("Success", "Report saved");
    } catch (e: any) {
      console.log(e);

      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        gap: 16,
      }}
    >
      <TextInput
        label="Report Name"
        value={reportName}
        onChangeText={setReportName}
      />

      <TextInput
        label="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <Checkbox.Item
        label="Discharged"
        status={isDischarged ? "checked" : "unchecked"}
        onPress={() => setIsDischarged(!isDischarged)}
      />

      <Button mode="outlined" onPress={pickVisaFiles}>
        Pick Visa Reports
      </Button>

      <Text>
        Files:
        {visaReports.length}
      </Text>

      <Button mode="outlined" onPress={pickEstimateFiles}>
        Pick Cost Estimates
      </Button>

      <Text>
        Files:
        {costEstimateFiles.length}
      </Text>

      <Button mode="outlined" onPress={pickArrivalPhotos}>
        Pick Arrival Photos
      </Button>

      <ScrollView horizontal>
        {arrivalPhotos.map((img, index) => (
          <Image
            key={index}
            source={{
              uri: img.uri,
            }}
            style={{
              width: 100,
              height: 100,
              marginRight: 8,
              borderRadius: 10,
            }}
          />
        ))}
      </ScrollView>

      <Button mode="contained" loading={loading} onPress={saveReport}>
        Save Report
      </Button>
    </ScrollView>
  );
};
