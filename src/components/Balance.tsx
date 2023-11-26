import React, { useState, useEffect } from "react";
import logo from "@/assets/logo_white.png";
import master from "@/assets/master_card.png";
import ccislsg from "@/assets/ccislsg_logo.png";
import orig_logo from "@/assets/circle_icon.png";
import { useGetStorage } from "@/hooks/useGetStorage";
import { Skeleton } from "@chakra-ui/react";

const Balance: React.FC = () => {
	const [balance, setBalance] = useState(0);
	const [totalPayment, setTotalPayment] = useState(0);
	const studentId = sessionStorage.getItem("student_id");
	const [college, setCollege] = useState("");
	const [loading, setLoading] = useState(false);
	const { getItem } = useGetStorage("token");
	const token = getItem();

	useEffect(() => {
		const headers = new Headers({
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		} as HeadersInit);

		const getBalance = async () => {
			setLoading(true);
			try {
				await fetch(`http://localhost:8000/api/balance/${studentId}`, {
					method: "GET",
					headers,
				}).then(async (res) => {
					const data = await res.json();
					setLoading(false);
					setBalance(data?.student[0]?.balance);
				});
			} catch (err) {
				console.log(err);
			}
		};

		const getTotalPaymentOfStudent = async () => {
			setLoading(true);
			try {
				await fetch(`http://localhost:8000/api/student-payment/${studentId}`, {
					method: "GET",
					headers,
				}).then(async (res) => {
					const data = await res.json();
					setLoading(false);
					setTotalPayment(data?.total_payment);
				});
			} catch (err) {
				console.log(err);
			}
		};

		const getCollegeTotalAmount = async () => {
			setLoading(true);
			try {
				await fetch(`http://localhost:8000/api/college/1`, {
					method: "GET",
					headers,
				}).then(async (res) => {
					const data = await res.json();
					setLoading(false);
					setCollege(data.total_payment);
				});
			} catch (err) {
				console.log(err);
			}
		};

		getBalance();
		getTotalPaymentOfStudent();
		getCollegeTotalAmount();
	}, []);
	return (
		<div className='relative bottom-12'>
			<div className='text-white bg-gradient-to-tr from-[#205250] to-primary p-4 rounded-md border border-[#999999]'>
				<img
					src={logo}
					alt='Logo'
					className='w-7 h-7'
				/>
				<p>Remaining balance</p>
				{!loading ? (
					<h1 className='font-bold text-7xl'>₱{balance}</h1>
				) : (
					<Skeleton
						variant={"rectangular"}
						startColor='#205250'
						height='70px'
						width='290px'
					/>
				)}
				<div className='flex justify-between items-center'>
					<p>
						{new Date().toLocaleDateString("en-US", {
							month: "2-digit",
							day: "2-digit",
						})}
					</p>
					<img
						src={master}
						alt='Master Card'
						className='w-6 h-4'
					/>
				</div>
			</div>
			<div className='w-full grid grid-cols-2 space-x-2 mt-2'>
				<div className='col-span-1 bg-zinc-800 p-2 rounded-md border border-zinc-500'>
					<div className='flex justify-between items-center'>
						<img
							src={ccislsg}
							alt='CCISLSG logo'
							className='w-12 h-12'
						/>
						<div className='flex flex-col justify-end'>
							<div className='flex flex-col justify-end items-end'>
								<img
									src={orig_logo}
									alt='Logo'
									className='w-5 h-5 mb-2'
								/>
								{!loading ? (
									<h1 className='font-bold text-xl text-[#A4A4A4]'>₱{college}</h1>
								) : (
									<Skeleton
										variant={"text"}
										startColor='#0D0D0D'
										height='20px'
										width='90px'
									/>
								)}
								<p className='text-[8px] text-end text-[#A4A4A4]'>
									Total College fee amount being collected as of{" "}
									{new Date().toLocaleDateString("en-US", {
										month: "2-digit",
										day: "2-digit",
									})}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className='col-span-1 bg-zinc-800 p-2 rounded-md border border-zinc-500'>
					<div className='flex flex-col justify-end items-end'>
						<img
							src={orig_logo}
							alt='Logo'
							className='w-5 h-5 mb-2'
						/>
						{!loading ? (
							<h1 className='font-bold text-xl text-[#A4A4A4]'>₱{totalPayment}</h1>
						) : (
							<Skeleton
								variant={"text"}
								startColor='#0D0D0D'
								height='20px'
								width='90px'
							/>
						)}
						<p className='text-xs text-end text-[#A4A4A4]'>
							Total amount paid as of{" "}
							{new Date().toLocaleDateString("en-US", {
								month: "2-digit",
								day: "2-digit",
							})}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Balance;
