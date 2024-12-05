import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode as atob } from "base-64";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";
import moment from "moment";
import { SERVER_IP } from "@env";

const ServiceRequestListHistory = ({ serviceRequest }) => {
  const serverIp = SERVER_IP || 'default_ip_here';
  return (
    <View style={{ flex: 1, flexDirection: "row", marginTop: 30 }}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "36%",
          gap: 13,
        }}
      >
        <View
          style={{
            width: 65,
            height: 60,
            borderRadius: 50,
            backgroundColor: "red",
          }}
        />
        <Text
          style={{
            fontSize: 14,
            fontWeight: 500,

            color:
              serviceRequest.status === "Cancelled"
                ? "#E21616"
                : serviceRequest.status === "Completed"
                ? "#CDD125"
                : "#979797",
          }}
        >
          {serviceRequest.status}
        </Text>
        <TouchableOpacity>
          <Text
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#979797",
            }}
          >
            More details
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "column",
          width: "64%",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginLeft: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 13,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 600,

              color: "#292D32",
            }}
          >
            {serviceRequest.artisan.name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: 600,

              color: "#A9ABAD",
            }}
          >
            {moment(serviceRequest.requestDate).fromNow()}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 30,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: 700,

              color: "#000000",
            }}
          >
            {serviceRequest.price} DH
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 400,

              color: "#000000",
            }}
          >
            {serviceRequest.service.serviceName === "Appliance Repair"
              ? "A-P "
              : serviceRequest.service.serviceName}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 13,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,

              color: "#3D2F2F",
            }}
          >
            Time taken
          </Text>
          <AntDesign name="clockcircle" size={22} color="black" style={{}} />
          <Text
            style={{
              fontSize: 20,
              fontWeight: 400,

              color: "#211F1F",
            }}
          >
            no data
          </Text>
        </View>
      </View>
    </View>
  );
};

const ReportListHistory = ({report}) => {
  const serverIp = SERVER_IP || 'default_ip_here';
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, margin: 32 }}>
      <Text style={{ fontWeight: 600, fontSize: 24, marginBottom: 10 }}>
        {report.service.serviceName} repair
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 10,
          alignItems: "baseline",
        }}
      >
        <Text style={{ color: "#A9ABAD", fontSize: 14, fontWeight: 400 }}>
        {new Date(report.reportDate).toLocaleDateString("en-GB")}
        </Text>
        <Text style={{ color: "#292D32", fontSize: 20, fontWeight: 400 }}>
          {report.user.name}
        </Text>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text style={{ color: "#292D32" }}>
          <Text style={{ fontWeight: 500 }}>Title: </Text>
          {report.title}
        </Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: "#292D32" }}>Issues: {report.issues}</Text>

        <TouchableOpacity onPress={() => navigation.navigate("reportDetails",{report})}>
          <Text style={{ color: "#979797", textDecorationLine: "underline" }}>
            More details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ReviewListHistory = () => {
  const serverIp = SERVER_IP || 'default_ip_here';
  const navigation = useNavigation();
  //                          *To be done later*
  return <View></View>;
};

const history = () => {
  const serverIp = SERVER_IP || 'default_ip_here';
  console.log(serverIp);
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("Service Requests");
  const [serviceRequests, setServiceRequests] = useState([]);

  
  const [reports, setReports] = useState([]);
 
  const [reviews, setReviews] = useState([]);

  const [userId, setUserId] = useState("");
  

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
    try {
      const fetchUserId = async () => {
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          const decodedToken = decodeJwt(token);
          const userId = decodedToken.payload.userId; // Update this line
          //console.log("Decoded user ID:", userId);
          setUserId(userId);
        } else {
          console.log("No token found");
        }
      };

      fetchUserId();
    } catch (error) {
      console.error("Error getting userId on history:", error);
    }
  }, []);
  useEffect(() => {
    if (userId) {
      fetchUserServiceRequest();
      fetchUserReports();
      // fetchUserReviews(); *to be completed after*
    }
  }, [userId]);

  const fetchUserServiceRequest = async () => {
    try {
      const response = await axios.get(
        `http://${serverIp}:3000/service-request/user/${userId}`
      );

      setServiceRequests(response.data.serviceRequests);
      
    } catch (error) {
      alert(`Failed to load service requests: ${error.message}`);
    }
  };

  const fetchUserReports = async () => {
    try {
      const reportResponse = await axios.get(
        `http://${serverIp}:3000/reports/user/${userId}`
      );
       
      setReports(reportResponse.data.reports);
      
    } catch (error) {
      alert(`Failed to load reports: ${error.message}`);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={{ flex: 1, backgroundColor: "white" }}>
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
          History
        </Text>
        <View
          style={{
            backgroundColor: "#EFF2F5",
            width: 390,
            height: 56,
            flexDirection: "column",
            justifyContent: "flex-end",
            alignSelf: "center",
            marginTop: 9,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "stretch",
              paddingBottom: 17,
            }}
          >
            <TouchableOpacity
              onPress={() => setSelectedTab("Service Requests")}
            >
              <Text
                style={[
                  styles.textViewFirstNotSelected,
                  selectedTab === "Service Requests" &&
                    styles.textViewFirstSelected,
                ]}
              >
                Service Requests
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSelectedTab("Reports")}>
              <Text
                style={[
                  styles.textViewFirstNotSelected,
                  selectedTab === "Reports" && styles.textViewFirstSelected,
                ]}
              >
                Reports
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedTab("Reviews")}>
              <Text
                style={[
                  styles.textViewFirstNotSelected,
                  selectedTab === "Reviews" && styles.textViewFirstSelected,
                ]}
              >
                Reviews
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 3, backgroundColor: "#292D32" }} />
        </View>
      </View>
      {/* Tab Content */}
      <ScrollView>
        {selectedTab === "Service Requests" && (
          <View>
            {serviceRequests.map((serviceRequest, index) => (
              <React.Fragment key={index}>
                <ServiceRequestListHistory serviceRequest={serviceRequest} />
                {index < serviceRequests.length - 1 && (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      
                    }}
                  >
                    <View
                      style={{
                        width: 352,
                        height: 1,
                        backgroundColor: "#D5DEE7",
                        border: 1,
                        marginTop: 20,
                      }}
                    />
                  </View>
                )}
              </React.Fragment>
            ))}
          </View>
        )}
        {selectedTab === "Reports" && (
          <View>
          {reports.map((report, index) => (
              <React.Fragment key={index}>
                <ReportListHistory report={report} />
                {index < reports.length - 1 && (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      
                    }}
                  >
                    <View
                      style={{
                        width: 352,
                        height: 1,
                        backgroundColor: "#D5DEE7",
                        border: 1,
                        marginTop: 20,
                      }}
                    />
                  </View>
                )}
              </React.Fragment>
            ))}
          </View>
        )}
        {selectedTab === "Reviews" && (
          <View>
            <ReviewListHistory reviews={reviews} />
          </View>
        )}
      </ScrollView>
    </View>
    </GestureHandlerRootView>
  );
};

export default history;

const styles = StyleSheet.create({
  textViewFirstNotSelected: {
    color: "#B3BFCB",
  },
  textViewFirstSelected: {
    color: "#292D32",
  },
});
