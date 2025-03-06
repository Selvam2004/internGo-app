
import React from "react";
import Route from "./routes/route";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Route />
      </PersistGate>
    </Provider>
  );
};

export default App;
// import React, { useEffect, useState } from "react";
// import { View, Text, Alert, Platform, PermissionsAndroid } from "react-native";

// // Function to create a notification channel


// const App = () => {
//   const [fcmToken, setFcmToken] = useState(null);

//   // Request permission for notifications

//   // Get FCM Token



//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Your FCM Token:</Text>
//       <Text>{fcmToken}</Text>
//     </View>
//   );
// };

// // Background message handler


// // Function to show local notification


// export default App;
