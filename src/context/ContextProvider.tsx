import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useGetStorage } from "../hooks/useGetStorage";

interface ContextProviderProps {
	children: ReactNode;
}

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
	// Destructure the result directly in the function signature
	const { getItem } = useGetStorage("token");
	const token = getItem();

	// Use ternary operator for concise conditional rendering
	return token ? <div>{children}</div> : <Navigate to='/' />;
};

export default ContextProvider;
