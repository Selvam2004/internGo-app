import {
  View,
  Text,
  StyleSheet, 
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import ErrorPage from "../User/Error";
import InteractionCard from "../../components/interactions/InteractionCard";
import { axiosInstance } from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";

export default function Interactions() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const { userId } = useSelector((state) => state.auth.data?.data);
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    fetchInteractions();
  };
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

  useEffect(() => {
    setLoading(true);
    fetchInteractions();
  }, []);

  return (
    <View style={styles.container}>
      {error ? (
        <ErrorPage onRetry={fetchInteractions} />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.header}>Interactions</Text>

          {loading ? (
            <View
              style={{
                height: 600,
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <ActivityIndicator />
              <Text style={{ fontWeight: "600", textAlign: "center" }}>
                Loading...
              </Text>
            </View>
          ) : (
            <>
              {interactions && interactions.length > 0 ? (
                <>
                  {interactions.map((intr) => (
                    <InteractionCard key={intr.id} interaction={intr} />
                  ))}
                </>
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
        </ScrollView>
      )}
    </View>
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
