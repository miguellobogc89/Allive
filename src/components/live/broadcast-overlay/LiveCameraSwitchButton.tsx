// src/components/live/broadcast-overlay/LiveCameraSwitchButton.tsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { colors, controls } from "../../../styles";

export function LiveCameraSwitchButton({disabled=false,onPress}:{disabled?:boolean;onPress:()=>void}){
 return <Pressable accessibilityRole="button" accessibilityLabel="Cambiar cámara" disabled={disabled} onPress={onPress} style={({pressed})=>[styles.button,disabled&&styles.disabled,pressed&&!disabled&&styles.pressed]}><Ionicons name="camera-reverse-outline" size={24} color={colors.text}/></Pressable>;
}
const styles=StyleSheet.create({
 button:{width:controls.circleButtonSize,height:controls.circleButtonSize,borderRadius:controls.circleButtonSize/2,alignItems:"center",justifyContent:"center",backgroundColor:colors.overlayChrome},
 pressed:{transform:[{scale:.96}],opacity:.76},disabled:{opacity:.4},
});
