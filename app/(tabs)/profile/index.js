import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Button,
  ScrollView,
  TextInput,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

const index = () => {
  const [userName, setUserName] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        // Retrieve userName from AsyncStorage
        const storedUserName = await AsyncStorage.getItem("userName");
        if (storedUserName !== null) {
          setUserName(storedUserName);
        }
      } catch (error) {
        console.error("Error fetching userName:", error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#77ACF1", paddingLeft:39 }}>
      <TouchableOpacity
        style={{
          width: 34,
          height: 34,
          backgroundColor: "#EFF2F5",
          borderRadius: 17,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "flex-end",
          marginRight: 35,
        }}
        onPress={navigation.goBack}
      >
        <Feather name="x" size={24} color="black" />
      </TouchableOpacity>
      <View style={{ marginTop: 80 }}>
        <Text style={{ fontSize: 26, fontWeight: 700, lineHeight: 23, color: "#000000" }}>
          Welcome,
        </Text>
        <Text style={{ fontSize: 24, fontWeight: 500, lineHeight: 23, color: "#000000", marginTop: 25 }}>
          {userName ? userName : "Guest"}!
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({});
