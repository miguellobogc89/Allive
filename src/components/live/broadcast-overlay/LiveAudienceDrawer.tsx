// src/components/live/broadcast-overlay/LiveAudienceDrawer.tsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../../../styles";

export type BroadcastAudienceMember={id:string;name:string};
type Props={open:boolean;viewers:number;members?:BroadcastAudienceMember[];onClose:()=>void;};
export function LiveAudienceDrawer({open,viewers,members=[],onClose}:Props){
 if(!open)return null;
 return <View style={styles.layer} pointerEvents="box-none"><Pressable accessibilityLabel="Cerrar espectadores" onPress={onClose} style={styles.scrim}/><View style={styles.drawer}>
  <View style={styles.header}><View><Text style={styles.eyebrow}>EN DIRECTO</Text><Text style={styles.title}>Espectadores · {viewers}</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Cerrar" onPress={onClose} style={styles.closeButton}><Ionicons name="close" size={22} color={colors.text}/></Pressable></View>
  <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>{members.length>0?members.map(member=><View key={member.id} style={styles.member}><View style={styles.avatar}><Text style={styles.avatarText}>{member.name.slice(0,1).toUpperCase()}</Text></View><Text numberOfLines={1} style={styles.memberName}>{member.name}</Text></View>):<Text style={styles.empty}>La lista detallada de espectadores aparecerá aquí.</Text>}</ScrollView>
 </View></View>;
}
const styles=StyleSheet.create({
 layer:{...StyleSheet.absoluteFill,zIndex:80},scrim:{...StyleSheet.absoluteFill,backgroundColor:"rgba(0,0,0,0.16)"},
 drawer:{position:"absolute",top:16,right:16,bottom:16,width:320,maxWidth:"86%",borderRadius:radius.lg,backgroundColor:"rgba(18,18,20,0.94)",overflow:"hidden"},
 header:{padding:spacing.lg,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:"rgba(255,255,255,0.14)"},
 eyebrow:{color:colors.textOnOverlayPlaceholder,fontSize:10,fontWeight:"800",letterSpacing:1.6},title:{marginTop:4,color:colors.text,fontSize:18,fontWeight:"700"},
 closeButton:{width:36,height:36,borderRadius:18,alignItems:"center",justifyContent:"center",backgroundColor:colors.overlayChrome},content:{padding:spacing.lg,gap:12},
 member:{flexDirection:"row",alignItems:"center",gap:11},avatar:{width:34,height:34,borderRadius:17,alignItems:"center",justifyContent:"center",backgroundColor:colors.overlayChrome},
 avatarText:{color:colors.text,...typography.label},memberName:{flex:1,color:colors.text,...typography.label},empty:{color:colors.textOnOverlayPlaceholder,fontSize:14,lineHeight:20},
});
