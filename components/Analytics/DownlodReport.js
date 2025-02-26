import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import React, { useState } from 'react' 
import  Icon  from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function DownlodReport({showToast,name,batch,id}) {
    const [loading,setLoading] = useState(false);
    const token = useSelector(state=>state.auth?.data?.data?.token);
    const handleDownload = async()=>{
        try{
          setLoading(true);
          showToast('success','Downloading the performance analysis Report...')
          const url =  `https://interngo.onrender.com/api/feedbacks/${id}/download?token=${token}`
          const fileName = `Intern_${name}-${batch}.pdf`;
          const fileUri = `${FileSystem.documentDirectory}${fileName}`;
          const { uri } = await FileSystem.downloadAsync(url, fileUri);
          await Sharing.shareAsync(uri, {
            dialogTitle: `Share ${fileName}`, 
          });       
          await FileSystem.deleteAsync(uri);
        }
        catch(err){
          const msg = JSON.stringify(err?.response?.data?.message)||'Report not downloaded.Try again later';  
          showToast('error',msg)
        }
        finally{
          setLoading(false)
        }
      }
      
  return (
    <View>
       <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
        <TouchableOpacity onPress={handleDownload} disabled={loading}>
         <View style={[styles.downloadButton,loading&&{backgroundColor:'skyblue'}]}>
         <Text style={{color:'white',fontWeight:'600',fontSize:16,paddingRight:5}}>Download</Text>
         <Icon name='download' color={'white'} size={18}/>
         </View>
        </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    downloadButton:{
        flexDirection:'row',
        backgroundColor:'#007BFF',   
        marginTop:15,
        padding:5,
        borderRadius:5,
    }
})