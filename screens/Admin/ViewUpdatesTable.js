import { Text, StyleSheet,  ScrollView, View, TextInput, TouchableOpacity, Modal  } from 'react-native'
import React, { useEffect, useRef, useState } from 'react' 
import { axiosInstance } from '../../utils/axiosInstance' 
import DailyUpdatesViewTable from '../../components/dailyupdates/DailyUpdatesViewTable';
import ErrorPage from '../../components/error/Error';
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSelector } from 'react-redux';

 
export default function TaskTable({route}) {
    const {date} = route.params;  
    const [modalVisible, setModalVisible] = useState(false);
    const [filter, setfilter] = useState({
      year: [],
      batch: [],
      designation: [], 
      selectedFilter: "Batch",
    });
    const [page, setPage] = useState({
      total: 0,
      current: 1,
      limit: 10,
    });
    const [search, setSearch] = useState(""); 
    const [dailyTask, setDailyTask] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");  

    const isFirstLoad = useRef(true);
    const filters = useSelector(state=>state.filters?.filters);   
    const years = filters?.years?.filter(y=>y)||[];
    const batches = filters?.batches?.filter(b=>b)||[];
    const designations = filters?.designations?.filter(d=>d)||[]; 

  const toggleSelection = (item) => {
    const { selectedFilter } = filter;
    let selectedArray;

    if (selectedFilter === "Year") {
      selectedArray = filter.year.includes(item)
        ? filter.year.filter((i) => i !== item)
        : [...filter.year, item];
      setfilter({ ...filter, year: selectedArray });
    } else if (selectedFilter === "Batch") {
      selectedArray = filter.batch.includes(item)
        ? filter.batch.filter((i) => i !== item)
        : [...filter.batch, item];
      setfilter({ ...filter, batch: selectedArray });
    } else if (selectedFilter === "Designation") {
      selectedArray = filter.designation.includes(item)
        ? filter.designation.filter((i) => i !== item)
        : [...filter.designation, item];
      setfilter({ ...filter, designation: selectedArray });
    }  
  };
 

    const handleNext = () => {
      if (page.current < page.total) {
        setPage({ ...page, current: page.current + 1 });
      }
    };
  
    const handlePrev = () => {
      if (page.current > 1) {
        setPage({ ...page, current: page.current - 1 });
      }
    };


      

    const handleSearch = (text) => {
      setSearch(text); 
    };

    useEffect(() => {
      const handler = setTimeout(() => {
        if(isFirstLoad.current){
          isFirstLoad.current=false
          return
        }
        fetchDailyTask()
      }, 1000);
      return () => {
        clearTimeout(handler);
      };
    }, [search]);
   
    const fetchDailyTask = async()=>{
      try{ 
        setLoading(true);    
        
        const response = await axiosInstance.post(`/api/dailyUpdates`,{
          name:search,
          year:filter.year,
          batch:filter.batch,
          designation:filter.designation,
          date:date
        },{
          params: {
            limit: page.limit,
            offset: (page.limit*(page.current-1))
          },
        });
        if(response){  
          const dt = response.data?.data
          setDailyTask(dt?.data||[]) 
          setPage({...page,total:Math.ceil(dt.total_pages),current:page.current<=Math.ceil(dt.total_pages)?page.current:1}); 

        } 
      }
      catch(err){
        setError(err.response.data?.message||'Tasks Not retrieved.Try again later') 
      }
      finally{
        setLoading(false);
        setModalVisible(false)
      }
    }
    useEffect(()=>{ 
      fetchDailyTask()
    },[])  

  return (
    <ScrollView  style={styles.container}>
      {error ? (
        <ErrorPage onRetry={fetchDailyTask} />
      ) :<>
      <Text style={styles.heading}>{new Date(date).toDateString()} Updates</Text>
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

          <TouchableOpacity
                style={styles.filterBadge}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.filterBadgeText}>Filters</Text>
              </TouchableOpacity>
          {
          loading?<View style={{flex:1,justifyContent:'center',height:500}}><Text style={{textAlign:'center'}}>Loading...</Text></View>:
         <> 
 
          {(dailyTask&&dailyTask.length>0)?
          <>
          {dailyTask.map((dt)=>{ 
            return(
              <DailyUpdatesViewTable key={dt.id} user={dt.user} dailyTask={dt.tasks}/>
            )
          })}
          </>
          :<View style={{height:400,justifyContent:'center',flex:1}}><Text style={{textAlign:'center'}}>No Data Available</Text></View>  }

          {page.total > 0 && !loading &&(
                <View style={styles.paginationContainer}>
                  <TouchableOpacity
                    style={styles.paginationButton}
                    onPress={handlePrev}
                    disabled={page.current === 1}
                  >
                    <Text style={styles.paginationText}>Previous</Text>
                  </TouchableOpacity>
                  <Text style={{ color: "black" }}>
                    {page.current} / {page.total}
                  </Text>
                  <TouchableOpacity
                    style={styles.paginationButton}
                    onPress={handleNext}
                    disabled={page.current === page.total}
                  >
                    <Text style={styles.paginationText}>Next</Text>
                  </TouchableOpacity>
                </View>
              )}
          </>
          } 
    </>}

     <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.sidebar}>
              <View>
                <Text style={styles.filterHeader}>filter</Text>
              </View>
              <TouchableOpacity
                onPress={() => setfilter({ ...filter, selectedFilter: "Year" })}
                style={styles.tab}
              >
                <Text
                  style={
                    filter.selectedFilter === "Year"
                      ? styles.activeTabText
                      : styles.tabText
                  }
                >
                  Year
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setfilter({ ...filter, selectedFilter: "Batch" })
                }
                style={styles.tab}
              >
                <Text
                  style={
                    filter.selectedFilter === "Batch"
                      ? styles.activeTabText
                      : styles.tabText
                  }
                >
                  Batch
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setfilter({ ...filter, selectedFilter: "Designation" })
                }
                style={styles.tab}
              >
                <Text
                  style={
                    filter.selectedFilter === "Designation"
                      ? styles.activeTabText
                      : styles.tabText
                  }
                >
                  Designation
                </Text>
              </TouchableOpacity> 
            </View>

            <View style={styles.content}>
              <Text style={styles.modalHeader}>
                Select {filter.selectedFilter}
              </Text>
              <ScrollView
                style={styles.badgeContainer}
                contentContainerStyle={{ alignItems: "flex-start" }}
              >
                {(filter.selectedFilter === "Year"
                  ? years
                  : filter.selectedFilter === "Batch"
                  ? batches  
                  : designations 
                ).map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.badge,
                      (filter.selectedFilter === "Year" && filter.year.includes(item)) ||
                      (filter.selectedFilter === "Batch" &&   filter.batch.includes(item)) ||
                      (filter.selectedFilter === "Designation" &&   filter.designation.includes(item))  
                        ? styles.selectedBadge
                        : null,
                    ]}
                    onPress={() => toggleSelection(item)}
                  >
                    <Text style={styles.badgeText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={fetchDailyTask}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  container:{
    padding:10,
  },
  heading:{
    fontSize:20,
    fontWeight:'bold', 
    padding:20
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
    backgroundColor: "#007BFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  filterBadgeText: {
    color: "#fff",
    fontWeight: "bold",
  }, 
  filterHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    flexDirection: "row",
    width: "90%",
    height: "70%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "flex-start",
  },
  sidebar: {
    width: "30%",
    paddingRight: 5,
  },
  content: {
    width: "70%",
    paddingLeft: 40,
    marginTop: 50,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  tab: {
    marginVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: "#333",
  },
  activeTabText: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "bold",
  },
  badgeContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  badge: {
    backgroundColor: "#e0e0e0",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  selectedBadge: {
    backgroundColor: "#007BFF",
  },
  badgeText: {
    color: "#333",
  },
  applyButton: {
    backgroundColor: "#28a745",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#dc3545",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 20,
  },
  paginationButton: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  paginationText: {
    color: "#fff",
    fontWeight: "bold",
  },
});