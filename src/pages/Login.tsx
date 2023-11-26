import React, { useState, useEffect } from "react";
import { useGetStorage } from "@/hooks/useGetStorage";
import TopLoadingBar from "react-top-loading-bar";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login: React.FC = () => {
	const [studentID, setStudentID] = useState("");
	const [password, setPassword] = useState("");
	const [progress, setProgress] = useState(0);
	const { setItem, getItem } = useGetStorage("token");
	const navigate = useNavigate();
	const token = getItem();

	const handleLogin = async () => {
		const headers = new Headers({
			"Content-Type": "application/json",
		} as HeadersInit);

		const payload = {
			student_id: studentID,
			password,
		};
		setProgress(30);
		try {
			await fetch("http://127.0.0.1:8000/api/auth/login", {
				method: "POST",
				headers,
				body: JSON.stringify(payload),
			}).then(async (res) => {
				const data = await res.json();

				if (!res.ok) {
					toast.error(data.message, {
						theme: "dark",
						position: "top-center",
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
					});
					return;
				}

				sessionStorage.setItem("student_id", data.student.student_id);
				sessionStorage.setItem("program", data.student.program_id);
				sessionStorage.setItem(
					"name",
					data.student.first_name + " " + data.student.last_name
				);
				setItem(data.accessToken);
				setProgress(100);
				navigate("/dashboard");
			});
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (!token) {
			toast.error("Session expired. Please login again.", {
				theme: "dark",
				position: "top-center",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			sessionStorage.clear();
		}
	}, [token]);

	return (
		<div className='bg-dark h-screen'>
			<ToastContainer />
			<TopLoadingBar
				progress={progress}
				color='#49B0AD'
				height={3}
				onLoaderFinished={() => setProgress(0)}
			/>
			<div className='xxxxs:p-6 xxxs:p-8 sm:p-10 md:p-12'>
				<h1 className='text-center font-bold text-white'>Login</h1>
				<div className='flex flex-col gap-4 mt-4'>
					<input
						type='text'
						placeholder='Student ID'
						className='rounded-md border border-primary py-2 px-4'
						value={studentID}
						onChange={(e) => setStudentID(e.target.value)}
					/>
					<input
						type='password'
						placeholder='Password'
						className='rounded-md border border-primary py-2 px-4'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button
						className='rounded-md font-semibold text-center py-2 text-primary bg-white'
						onClick={() => {
							handleLogin();
							setProgress(100);
						}}>
						Login
					</button>
				</div>
			</div>
		</div>
	);
};

export default Login;
