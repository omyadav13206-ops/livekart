import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { PrimaryButton } from "../components/PrimaryButton";
import { useAppContext } from "../context/AppContext";
import * as imageService from "../services/imageService";

export default function AddProductScreen() {
  const { addProduct, userId } = useAppContext();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Camera", "Gallery"],
          cancelButtonIndex: 0,
        },
        async (index) => {
          if (index === 1) {
            const uri = await imageService.captureProductImage();
            if (uri) setImageUri(uri);
          } else if (index === 2) {
            const uri = await imageService.pickProductImage();
            if (uri) setImageUri(uri);
          }
        }
      );
    } else {
      Alert.alert(
        "Product Photo",
        "How would you like to add a photo?",
        [
          { text: "Camera", onPress: async () => {
            const uri = await imageService.captureProductImage();
            if (uri) setImageUri(uri);
          }},
          { text: "Gallery", onPress: async () => {
            const uri = await imageService.pickProductImage();
            if (uri) setImageUri(uri);
          }},
          { text: "Cancel", style: "cancel" },
        ]
      );
    }
  };

  const onSubmit = async () => {
    if (!name.trim() || !price.trim() || !description.trim() || !category.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    setSaving(true);
    try {
      let uploadedUrl: string | undefined;

      if (imageUri && userId) {
        setUploading(true);
        uploadedUrl = await imageService.uploadProductImage(imageUri, userId);
        setUploading(false);
      }

      await addProduct({
        name: name.trim(),
        price: Number(price),
        description: description.trim(),
        category: category.trim(),
        shortDescription: description.trim().slice(0, 55),
        imageUrl: uploadedUrl,
      });

      Alert.alert("✅ Success", "Product added successfully!");
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to add product. Please try again.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.screenTitle}>Add Product</Text>
        <Text style={styles.screenSubtitle}>List your product for buyers</Text>

        {/* Image Picker */}
        <Pressable style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <View style={styles.changePhotoBtn}>
                <MaterialIcons name="edit" size={14} color="#fff" />
                <Text style={styles.changePhotoText}>Change</Text>
              </View>
            </>
          ) : (
            <>
              <MaterialIcons name="add-a-photo" size={36} color="#1f8f57" />
              <Text style={styles.imagePickerText}>Add Product Photo</Text>
              <Text style={styles.imagePickerSub}>From Camera or Gallery</Text>
            </>
          )}
        </Pressable>

        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Organic Tomatoes"
          placeholderTextColor="#9ab5a2"
        />

        <Text style={styles.label}>Price (Rs.) *</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholder="e.g. 80"
          placeholderTextColor="#9ab5a2"
        />

        <Text style={styles.label}>Category *</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="e.g. Vegetables, Fruits, Dairy..."
          placeholderTextColor="#9ab5a2"
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.multiLine]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Describe your product in detail..."
          placeholderTextColor="#9ab5a2"
        />

        <View style={{ height: 16 }} />

        {(saving || uploading) ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#1f8f57" size="small" />
            <Text style={styles.loadingText}>
              {uploading ? "Uploading photo..." : "Saving product..."}
            </Text>
          </View>
        ) : (
          <>
            <PrimaryButton label="✅ Add Product" onPress={onSubmit} />
            <View style={{ height: 10 }} />
            <PrimaryButton
              label="Cancel"
              variant="ghost"
              onPress={() => router.back()}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f7f4",
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f2a1c",
    marginBottom: 2,
  },
  screenSubtitle: {
    fontSize: 14,
    color: "#5d7a67",
    marginBottom: 18,
  },
  imagePicker: {
    height: 180,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#1f8f57",
    backgroundColor: "#edf7f1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    overflow: "hidden",
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  changePhotoBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(31,143,87,0.9)",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  changePhotoText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  imagePickerText: {
    marginTop: 10,
    color: "#1f8f57",
    fontWeight: "700",
    fontSize: 15,
  },
  imagePickerSub: {
    marginTop: 4,
    color: "#6b9e7f",
    fontSize: 12,
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    color: "#1a3528",
    fontWeight: "700",
    fontSize: 14,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#c9dfd3",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: "#1c3529",
    fontSize: 15,
  },
  multiLine: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  loadingBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#c9dfd3",
  },
  loadingText: {
    color: "#1f8f57",
    fontWeight: "600",
    fontSize: 14,
  },
});
