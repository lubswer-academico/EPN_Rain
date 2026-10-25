import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Theme } from "../../constants/theme";

export function OfflineBanner() {
  const [estaDesconectado, setEstaDesconectado] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const sinRed = !state.isConnected || state.isInternetReachable === false;
      setEstaDesconectado(sinRed);
    });
    return () => unsubscribe();
  }, []);

  if (!estaDesconectado) return null;

  return (
    <View style={styles.banner}>
      <Ionicons
        name="cloud-offline"
        size={15}
        color={Theme.colors.badgePendingText}
      />
      <Text style={styles.texto}>
        Modo Sin Conexión
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Theme.colors.badgePendingBg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#FDE68A",
  },
  texto: {
    fontSize: 11,
    fontWeight: "700",
    color: Theme.colors.badgePendingText,
  },
});
