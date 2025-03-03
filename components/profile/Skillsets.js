import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { axiosInstance } from "../../utils/axiosInstance";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";

export default function Skillsets({ edit, user, fetchUser }) {
  const role = useSelector((state) => state.auth.data?.data.role);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedSecondarySkills, setSelectedSecondarySkills] = useState([]);
  const [skill, setSkill] = useState(user["secondary_skills"] || []);
  const [primarySkill, setPrimarySkill] = useState(user["primary_skill"] || "");
  const [currentSkill, setCurrentSkill] = useState("");
  const availableSkills = [
    "JavaScript",
    "Python",
    "Java",
    "React",
    "Node.js",
    "Ruby",
    "C#",
    "C++",
    "Swift",
    "Go",
    "PHP",
    "TypeScript",
    "Kotlin",
    "Dart",
    "Rust",
    "HTML",
    "CSS",
    "Scala",
    "Elixir",
    "Haskell",
    "Clojure",
    "Perl",
    "Shell",
    "MATLAB",
    "Objective-C",
    "Visual Basic",
    "Groovy",
    "R",
    "Lua",
    "SQL",
    "F#",
    "Assembly",
    "Fortran",
    "COBOL",
    "Scratch",
  ];

  useEffect(() => {
    if (user) {
      setSkill(user["secondary_skills"] || []);
      setPrimarySkill(user["primary_skill"] || "");
      setSelectedSecondarySkills(user["secondary_skills"] || []);
    }
  }, [user]);

  const showToast = (state, message) => {
    Toast.show({
      type: state,
      text1: "Skills update",
      text2: message,
      position: "top",
      swipeable: true,
      visibilityTime: 1500,
    });
  };

  const handleSave = () => {
    if (!primarySkill) {
      showToast("error", "Please select a primary skill");
      return;
    }

    handleSubmit(selectedSecondarySkills);
  };

  const handleSubmit = async (skills) => {
    try {
      const response = await axiosInstance.patch(
        `/api/users/update/${user.id}`,
        {
          primary_skill: primarySkill,
          secondary_skills: skills,
        }
      );
      if (response) {
        fetchUser();
        setModalVisible(false);
        setSelectedSecondarySkills([]);
        setPrimarySkill("");
      }
    } catch (err) {
      const msg =
        JSON.stringify(err?.response?.data?.message) ||
        "Skills not updated. Try again later";
      showToast("error", msg);
    }
  };
  
  const handleModalOpen = () => {
          setPrimarySkill(user["primary_skill"] || "");
    setSelectedSecondarySkills(user["secondary_skills"] || []);
    setModalVisible(true)
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Skills</Text>
        <TouchableOpacity
          style={[
            styles.editButton,
            {
              flexDirection: "row",
              display: role === "Admins" ? (edit ? "" : "none") : "",
            },
          ]}
          onPress={handleModalOpen}
        >
          <Icon name="edit" style={styles.editIcon} size={18} color="white" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.skillsView}>
        <Text style={styles.skillsLabel}>
          Primary Skill: {user.primary_skill || "Not set"}
        </Text>
        <Text style={styles.skillsLabel}>Secondary Skills:</Text>
        <View style={styles.badgesContainer}>
          {skill.length > 0 ? (
            skill.map((skl, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>{skl}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noSkillsText}>No Skills Available</Text>
          )}
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Toast />
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Add Skills</Text>
            <View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Primary Skill</Text>
                <Picker
                  selectedValue={primarySkill}
                  onValueChange={(itemValue) => setPrimarySkill(itemValue)}
                  style={styles.picker}
                  mode="dropdown"
                >
                  <Picker.Item
                    label="Select Primary Skill"
                    value=""
                    color="gray"
                    enabled={false}
                  />
                  {availableSkills.map((skill, index) => {
                    const isDisabled =
                      selectedSecondarySkills.includes(skill)  
                    return (
                      <Picker.Item
                        key={index}
                        label={skill}
                        value={skill}
                        enabled={!isDisabled}
                        color={isDisabled ? "gray" : ""}
                      />
                    );
                  })}
                </Picker>
              </View>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Secondary Skills</Text>
                <Picker
                  mode="dropdown" 
                  selectedValue={currentSkill}
                  onValueChange={(itemValue) => {
                    if (
                      !selectedSecondarySkills.includes(itemValue) &&
                      itemValue != primarySkill
                    ) {
                      setSelectedSecondarySkills([
                        ...selectedSecondarySkills,
                        itemValue,
                      ]);
                      setCurrentSkill(itemValue)
                    }
                  }}
                  style={styles.picker}
                >
                  <Picker.Item
                    label="Select Secondary Skills"
                    value=""
                    color="gray"
                    enabled={false}
                  />
                  {availableSkills.map((skill, index) => {
                    const isDisabled =
                      selectedSecondarySkills.includes(skill) ||
                      skill === primarySkill;

                    return (
                      <Picker.Item
                        key={index}
                        label={skill}
                        value={skill}
                        enabled={!isDisabled}
                        color={isDisabled&&skill!=currentSkill ? "gray" : ""}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>
            <View style={styles.badgesContainer}>
              {selectedSecondarySkills.map((skl, index) => (
                <View key={index} style={styles.badge}>
                  <Text style={styles.badgeText}>{skl}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      const updatedSkills = selectedSecondarySkills.filter(
                        (skill) => skill !== skl
                      );
                      setSelectedSecondarySkills(updatedSkills);
                    }}
                  >
                    <Text style={styles.cancel}>x</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  editButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "#1E90FF",
    borderRadius: 5,
  },
  editText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  skillsView: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  skillsLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "600",
    color: "#333",
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  badge: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: "skyblue",
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  badgeText: {
    color: "#333",
  },
  noSkillsText: {
    color: "#888",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalField: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 55,
    width: "100%",
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
  },
  saveButton: {
    marginTop: 10,
    paddingVertical: 12,
    backgroundColor: "#28a745",
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancel: {
    marginLeft: 8,
    color: "red",
    fontWeight: "bold",
  },
});
