import React, { useState, useEffect } from "react";
import logo from "@/assets/circle_icon.png";
import { useGetStorage } from "@/hooks/useGetStorage";
import TopLoadingBar from "react-top-loading-bar";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import Cookies from "js-cookie";

const Login: React.FC = () => {
	const [rememberedStudentID, setRememberedStudentID] = useState("");
	const [studentID, setStudentID] = useState("");
	const [password, setPassword] = useState("");
	const [progress, setProgress] = useState(0);
	const [rememberMe, setRememberMe] = useState(false);
	const { setItem, getItem } = useGetStorage("token");
	const navigate = useNavigate();
	const token = getItem();

	const handleLogin = async () => {
		const headers = new Headers({
			"Content-Type": "application/json",
		} as HeadersInit);

		const payload = {
			student_id: rememberMe ? rememberedStudentID : studentID,
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

				if (rememberMe) {
					Cookies.set("student_id", data.student.student_id);
					Cookies.set("remember_me", "true");
				} else {
					Cookies.remove("student_id");
					Cookies.remove("remember_me");
				}

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
				autoClose: 1000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
			sessionStorage.clear();
		}
	}, []);

	useEffect(() => {
		const storedStudentID = Cookies.get("student_id");
		const storedRememberMe = Cookies.get("remember_me");

		if (storedStudentID && storedRememberMe === "true") {
			setRememberedStudentID(storedStudentID);
			setRememberMe(true);
		}
	}, []);

	return (
		<div className='bg-dark h-screen font-main'>
			<ToastContainer />
			<TopLoadingBar
				progress={progress}
				color='#49B0AD'
				height={3}
				onLoaderFinished={() => setProgress(0)}
			/>
			<div className='xxxxs:p-6 xxxs:p-8 sm:p-10 md:p-12'>
				<div className='flex justify-start'>
					<Link to='/menu'>
						<IoMdArrowRoundBack
							size={25}
							className='text-white'
						/>
					</Link>
				</div>
				<div className='flex flex-col w-full justify-center place-items-center mt-12'>
					<img
						src={logo}
						className='w-16 h-16 mb-10'
					/>
					<h1 className='text-center font-bold text-2xl text-white'>Login</h1>
					<div className='flex flex-col gap-4 mt-4 w-full'>
						<input
							type='text'
							placeholder='Student ID'
							className='rounded-md border border-primary py-2 px-4'
							value={rememberMe ? rememberedStudentID : studentID}
							onChange={(e) => {
								const value = e.target.value;
								setStudentID(value);
								if (rememberMe) {
									setRememberedStudentID(value);
								}
							}}
						/>
						<input
							type='password'
							placeholder='Password'
							className='rounded-md border border-primary py-2 px-4'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<div className='flex items-center'>
							<input
								type='checkbox'
								checked={rememberMe}
								onChange={() => setRememberMe(!rememberMe)}
								className='mr-2'
							/>
							<label className='text-white'>Remember Me</label>
						</div>
						<button
							className='rounded-md font-bold text-center py-2 text-white bg-primary'
							onClick={() => {
								handleLogin();
								setProgress(100);
							}}>
							Login
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
