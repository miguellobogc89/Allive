import { Pressable, StyleSheet, Text, View } from "react-native";
type Props={isFollowing:boolean;loading:boolean;onFollow:()=>void;onSubscribe:()=>void;};
export function ProfilePublicActions({isFollowing,loading,onFollow,onSubscribe}:Props){
 return <View style={styles.row}>
  <Pressable disabled={loading} onPress={onFollow} style={[styles.button,styles.follow,isFollowing&&styles.following]}>
   <Text style={[styles.text,styles.followText,isFollowing&&styles.followingText]}>{loading?"...":isFollowing?"Siguiendo":"Seguir"}</Text>
  </Pressable>
  <Pressable onPress={onSubscribe} style={[styles.button,styles.subscribe]}><Text style={[styles.text,styles.subscribeText]}>Suscribir</Text></Pressable>
 </View>;
}
const styles=StyleSheet.create({
 row:{flexDirection:"row",gap:9,marginTop:17},
 button:{flex:1,minHeight:42,borderRadius:10,alignItems:"center",justifyContent:"center"},
 follow:{backgroundColor:"#111111"},following:{backgroundColor:"#F1F1F1",borderWidth:1,borderColor:"#E0E0E0"},
 subscribe:{backgroundColor:"#0756D8"},
 text:{fontSize:13,fontWeight:"600"},followText:{color:"#FFFFFF"},followingText:{color:"#171717"},subscribeText:{color:"#FFFFFF"}
});
