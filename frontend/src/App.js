import React, { useState, createContext } from "react";
import { Snackbar, Alert } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { appRoutes, authRoutes } from './routes';
import Header from "./components/header/header.component";

export const SnackbarContext = createContext({});

const App = () => {

	const token = localStorage.getItem('token');

	const [snack, setSnack] = useState({
		message: '',
		color: '',
		severity: 'success',
		open: false,
		autoHideDuration: 3000
	});

	const pathname = window?.location?.pathname?.split('/')?.reverse();

	return (
		<SnackbarContext.Provider value={{ snack, setSnack }}>
			<Snackbar autoHideDuration={snack.autoHideDuration} open={snack.open} onClose={() => setSnack({ ...snack, open: false })}>
				<Alert variant="filled" onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity}>{snack.message}</Alert>
			</Snackbar>
			<BrowserRouter>
				{ token && pathname?.length === 2 && ['login', 'signup']?.includes(pathname[0]) && <Navigate to="/dashboard" /> }
				{ token && <Header /> }
				<Routes>
					{
						token
						? appRoutes?.map((route) => <Route key={route.key} exact={route.exact} path={route.path} element={route?.component} />)
						: authRoutes?.map((route) => <Route key={route.key} exact={route.exact} path={route.path} element={route?.component} />)
					}
				</Routes>
			</BrowserRouter>
		</SnackbarContext.Provider>
	);
}

export default App;
