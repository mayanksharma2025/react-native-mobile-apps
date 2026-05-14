// src/features/profile/screens/ProfileFormScreen.tsx

import React, { useEffect, useState } from "react";

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

import {
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

import { ProfileRepository } from "../repositories/ProfileRepository";

import { Category } from "../types";

const repo = new ProfileRepository();

export const ProfileFormScreen = () => {
  const user = auth.currentUser;

  /* ---------------- STATES ---------------- */

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(user?.displayName || "");

  const [email, setEmail] = useState(user?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [address, setAddress] = useState("");

  const [working, setWorking] = useState(true);

  const [category, setCategory] = useState<Category>(Category.Developer);

  const [photo, setPhoto] = useState("");

  const [skills, setSkills] = useState<string[]>([]);

  const [educations, setEducations] = useState([
    {
      school: "",
      degree: "",
    },
  ]);

  const [experiences, setExperiences] = useState([
    {
      company: "",
      role: "",
    },
  ]);

  /* ---------------- LOAD PROFILE ---------------- */

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const profile = await repo.getProfile(user.uid);

        if (!profile) return;

        setName(profile.name || "");

        setEmail(profile.email || "");

        setAddress(profile.address || "");

        setCategory(profile.category || Category.Developer);

        setWorking(profile.working ?? true);

        setSkills(profile.skills || []);

        setEducations(
          profile.educations || [
            {
              school: "",
              degree: "",
            },
          ],
        );

        setExperiences(
          profile.experiences || [
            {
              company: "",
              role: "",
            },
          ],
        );

        if (profile.photoUrl) {
          setPhoto(profile.photoUrl);
        }
      } catch (e) {
        console.log(e);
      }
    };

    loadProfile();
  }, []);

  /* ---------------- SKILLS ---------------- */

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  /* ---------------- IMAGE PICKER ---------------- */

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  /* ---------------- SAVE PROFILE ---------------- */

  const saveProfile = async () => {
    try {
      if (!user) return;

      setLoading(true);

      /* PASSWORD VALIDATION */

      if (password && password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");

        return;
      }

      /* IMAGE UPLOAD */

      let photoUrl = photo;

      if (photo && !photo.startsWith("https")) {
        photoUrl = await repo.uploadProfilePhoto(photo, user.uid);
      }

      /* UPDATE DISPLAY NAME */

      if (name !== user.displayName) {
        await updateProfile(user, {
          displayName: name,
        });
      }

      /* REAUTHENTICATION */

      const needsReAuth = email !== user.email || !!password;

      if (needsReAuth) {
        if (!currentPassword) {
          Alert.alert("Error", "Current password required");

          return;
        }

        const credential = EmailAuthProvider.credential(
          user.email || "",
          currentPassword,
        );

        await reauthenticateWithCredential(user, credential);
      }

      /* UPDATE EMAIL */

      if (email !== user.email) {
        await updateEmail(user, email);
      }

      /* UPDATE PASSWORD */

      if (password) {
        await updatePassword(user, password);
      }

      /* SAVE FIRESTORE PROFILE */

      await repo.saveProfile({
        id: user.uid,
        name,
        email,
        address,
        photoUrl,
        category,
        working,
        skills,
        educations,
        experiences,
      });

      Alert.alert("Success", "Profile updated successfully");

      /* CLEAR PASSWORDS */

      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      console.log(e);

      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        gap: 12,
      }}
    >
      {/* USER ID */}
      <Text variant="bodySmall">UID: {user?.uid}</Text>

      {/* PROFILE PHOTO */}
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

      {/* NAME */}
      <TextInput label="Name" value={name} onChangeText={setName} />

      {/* EMAIL */}
      <TextInput
        label="Email"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
      />

      {/* CURRENT PASSWORD */}
      <TextInput
        label="Current Password"
        value={currentPassword}
        secureTextEntry
        onChangeText={setCurrentPassword}
      />

      {/* NEW PASSWORD */}
      <TextInput
        label="New Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      {/* CONFIRM PASSWORD */}
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
      />

      {/* ADDRESS */}
      <TextInput label="Address" value={address} onChangeText={setAddress} />

      {/* CATEGORY */}
      <Text variant="titleMedium">Category</Text>

      <RadioButton.Group
        value={category}
        onValueChange={(v) => setCategory(v as Category)}
      >
        <RadioButton.Item label="Developer" value={Category.Developer} />

        <RadioButton.Item label="Designer" value={Category.Designer} />

        <RadioButton.Item label="Manager" value={Category.Manager} />
      </RadioButton.Group>

      {/* WORKING */}
      <Checkbox.Item
        label="Currently Working"
        status={working ? "checked" : "unchecked"}
        onPress={() => setWorking(!working)}
      />

      {/* SKILLS */}
      <Text variant="titleMedium">Skills</Text>

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

      {/* EDUCATION */}
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
          setEducations([
            ...educations,
            {
              school: "",
              degree: "",
            },
          ])
        }
      >
        Add Education
      </Button>

      {/* EXPERIENCE */}
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
          setExperiences([
            ...experiences,
            {
              company: "",
              role: "",
            },
          ])
        }
      >
        Add Experience
      </Button>

      {/* SAVE BUTTON */}
      <Button
        mode="contained"
        loading={loading}
        disabled={loading}
        onPress={saveProfile}
      >
        Save Profile
      </Button>
    </ScrollView>
  );
};
