import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { axiosInstance } from '../../utils/axiosInstance';

export default function AdminHome() { 
  const { name  } = useSelector((state) => state.auth.data?.data); 
  const announcement = useSelector(state=>state.notifications?.announcement)||[]
  const [users,setUsers]=useState({
    total:0,
    active:0,
    notActive:0,
    deployed:0,
  })
  useEffect(()=>{
    fetchHome();
  },[])
  const fetchHome = async()=>{
    try{
      const response = await axiosInstance.get(`api/users/count/status`);
      const data = response.data?.data;  
      
      setUsers({
        total:data?.totalCount||0,
        active:data?.activeStatus||0,
        notActive:data?.notActiveStatus||0,
        deployed:data?.deployedCount||0,
      })
    }
    catch(err){
      console.log(err);      
    }
  }
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}> 
        <View>
          <Text style={styles.welcomeText}>Welcome {name}</Text>
        </View>
 
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Get Started!</Text>
          <Text style={styles.cardDescription}>
            Explore your dashboard to manage interns, track daily updates, schedule interactions with mentors and Performance Analysis.
          </Text>
        </View>
 
        <View style={styles.card}>
          <Text style={styles.announcementTitle}>
          📢 Announcements
          </Text>
          {announcement.length>0?
          <View style={{ maxHeight: 300 }}>
          <ScrollView  showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
            {announcement.map((data, i) => (
              <View key={i} style={styles.announcementItem}>
                <Text style={styles.announcementText}>{data}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        :<View style={{height:80,justifyContent:'center'}}><Text style={{textAlign:'center'}}>No Announcement Currently</Text></View>}
        </View>
 
        <View style={styles.statCard}>
          <Icon name="users" size={32} color="#007BFF" />
          <Text style={styles.statTitle}>Total Interns</Text>
          <Text style={styles.statValue}>{users.total}</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="user-check" size={32} color="green" />
          <Text style={styles.statTitle}>Active Interns</Text>
          <Text style={styles.statValue}>{users.active}</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="user-times" size={32} color="red" />
          <Text style={styles.statTitle}>Non-Active Interns</Text>
          <Text style={styles.statValue}>{users.notActive}</Text>
        </View>

        <View style={styles.statCard}>
          <Icon name="users" size={32} color="gray" />
          <Text style={styles.statTitle}>Deployed Interns</Text>
          <Text style={styles.statValue}>{users.deployed}</Text>
        </View>

      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 InternGo. All rights reserved.</Text> 
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    backgroundColor: '#f0f4f8',
  },
  content: {
    padding: 20, 
  },
  welcomeText: {
    fontWeight: 'bold',
    fontSize: 24,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 5,
  },
  announcementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  announcementItem: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  announcementText: {
    fontSize: 16,
    color: '#333',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007BFF',
    marginTop: 4,
  },
  footer: {
    backgroundColor: '#343a40',
    padding: 15,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
  },
});
