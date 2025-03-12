import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../utils/axiosInstance';

export default function InternHome() {
  const [mentorDetails, setMentorDetails] = useState({
    mentorName: '',
    currentPlans: '',
    daysAllotted: 0,
  });
  const announcement = useSelector(state=>state.notifications?.announcement)||[]
  const { name, userId } = useSelector((state) => state.auth.data?.data); 
  const [zone,setZone]=useState('');
      const [refreshing, setRefreshing] = useState(false);
      const handleRefresh  = async()=>{
        setRefreshing(true);
        fetchHome();
      }
  useEffect(() => {
    fetchHome();
  }, [userId]);

  const fetchHome = async () => {
    try {
      const response = await axiosInstance.get(`/api/users/training/${userId}`);
      const data = response.data?.data?.milestone;
      const zn = response.data?.data?.zone;
      setZone(zn);
      setMentorDetails({
        mentorName: data?.mentorName,
        currentPlans: data?.name,
        daysAllotted: data?.milestoneDays,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  }; 

  return (
    <ScrollView    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />} style={styles.container} contentContainerStyle={{flexGrow:1,justifyContent:'space-between'}} showsVerticalScrollIndicator={false}>
      <View style={styles.content}> 
        <View>
          <Text style={styles.welcomeText}>Welcome {name}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Get Started!</Text>
          <Text style={styles.cardDescription}>
            Explore your dashboard to manage your internship, track your training status and daily updates.
          </Text>
        </View>
 
        <View style={styles.card}>
          <Text style={styles.announcementTitle}>
          📢 Announcements
          </Text>
          {announcement.length>0?
          <View style={{ maxHeight: 300 }}>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
            {announcement.map((data, i) => (
              <View key={i} style={styles.announcementItem}>
                <Text style={styles.announcementText}>{data}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        :<View style={{height:80,justifyContent:'center'}}><Text style={{textAlign:'center'}}>No Announcement Currently</Text></View>}
        </View>
 
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Training Details</Text>
          <Text style={styles.cardDescription}>
            <Text style={styles.boldText}>Mentor:</Text> {mentorDetails.mentorName||"Not Assigned"}
          </Text>
          <Text style={styles.cardDescription}>
            <Text style={styles.boldText}>Current Training:</Text> {mentorDetails.currentPlans||"Not Assigned"}
          </Text>
          <Text style={styles.cardDescription}>
            <Text style={styles.boldText}>Days Allotted:</Text> {mentorDetails.daysAllotted||"Not Alloted"}
          </Text>
        </View> 

        <View style={styles.performanceCard}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <Text style={[styles.zoneText, {color:zone=='GREEN ZONE'?'green':zone=='YELLOW ZONE'?'yellow':zone=='RED ZONE'?'red':'gray'}]}>
            {zone||'NOT UPDATED'}
          </Text>
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
    minHeight:100
  },
  performanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 15,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000',
  },
  zoneText: {
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 10,
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
  placeholderText: {
    color: '#666',
    fontSize: 16,
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
