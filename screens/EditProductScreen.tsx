import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, updateProduct, deleteProduct } = useAppContext();

  const product = products.find((item) => item.id === id);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (!product) {
      return;
    }

    setName(product.name);
    setPrice(String(product.price));
    setDescription(product.description);
    setCategory(product.category);
  }, [product]);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emptyText}>Product not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const onSave = () => {
    updateProduct(product.id, {
      name,
      price: Number(price),
      description,
      category,
      shortDescription: description.slice(0, 55),
    });

    Alert.alert("Saved", "Product changes updated in local state.");
    router.back();
  };

  const onDelete = () => {
    deleteProduct(product.id);
    Alert.alert("Deleted", "Product removed from local state.");
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          title="Edit Product"
          subtitle="Pre-filled with selected product"
        />

        <Text style={styles.label}>Product Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multiLine]}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
        />

        <PrimaryButton label="Save Changes" onPress={onSave} />
        <View style={styles.spacer} />
        <PrimaryButton
          label="Delete Product"
          variant="ghost"
          onPress={onDelete}
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
    paddingBottom: 24,
  },
  emptyText: {
    color: "#274235",
    fontWeight: "700",
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
  spacer: {
    height: 8,
  },
});
