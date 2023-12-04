/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import Navbar from "@/components/Navbar";
import ccislsg from "@/assets/ccislsg_logo.png";
import { useGetStorage } from "@/hooks/useGetStorage";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Head from "@/components/Head";
import { motion } from "framer-motion";
import { IoCloseCircleOutline } from "react-icons/io5";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "@/assets/circle_icon.png";
import { FaTrashCan } from "react-icons/fa6";

const Receipt: React.FC<{
	isView: boolean;
	setIsView: any;
	receipt: any;
}> = ({ isView, setIsView, receipt }) => {
	if (!receipt) return null;
	const parsedReceipt = JSON.parse(receipt)[0];
	return (
		<>
			{isView === true && (
				<div className='fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-50'>
					<ToastContainer />
					<IoCloseCircleOutline
						onClick={() => {
							setIsView(false);
						}}
						size={40}
						className='text-white mb-10 cursor-pointer'
					/>
					<motion.form
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.5 }}
						transition={{
							duration: 0.8,
							type: "spring",
							ease: [0, 0.71, 0.2, 0],
						}}
						className='bg-white p-8 rounded-md w-[400px]'>
						<div className='flex justify-between items-center'>
							<img
								src={logo}
								alt='WTF Logo'
								className='w-8 h-8'
							/>
							<div className='flex items-center gap-2'>
								<img
									src={ccislsg}
									alt='CCISLSG Logo'
									className='w-8 h-8'
								/>
								<p className='text-primary font-bold text-sm'>CCISLSG</p>
							</div>
						</div>
						<div className='flex flex-col gap-2 mt-14'>
							<div className='flex justify-between items-center'>
								<div className='flex gap-2 items-center'>
									<h1>DATE</h1>
									<p className='text-primary font-bold text-sm'>
										{new Date(parsedReceipt?.date).toLocaleDateString("en-US", {
											month: "long",
											day: "numeric",
											year: "numeric",
										})}
									</p>
								</div>
								<div className='flex gap-2 items-center'>
									<h1>CONTROL NO.</h1>
									<p className='text-primary font-bold text-sm'>
										{parsedReceipt?.ar_no}
									</p>
								</div>
							</div>
							<h1 className='text-center font-bold mt-4 text-xl'>
								ACKNOWLEDGEMENT RECEIPT
							</h1>
							<p className='text-center text-sm mt-2'>
								This is to certify that{" "}
								<span className='font-bold'>
									{parsedReceipt.first_name + " " + parsedReceipt?.last_name}
								</span>{" "}
								with ID number{" "}
								<span className='font-bold'>{parsedReceipt?.student_id}</span> paid the
								College fee worth{" "}
								<span className='font-bold'>₱{parsedReceipt.amount}</span>
							</p>
							<div className='flex justify-between items-center mt-20 text-xs gap-10'>
								<div className='flex gap-4 items-center'>
									<p>SEMESTER</p>
									<p className='text-primary font-bold text-sm'>
										{parsedReceipt?.semester_id === 1 ? "1st" : "2nd"} Semester
									</p>
								</div>
								<div className='flex gap-2 items-center'>
									<p>ACADEMIC YEAR</p>
									<p className='text-primary font-bold text-sm'>
										{parsedReceipt?.acad_year}
									</p>
								</div>
							</div>

							<div className='flex flex-col place-content-center place-items-center justify-center mt-10'>
								<p className='font-bold'>{parsedReceipt?.admin_id}</p>
								<p>Collector's ID</p>
							</div>
						</div>
					</motion.form>
				</div>
			)}
		</>
	);
};

const Notifications: React.FC = () => {
	const { getItem } = useGetStorage("token");
	const token = getItem();
	const student_id = sessionStorage.getItem("student_id");
	const [notifications, setNotifications] = useState<any[]>([]);
	const [notifFromDb, setNotifFromDb] = useState<any[]>([]);
	const [isView, setIsView] = useState(false);
	const [selectedReceipt, setSelectedReceipt] = useState<any>("");

	const fetchNotificationsFromDb = async () => {
		const headers = new Headers({
			Authorization: `Bearer ${token}`,
		} as HeadersInit);
		try {
			const res = await fetch(
				`http://localhost:8000/api/notifications/${student_id}`,
				{
					method: "GET",
					headers,
				}
			);
			const data = await res.json();

			setNotifFromDb(data?.notifications);
		} catch (err) {
			console.log(err);
		}
	};

	const deleteAllNotifications = async () => {
		try {
			await axios.delete(`http://localhost:8000/api/notifications/${student_id}`);
			fetchNotificationsFromDb();
		} catch (err) {
			console.log(err);
		}
	};

	const initializePusher = async () => {
		const pusher = new Pusher("7c7a03a437d59fe674fe", {
			cluster: "ap1",
			forceTLS: true,
			authEndpoint: "http://localhost:8000/api/pusher/auth",
		});

		pusher.connection.bind("connected", async () => {
			try {
				const response = await axios.post("http://localhost:8000/api/pusher/auth", {
					socket_id: pusher.connection.socket_id,
					channel_name: `private-student-${student_id}`,
				});

				const pusherAuth = response.data.auth;

				const channel = pusher.subscribe(`private-student-${student_id}`);
				channel.bind("pusher:subscription_succeeded", () => {
					channel.trigger("client-auth", {
						Authorization: `Bearer ${pusherAuth}`,
					});
				});

				channel.bind("client-receipt-received", (data: Notification) => {
					const key = "id" as any;
					setNotifications((prevNotifications) => [
						...new Map(
							[data, ...prevNotifications].map((item) => [
								//eslint-disable-next-line
								//@ts-nocheck
								item[key] as any,
								item,
							])
						).values(),
					]);

					fetchNotificationsFromDb();
				});
			} catch (error) {
				console.error("Pusher authentication error:", error);
			}
		});

		return () => {
			pusher.disconnect();
		};
	};

	useEffect(() => {
		initializePusher();
		fetchNotificationsFromDb();
	}, [student_id]);

	return (
		<div className={`bg-dark font-main pb-14 h-screen`}>
			<Head />
			<div className='xxxxs:p-6 xxxs:p-8 sm:p-10 md:p-16'>
				<div className='flex justify-between items-center pb-4'>
					<h1 className='font-bold text-2xl text-white'>Notifications</h1>
					<button onClick={deleteAllNotifications}>
						<FaTrashCan
							size={20}
							className='text-primary'
						/>
					</button>
				</div>
				<div className='max-h-[450px] overflow-y-auto custom'>
					{notifFromDb?.length > 0 &&
						notifFromDb?.map((notif, idx) => {
							return (
								<button
									onClick={() => {
										setIsView(true);
										setSelectedReceipt(notif?.receipt);
									}}
									key={idx}
									className='w-full py-2 border-t border-zinc-600 flex items-center gap-4'>
									<img
										src={ccislsg}
										alt='CCISLSG Logo'
										className='w-16 h-16 p-3 rounded-full bg-primary'
									/>
									<div className='flex flex-col justify-start items-start place-items-start w-full'>
										<h1 className='font-bold text-white text-lg'>CCISLSG</h1>
										<div className='flex items-center w-full text-left justify-between'>
											<div className='flex flex-col'>
												<p className='text-zinc-400'>{notif?.note}</p>
												<p className='text-xs text-zinc-500'>
													{new Date(notif?.created_at).toLocaleDateString("en-US", {
														month: "long",
														day: "numeric",
														year: "numeric",
														hour: "numeric",
														minute: "numeric",
														hour12: true,
													})}
												</p>
											</div>
											<HiOutlineDotsHorizontal
												size={15}
												className='text-primary'
											/>
										</div>
									</div>
								</button>
							);
						})}
				</div>
			</div>
			<Receipt
				isView={isView}
				setIsView={setIsView}
				receipt={selectedReceipt}
			/>
			<Navbar notifications={notifications} />
		</div>
	);
};

export default Notifications;
