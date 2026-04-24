import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { PrimaryButton } from "../components/PrimaryButton";
import { SectionHeader } from "../components/SectionHeader";
import { useAppContext } from "../context/AppContext";

export default function AddProductScreen() {
  const { addProduct } = useAppContext();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const onSubmit = () => {
    if (!name || !price || !description || !category) {
      Alert.alert("Please fill all fields");
      return;
    }

    addProduct({
      name,
      price: Number(price),
      description,
      category,
      shortDescription: description.slice(0, 55),
    });

    Alert.alert("Success", "Product added in local state");
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="Add Product" subtitle="UI-only seller action" />

        <Text style={styles.label}>Product Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Organic Lemons"
        />

        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholder="Ex: 120"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multiLine]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Write product description"
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="Ex: Fruits"
        />

        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>
            Image Upload Placeholder (UI only)
          </Text>
        </View>

        <PrimaryButton label="Add Product" onPress={onSubmit} />
        <View style={styles.spacer} />
        <PrimaryButton
          label="Cancel"
          variant="ghost"
          onPress={() => router.back()}
        />
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
    paddingBottom: 22,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    color: "#264234",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d4e3da",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#1c3529",
  },
  multiLine: {
    minHeight: 86,
    textAlignVertical: "top",
  },
  imagePlaceholder: {
    marginTop: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#b8cdc0",
    borderRadius: 12,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fcfa",
  },
  placeholderText: {
    color: "#6b8074",
    fontSize: 13,
  },
  spacer: {
    height: 8,
  },
});
