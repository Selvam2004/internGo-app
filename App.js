import React from 'react' 
import Route from './routes/route'
import { Provider } from 'react-redux'
import store, { persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'


 const App = () => {
   return (
    <Provider store={store}>

      <PersistGate persistor={persistor}>
       
        <Route/> 

     </PersistGate>
     
    </Provider>
   )
 }
 
 export default App