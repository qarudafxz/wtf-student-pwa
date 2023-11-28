import React, { useState } from "react";
import { useGetStorage } from "@/hooks/useGetStorage";
import { Navbar } from ".";

const PayViaGcash: React.FC = () => {
	const student_id = sessionStorage.getItem("student_id");
	const { getItem } = useGetStorage("token");
	const token = getItem();
	const [amount, setAmount] = useState("");

	//Will work this out later
	const pay = async () => {
		try {
			await fetch(`http://127.0.0.1:8000/api/pay/${student_id}/${amount}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}).then(async (res) => {
				const data = await res.json();

				if (data.checkout_url) {
					window.location.href = data.checkout_url;
				}
			});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className='font-main h-screen bg-dark'>
			<div className='xxxxs:p-6 xxxs:p-8 sm:p-10 md:p-12'>
				<h1 className='font-bold text-white text-4xl'>Pay Via Gcash</h1>
				<input
					type='text'
					onChange={(e) => setAmount(e.target.value)}
					placeholder='Enter amount'
					className='w-full py-2 rounded-md mt-4 pl-3'
				/>
				<button
					onClick={pay}
					className='bg-primary text-center py-2 rounded-md font-bold w-full'>
					Pay
				</button>
			</div>
			<Navbar />
		</div>
	);
};

export default PayViaGcash;
