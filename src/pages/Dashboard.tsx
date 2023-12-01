/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import { Balance, Head, Logs, Navbar } from "@/components";

const Dashboard: React.FC = () => {
	const student_id = sessionStorage.getItem("student_id");
	const [notifications, setNotifications] = useState<Notification[]>([]);

	const initializePusher = async () => {
		const pusher = new Pusher("7c7a03a437d59fe674fe", {
			cluster: "ap1",
			forceTLS: true,
			authEndpoint: "http://localhost:8000/api/pusher/auth",
		});

		pusher.connection.bind("connected", async () => {
			try {
				// Make an authenticated request to your Laravel backend to obtain Pusher auth token
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

				// Bind the event
				channel.bind("client-receipt-received", (data: any) => {
					const key = "id" as any;
					// Update state with the new notification
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
				});
			} catch (error) {
				console.error("Pusher authentication error:", error);
			}
		});

		// Cleanup on component unmount
		return () => {
			pusher.disconnect();
		};
	};

	useEffect(() => {
		initializePusher();
	}, [student_id]);

	return (
		<div className='bg-dark h-full font-main overflow-y-auto'>
			<Head />
			<div className='xxxxs:p-6 xxxs:p-8 sm:p-10 md:p-12'>
				<Balance />
				<Logs />
			</div>
			<Navbar notifications={notifications} />
		</div>
	);
};

export default Dashboard;
