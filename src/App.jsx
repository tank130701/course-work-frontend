import React, { StrictMode } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Root from './components/Root/Root.jsx';
import LoginForm from "./components/LoginForm/LoginForm";
import CategoriesPanel from './components/CategoriesPanel/CategoriesPanel.jsx';

import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StrictMode>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            {/*<Route path={'/'} element={store.isAuthenticated() ? <Board /> : <LoginForm /> }/>*/}
            {<Route path='/login' element={<LoginForm />} />}
            {<Route path='/root' element={<Root />} />}
            {<Route path='/categories-panel' element={<CategoriesPanel />} />}
          </Routes>
        </Router>
      </StrictMode>
    </QueryClientProvider>
  );
}

export default App;
