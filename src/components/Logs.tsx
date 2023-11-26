//eslint-disable-next-line
//@ts-nocheck
import React, { useEffect, useState } from "react";
import { useGetStorage } from "@/hooks/useGetStorage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Skeleton, SkeletonCircle } from "@chakra-ui/react";

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
		const getLogs = async () => {
			setLoading(true);
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
					setLoading(true);
					setPayments(data.payments);
				});
				await fetch("");
			} catch (err) {
				console.log(err);
			}
		};

		getLogs();
	}, []);
	return (
		<div className='font-main relative bottom-10 bg-dark h-full'>
			<ToastContainer />
			<div className='flex flex-col gap-2'>
				<div className='flex justify-between items-center'>
					<h1 className='font-bold text-white text-xl mb-4'>Logs</h1>
				</div>
				<div className='max-h-[150px] overflow-auto flex flex-col gap-5'>
					{payments?.map((payment, idx) => {
						return (
							<div
								key={idx}
								className='grid grid-cols-7'>
								{loading ? (
									<SkeletonCircle
										size='70'
										startColor='#4FD1C5'
										endColor='#63B3ED'
										className='rounded-full'
									/>
								) : (
									<div className='col-span-2 flex flex-col bg-primary rounded-full text-center py-5'>
										<h1 className='text-black font-bold text-[9px]'>
											{new Date(payment?.date as string).toLocaleDateString("en-US", {
												month: "short",
												year: "numeric",
											})}
										</h1>
										<h1 className='font-extrabold text-3xl'>
											{" "}
											{new Date(payment?.date as string).toLocaleDateString("en-US", {
												day: "numeric",
											})}
										</h1>
									</div>
								)}
								<div className='col-span-5 flex justify-between items-center'></div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Logs;
