import React, { useState, useEffect } from "react";
import logo from "@/assets/logo_white.png";
import master from "@/assets/master_card.png";
import { useGetStorage } from "@/hooks/useGetStorage";

const Balance: React.FC = () => {
	const [balance, setBalance] = useState(0);
	const studentId = sessionStorage.getItem("student_id");
	const { getItem } = useGetStorage("token");
	const token = getItem();

	useEffect(() => {
		const headers = new Headers({
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		} as HeadersInit);

		const getBalance = async () => {
			try {
				await fetch(`http://localhost:8000/api/balance/${studentId}`, {
					method: "GET",
					headers,
				}).then(async (res) => {
					const data = await res.json();
					console.log(data.student);
					setBalance(data?.student[0]?.balance);
				});
			} catch (err) {
				console.log(err);
			}
		};

		getBalance();
	}, []);
	return (
		<div className='relative bottom-4'>
			<div className=''>
				<h1>{balance}</h1>
			</div>
		</div>
	);
};

export default Balance;
