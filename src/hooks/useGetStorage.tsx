import { useCookies } from "react-cookie";

export const useGetStorage = (key: string) => {
	const [token, setToken] = useCookies([key]);

	const getItem = () => {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : null;
	};

	const setItem = (token: string) => {
		//add expiration date

		setToken(key, token, { path: "/" });
		document.cookie = `${key}=${token}; path=/; max-age=600;`;
	};

	const removeItem = () => {
		setToken(key, "", { path: "/" });
		document.cookie = `${key}=; path=/; max-age=0;`;
	};

	return { getItem, setItem, removeItem, token };
};
