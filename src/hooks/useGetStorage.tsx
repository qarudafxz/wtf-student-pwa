import { useCookies } from "react-cookie";

export const useGetStorage = (key: string) => {
	const [token, setToken] = useCookies([key]);

	const getItem = () => {
		//get the token from the cookies
		return token[key];
	};

	const setItem = (token: string) => {
		//expiration time is on 5 minutes

		setToken(key, token, { path: "/" });
		document.cookie = `${key}=${token}; path=/; max-age=600;`;
	};

	const removeItem = () => {
		setToken(key, "", { path: "/" });
		document.cookie = `${key}=; path=/; max-age=0;`;
	};

	return { getItem, setItem, removeItem, token };
};
