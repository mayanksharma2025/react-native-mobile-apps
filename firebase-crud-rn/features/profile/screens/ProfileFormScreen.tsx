import React, { useState } from "react";
import { ScrollView, View, Image, Alert } from "react-native";

import {
  TextInput,
  Button,
  Text,
  RadioButton,
  Checkbox,
} from "react-native-paper";

import * as ImagePicker from "expo-image-picker";

import { auth } from "@/src/core/firebase/firebaseConfig";

import { ProfileRepository } from "../repositories/ProfileRepository";

import { Category } from "../types";

const repo = new ProfileRepository();

export const ProfileFormScreen = () => {
  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const [working, setWorking] = useState(true);

  const [category, setCategory] = useState<Category>(Category.Developer);

  const [photo, setPhoto] = useState("");

  const [skills, setSkills] = useState<string[]>([]);

  const [educations, setEducations] = useState([{ school: "", degree: "" }]);

  const [experiences, setExperiences] = useState([{ company: "", role: "" }]);

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const saveProfile = async () => {
    try {
      if (!user) return;

      let photoUrl = "";

      if (photo) {
        photoUrl = await repo.uploadProfilePhoto(photo, user.uid);
      }

      await repo.saveProfile({
        id: user.uid,
        email: user.email || "",
        name,
        address,
        photoUrl,
        category,
        working,
        skills,
        educations,
        experiences,
      });

      Alert.alert("Success", "Profile saved");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        gap: 12,
      }}
    >
      <Button mode="outlined" onPress={pickImage}>
        Pick Profile Photo
      </Button>

      {!!photo && (
        <Image
          source={{ uri: photo }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            alignSelf: "center",
          }}
        />
      )}

      <TextInput label="Name" value={name} onChangeText={setName} />

      <TextInput label="Address" value={address} onChangeText={setAddress} />

      <Text variant="titleMedium">Category</Text>

      <RadioButton.Group
        onValueChange={(v) => setCategory(v as Category)}
        value={category}
      >
        <RadioButton.Item label="Developer" value={Category.Developer} />
        <RadioButton.Item label="Designer" value={Category.Designer} />
        <RadioButton.Item label="Manager" value={Category.Manager} />
      </RadioButton.Group>

      <Checkbox.Item
        label="React Native"
        status={skills.includes("React Native") ? "checked" : "unchecked"}
        onPress={() => toggleSkill("React Native")}
      />

      <Checkbox.Item
        label="Firebase"
        status={skills.includes("Firebase") ? "checked" : "unchecked"}
        onPress={() => toggleSkill("Firebase")}
      />

      <Checkbox.Item
        label="TypeScript"
        status={skills.includes("TypeScript") ? "checked" : "unchecked"}
        onPress={() => toggleSkill("TypeScript")}
      />

      <Text variant="titleMedium">Education</Text>

      {educations.map((edu, index) => (
        <View key={index}>
          <TextInput
            label="School"
            value={edu.school}
            onChangeText={(text) => {
              const arr = [...educations];
              arr[index].school = text;
              setEducations(arr);
            }}
          />

          <TextInput
            label="Degree"
            value={edu.degree}
            onChangeText={(text) => {
              const arr = [...educations];
              arr[index].degree = text;
              setEducations(arr);
            }}
          />
        </View>
      ))}

      <Button
        onPress={() =>
          setEducations([...educations, { school: "", degree: "" }])
        }
      >
        Add Education
      </Button>

      <Text variant="titleMedium">Experience</Text>

      {experiences.map((exp, index) => (
        <View key={index}>
          <TextInput
            label="Company"
            value={exp.company}
            onChangeText={(text) => {
              const arr = [...experiences];
              arr[index].company = text;
              setExperiences(arr);
            }}
          />

          <TextInput
            label="Role"
            value={exp.role}
            onChangeText={(text) => {
              const arr = [...experiences];
              arr[index].role = text;
              setExperiences(arr);
            }}
          />
        </View>
      ))}

      <Button
        onPress={() =>
          setExperiences([...experiences, { company: "", role: "" }])
        }
      >
        Add Experience
      </Button>

      <Button mode="contained" onPress={saveProfile}>
        Save Profile
      </Button>
    </ScrollView>
  );
};
