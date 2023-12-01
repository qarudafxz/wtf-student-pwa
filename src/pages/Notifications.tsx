import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import Navbar from "@/components/Navbar";
import ccislsg from "@/assets/ccislsg_logo.png";
import { useGetStorage } from "@/hooks/useGetStorage";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Head from "@/components/Head";

interface Notification {
	message: string;
	note: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	receipt: any;
}

const Notifications: React.FC = () => {
	const { getItem } = useGetStorage("token");
	const token = getItem();
	const student_id = sessionStorage.getItem("student_id");
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [notifFromDb, setNotifFromDb] = useState<Notification[]>([]);

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
					console.log(data);
					setNotifications((prevNotifications) => [data, ...prevNotifications]);
					setNotifFromDb((prevNotifications) => [data, ...prevNotifications]);
				});
			} catch (error) {
				console.error("Pusher authentication error:", error);
			}
		});

		return () => {
			pusher.disconnect();
		};
	};

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

	useEffect(() => {
		initializePusher();
		fetchNotificationsFromDb();
	}, [student_id]);

	return (
		<div className='bg-dark h-screen font-main'>
			<Head />
			<div className='xxxxs:p-6 xxxs:p-8 sm:p-10 md:p-16'>
				<h1 className='font-bold text-2xl text-white pb-4'>Notifications</h1>
				{notifications?.length > 0 &&
					notifications?.map((notif, idx) => {
						return (
							<div
								key={idx}
								className='w-full py-2 border-t border-zinc-600 flex items-center gap-4'>
								<img
									src={ccislsg}
									alt='CCISLSG Logo'
									className='w-16 h-16 p-3 rounded-full bg-primary'
								/>
							</div>
						);
					})}
				{notifFromDb?.length > 0 &&
					notifFromDb?.map((notif, idx) => {
						return (
							<div
								key={idx}
								className='w-full py-2 border-t border-zinc-600 flex items-center gap-4'>
								<img
									src={ccislsg}
									alt='CCISLSG Logo'
									className='w-16 h-16 p-3 rounded-full bg-primary'
								/>
								<div className='flex flex-col w-full'>
									<h1 className='font-bold text-white text-lg'>CCISLSG</h1>
									<div className='flex justify-between items-center'>
										<p className='text-zinc-400'>{notif?.note}</p>
										<HiOutlineDotsHorizontal
											size={15}
											className='text-primary'
										/>
									</div>
								</div>
							</div>
						);
					})}
			</div>
			<Navbar notifications={notifications} />
		</div>
	);
};

export default Notifications;
