import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContextProvider from "@/context/ContextProvider";
import { GetStarted, Menu, Dashboard, Login, Signup } from "@/pages";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route
					path='/'
					element={<GetStarted />}
				/>
				<Route
					path='/menu'
					element={<Menu />}
				/>
				<Route
					path='/login'
					element={<Login />}
				/>
				<Route
					path='/register'
					element={<Signup />}
				/>
				{/* If the user logs in already */}
				<Route
					path='/dashboard'
					element={
						<ContextProvider>
							<Dashboard />
						</ContextProvider>
					}
				/>
			</Routes>
		</Router>
	);
};

export default App;
