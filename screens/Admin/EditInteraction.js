import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView, FlatList, ActivityIndicator } from 'react-native'
import React, {   useEffect, useRef, useState } from 'react' 
import ErrorPage from '../../components/error/Error'; 
import Icon from "react-native-vector-icons/MaterialIcons";
import InteractionEditCard from '../../components/interactions/InteractionEditCard';
import DateTimePicker from 'react-native-modal-datetime-picker'
import { axiosInstance } from '../../utils/axiosInstance';
import { useSelector } from 'react-redux'; 


export default function Interactions() { 

  const [search, setSearch] = useState("");  
  const [modalVisible, setModalVisible] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [isVisible,setIsVisible] = useState(false)

  const [filter, setfilter] = useState({
    status: [],
    batch: [],
    designation: [],
    date:'',
    selectedFilter: 'Status', 
  });
  const [page,setPage] = useState({
    total:0,
    current:1,
    limit:10, 
  })
  const [error, setError] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [hasMore, setHasMore] = useState(true); 
  const [fetchMoreLoading, setFetchMoreLoading] = useState(false);  

  const filters = useSelector(state=>state.filters?.filters)||[];    
  const batches = filters?.batches?.filter(b=>b)||[];
  const designations = filters?.designations?.filter(d=>d)||[];
  const status = ['COMPLETED',"PENDING","FEEDBACK_PENDING"]; 
  const isFirstLoad = useRef(true); 
  const handleSearch = (text) => {
    setSearch(text); 
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if(isFirstLoad.current){
        isFirstLoad.current=false
        return
      }
      handleFilterSubmit()
    }, 1000);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  

   
  const fetchInteractions = async (reset = false) => {
    if (loading || fetchMoreLoading) return;

    try {
      setError(false);
      if (reset) {
        setLoading(true);
        setInteractions([]);        
      } else {
        setFetchMoreLoading(true);
      }   
      
      const response = await axiosInstance.post(
        '/api/interactions',
        {
          interactionStatus: filter.status,
          batch: filter.batch,
          designation: filter.designation,
          date: filter.date,
          name: search,
        },
        {
          params: {
            limit: page.limit,
            offset: page.limit * (page.current - 1),
          },
        }
      );

      if (response) {
        const newData = response.data.data?.data;           
        setInteractions((prev) => (reset ? newData : [...prev, ...newData]));
        setHasMore(newData.length > 0); 
      }
    } catch (err) { 
      setError(true);
    } finally {
      setModalVisible(false)
      setLoading(false);
      setFetchMoreLoading(false);
    }
  };
  
   
  const handleFilterSubmit = () => {      
    setPage((prev) => ({ ...prev, current: 1 }));  
  }
 
  const fetchMore = ()=>{
    if(!hasMore||fetchMoreLoading) return
    setPage((prev) => ({ ...prev, current: prev.current + 1 }));
    
  }  

  useEffect(() => { 
    if (page.current == 1) {
      fetchInteractions(true);
    }
    else {
      fetchInteractions();
    }    
  },[page.current])

  const toggleSelection = (item) => {
    const { selectedFilter } = filter;
    let selectedArray;

    if (selectedFilter === 'Status') {
      selectedArray = filter.status.includes(item) ? filter.status.filter(i => i !== item) : [...filter.status, item];
       setfilter({ ...filter, status: selectedArray });
    } else if (selectedFilter === 'Batch') {
      selectedArray = filter.batch.includes(item) ? filter.batch.filter(i => i !== item) : [...filter.batch, item];
      setfilter({ ...filter, batch: selectedArray });
    } else if (selectedFilter === 'Designation') {
      selectedArray = filter.designation.includes(item) ? filter.designation.filter(i => i !== item) : [...filter.designation, item];
      setfilter({ ...filter, designation: selectedArray });
    } 
  };

  const handleDateConfirm = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setfilter({...filter,date:formattedDate});
    setIsVisible(false);
  };

  const handleRemoveDate = ()=>{
    setfilter({...filter,date:''})
  }

  const handleSubmitChange =(id,edit)=>{
    setInteractions((prev) =>
      prev.map((interaction) =>
        interaction.id !== id
          ? interaction
          : {
              ...interaction,
              assignedInterviewer: edit.assignedInterviewer,
              date: edit.date,
              time: edit.time,
              duration: edit.duration,
            }
      )
    );
  }

  return (
    <View style={styles.container}>
      {error?<ErrorPage onRetry={fetchInteractions}/>:
      <>
      { 
      loading?<View style={{justifyContent:'center',flexDirection:'row',alignItems:'center',height:600}}><ActivityIndicator/><Text style={{textAlign:'center',fontWeight:'600'}}>Loading...</Text></View>:
        <View>
        <FlatList
        data={interactions}
        keyExtractor={(item,index)=>String(item.id)}
        renderItem={({item})=>(
          <>   
                 <InteractionEditCard handleSubmitChange={handleSubmitChange} interaction={item}/>
           </>
        )} 
        onEndReachedThreshold={0.5} 
        onEndReached={fetchMore}
        ListHeaderComponent={
            <>
          <Text style={styles.header}>Interactions</Text>
          <View style={styles.searchContainer}>
              <Icon
                name="search"
                size={24}
                color="#888"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                value={search}
                placeholder="Search..."
                placeholderTextColor="#888"
                onChangeText={(text)=>handleSearch(text)}
              />
          </View>
          <TouchableOpacity style={styles.filterBadge} onPress={() => setModalVisible(true)}>
              <Text style={styles.filterBadgeText}>Filters</Text>
            </TouchableOpacity>
            </>
        }
        ListEmptyComponent={
          <View style={{justifyContent:'center',height:500}}><Text style={{textAlign:'center'}}>No data available</Text></View>
        }
        ListFooterComponent={
          !loading&&fetchMoreLoading&&<ActivityIndicator size="large" color="#007bff" />  
        } 
        showsVerticalScrollIndicator={false}
        />
        
        </View>
      }
      </>
      }
            <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
            
          <View style={styles.modalContent}>
          
            <View style={styles.sidebar}>
              <View><Text style={styles.filterHeader}>Filters</Text></View>
              <TouchableOpacity onPress={() => setfilter({ ...filter, selectedFilter: 'Status' })} style={styles.tab}>
                <Text style={filter.selectedFilter === 'Status' ? styles.activeTabText : styles.tabText}>Status</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setfilter({ ...filter, selectedFilter: 'Batch' })} style={styles.tab}>
                <Text style={filter.selectedFilter === 'Batch' ? styles.activeTabText : styles.tabText}>Batch</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setfilter({ ...filter, selectedFilter: 'Designation' })} style={styles.tab}>
                <Text style={filter.selectedFilter === 'Designation' ? styles.activeTabText : styles.tabText}>Designation</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setfilter({ ...filter, selectedFilter: 'Date' })} style={styles.tab}>
                <Text style={filter.selectedFilter === 'Date' ? styles.activeTabText : styles.tabText}>Date</Text>
              </TouchableOpacity>
            </View>
 
            <View style={styles.content}>
              <Text style={styles.modalHeader}>Select {filter.selectedFilter}</Text>
              <ScrollView  style={styles.badgeContainer} contentContainerStyle={{alignItems:'flex-start'}}>
                {filter.selectedFilter==='Date'?
                <View style={{flexDirection:'row'}}>
                 <TouchableOpacity onPress={()=>setIsVisible(true)}>
                  <View style={{ height:40 }}>
            <Text style={styles.dateText}>{filter.date||'Choose date'}</Text>
            
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRemoveDate}>
             <Text style={{fontSize:20,margin:5,marginLeft:10,color:'red'}}>x</Text> 
             </TouchableOpacity>
                </View>:
                <>{(filter.selectedFilter === 'Status' ? status : filter.selectedFilter === 'Batch' ? batches : designations ).map(item => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.badge, 
                      (filter.selectedFilter === 'Status' && filter.status.includes(item)) || 
                      (filter.selectedFilter === 'Batch' && filter.batch.includes(item)) || 
                      (filter.selectedFilter === 'Designation' && filter.designation.includes(item))  
                      ? styles.selectedBadge : null]}
                    onPress={() => toggleSelection(item)}
                  >
                    <Text style={styles.badgeText}>{item}</Text>
                  </TouchableOpacity>
                ))}</>
                }
              </ScrollView>

              <TouchableOpacity style={styles.applyButton} onPress={handleFilterSubmit}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
          </Modal>
      <DateTimePicker isVisible={isVisible} mode='date' onConfirm={handleDateConfirm} onCancel={()=>setIsVisible(false)}/>

    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    paddingHorizontal:20, 
  },
  header:{
    fontSize:20,
    marginBottom:10,
    marginTop:10,
    fontWeight:'bold'
  }, 
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    shadowColor: "#000",
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
    color: "#333",
    paddingVertical: 5,
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
  dateText:{
    width:100,
    borderWidth:1,
    borderColor:'lightgray',
    borderRadius:5,
    flex:1,   
    textAlign:'center',
    textAlignVertical:'center'
  }
})