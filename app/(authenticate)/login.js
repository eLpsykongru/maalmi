import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Redirect, useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const login = () => {

  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          router.replace("/(tabs)/home");
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkLoginStatus();
  }, []);
  const handleLogin = () => {
    const user = {
      phoneNumber: phoneNumber,
      password: password,
    };
    
    console.log("User object sent to server:", user);

    axios.post(`http://192.168.100.7:3000/login`, user)
  .then((response) => {
    console.log("Response from server:", response);
    const token = response.data.token;
    console.log("Received token:", token);
    AsyncStorage.setItem("authToken", token);
    router.replace("/(tabs)/home");
  })
  .catch((error) => {
    console.log("Error during login:", error);
  });

  
  };
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <View style={{ alignItems: "center" }}>
        <Image
          style={{ width: 150, height: 150, resizeMode: "contain" }}
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png",
          }}
        />
      </View>
      <KeyboardAvoidingView style={{ marginLeft: 21 }}>
        <View>
          <Text style={{ fontWeight: 500, fontSize: 36, color: "#292D32" }}>
            Welcome!
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: 400,
              color: "#6A798A",
              marginTop: 10,
            }}
          >
            Sign up or Login in your Account
          </Text>
        </View>
        <View>
          <View style={{ marginTop: 36 }}>
            <Text
              style={{
                marginLeft: 10,
                fontSize: 17,
                lineHeight: 23,
                fontWeight: 400,
              }}
            >
              Phone Number
            </Text>
            <View
              style={{
                paddingVertical: 5,
                marginTop: 6,
                flexDirection: "row",
                backgroundColor: "#EFF2F5",
                width: 348,
                height: 55,
                alignItems: "center",
                borderRadius: 14,
                display: "flex",
                gap: 10,
              }}
            >
              <TextInput
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
                style={{
                  marginLeft: 10,
                  fontSize: 17,
                  lineHeight: 23,
                  fontWeight: 400,
                }}
                placeholder="Enter your phone number"
              />
            </View>
          </View>
          <View style={{ marginTop: 26 }}>
            <Text
              style={{
                marginLeft: 10,
                fontSize: 17,
                lineHeight: 23,
                fontWeight: 400,
              }}
            >
              Password
            </Text>
            <View
              style={{
                paddingVertical: 5,
                marginTop: 6,
                flexDirection: "row",
                backgroundColor: "#EFF2F5",
                width: 348,
                height: 55,
                alignItems: "center",
                borderRadius: 14,
                display: "flex",
                gap: 10,
              }}
            >
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={{
                  marginLeft: 10,
                  fontSize: 17,
                  lineHeight: 23,
                  fontWeight: 400,
                }}
                placeholder="Enter your password"
              />
            </View>
          </View>

          <Pressable>
            <Text
              style={{
                textAlign: "right",
                marginRight: 21,
                marginTop: 21,
                fontSize: 17,
                fontWeight: 400,
                lineHeight: 23,
                color: "#6A798A",
                textDecorationLine: "underline",
              }}
            >
              Forgot password?
            </Text>
          </Pressable>
          <View style={{ position: "absolute", marginTop: 280 }}>
            <Pressable
              onPress={handleLogin}
              style={{
                marginTop: 70,
                display: "flex",
                width: 348,
                height: 58,
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                borderRadius: 18,
                backgroundColor: "#8F7BE1",
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 18,
                  fontWeight: 700,
                  lineHeight: 18,
                }}
              >
                Login
              </Text>
            </Pressable>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 17,
                fontWeight: 400,
                lineHeight: 23,
                marginTop: 15,
              }}
            >
              <Text style={{ color: "#9981FA" }}>New to E-Maalmi? </Text>
              <View>
                <Pressable onPress={() => router.replace("/register")}>
                  <Text
                    style={{
                      color: "#9981FA",
                      textDecorationLine: "underline",
                    }}
                  >
                    Sign up
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({});
