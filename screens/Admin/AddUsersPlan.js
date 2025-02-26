import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, {   useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import EP from "react-native-vector-icons/Entypo";
import { axiosInstance } from "../../utils/axiosInstance";
import ErrorPage from "../User/Error";
import AddPlanUsersCard from "../../components/plans/AddPlanUsersCard";
import { useSelector } from "react-redux";
export default function AddUsersPlan({ route }) {
  const { id } = route.params;
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setfilter] = useState({
    year: [],
    batch: [],
    designation: [],
    status: [],
    planStatus:'Not Present',
    selectedFilter: "planStatus",
  });
  const [page, setPage] = useState({
    total: 0,
    current: 1,
    limit: 10,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState(""); 
  const [user, setUser] = useState([]);
  const [selected,setSelected] = useState([]);


  const filters = useSelector(state=>state.filters?.filters);   
  const years = filters?.years?.filter(y=>y)||[];
  const batches = filters?.batches?.filter(b=>b)||[];
  const designations = filters?.designations?.filter(d=>d)||[];
  const status = filters?.statuses?.filter(s=>s)||[]; 
  const planStatus = ['Present','Not Present']
  const [selectAll,SetSelectAll] = useState(false);
  const [prev,SetPrev] = useState('Not Present');
  const isFirstLoad = useRef(true);

  useEffect(() => {
    setLoading(true);
    fetchPlanUsers();
  }, [page.current]); 

  const handleSearch = (text) => {
    setSearch(text); 
  };   

  useEffect(() => {
    const handler = setTimeout(() => {
      if(isFirstLoad.current){
        isFirstLoad.current=false
        return
      }
      fetchPlanUsers()
    }, 1000);
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const fetchPlanUsers = async () => {
    try {       
      setError(false);
      setLoading(true); 
      const response = await axiosInstance.post(
        `/api/plans/${id}/users`,
        {
          name:search,
          year: filter.year.map((value) => Number(value)),
          batch: filter.batch,
          designation: filter.designation,
          status: filter.status,
          planStatus:filter.planStatus
        },
        {
          params: {
            limit: page.limit,
            offset: page.limit * (page.current - 1),
          },
        }
      );

      if (response) { 
        if(prev!=filter.planStatus){
            setSelected([]);
            SetPrev(filter.planStatus);
        }
        const dt = response.data.data;
        setUser(dt.data);
        setPage({
          ...page,
          total: Math.ceil(dt.total_pages),
          current: page.current <= Math.ceil(dt.total_pages) ? page.current : 1,
        });
      }
    } catch (err) { 
      setError(err);
    } finally {
      setLoading(false);
      setModalVisible(false);
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
    } else if (selectedFilter === "Status") {
      selectedArray = filter.status.includes(item)
        ? filter.status.filter((i) => i !== item)
        : [...filter.status, item];
      setfilter({ ...filter, status: selectedArray });
    }
    else if(selectedFilter === "planStatus"){
        setfilter({ ...filter, planStatus: item});
    }
  };
 

  const toggleSelectAll = ()=>{
    const userArray = user?.map((u)=>u.id); 
    if(selectAll){
        const selectArray = selected.filter(s=>!userArray.includes(s));
        setSelected([...selectArray])
        SetSelectAll(false);
    }
    else{
        const selectArray = userArray.filter(u=>!selected.includes(u));
        setSelected([...selected,...selectArray])
        SetSelectAll(true);
    }
  } 

useEffect(()=>{ 
    const userArray = user?.map((u)=>u.id);
    const selectArray = userArray.filter(u=>!selected.includes(u));
    if(selectArray.length>0){
        SetSelectAll(false);
    }
    else{
        SetSelectAll(true);
    }
},[selected,fetchPlanUsers])

const handleUserSubmit = async()=>{
    try{ 
        if(selected.length>0){ 
            if(filter.planStatus=='Not Present'){
               const response = await axiosInstance.patch(`/api/plans/${id}/addUsers`,{userIds:selected})
               if(response){
                const sa = user.filter(u=>!selected.includes(u.id)); 
                setUser(sa)
                setSelected([]);
                fetchPlanUsers();
                }
            }
            else{
               const response = await axiosInstance.patch(`/api/plans/${id}/removeUsers`,{userIds:selected})
               if(response){
                const sa = user.filter(u=>!selected.includes(u.id)); 
                setUser(sa)
                setSelected([]);
                fetchPlanUsers();
                }
            }
            
        }
    }
    catch(err){
        console.log(err)
    }
}

  return (
    <ScrollView>
      {error ? (
        <ErrorPage onRetry={fetchPlanUsers} />
      ) : (
        <>
          <View>
          <Text style={styles.headerText}>Choose users</Text>

            <View style={styles.container}>
              <View style={styles.searchContainer}>
                <Icon
                  name="search"
                  size={24}
                  color="#888"
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  placeholderTextColor="#888"
                  onChangeText={handleSearch}
                />
              </View>
              
              <TouchableOpacity
                style={styles.filterBadge}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.filterBadgeText}>Filters</Text>
              </TouchableOpacity>

                
              { !loading&&user.length>0&&<View style={styles.header}>
                <TouchableOpacity onPress={toggleSelectAll}>
                <View style={[styles.select,{backgroundColor:selectAll?'#007BFF':'lightgray'}]}>
                <Text style={{color:selectAll?'white':'black'}}>Select All</Text>
                </View>
                </TouchableOpacity>

             {filter.planStatus!='Present'?
             <TouchableOpacity onPress={handleUserSubmit}>
              <View style={styles.headerButton}>
              <EP name='add-user' size={20} color={'white'}/>
              <Text style={styles.headerButtonText}>Add</Text>
               </View>
               </TouchableOpacity>:
               <TouchableOpacity onPress={handleUserSubmit}>
                      <View style={[styles.headerButton,{backgroundColor:'red'}]}>
                        <EP name='remove-user' size={20} color={'white'}/>
                        <Text style={styles.headerButtonText}>Remove</Text>
                      </View>
                </TouchableOpacity>
            }
               </View>}

             {!loading? <View style={styles.profileCardContainer}>
                {user.length>0 ? (
                  user.map((profile, id) => (
                    <AddPlanUsersCard planStatus={filter.planStatus}  selected={selected} setSelected={setSelected} user={profile} key={id} />
                  ))
                ) : (
                  <View style={{minHeight:200,justifyContent:'center'}}>
                    <Text style={{ textAlign: "center" ,fontSize:18 }}>
                      No records to display
                    </Text>
                  </View>
                )}
              </View>:<View style={{minHeight:200,justifyContent:'center'}}><Text style={{textAlign:'center'}}>Loading...</Text></View>}

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
            </View>
          </View>
        </>
      )}

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
              <TouchableOpacity
                onPress={() =>
                  setfilter({ ...filter, selectedFilter: "Status" })
                }
                style={styles.tab}
              >
                <Text
                  style={
                    filter.selectedFilter === "Status"
                      ? styles.activeTabText
                      : styles.tabText
                  }
                >
                  Status
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setfilter({ ...filter, selectedFilter: "planStatus" })
                }
                style={styles.tab}
              >
                <Text
                  style={
                    filter.selectedFilter === "planStatus"
                      ? styles.activeTabText
                      : styles.tabText
                  }
                >
                  Plan Status
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
                  : filter.selectedFilter === "Status"
                  ? status
                  : filter.selectedFilter === "Designation"
                  ? designations
                  : planStatus
                ).map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.badge,
                      (filter.selectedFilter === "Year" && filter.year.includes(item)) ||
                      (filter.selectedFilter === "Batch" &&   filter.batch.includes(item)) ||
                      (filter.selectedFilter === "Designation" &&   filter.designation.includes(item)) ||
                      (filter.selectedFilter === "Status" && filter.status.includes(item))||
                       (filter.selectedFilter === "planStatus" && filter.planStatus==item)
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
                onPress={fetchPlanUsers}
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
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  header:{
    flexDirection:'row',
    justifyContent:'space-between'
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 24,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  headerButton:{
    width:100,
    flexDirection:'row',
    backgroundColor:'#007BFF', 
    borderRadius:5,
    padding:7,
    paddingHorizontal:8,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    marginRight:20,
    marginBottom:5
  },
  headerButtonText:{
    color:'white', 
    paddingLeft:8,
    fontWeight:'700'
  },
  select:{ 
    backgroundColor:'lightgray',
    padding:5,
    paddingHorizontal:9,
    justifyContent:'center',
    borderRadius:15,
    marginLeft:10,
    marginBottom:5

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
  profileCardContainer: {
    marginBottom: 10,
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
  loadingContainer: {
    position: "absolute",
    flexDirection: "row",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1,
  },
  loadingText: {
    padding: 5,
    fontSize: 16,
    color: "#000",
  },
});
