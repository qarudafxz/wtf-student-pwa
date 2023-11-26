import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GetStarted from "@/pages/GetStarted";
import Menu from "@/pages/Menu";
import ContextProvider from "@/context/ContextProvider";
import Dashboard from "@/pages/Dashboard";

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
