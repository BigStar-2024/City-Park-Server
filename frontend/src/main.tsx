
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import StoreProvider from './store/store.tsx'
import SVGs from './components/svg.tsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom'
import { ConfirmDialog } from 'primereact/confirmdialog'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <SVGs />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />    
    <ConfirmDialog />
    <BrowserRouter>
      <StoreProvider>
        <App />
      </StoreProvider>
    </BrowserRouter>
  </>
)
