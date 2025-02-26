import { View, Text, StyleSheet, Switch, ScrollView ,ActivityIndicator, RefreshControl} from 'react-native';
import React, { useEffect, useState } from 'react';
import ErrorPage from '../../components/error/Error'; 
import { axiosInstance } from '../../utils/axiosInstance';
import { useSelector } from 'react-redux'; 
import Toast from 'react-native-toast-message';

export default function PendingTickets() { 
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(false);
  const [helpRequests, setHelpRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
    const handleRefresh = () => {
      setRefreshing(true);
      fetchRequests();
    };

  const userId = useSelector(state=>state.auth?.data?.data?.userId); 
  const showToast = (state,message) => {     
    Toast.show({
      type: state,  
      text1: "Help Request",
      text2: message,
      position: "top",   
      swipeable:true,
      visibilityTime:1500, 
    });
  };
 
  const toggleResolved = async(id) => {
    const change = helpRequests.filter(i=>i.id==id)[0]?.resolvedStatus=='PENDING'?'RESOLVED':'PENDING';
    try{ 
      setHelpRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, resolvedStatus: request.resolvedStatus=='PENDING'?'RESOLVED':'PENDING' } : request
        )
      );
      
      const response = await axiosInstance.patch(`api/helpdesk/${id}`,{
        resolvedStatus:change
      })
      if(response){
        showToast('success','Help request changed successfully');  
      }
    }
    catch(err){
      const msg = JSON.stringify(err.response?.data?.message)||'Help request toggle failed';      
      showToast('error',msg)
      setHelpRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, resolvedStatus: request.resolvedStatus=='PENDING'?'RESOLVED':'PENDING' } : request
        )
      );
    }
  };

  const fetchRequests = async()=>{
    try {      
      const response = await axiosInstance.get(`api/helpdesk/${userId}`);
      if(response){
        const data = response.data.data;
        setHelpRequests(data)    
      }
    } catch (error) { 
      setError(false)
    }
    finally{
      setLoading(false);
      setRefreshing(false)
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchRequests();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <>
        {error ? (
          <ErrorPage onRetry={fetchRequests} />
        ) : (
          <>
            {loading ? (
              <View
                style={{
                  justifyContent: "center",
                  flexDirection: "row",
                  alignItems: "center",
                  height: 600,
                }}
              >
                <ActivityIndicator />
                <Text style={{ textAlign: "center", fontWeight: "600" }}>
                  Loading...
                </Text>
              </View>
            ) : (
              <View>
                <Text style={styles.header}>Help Requests</Text>
                <View style={{ marginBottom: 20 }}>
                  {helpRequests.length > 0 ? (
                    helpRequests.map((request) => (
                      <View key={request.id} style={styles.card}>
                        <Text style={styles.subject}>{request?.subject}</Text>
                        <Text style={styles.description}>
                          {request?.description}
                        </Text>
                        <Text style={styles.details}>
                          <Text style={styles.boldText}>Received From:</Text>{" "}
                          {request?.senderName}
                        </Text>
                        <Text style={styles.details}>
                          <Text style={styles.boldText}>Priority:</Text>{" "}
                          {request?.priority}
                        </Text>
                        <Text style={styles.details}>
                          <Text style={styles.boldText}>Raised To:</Text>{" "}
                          {request.recepient == "Admins" ? "Admin" : "Mentor"}
                        </Text>
                        {request.recepient === "Mentors" && (
                          <Text style={styles.details}>
                            <Text style={styles.boldText}>Mentor:</Text>{" "}
                            {request.recepientId || "Not available"}
                          </Text>
                        )}

                        <View style={styles.switchContainer}>
                          <Text style={styles.statusText}>
                            Status:{" "}
                            <Text
                              style={{
                                color:
                                  request?.resolvedStatus == "PENDING"
                                    ? "red"
                                    : "green",
                              }}
                            >
                              {request?.resolvedStatus}
                            </Text>
                          </Text>
                          <Switch
                            value={
                              request.resolvedStatus == "PENDING" ? false : true
                            }
                            onValueChange={() => toggleResolved(request.id)}
                          />
                        </View>
                      </View>
                    ))
                  ) : (
                    <View style={{ justifyContent: "center", height: 500 }}>
                      <Text style={{ fontWeight: "500", textAlign: "center" }}>
                        No Requests available
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </>
        )}
      </>
      <Toast />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#007BFF',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  details: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

