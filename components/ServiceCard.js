import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const ServiceCard = ({ item,index }) => {
  const isCentered = index === 3;

  return (
    <View  style={[styles.container, isCentered && styles.centeredContainer]}>
      <View
        style={{
          backgroundColor: "rgba(244, 115, 158, 0.12)",
          
          flexDirection: "column",
          borderRadius: 50,
          width: 100,
          height: 100,
          padding: 20,
          alignItems: "center",
          
        }}
      >
      
        <Image
          style={{ width: 50, height: 50 }}
          source={{ uri: item?.serviceLogo }}
        />
        <Text
          style={{
            textAlign: "center",
            fontSize: 11,
            lineHeight: 18,
            fontWeight: 500,
          }}
        >
          {item?.serviceName}
        </Text>
        
      </View>
    </View>
  );
};

export default ServiceCard;

const styles = StyleSheet.create({
  centeredContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "white",
    flex: 1, 
  },
});
