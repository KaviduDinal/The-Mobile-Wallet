import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"


      }}
    >
      <Text style={styles.container}>Edit app/index.jsx to edit this screen.</Text>
      <Link href={"/about"}>About</Link>
      <View>
        <Text>
          Hello
        </Text>
      </View>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "purple",
  },
});

