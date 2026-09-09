// src/components/live/broadcast-overlay/LiveLikeCounter.tsx
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, typography } from "../../../styles";

export function LiveLikeCounter({ count }: { count: number }) {
  return <View style={styles.container} pointerEvents="none">
    <Ionicons name="heart" size={18} color={colors.text} />
    <Text style={styles.text}>{count}</Text>
  </View>;
}
const styles=StyleSheet.create({
  container:{minHeight:36,paddingHorizontal:12,flexDirection:"row",alignItems:"center",justifyContent:"center",gap:6,borderRadius:radius.round,backgroundColor:colors.overlayChrome},
  text:{color:colors.text,...typography.label},
});
