import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  RefreshControl,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { decode as atob } from "base-64";
import { AntDesign } from "@expo/vector-icons";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import ServiceCard from "../../../components/ServiceCard";

const index = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const [userName, setUserName] = useState("");
  const [userCity, setUserCity] = useState("");
  const [services, setServices] = useState("");
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  function base64UrlDecode(str) {
    try {
      // Decode base64url-encoded string
      str = str.replace(/-/g, "+").replace(/_/g, "/");
      while (str.length % 4) {
        str += "=";
      }

      return atob(str);
    } catch (error) {
      console.error("Error decoding base64url:", error);
      return null;
    }
  }

  function decodeJwt(token) {
    try {
      const [header, payload, signature] = token.split(".");

      // Decode header and payload
      const decodedHeader = JSON.parse(base64UrlDecode(header));
      const decodedPayload = JSON.parse(base64UrlDecode(payload));

      //  console.log('Decoded Header:', decodedHeader);
      //console.log('Decoded Payload:', decodedPayload);

      return {
        header: decodedHeader,
        payload: decodedPayload,
        signature: signature,
      };
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          const decodedToken = decodeJwt(token);
          const userId = decodedToken.payload.userId; // Update this line
          //console.log("Decoded user ID:", userId);
          setUserId(userId);
        } else {
          console.log("No token found");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://192.168.0.61:3000/services");
        const serviceData = response.data.services;
        setServices(serviceData);
      } catch (error) {
        console.log("Error fetching services", error);
      }
    };

    fetchServices();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.61:3000/profile/${userId}`
      );
      const userData = response.data.user;
      const userDataName = response.data.user.name;
      const userDataCity = response.data.user.city;
      setUser(userData);
      setUserName(userDataName);
      setUserCity(userDataCity);

      //store userName in asyncstorage
      AsyncStorage.setItem("userName", userDataName);
    } catch (error) {
      console.log("Error fetching user profile", error);
    }
  };

  return (
     <GestureHandlerRootView style={{ flex: 1 }}>    
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          marginHorizontal: 10,
          justifyContent: "space-between",
          padding: 21,
        }}
      >
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "flex-start",
            borderWidth: 0.2,
            borderColor: "grey",
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            backgroundColor: "#FFFEFE",
            padding: 4,
            width: 180,
            height: 40,
            gap: 4,
          }}
        >
          <Ionicons name="ios-location-sharp" size={30} color="black" />
          <Text style={{ color: "#292D32", fontSize: 13, fontWeight: 700 }}>
            {userCity}, Morocco
          </Text>
        </View>
        <View></View>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ padding: 27, paddingTop: 31 }}>
          <Text style={{ color: "#000", fontSize: 32, fontWeight: 400 }}>
            Hey, <Text style={{ fontWeight: 700 }}>{userName}!</Text>
          </Text>
          <Text
            style={{
              color: "#000",
              fontSize: 32,
              fontWeight: 400,
              paddingTop: 42,
            }}
          >
            Find Trusted Artisan for Your Home Repairs.
          </Text>
        </View>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            display: "flex",
            padding: 27,
            justifyContent: "space-between",
            gap: 18,
          }}
        >
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
              borderRadius: 22,
              width: 278,
              height: 57,
              backgroundColor: "#EFF2F5",
              padding: 14,
            }}
          >
            <AntDesign name="search1" size={24} color="#45B8E9" />
            <TextInput
              placeholder="Search Artisans, Services"
              style={{
                fontSize: 17,
                fontWeight: 400,
                color: "#B3BFCB",
                lineHeight: 23,
              }}
            />
          </View>
          <View
            style={{
              backgroundColor: "#77ACF1",
              padding: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Ionicons name="filter" size={24} color="#FFFFFF" />
          </View>
        </View>
        <View style={{ padding: 27 }}>
          <View
            style={{
              flex: 1,
              height: Dimensions.get("window").height / 4 ,
              width: Dimensions.get("window").width / 1.2,
            }}
          >
            <FlatList
              data={services}
              columnWrapperStyle={{ justifyContent: "space-between", gap: 10 }}
              numColumns={3}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                
                <ServiceCard item={item} key={index} />
              )}
            />
          </View>
        </View>
        <View style={{ padding: 27, paddingTop: 31 }}>
          <Text
            style={{
              color: "#000",
              fontSize: 32,
              fontWeight: 400,
            }}
          >
            How it works
          </Text>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              marginTop: 56,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Image
                style={{ width: 32, height: 30, resizeMode: "contain" }}
                source={{
                  uri: `https://s3-alpha-sig.figma.com/img/d5d0/ec6c/c59ba58954dd3a3d66d6289c321b6ff0?Expires=1708905600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HW5jjeI0WU5pbd4Dd6okhkZDBCRLJQ0ffdifS3YabU264Bx7KspZ83LOmk7JvD3u8miovEE2U~ZD2xIvNJhAYVHQaRYRbAAZLXtk8HBbPviNhAzOiJUoGtLnUAN-21DaLaztcyHwP-FMfIn3G9qj9QxDrBez-QdmH3081PvPewdWf4SWuEHzacac1GFNn-jxMmEedpIiQfrUL54MRuIo6EdofNKv3aL3FO9RgLBM-PNig2GouU-Z7V2YwTCAHWQvaCjFNwHsEWUiDTj375MTD2Rvh4zd6-OIHxLuehAvV8Wxiy0gKzaHDUL0Yh-bsiF5ZUR3XEmyQodiAl6iRPhwtA__`,
                }}
              />
              <Text style={{ fontWeight: 200, fontSize: 18, lineHeight: 36 }}>
                Search for services
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Image
                style={{ width: 32, height: 30, resizeMode: "contain" }}
                source={{
                  uri: `https://s3-alpha-sig.figma.com/img/4f5d/acc6/46ca4fe25fb05e10506dbc4c4a8133de?Expires=1708905600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=hVhaIBAR2b03FyQkpLc5g0cYMy9nfAP6SbNmGN8mWwBL805NsDJqogJCmgzYk5rSq0HtWXwyATyTxjQEbjhrqFfFT697nwk-Dq0vf1Hl6UcsFfSOtENhZUjeJ~FOSwINXT-bLtl3I1Hx3b9MjdmojUdIBhvgJnUu7kbq~RcxCnYaJoQxK6P1vzubK8p1lj9dxgZyygkGzvVnTVT5JptBppxjljCIvB-G6I3PdVay-HUswkRVd1fdiBZc9s0aLx75zyOTCfFTt4C~ERikUt0DrRkAZrca00e8fP2ym-bntqdo3Y~vK6TYtnat~Uy3aYghVFJDyNFrDnTIs-Hci-M4iQ__`,
                }}
              />
              <Text style={{ fontWeight: 200, fontSize: 18, lineHeight: 36 }}>
                Compare offers from artisans
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Image
                style={{ width: 32, height: 30, resizeMode: "contain" }}
                source={{
                  uri: `https://s3-alpha-sig.figma.com/img/f646/7601/5898d544473a133ca680c8800e058522?Expires=1708905600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=REx4jv5~MnCifTLHGVDpU8KEYsTXhzSLi9trdBkvRYiyeqgVQlMhO~RwQHFom5rbqoPBCo2wLe2EsXX4zMH3mi-SoQ6nFyS3JpnBqXnJQLg4OiAgSBU0l6Ig3Q5fRDOJ37JiisjbKPQ3YaWrKLHDKPEfQsqkH8~2KuwtGCDuXBTN~2m60FvMLZyB3fmRed2U3e5uBm9b0Dtkn8MOhD4xCE2Mq64~fCs5ESc9u6CeErJcvrEcsYU2Modjoas93I5HiMp5ZNPX3uu0mGf4LEKSi1ka4PMuC-AH6X7SUdmvtCUq3jsxC~vNXSWrxMrc2cjhm~pzrgoI5FIH32YR4R6gyg__`,
                }}
              />
              <Text style={{ fontWeight: 200, fontSize: 18, lineHeight: 36 }}>
                Book the most suitable offer
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Image
                style={{ width: 32, height: 30, resizeMode: "contain" }}
                source={{
                  uri: `https://s3-alpha-sig.figma.com/img/c889/ffd8/d24912647ab56a120bf7c1df5bf20bcb?Expires=1708905600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Sw2sxM~sqluvyXSjTonBhwXeGhzTJgCiB9BEC5eXc7rXRFy7-bhRAIcDgUJiWQwD0i8VzXqBGkEm7VQXGfWcxE1b8ztEDC1ixNkMhONXh9LBSVv9buOoPpTWCS3-5XrAUHZyW~wdbzzdpFo3C8xS0Z6uHPLYWuzF-FX-~sxBWHmsgzKEIWrAh-R0K4xVS3i8mVcSV~zabECGsQhanz-TmYW5mqFT3F~5HqbRLWZbj-335ZcuUx~ccga8oaJDoVMZyTq83t6LGU785qdvQWQd~qaFSm8rFtq7meEc4aduvyGap56LojKRR35Q1dk8PDXja9HWrlI7rdMWpDG-3mseuA__`,
                }}
              />
              <Text style={{ fontWeight: 200, fontSize: 18, lineHeight: 36 }}>
                Get your repairs done hassle-free
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
    </GestureHandlerRootView>
  );
};

export default index;

const styles = StyleSheet.create({});
