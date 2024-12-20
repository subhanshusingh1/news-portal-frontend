import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {ClerkProvider} from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import { store } from './redux/store/store.jsx'
import { fetchDescription } from './redux/slicers/DescriptionSlice.jsx'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// store.dispatch(fetchDescription({ id: "67619636afa2e9f11a4bfdcd", regionType: "locality" }));
// store.subscribe(() => console.log(store.getState()));


createRoot(document.getElementById('root')).render(
  <StrictMode>
  <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/">

  <Provider store={store}>
      <App />
  </Provider>
  </ClerkProvider>

  </StrictMode>,
)
