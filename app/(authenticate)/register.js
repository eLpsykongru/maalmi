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
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from "react-native-picker-select";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";


const register = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [city, setCity] = useState("");
  const [adresse, setAdresse] = useState("");
  const router = useRouter();

  const handleRegister = ()=> {
    const user = {
      phoneNumber:phoneNumber,
      name:name,
      password:password,
      city:city,
      adresse:adresse
    } 
    axios.post("http://192.168.100.7:3000/register",user)
      .then((response) =>{
  
      console.log(response);
      Alert.alert("Registration successfuly","You have been registered successfuly");
      setName("");
      setPhoneNumber("");
      setPassword("");
      setRePassword("");
      setCity("");
      setAdresse("");
       router.replace("/login");
    }).catch((error)=>{
      Alert.alert("Registration failed","An error concured while registering");
      console.log("Registration failed",error);
    })
  }

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  const handleNext = () => {
    if (
      step === 1 &&
      name.trim() !== "" &&
      phoneNumber.trim() !== "" &&
      password === rePassword
    ) {
      setStep(2);
    } else if (step === 2 && city.trim() !== "" && adresse.trim() !== "") {
      setStep(3);
    }
  };


  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <KeyboardAvoidingView style={{ marginLeft: 21, marginTop: 17 }}>
        {step === 1 && (
          <View>
            <Text style={{ fontWeight: 500, fontSize: 36, color: "#292D32" }}>
              Create an Account!
            </Text>
          </View>
        )}
        {step === 2 && (
          <View>
            <Text style={{ fontWeight: 500, fontSize: 36, color: "#292D32" }}>
              Step 2: Location Details
            </Text>
          </View>
        )}
        {step === 3 && (
          <View>
            <Text style={{ fontWeight: 500, fontSize: 36, color: "#292D32" }}>
              Step 3: Confirmation
            </Text>
            <Text
              style={{
                fontSize: 17,
                fontWeight: 400,
                color: "#6A798A",
                marginTop: 20,
              }}
            >
              Please confirm your details below to complete the registration
              process.
            </Text>
          </View>
        )}
        <View>
          {step === 1 && (
            <View style={{ marginTop: 36 }}>
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 17,
                  lineHeight: 23,
                  fontWeight: 400,
                }}
              >
                Full Name
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
                  value={name}
                  onChangeText={(text) => setName(text)}
                  style={{
                    marginLeft: 10,
                    fontSize: 17,
                    lineHeight: 23,
                    fontWeight: 400,
                  }}
                  placeholder="Enter your full name"
                />
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

              <View style={{ marginTop: 26 }}>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 17,
                    lineHeight: 23,
                    fontWeight: 400,
                  }}
                >
                  Confirm Password
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
                    value={rePassword}
                    onChangeText={(text) => setRePassword(text)}
                    style={{
                      marginLeft: 10,
                      fontSize: 17,
                      lineHeight: 23,
                      fontWeight: 400,
                    }}
                    placeholder="Re-enter your password"
                  />
                </View>
              </View>
            </View>
          )}

          {step === 2 && (
            <View>
              <View style={{ marginTop: 20, marginRight: 20 }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: 400,
                    color: "#6A798A",
                    marginTop: 20,
                  }}
                >
                  Enter your city:
                </Text>
                <RNPickerSelect
                  onValueChange={(value) => setCity(value)}
                  items={[
                    { label: "Tanger", value: "Tanger" },
                    { label: "Casablanca", value: "Casablanca" },
                    { label: "Fes", value: "Fes" },
                    { label: "Rabat", value: "Rabat" },
                    { label: "Kenitra", value: "Kenitra" },
                  ]}
                  placeholder={{ label: "Select your city...", value: null }}
                  style={{
                    inputIOS: {
                      fontSize: 16,
                      paddingVertical: 12,
                      paddingHorizontal: 10,
                      marginTop: 15,

                      borderRadius: 8,
                      color: "black",

                      backgroundColor: "#EFF2F5",
                    },
                    inputAndroid: {
                      fontSize: 16,
                      paddingVertical: 12,
                      paddingHorizontal: 10,
                      marginTop: 15,

                      borderRadius: 8,
                      color: "black",

                      backgroundColor: "#EFF2F5",
                    },
                  }}
                />
              </View>
              <View
                style={{
                  marginRight: 20,
                  marginTop: 25,
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: 400,
                    color: "#6A798A",
                    marginTop: 20,
                  }}
                >
                  Enter your Adresse:
                </Text>
                <TextInput
                  value={adresse}
                  onChangeText={(text) => setAdresse(text)}
                  style={{
                    fontSize: 16,
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    marginTop: 15,

                    borderRadius: 8,
                    color: "black",

                    backgroundColor: "#EFF2F5",
                  }}
                  placeholder="Enter your Adresse"
                />
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={{ marginTop: 20, marginRight: 20 }}>
              <Text style={styles.confirmationText}>Full Name: {name}</Text>
              <Text style={styles.confirmationText}>
                Phone Number: {phoneNumber}
              </Text>
              <Text style={styles.confirmationText}>Password: {password}</Text>
              <Text style={styles.confirmationText}>City: {city}</Text>
              <Text style={styles.confirmationText}>adresse: {adresse}</Text>
            </View>
          )}
          {step === 1 && (
            <View style={{ position: "absolute", marginTop: 490 }}>
              <Pressable
                onPress={handleNext}
                style={{
                  marginTop: 30,
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
                  Continue
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
                <Text style={{ color: "#9981FA" }}>
                  Already have an account?{" "}
                </Text>
                <View>
                  <Pressable onPress={() => router.replace("/login")}>
                    <Text
                      style={{
                        color: "#9981FA",
                        textDecorationLine: "underline",
                      }}
                    >
                      Sign in
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          {step === 2 && (
            <View
              style={{
                position: "absolute",
                marginTop: 490,
                
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 5,
                gap: 10,
                justifyContent: "space-between"
              }}
            >
            <Pressable onPress={handlePrev}>
              <FontAwesome5
                name="caret-left"
                size={40}
                color="#292D32"
                style={{
                  marginTop: 24,
                }}
              />
            </Pressable>

              <Pressable
                onPress={handleNext}
                style={{
                  marginTop: 30,
                  display: "flex",
                  width: 250,
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
                  Continue
                </Text>
              </Pressable>
            </View>
          )}
          {step === 3 && (
            <View
              style={{
                position: "absolute",
                marginTop: 490,
                
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 5,
                gap: 10,
                justifyContent: "space-between"
              }}
            >
            <Pressable onPress={handlePrev}>
              <FontAwesome5
                name="caret-left"
                size={40}
                color="#292D32"
                style={{
                  marginTop: 24,
                }}
              />
            </Pressable>

              <Pressable
                onPress={handleRegister}
                style={{
                  marginTop: 30,
                  display: "flex",
                  width: 250,
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
                  Confirm
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default register;

const styles = StyleSheet.create({
  confirmationText: {
    fontSize: 17,
    fontWeight: 400,
    color: "#6A798A",
    marginTop: 10,
  },
});
