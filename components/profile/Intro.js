import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import React, {  useEffect, useState } from 'react'; 
import Icon from 'react-native-vector-icons/MaterialIcons';
import FileIcon from 'react-native-vector-icons/AntDesign';  
import CameraIcon from 'react-native-vector-icons/FontAwesome';   
import * as ImagePicker from 'expo-image-picker';
import { axiosInstance } from '../../utils/axiosInstance';
import { useSelector } from 'react-redux';
import EP from 'react-native-vector-icons/Entypo';
import * as ImageManipulator from 'expo-image-manipulator';
import Toast from 'react-native-toast-message';
import ProfileImg from '../../assets/profile.png';


export default function Intro({user,edit,fetchUser}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isImgVisible, setImgVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(user.profilePhoto);  
  const role = useSelector(state=>state.auth.data?.data.role);   
  const showToast = (state, message) => {
    Toast.show({
      type: state,
      text1: 'Profile update',
      text2: message,
      position: 'top',
      swipeable: true,
      visibilityTime: 1500,
    });
  };
  useEffect(() => {
    requestPermissions(); 
  }, []);

  useEffect(() => {
    if (user) {
      setImageUrl(user.profilePhoto);
    }
  }, [user]);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
  if (status !== 'granted') { 
    const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (newStatus !== 'granted') {
      alert('Permission to access media library is required!');
    }
  }
  };
  const convert = async(image)=>{
    const manipResult = await ImageManipulator.manipulateAsync(
      image,  
      [{ resize: { width: 800, height: 1000 } }], 
      {
        compress: 0.5,  
        format: ImageManipulator.SaveFormat.JPEG,  
        base64: true,  
      }
    );
    return manipResult
  }
  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypes,
      allowsEditing: true,
      quality: 1,
      base64:true
    });

    if (!result.canceled) {
      const image = `data:image/jpeg;base64,${result.assets[0].base64}`
      const resized =(await convert(image)).base64;  
      handleImageChange(resized);  
      setIsVisible(false);
    }
    
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      base64:true
    });

    if (!result.canceled) {
      const image = `data:image/jpeg;base64,${result.assets[0].base64}`
      const resized =(await convert(image)).base64;  
      handleImageChange(resized);  
      setIsVisible(false);
    } 
  };
  
    const handleImageChange = async (image)=>{
      try{ 
        const response = await axiosInstance.patch(`/api/users/update/${user.id}`,{
          profilePhoto:image
        } ) 
        if(response){ 
          showToast('success','Profile image updated successfully!'),
          fetchUser();
        }
      }
      catch(error){  
        let msg =  'Profile image not updated!'
        if(error.response?.status==413){
          msg = 'Image size is too large'
        }
        showToast('error',msg);
      }
    } 




  return (
    <View style={styles.profileCnt}>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => setImgVisible(true)}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              onError={() => setImageUrl("")}
              style={styles.profile}
            />
          ) : (
            <Image
            source={ProfileImg} 
            style={styles.profile}
          />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsVisible(true)}>
          <Icon
            name="edit"
            style={[
              styles.editIcon,
              { display: role == "Admins" ? (edit ? "" : "none") : "" },
            ]}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>

      <View style={{ marginLeft: 15, marginTop: 5, width: "50%" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20 ,flex:3,}}>Profile</Text>
          {(role=='Interns'||!edit)?   <Text
            style={[
              styles.badge,
              { backgroundColor: user.status == "ACTIVE" ? "green" : "gray"   },
            ]}
          >
           {user.status || "IDLE"} 
          </Text>:
          <Text
            style={[
              styles.badge,
              { backgroundColor: "green" },
            ]}
          >
            ACTIVE
          </Text>}
        </View>
        <Text
          style={{
            fontSize: 15,
            color: "green",
            fontWeight: "600",
            marginTop: 5,
          }}
        >
          {user.name || "Name"}
        </Text>
        <Text style={{ fontSize: 12, marginTop: 5 }}>
          {user.email || "example@gmail.com"}
        </Text>
        {(role=='Interns'||!edit)&&<Text style={{ fontSize: 12, marginTop: 5 }}>
          {user.batch || "Batch ---"} {user.phase || "Phase ---"}
        </Text>}
        <Text style={{ fontSize: 12, marginTop: 5 }}>
          {role=='Mentors'?'Mentor':(role=='Admins'&edit)?'Admin': user.designation || "Designation --"}
        </Text>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
          <View style={styles.modal}>
            <TouchableWithoutFeedback>
              <View style={styles.modalcnt}>
                <Text
                  style={{ margin: "auto", textAlign: "center", fontSize: 18 }}
                >
                  Choose an option
                </Text>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={takePhoto}
                  >
                    <CameraIcon name="camera" size={40} color="black" />
                    <Text style={styles.iconText}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={selectImage}
                  >
                    <FileIcon name="folderopen" size={40} color="black" />
                    <Text style={styles.iconText}>File</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent={true}
        animationType="fade"
        visible={isImgVisible}
        onRequestClose={() => setImgVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setImgVisible(false)}>
          <View style={styles.modalimg}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                onError={() => setImageUrl("")}
                style={[styles.profilehover]}
              />
            ) : (
              <EP name="user" size={200} style={styles.profilehover} />
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Toast/>
    </View>
  );
}

const styles = StyleSheet.create({
  profile: {
    width: 130,
    height: 130,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#ccc',
    textAlign:'center'
  },
  profilehover: {
    width: 250,
    height: 250,
    borderRadius: 150,
    borderWidth: 2,
    borderColor: '#ccc',
    textAlign:'center'
  },
  profileCnt: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingLeft: 10,
    borderRadius: 20,
    flexDirection: 'row',
  },
  imageContainer: {
    position: 'relative',
  },
  editIcon: {
    position: 'absolute',
    left: 100,
    bottom: 12.5,
    backgroundColor: '#6200EE',
    borderRadius: 20,
    padding: 3,
    elevation: 5,
  },
  badge:{ 
    fontWeight: 'bold',
    fontSize: 8, 
    color:'white',
    borderRadius:10,
    padding:5,
    flex:2,
    textAlign:'center'
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalcnt: {
    width: "100%",
    height: "30%",
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom:50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalimg: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconText: {
    marginTop: 5,
    fontSize: 14,
  },
});