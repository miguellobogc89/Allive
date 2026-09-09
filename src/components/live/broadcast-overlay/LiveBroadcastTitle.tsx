// src/components/live/broadcast-overlay/LiveBroadcastTitle.tsx
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius, spacing } from "../../../styles";

type Props={title:string;editing:boolean;onChangeTitle:(value:string)=>void;onEdit:()=>void;onSave:()=>void;};
export function LiveBroadcastTitle({title,editing,onChangeTitle,onEdit,onSave}:Props){
 if(editing)return <View style={styles.editor}><TextInput autoFocus value={title} onChangeText={onChangeTitle} onSubmitEditing={onSave} onBlur={onSave} maxLength={90} placeholder="Pon un título al directo" placeholderTextColor={colors.textOnOverlayPlaceholder} style={styles.input} returnKeyType="done"/></View>;
 return <View style={styles.row}><Text numberOfLines={2} style={styles.title}>{title.trim()||"Sin título"}</Text><Pressable accessibilityRole="button" accessibilityLabel="Editar título" onPress={onEdit} hitSlop={10} style={({pressed})=>[styles.editButton,pressed&&styles.pressed]}><Ionicons name="pencil-outline" size={17} color={colors.text}/></Pressable></View>;
}
const styles=StyleSheet.create({
 row:{maxWidth:560,flexDirection:"row",alignItems:"flex-end",gap:spacing.sm},
 title:{flexShrink:1,color:colors.text,fontSize:27,lineHeight:31,fontWeight:"700",letterSpacing:-.5,textShadowColor:"rgba(0,0,0,0.55)",textShadowOffset:{width:0,height:1},textShadowRadius:8},
 editButton:{width:34,height:34,borderRadius:17,alignItems:"center",justifyContent:"center",backgroundColor:colors.overlayChrome},
 pressed:{opacity:.72},editor:{maxWidth:560,borderRadius:radius.md,backgroundColor:colors.overlayChrome,paddingHorizontal:14,paddingVertical:8},
 input:{minWidth:240,color:colors.text,fontSize:21,lineHeight:26,fontWeight:"700"},
});
