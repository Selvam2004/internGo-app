import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import ErrorPage from "./../../components/error/Error";
import { axiosInstance } from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import MentorInteractionCard from "../../components/interactions/MentorInteractionCard";

export default function Interactions() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const { userId } = useSelector((state) => state.auth.data?.data);
  const [refreshing, setRefreshing] = useState(false);
  const fetchInteractions = async () => {
    try {
      setError(false);
      const response = await axiosInstance.post(`/api/interactions/${userId}`, {
        interactionStatus: [],
        name: "",
        date: "",
      });
      if (response) {
        setInteractions(response.data.data?.data || []);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    fetchInteractions();
  };
  useEffect(() => {
    setLoading(true);
    fetchInteractions();
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      showsVerticalScrollIndicator={false}
      style={styles.container}
    >
      {error ? (
        <ErrorPage onRetry={fetchInteractions} />
      ) : (
        <>
          <Text style={styles.header}>Interactions</Text>

          {loading ? (
            <View
              style={{
                justifyContent: "center",
                height: 500,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <ActivityIndicator />
              <Text style={{ textAlign: "center" }}>Loading...</Text>
            </View>
          ) : (
            <>
              {interactions && interactions.length > 0 ? (
                <View style={{ paddingBottom: 30 }}>
                  {interactions.map((intr) => (
                    <MentorInteractionCard key={intr.id} interaction={intr} />
                  ))}
                </View>
              ) : (
                <View style={{ height: 500, justifyContent: "center" }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "400",
                      textAlign: "center",
                    }}
                  >
                    No Interactions Available
                  </Text>
                </View>
              )}
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
});
