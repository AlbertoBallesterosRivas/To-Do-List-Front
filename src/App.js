import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import AppContent from "./AppContent";
import './styles/main.scss';

// Componente principal de la aplicación
const App = () => {
  return (
    <Provider store={store}>
      <Router>
        {/* Puedes agregar un encabezado o un componente de navegación aquí */}
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;