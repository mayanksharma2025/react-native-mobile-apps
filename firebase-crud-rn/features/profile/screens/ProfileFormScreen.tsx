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

import { auth, db } from "@/src/core/firebase/firebaseConfig";

import {
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  reload,
} from "firebase/auth";

import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { storage } from "@/src/core/firebase/firebaseConfig";

import { Category } from "../types";

/* ------------------------------------------------ */

export const ProfileFormScreen = () => {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

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

  /* ------------------------------------------------ */
  /* LOAD PROFILE */
  /* ------------------------------------------------ */

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      /* ALWAYS REFRESH USER */
      await reload(user);

      const currentUser = auth.currentUser;

      setName(currentUser?.displayName || "");

      setEmail(currentUser?.email || "");

      const docRef = doc(db, "users", user.uid);

      const snap = await getDoc(docRef);

      if (!snap.exists()) return;

      const data = snap.data();

      setAddress(data.address || "");

      setCategory(data.category || Category.Developer);

      setWorking(data.working ?? true);

      setSkills(data.skills || []);

      setEducations(
        data.educations || [
          {
            school: "",
            degree: "",
          },
        ],
      );

      setExperiences(
        data.experiences || [
          {
            company: "",
            role: "",
          },
        ],
      );

      setPhoto(data.photoUrl || "");
    } catch (e) {
      console.log(e);
    }
  };

  /* ------------------------------------------------ */
  /* IMAGE PICKER */
  /* ------------------------------------------------ */

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  /* ------------------------------------------------ */
  /* TOGGLE SKILLS */
  /* ------------------------------------------------ */

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  /* ------------------------------------------------ */
  /* SAVE PROFILE */
  /* ------------------------------------------------ */

  const saveProfile = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;

      if (!user) return;

      /* PASSWORD VALIDATION */

      if (password && password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");

        return;
      }

      /* REAUTH */

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

      /* UPDATE DISPLAY NAME */

      await updateProfile(user, {
        displayName: name,
      });

      /* UPDATE EMAIL */

      if (email !== user.email) {
        await updateEmail(user, email);
      }

      /* UPDATE PASSWORD */

      if (password) {
        await updatePassword(user, password);
      }

      /* REFRESH USER */

      await reload(user);

      const updatedUser = auth.currentUser;

      /* IMAGE UPLOAD */

      let photoUrl = photo;

      if (photo && !photo.startsWith("https")) {
        const response = await fetch(photo);

        const blob = await response.blob();

        const storageRef = ref(storage, `profiles/${user.uid}`);

        await uploadBytes(storageRef, blob);

        photoUrl = await getDownloadURL(storageRef);
      }

      /* SAVE FIRESTORE */

      await setDoc(
        doc(db, "users", user.uid),
        {
          id: user.uid,

          name: updatedUser?.displayName || "",

          email: updatedUser?.email || "",

          address,

          photoUrl,

          category,

          working,

          skills,

          educations,

          experiences,

          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        },
      );

      /* REFRESH SCREEN */

      await loadProfile();

      /* CLEAR PASSWORDS */

      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");

      Alert.alert("Success", "Profile updated successfully");
    } catch (e: any) {
      console.log(e);

      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------ */
  /* UI */
  /* ------------------------------------------------ */

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        gap: 12,
      }}
    >
      <Text variant="bodySmall">UID: {auth.currentUser?.uid}</Text>

      {/* PHOTO */}

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
        disabled
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

      {["React Native", "Firebase", "TypeScript"].map((skill) => (
        <Checkbox.Item
          key={skill}
          label={skill}
          status={skills.includes(skill) ? "checked" : "unchecked"}
          onPress={() => toggleSkill(skill)}
        />
      ))}

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

      {/* SAVE */}

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
