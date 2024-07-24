import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const reportDetails = () => {
  
  const navigation = useNavigation();
  const route = useRoute();
  const goBack = () => {
    navigation.goBack();
  };
  const { report } = route.params;
  useEffect(() => {
    console.log(report);
  }, [report]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ backgroundColor: "white" }}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-start",
            padding: 18,
            justifyContent: "space-between",
            gap: 9,
            activeOpacity: 0.5,
          }}
          onPress={goBack}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
          <Text>Back</Text>
        </TouchableOpacity>
        <View>
          <Text
            style={{
              fontWeight: 400,
              fontSize: 36,
              lineHeight: 42,
              color: "#292D32",
              paddingLeft: 21,
              paddingTop: 14,
            }}
          >
            Report Details
          </Text>
          <View
            style={{
              width: 390,
              height: 6,
              backgroundColor: "#D5DEE7",
              marginTop: 20,
            }}
          />
        </View>

        <View>
          <Text style={{ fontSize: 20, fontWeight: 400, paddingLeft: 21 }}>
            Service: {report.service.serviceName}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 400, paddingLeft: 21 }}>
            Artisan: {report.artisan.name}
          </Text>
        </View>
        <View
          style={{
            width: 290,
            height: 1,
            backgroundColor: "#D5DEE7",
            marginTop: 20,
          }}
        />
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <View>
          <Text style={{ fontSize: 20, fontWeight: 400, paddingLeft: 21 }}>
            Report information :
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 400, paddingLeft: 21 }}>
            Date: {new Date(report.reportDate).toLocaleDateString()}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 400, paddingLeft: 21 }}>
            Title: {report.title}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 400, paddingLeft: 21 }}>
            Description: {report.description}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 400, paddingLeft: 21 }}>
            Issues: {report.issues}
          </Text>
        </View>
        <View
          style={{
            width: 290,
            height: 1,
            backgroundColor: "#D5DEE7",
            marginTop: 20,
          }}
        />

        <View>
          <Text style={{ fontSize: 20, fontWeight: 400, paddingLeft: 21 }}>
            Report status : 
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 400, paddingLeft: 21 }}>
            Status: {report.status}
          </Text>
        </View>
        <View
          style={{
            width: 290,
            height: 1,
            backgroundColor: "#D5DEE7",
            marginTop: 20,
          }}
        />
        <View>
          <Text style={{ fontSize: 20, fontWeight: 400, paddingLeft: 21 }}>
            Payment and rating :
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 400, paddingLeft: 21 }}>
            Payment: {report.serviceRequest.price} DH
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 400, paddingLeft: 21 }}>
            Rating: {report.serviceRequest.rate} {report.serviceRequest.rate > 1 ? "stars" : "star"}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 400, paddingLeft: 21 }}>
            Time taken: {report.serviceRequest.timeTaken}
          </Text>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default reportDetails;
