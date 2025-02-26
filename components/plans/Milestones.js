import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { axiosInstance } from "../../utils/axiosInstance";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";


export default function Milestones(props) { 
  const [milestones, setMilestones] = useState([]);
  const [editable, setEditable] = useState(null);
  const [loading, setLoading] = useState(false);
  const mentors = useSelector(state=>state.mentors?.mentors)?.map(val=>val.name)

  const [error, setError] = useState("");
    useEffect(() => {
      if (props.milestones) {
      setMilestones(handleFill(props.milestones));
      }
    }, [props.milestones]);

  const heading = [
    "Name",
    "Description",
    "Days",
    "Interactions", 
  ];

  const handleFill = (milestone) => {
    return milestone.map((m) => {
      if (m.objectives?.length < 1) {
        return {
          ...m,
          objectives: [
            {
              id: new Date().toISOString(),
              name: "",
              description: "",
              objectiveDays: "",
              noOfInteractions: "",
              roadmapType: "DEFAULT",
            },
          ],
        };
      } else {
        return {
          ...m,
        };
      }
    });
  };

  const handleDeleteMilestone = async (milestoneId) => {
    Alert.alert("Confirm", "Are you sure want to delete?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => {
          submitDeleteMilestone(milestoneId);
        },
      },
    ]);
  };

  const submitDeleteMilestone = async (milestoneId) => {
    try {
      const response = await axiosInstance.delete(
        `api/plans/delete/milestone/${milestoneId}`
      );
      if (response) {
        setMilestones(milestones.filter((m) => m.id !== milestoneId));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddRow = (milestoneId) => {
    setMilestones(
      milestones.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              objectives: [
                ...m.objectives,
                {
                  id: new Date().toISOString(),
                  name: "",
                  description: "",
                  objectiveDays: "",
                  noOfInteractions: "",
                  roadmapType: "DEFAULT",
                },
              ],
            }
          : m
      )
    );
  };

  const handleDeleteRow = (milestoneId, rowId) => { 
    setMilestones(
      milestones.map((m) =>
        m.id === milestoneId
          ? { ...m, objectives: m.objectives.filter((row) => row.id !== rowId) }
          : m
      )
    );
    if(Number(rowId)){
       submitDeleteObjective(rowId);
    }

  };

  const submitDeleteObjective =  async(rowId)=>{
    try{
        const response = await axiosInstance.delete(`/api/plans/delete/objective/${rowId}`)  
    }
    catch(err){
      console.log(err.respone)
    }
  }

  const handleRowChange = (milestoneId, rowId, field, value) => {
    setMilestones(
      milestones.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              objectives: m.objectives.map((row) =>
                row.id === rowId ? { ...row, [field]: value } : row
              ),
            }
          : m
      )
    );
  };

  const handleEdit = (id) => {
    setEditable(id);
  };

  const handleSave = (id) => {
    setError("");
    let create = [];
    let update = [];
    let original = props.milestones.filter((m) => m.id == id)[0];
    let updated = milestones.filter((m) => m.id == id)[0]; 
    if(validation(id)){ 
      setLoading(true);
      const updatems = updateMilestone(id,original,updated);
      createObjective(id,updated,create);
      updateObjective(original,updated,update) 
      let apiCalls =[];
      if(updatems){  
        apiCalls.push(axiosInstance.patch(`/api/plans/${props.id}/update/milestone`,{...updatems}))        
      }
      if(create.length>0){
        apiCalls.push(axiosInstance.post(`/api/plans/${props.id}/create/objectives`,{objectiveDatas:create}))
      }
      if(update.length>0){
        apiCalls.push(axiosInstance.patch(`/api/plans/${props.id}/update/objectives`,{objectiveDatas:update}))
      } 
      if(apiCalls.length>0){
        handleSubmitUpdate(apiCalls);
      }
      else{
        setLoading(false);
        setEditable(null);
      }
    } 

  };

  const handleSubmitUpdate = async (apiCalls) => {
    setLoading(true);  
  
    const responses = await Promise.allSettled(apiCalls);
    let err=false;
    let errmsg=''
    responses.forEach((result, index) => {
      if (result.status === "rejected")  {
        err=true;
        errmsg=JSON.stringify(result.reason?.response?.data?.message);  
      }
    });  
    setLoading(false); 
    if(!err){
      setEditable(null);
    }else{
      setError(errmsg);
    }
  };
  
  const validation = (id)=>{  
    
    let updated = milestones.filter((m) => m.id == id)[0];
    if (
      updated.name?.trim() == "" ||
      updated.mentorName?.trim() == "" ||
      updated.milestoneDays == "" ||
      updated.milestoneDays == "0"
    ) {
      setError("*Please fill milestone details");
      return false;
    }
    if(Number(updated.milestoneDays>180)){
      setError("*Please enter valid milestone days");
      return false;
    }
    if(mentors.length>0&&(!mentors.includes(updated.mentorName))){
      setError("*Please provide valid mentor name");
      return false;
    }
    let err='';
    updated.objectives?.forEach((field) => {
      if (
        field.name?.trim() == "" ||
        field.description?.trim() == "" ||
        field.noOfInteractions == ''||
        field.objectiveDays == ""||
        field.noOfInteractions == "0"||
        field.objectiveDays == "0"
      ) {         
        err="*Please fill all fields with valid data"; 
      }
    });
    if(err){
      setError(err);
      return false;
    }
    updated.objectives?.forEach((field) => {
      if (
        (!/^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/.test(field.name)) ||
        (!/^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/.test(field.description))  
      ) {        
        err="*Please enter valid name and description"; 
      }
    });
    if(err){
      setError(err);
      return false;
    }
    const total = updated.objectives?.reduce((acc,curr)=>acc+Number(curr.objectiveDays),0);
    if(total>Number(updated.milestoneDays)){ 
      setError("*No of days should not exceed total milestone Days");
      return false;
    } 
    else{
      return true;
    }
    
  }

  const updateMilestone = (id,original,updated)=>{   
    if(
      updated.name?.trim() !=original.name||
      updated.mentorName?.trim() !=original.mentorName||
      updated.milestoneDays!=original.milestoneDays 
  ){ 
      return {
        milestoneId:id,
        milestoneData:{
          name:updated.name,
          mentorName:updated.mentorName,
          milestoneDays:Number(updated.milestoneDays)
        }
      }
      
  }
  else {
    return null
  }
  }

  const createObjective = (id,updated,create)=>{ 
    updated.objectives?.forEach((field) => {
      if (!Number(field.id)) {
         create.push(
          {
            name:  field.name,
            milestoneId: id,
            description:  field.description,
            objectiveDays:  Number(field.objectiveDays),
            noOfInteractions:  Number(field.noOfInteractions),
            roadmapType: field.roadmapType
          }
         );
      } 
    });   
  }

  const updateObjective = (original,updated,update)=>{
    
    updated.objectives?.forEach((field) => { 
      if (!!Number(field.id)) { 
          const comp = original.objectives.filter((i)=>i.id==field.id)[0];
          if(field.name.trim()!=comp.name||field.description.trim()!=comp.description||
             field.noOfInteractions!=comp.noOfInteractions?.toString()||
          field.objectiveDays!=comp.objectiveDays?.toString()||
          field.roadmapType!=comp.roadmapType){
              update.push({
                objectiveId:field.id,
                objectiveData:{
                  name:  field.name, 
                  description:  field.description,
                  objectiveDays:  Number(field.objectiveDays),
                  noOfInteractions:  Number(field.noOfInteractions),
                  roadmapType: field.roadmapType
                }
              });
          }
      } 
    });
  }

  return (
    <View>
      {milestones &&
        milestones.map((milestone) => (
          <View key={milestone.id} style={styles.milestone}>

            <View>
              <View style={[styles.milestoneHeader, ]}>
                <View style={{flex:8}}>
                <View style={{ flexDirection: "row" }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TextInput
                    style={styles.milestoneName}
                    placeholder="Milestone Name"
                    value={milestone.name}
                    onChangeText={(text) =>
                      setMilestones(
                        milestones.map((m) =>
                          m.id === milestone.id ? { ...m, name: text } : m
                        )
                      )
                    }
                    editable={editable == milestone.id}
                  />
                  <Text style={styles.milestoneName}>-</Text>
                  <TextInput
                    style={styles.milestoneMentorName}
                    placeholder="Mentor"
                    value={milestone.mentorName}
                    onChangeText={(text) =>
                      setMilestones(
                        milestones.map((m) =>
                          m.id === milestone.id ? { ...m, mentorName: text } : m
                        )
                      )
                    }
                    editable={editable == milestone.id}
                  />
                  <Text style={styles.milestoneName}>(</Text>
                  <TextInput
                    style={styles.milestoneMentorName}
                    placeholder="Days"
                    value={milestone.milestoneDays?.toString()}
                    onChangeText={(text) =>
                      setMilestones(
                        milestones.map((m) =>
                          m.id === milestone.id
                            ? { ...m, milestoneDays: text }
                            : m
                        )
                      )
                    }
                    keyboardType="numeric"
                    editable={editable == milestone.id}
                  />
                  <Text style={styles.milestoneName}>
                    {milestone.milestoneDays > 1 ? ")Days" : ")Day"}
                  </Text>
                  </ScrollView>
                </View>
                </View>
                <View style={{flex:1}}> 
                <TouchableOpacity
                  onPress={() => handleDeleteMilestone(milestone.id)}
                >                  
                    <Icon name="delete" size={24} color="red" />                 
                </TouchableOpacity>
                </View>
              </View>
            </View>
            {editable == milestone.id && error && (
              <Text style={{ color: "red" }}>{error}</Text>
            )}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                <View style={styles.headerRow}>
                  {heading.map((field) => (
                    <Text key={field} style={styles.headerText}>
                      {field}
                    </Text>
                  ))}
{editable == milestone.id ? (
  <Text style={[styles.headerText, { width: 70 }]}>Delete</Text>
) : null}
                </View>

                {milestone.objectives &&
                  milestone.objectives.map((row) => (
                    <View key={row.id} style={styles.row}>
                      <TextInput
                        style={styles.input}
                        value={row.name}
                        placeholder="Name"
                        onChangeText={(text) =>
                          handleRowChange(milestone.id, row.id, "name", text)
                        }
                        editable={editable == milestone.id}
                        multiline
                      />
                      <TextInput
                        style={styles.input}
                        value={row.description}
                        placeholder="description"
                        onChangeText={(text) =>
                          handleRowChange(
                            milestone.id,
                            row.id,
                            "description",
                            text
                          )
                        }
                        editable={editable == milestone.id}
                        multiline
                      />
                      <TextInput
                        style={styles.input}
                        value={row.objectiveDays?.toString() }
                        onChangeText={(text) =>
                          handleRowChange(
                            milestone.id,
                            row.id,
                            "objectiveDays",
                            text
                          )
                        }
                        placeholder="0"
                        editable={editable == milestone.id}
                        keyboardType="number-pad"
                      />
                      <TextInput
                        style={styles.input}
                        value={row.noOfInteractions?.toString()}
                        placeholder="0"
                        onChangeText={(text) =>
                          handleRowChange(
                            milestone.id,
                            row.id,
                            "noOfInteractions",
                            text
                          )
                        }
                        editable={editable == milestone.id}
                        keyboardType="number-pad"
                      /> 
                      {editable == milestone.id ? (
                        <TouchableOpacity
                          style={styles.delete}
                          onPress={() => handleDeleteRow(milestone.id, row.id)}
                        >
                          <View style={{ flex: 1, justifyContent: "center" }}>
                            <Text style={{ textAlign: "center" }}>
                              <Icon name="close" color="red" size={24} />{" "}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ):null}
                    </View>
                  ))}
              </View>
            </ScrollView>

            <View style={styles.footer}>
              {editable == milestone.id ? (
                <>
                  <TouchableOpacity onPress={() => handleAddRow(milestone.id)}>
                    <View style={styles.addButton}>
                      <Icon name="add" size={20} color="#fff" />
                      <Text style={styles.addButtonText}> Add Row </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity disabled={loading} onPress={() => handleSave(milestone.id)}>
                    <View
                      style={[styles.addButton, { backgroundColor: loading?'lightgreen':"green" }]}
                    >
                      <Text style={styles.addButtonText}> Save Changes </Text>
                    </View>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={() => handleEdit(milestone.id)}>
                  <View style={styles.addButton}>
                    <Icon name="edit" size={20} color="#fff" />
                    <Text style={styles.addButtonText}> Edit </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  milestone: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  milestoneHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  milestoneName: {
    paddingVertical: 8,
    fontSize: 22,
    fontWeight: "bold",
  },
  milestoneMentorName: {
    paddingVertical: 8,
    fontSize: 20,
    fontWeight: "bold",
  },
  milestoneTitleInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center", 
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#ddd",
    paddingVertical: 12,
    borderTopLeftRadius:5,
    borderTopRightRadius:5
  },
  headerText: {
    width: 140,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: 140,
    height: "100%",
    borderWidth: 1,
    borderColor: "#ccc", 
    textAlign: "center", 
    backgroundColor: "#fff",
    padding:5,
    paddingVertical:10
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 5,
    margin: 5,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  delete: {
    width: 90,
    height: "100%",
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});
