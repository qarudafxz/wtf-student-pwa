import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useGetStorage } from "../hooks/useGetStorage";

interface ContextProviderProps {
	children: ReactNode;
}

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
	const { getItem } = useGetStorage("token");
	const token = getItem();

	return token ? <div>{children}</div> : <Navigate to='/menu' />;
};

export default ContextProvider;
