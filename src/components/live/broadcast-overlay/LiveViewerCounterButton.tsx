// src/components/live/broadcast-overlay/LiveViewerCounterButton.tsx
import { Ionicons } from "@expo/vector-icons";
import type { Animated } from "react-native";
import { Animated as RNAnimated, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, typography } from "../../../styles";

type Props={viewers:number;viewerDelta:number|null;badgeScale:Animated.AnimatedInterpolation<string|number>;deltaOpacity:Animated.AnimatedInterpolation<string|number>;deltaTranslateY:Animated.AnimatedInterpolation<string|number>;onPress:()=>void;};
export function LiveViewerCounterButton({viewers,viewerDelta,badgeScale,deltaOpacity,deltaTranslateY,onPress}:Props){
 return <View style={styles.wrapper}>
  <RNAnimated.View style={{transform:[{scale:badgeScale}]}}>
   <Pressable accessibilityRole="button" accessibilityLabel="Ver espectadores" onPress={onPress} style={({pressed})=>[styles.button,pressed&&styles.pressed]}>
    <Ionicons name="eye-outline" size={18} color={colors.text}/><Text style={styles.text}>{viewers}</Text>
   </Pressable>
  </RNAnimated.View>
  {viewerDelta!==null?<RNAnimated.Text pointerEvents="none" style={[styles.delta,{opacity:deltaOpacity,transform:[{translateY:deltaTranslateY}]}]}>{viewerDelta>0?`+${viewerDelta}`:viewerDelta}</RNAnimated.Text>:null}
 </View>;
}
const styles=StyleSheet.create({
 wrapper:{position:"relative",alignItems:"center"},
 button:{minHeight:36,paddingHorizontal:12,flexDirection:"row",alignItems:"center",justifyContent:"center",gap:6,borderRadius:radius.round,backgroundColor:colors.overlayChrome},
 pressed:{opacity:.72},text:{color:colors.text,...typography.label},
 delta:{position:"absolute",top:42,color:colors.text,fontSize:typography.caption.fontSize,fontWeight:"800",paddingHorizontal:7,paddingVertical:3,borderRadius:radius.sm,backgroundColor:colors.overlayDelta},
});
