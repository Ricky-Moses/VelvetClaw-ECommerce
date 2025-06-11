import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// Slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Redux
import { Provider } from 'react-redux'
import Store from './Redux/Store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </StrictMode>,
)
