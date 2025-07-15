import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import { Navigate } from 'react-router-dom';
import Secretary from './views/Secretary/Secretary.jsx';
import Medic from './views/Medic/Medic.jsx';
import InstanceDriver from './views/Secretary/InstanceDriver.jsx';
import InstanceUser from './views/Administrador/InstanceUser.jsx'
import Administrador from './views/Administrador/Administrador.jsx';
import AllDrivers from './views/Secretary/AllDrivers.jsx';
import Psicotecnica from './views/Psicotecnica/Psicotecnica.jsx';
import ViewDriverPsicotecnica from './views/Psicotecnica/ViewDriverPsicotecnica.jsx';
import ViewDriverQRPsicotecnica from './views/Psicotecnica/ViewDriverQRPsicotecnica.jsx';
import UploadFilePsicotecnica from './views/Psicotecnica/UploadFilePsicotecnica.jsx';
import UploadQRPsicotecnica from './views/Psicotecnica/UploadQRPsicotecnica.jsx';
import ViewDriverAdministrador from './views/Administrador/ViewDriverAdministrador.jsx';
import UploadFileAdministrador from './views/UploadFileAdministrador.jsx';
import MedicForm from './views/Medic/MedicForm.jsx';
import ViewDriverMedic from './views/Medic/ViewDriverMedic.jsx';
import Psychologist from "./views/Psychologist/Psychologist.jsx";
import ViewDriverPsychologist from './views/Psychologist/ViewDriverPsychologist.jsx';
import PsychologistForm from './views/Psychologist/PsychologistForm.jsx'
import ViewUsersAdministrador from "./views/Administrador/ViewUsersAdministrador.jsx";
import EditUser from "./views/Administrador/EditUser.jsx";
import Doc from './views/BackDoc/Doc.jsx';
import ViewBusinessSecretary from "./views/Secretary/ViewBusinessSecretary.jsx";
import EditBusiness from "./views/Secretary/EditBusiness.jsx";
import InstanceBusiness from "./views/Secretary/InstanceBusiness.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/Documentador"
            element={
              <ProtectedRoute>
                <Doc />
              </ProtectedRoute>
            }
          />
          {/* Secretary Routes */}
          <Route
            path="/Secretary"
            element={
              <ProtectedRoute>
                <Secretary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ViewBusinessSecretary"
            element={
              <ProtectedRoute>
                <ViewBusinessSecretary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/InstanceBusiness"
            element={
              <ProtectedRoute>
                <InstanceBusiness />
              </ProtectedRoute>
            }
          />
          <Route
            path="/EditBusiness/:id"
            element={
              <ProtectedRoute>
                <EditBusiness />
              </ProtectedRoute>
            }
          />
          <Route
            path="/UploadFilePsicotecnica"
            element={
              <ProtectedRoute>
                <UploadFilePsicotecnica />
              </ProtectedRoute>
            }
          />
          <Route
            path="/UploadQRPsicotecnica"
            element={
              <ProtectedRoute>
                <UploadQRPsicotecnica />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ViewDriverPsicotecnica"
            element={
              <ProtectedRoute>
                <ViewDriverPsicotecnica />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ViewDriverQRPsicotecnica"
            element={
              <ProtectedRoute>
                <ViewDriverQRPsicotecnica />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ViewDriverAdministrador"
            element={
              <ProtectedRoute>
                <ViewDriverAdministrador />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ViewUsersAdministrador"
            element={
              <ProtectedRoute>
                <ViewUsersAdministrador />
              </ProtectedRoute>
            }
          />
          <Route
            path="/UploadFileAdministrador"
            element={
              <ProtectedRoute>
                <UploadFileAdministrador />
              </ProtectedRoute>
            }
          />
          <Route
            path="/InstanceDriver"
            element={
              <ProtectedRoute>
                <InstanceDriver />
              </ProtectedRoute>
            }
          />
          <Route
            path="/InstanceUser"
            element={
              <ProtectedRoute>
                <InstanceUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/EditUser/:id"
            element={
              <ProtectedRoute>
                <EditUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AllDrivers"
            element={
              <ProtectedRoute>
                <AllDrivers />
              </ProtectedRoute>
            }
          />
          {/* Administrador Routes */}
          <Route
            path="/Administrador"
            element={
              <ProtectedRoute>
                <Administrador />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Psicotecnica"
            element={
              <ProtectedRoute>
                <Psicotecnica />
              </ProtectedRoute>
            }
          />
          {/* Medic Routes */}
          <Route
            path="/Medic"
            element={
              <ProtectedRoute>
                <Medic />
              </ProtectedRoute>
            }
          />
          <Route
            path="/MedicForm"
            element={
              <ProtectedRoute>
                <MedicForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ViewDriverMedic"
            element={
              <ProtectedRoute>
                <ViewDriverMedic />
              </ProtectedRoute>
            }
          />
          {/* Psychologist Routes */}
          <Route
            path="/Psychologist"
            element={
              <ProtectedRoute>
                <Psychologist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PsychologistForm"
            element={
              <ProtectedRoute>
                <PsychologistForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ViewDriverPsychologist"
            element={
              <ProtectedRoute>
                <ViewDriverPsychologist />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
