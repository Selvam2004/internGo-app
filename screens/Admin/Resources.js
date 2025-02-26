import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import React, {   useEffect, useRef, useState } from 'react';
import ProfileCard from '../../components/resources/ProfileCard';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import ErrorPage from '../User/Error';
import { axiosInstance } from '../../utils/axiosInstance'; 
import { useSelector } from 'react-redux'; 
export default function Resources() {
  const [modalVisible, setModalVisible] = useState(false); 
  const [error,setError] = useState(false); 
  const [loading,setLoading] = useState(false); 
  const [search,setSearch] = useState(""); 
  const [user,setUser] = useState([]); 
  const [filter, setfilter] = useState({
    year: [],
    batch: [],
    designation: [],
    status:[],
    selectedFilter: 'Year', 
  });
  const [page,setPage] = useState({
    total:0,
    current:1,
    limit:5, 
  })
  const filters = useSelector(state=>state.filters?.filters);   
  const years = filters?.years?.filter(y=>y)||[];
  const batches = filters?.batches?.filter(b=>b)||[];
  const designations = filters?.designations?.filter(d=>d)||[];
  const status = filters?.statuses?.filter(s=>s)||[]; 
  const isFirstLoad = useRef(true);
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh  = async()=>{
    setRefreshing(true);
    fetchResource();
  }
  useEffect(()=>{   
    setLoading(true);
    fetchResource();
  },[page.current])
  
  const handleSearch = (text)=>{
    setSearch(text); 
  }
  useEffect(() => {
    const handler = setTimeout(() => {
      if(isFirstLoad.current){
        isFirstLoad.current=false
        return
      }
      setLoading(true);
      fetchResource()
    }, 1000);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleNext = ()=>{
    if (page.current <page.total) {
    setPage({...page,current:page.current+1});
    }
 
  }
const handlePrev = () => {
  if (page.current > 1) {
    setPage({ ...page, current: page.current - 1 });
  }
};

 
  const toggleSelection = (item) => {
    const { selectedFilter } = filter;
    let selectedArray;

    if (selectedFilter === 'Year') {
      selectedArray = filter.year.includes(item) ? filter.year.filter(i => i !== item) : [...filter.year, item];
       setfilter({ ...filter, year: selectedArray });
    } else if (selectedFilter === 'Batch') {
      selectedArray = filter.batch.includes(item) ? filter.batch.filter(i => i !== item) : [...filter.batch, item];
      setfilter({ ...filter, batch: selectedArray });
    } else if (selectedFilter === 'Designation') {
      selectedArray = filter.designation.includes(item) ? filter.designation.filter(i => i !== item) : [...filter.designation, item];
      setfilter({ ...filter, designation: selectedArray });
    }
    else if (selectedFilter === 'Status') {
      selectedArray = filter.status.includes(item) ? filter.status.filter(i => i !== item) : [...filter.status, item];
      setfilter({ ...filter, status: selectedArray });
    }
  };
  
  const fetchResource = async()=>{
    try{
      setError(""); 
      setModalVisible(false);
      const response = await axiosInstance.post(
        '/api/users', 
        {   
            name:search,
            year: filter.year.map(value=>Number(value)),
            batch: filter.batch,
            designation: filter.designation,
            status:filter.status     
        },
        {
          params: {
            limit: page.limit,
            offset: (page.limit*(page.current-1))
          } 
        }
      )
      
      if(response){ 
        const dt = response.data.data;
        setUser(dt.data);
        setPage({...page,total:Math.ceil(dt.total_pages),current:page.current<=Math.ceil(dt.total_pages)?page.current:1}); 
      }
    }
    catch(err){ 
      setError(err);
    }
    finally{
      setLoading(false);   
      setRefreshing(false);   
    }
  }
  return (
    
    <ScrollView
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >

      {error?<ErrorPage onRetry={fetchResource}/>:
        loading?<View style={{height:600,justifyContent:'center',flexDirection:'row',alignItems:'center'}}><ActivityIndicator/><Text style={{fontWeight:'600',textAlign:'center'}}>Loading...</Text></View>:
      <View>
      <Text style={styles.header}>Resources</Text>
      <View style={styles.container}> 
        <View style={styles.searchContainer}>
          <Icon name="search" size={24} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#888"
            onChangeText={handleSearch} 
          />
        </View>
 
        <TouchableOpacity style={styles.filterBadge} onPress={() => setModalVisible(true)}>
          <Text style={styles.filterBadgeText}>Filters</Text>
        </TouchableOpacity>

        <View style={styles.profileCardContainer}>
        {user&&user.length>0?user.map((profile,id) => (
            <ProfileCard user={profile} key={id} />
          )):<View><Text style={{textAlign:'center'}}>No records to display</Text></View>}
        </View>

        {page.total>0&&<View style={styles.paginationContainer}>
          <TouchableOpacity 
            style={styles.paginationButton} 
            onPress={handlePrev}
            disabled={page.current === 1}
          >
            <Text style={styles.paginationText}>Previous</Text>
          </TouchableOpacity>
          <Text style={{color:'black'}}>{page.current} / {page.total}</Text>
          <TouchableOpacity 
            style={styles.paginationButton} 
            onPress={handleNext}
            disabled={page.current === page.total}
          >
            <Text style={styles.paginationText}>Next</Text>
          </TouchableOpacity>
        </View>}

      </View>
      </View>}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
            
          <View style={styles.modalContent}>
          
            <View style={styles.sidebar}>
              <View><Text style={styles.filterHeader}>filter</Text></View>
              <TouchableOpacity onPress={() => setfilter({ ...filter, selectedFilter: 'Year' })} style={styles.tab}>
                <Text style={filter.selectedFilter === 'Year' ? styles.activeTabText : styles.tabText}>Year</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setfilter({ ...filter, selectedFilter: 'Batch' })} style={styles.tab}>
                <Text style={filter.selectedFilter === 'Batch' ? styles.activeTabText : styles.tabText}>Batch</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setfilter({ ...filter, selectedFilter: 'Designation' })} style={styles.tab}>
                <Text style={filter.selectedFilter === 'Designation' ? styles.activeTabText : styles.tabText}>Designation</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setfilter({ ...filter, selectedFilter: 'Status' })} style={styles.tab}>
                <Text style={filter.selectedFilter === 'Status' ? styles.activeTabText : styles.tabText}>Status</Text>
              </TouchableOpacity>
            </View>
 
            <View style={styles.content}>
              <Text style={styles.modalHeader}>Select {filter.selectedFilter}</Text>
              <ScrollView  style={styles.badgeContainer} contentContainerStyle={{alignItems:'flex-start'}}>
                {(filter.selectedFilter === 'Year' ? years : filter.selectedFilter === 'Batch' ? batches : filter.selectedFilter === 'Status' ? status :designations).map(item => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.badge, 
                      (filter.selectedFilter === 'Year' && filter.year.includes(item)) || 
                      (filter.selectedFilter === 'Batch' && filter.batch.includes(item)) || 
                      (filter.selectedFilter === 'Designation' && filter.designation.includes(item)) ||
                      (filter.selectedFilter === 'Status' && filter.status.includes(item)) 
                      ? styles.selectedBadge : null]}
                    onPress={() => toggleSelection(item)}
                  >
                    <Text style={styles.badgeText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity style={styles.applyButton} onPress={ fetchResource }>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 24,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',  
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',  
    padding: 10,
    shadowColor: '#000',  
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, 
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: { 
    fontSize: 16,
    color: '#333',
    paddingVertical: 5, 
  },
  profileCardContainer: {
    marginBottom: 10,
  },
  filterBadge: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  filterBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filterHeader:{
    fontSize:24,
    fontWeight:'bold',
    marginBottom:10
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flexDirection: 'row',
    width: '90%',
    height:"70%",
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'flex-start',
  },
  sidebar: {
    width: '30%',
    paddingRight: 5, 
  },
  content: {
    width: '70%',
    paddingLeft:40,
    marginTop:50
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tab: {
    marginVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  activeTabText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  badgeContainer: {
    flexDirection: 'row', 
    marginBottom: 15,
  },
  badge: {
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    marginBottom:10
  },
  selectedBadge: { 
    backgroundColor: '#007BFF', 
  }, 
  badgeText: {
    color: '#333',
  },
  applyButton: {
    backgroundColor: '#28a745',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems:'center'
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#dc3545',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems:'center'
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  paginationButton: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  paginationText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    flexDirection:'row',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    zIndex: 1,  
},
loadingText: { 
    padding:5,
    fontSize: 16,
    color: '#000',  
}
});