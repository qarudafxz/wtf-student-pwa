/* eslint-disable react-hooks/exhaustive-deps */
//eslint-disable-next-line
//@ts-nocheck
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetStorage } from "@/hooks/useGetStorage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { CiClock2 } from "react-icons/ci";

const Logs: React.FC = () => {
	const studentId = sessionStorage.getItem("student_id");
	const { getItem } = useGetStorage("token");
	const token = getItem();
	const [payments, setPayments] = useState([]);
	const [loading, setLoading] = useState(false);

	const headers = new Headers({
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	} as HeadersInit);

	useEffect(() => {
		setLoading(true);
		const getLogs = async () => {
			try {
				await fetch(`http://localhost:8000/api/logs/${studentId}`, {
					method: "GET",
					headers,
				}).then(async (res) => {
					const data = await res.json();

					if (!res.ok) {
						toast.error("Something went wrong", {
							theme: "dark",
							position: "top-right",
							autoClose: 3000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
						});
						return;
					}
					console.log(data);
					setPayments(data.payments?.reverse());
					setTimeout(() => {
						setLoading(false);
					}, 1500);
				});
				await fetch("");
			} catch (err) {
				console.log(err);
			}
		};

		getLogs();
	}, []);

	return (
		<div className='font-main h-screen relative bottom-10 bg-dark'>
			<ToastContainer />
			<div className='flex flex-col gap-2'>
				<div className='flex justify-between items-center my-4'>
					<h1 className='font-bold text-white text-xl'>Logs</h1>
					<Link
						to='/pay'
						className='font-bold text-zinc-500 bg-zinc-800 border border-zinc-500 px-2 py-1 rounded-md'>
						Pay with Gcash
					</Link>
				</div>
				<div className='w-full flex flex-col gap-10'>
					{payments?.map((payment, idx) => {
						return (
							<div
								key={idx}
								className='flex gap-4 items-center'>
								{loading ? (
									<>
										<SkeletonCircle
											size='60'
											startColor='#272727'
											endColor='#1F1F1F'
											className='rounded-full'
										/>
										<Skeleton
											height='55px'
											width='220px'
											startColor='#272727'
											endColor='#1F1F1F'
										/>
									</>
								) : (
									<div
										className={`border-t border-zinc-500 flex flex-row w-full gap-4 ${
											idx % 2 === 0 && "bg-zinc-950"
										}`}>
										{/* Circular */}
										<div className='bg-primary text-black font-bold font-main rounded-full px-2 flex flex-col items-center place-content-center place-items-center'>
											<h1 className='text-xs text-center'>
												{new Date(payment?.date).toLocaleDateString("en-US", {
													month: "short",
													year: "numeric",
												})}
											</h1>
											<h1 className='font-extrabold text-xl text-center'>
												{new Date(payment?.date).toLocaleString("en-US", {
													day: "2-digit",
												})}
											</h1>
										</div>
										{/* content */}
										<div className='flex justify-between items-center'>
											<div className='flex flex-col justify-start items-start '>
												<h1 className='text-primary font-extrabold text-3xl'>
													PHP{payment?.amount}
												</h1>
												{!payment?.collector?.first_name ||
												!payment?.collector?.last_name ? (
													<p className='text-white text-xs flex items-center'>
														Paid via Gcash
													</p>
												) : (
													<p className='text-white text-xs flex items-center'>
														Collected by {payment?.collector?.first_name}{" "}
														{payment?.collector?.last_name}
													</p>
												)}
												<p className='text-[14px] text-zinc-400 flex items-center gap-2'>
													<CiClock2
														className='text-primary bg-zinc-800 rounded-md p-2'
														size={35}
													/>
													{/* Format the time, only the time, remove the date */}
													{new Date(payment?.created_at).toLocaleTimeString("en-US", {
														hour: "2-digit",
														minute: "2-digit",
														second: "2-digit",
														hour12: true,
													})}
												</p>
											</div>
											<div className='flex flex-col justify-end items-end ml-4'>
												<p className='text-zinc-400 font-bold text-end'>{payment?.ar_no}</p>
												<p
													className={`text-xs bg-zinc-700 border border-zinc-400 px-2 py-1 rounded-md ${
														payment?.desc === "partial" ? "text-yellow-400" : "text-green-500"
													}`}>
													{payment.desc}
												</p>
											</div>
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Logs;
