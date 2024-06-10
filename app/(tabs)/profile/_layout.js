import {Stack } from "expo-router";


export default function Layout(){
    return(
        <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen name="index" />
            <Stack.Screen name="history"/ >
                <Stack.Screen name="reportDetails"/>
          
        </Stack>
    )
}