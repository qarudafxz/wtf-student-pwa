/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import logo from "@/assets/circle_icon.png";
import { Input, Select, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const Signup: React.FC = () => {
	const [studentID, setStudentID] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [program, setProgram] = useState("BSIT");
	const [year, setYear] = useState("First Year");
	const [password, setPassword] = useState("");

	const handleRegister = async (e: any) => {
		e.preventDefault();
		const payload = {
			student_id: studentID,
			first_name: firstName,
			last_name: lastName,
			email,
			program_id:
				program === "BSIT"
					? 1
					: program === "BSIS"
					? 2
					: program === "BSCS"
					? 3
					: null,
			year_level_code:
				year === "First Year"
					? 1
					: year === "Second Year"
					? 2
					: year === "Third Year"
					? 3
					: year === "Fourth Year"
					? 4
					: null,
			password,
		};
		try {
			console.log(payload.program_id);
			console.log(payload.year_level_code);
			console.log(payload);

			Object.keys(payload).forEach((key) => {
				//eslint-disable-next-line
				//@ts-ignore
				if (payload[key] === "") {
					alert("Please fill up all the fields");
					throw new Error("Please fill up all fields");
				}
			});
			const regex = /^[0-9]{3}-[0-9]{5}$/;

			if (!regex.test(payload.student_id)) {
				alert("Invalid student ID format. Please follow the format 211-00483");
				throw new Error(
					"Invalid student ID format. Please follow the format 211-00483"
				);
			}

			console.log(payload);

			// await fetch("http://127.0.0.1:8000/api/auth/register", {
			// 	method: "POST",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	} as HeadersInit,
			// 	body: JSON.stringify(payload),
			// }).then(async (res) => {
			// 	const data = await res.json();

			// 	if (!res.ok) {
			// 		alert(data.message);
			// 		return;
			// 	}

			// 	alert(data.message);
			// 	window.location.href = "/login";
			// });
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className='bg-dark h-full font-main overflow-y-auto'>
			<div className='xxxxs:p-6 xxxs:p-8 sm:p-10 md:p-12'>
				<div className='flex justify-start'>
					<Link to='/menu'>
						<IoMdArrowRoundBack
							size={25}
							className='text-white'
						/>
					</Link>
				</div>
				<div className='flex flex-col justify-center place-items-center'>
					<img
						src={logo}
						alt='logo'
						className='w-20 h-20'
					/>
					<h1 className='font-bold text-white text-3xl'>Register</h1>
					<form
						onSubmit={handleRegister}
						className='w-full pt-10'>
						<div className='flex flex-col justify-start items-start'>
							<label className='text-white'>Student ID</label>
							<Input
								type='text'
								onChange={(e) => setStudentID(e.target.value)}
								placeholder='Student ID [e.g. 2021-00000]'
								className='mt-2 bg-zinc-800 text-white py-4 rounded-md pl-3 w-full'
							/>
						</div>
						<div className='flex flex-col justify-start items-start'>
							<label className='text-white'>First Name</label>
							<Input
								type='text'
								onChange={(e) => setFirstName(e.target.value)}
								placeholder='First Name'
								className='mt-2 bg-zinc-800 text-white py-4 rounded-md pl-3 w-full'
							/>
						</div>
						<div className='flex flex-col justify-start items-start'>
							<label className='text-white'>Last Name</label>
							<Input
								type='text'
								onChange={(e) => setLastName(e.target.value)}
								placeholder='Last Name'
								className='mt-2 bg-zinc-800 text-white py-4 rounded-md pl-3 w-full'
							/>
						</div>
						<div className='flex flex-col justify-start items-start'>
							<label className='text-white'>Email</label>
							<Input
								type='email'
								onChange={(e) => setEmail(e.target.value)}
								placeholder='Email'
								className='mt-2 bg-zinc-800 text-white py-4 rounded-md pl-3 w-full'
							/>
						</div>
						<div className='flex flex-col justify-start items-start'>
							<label className='text-white'>Password</label>
							<Input
								type='password'
								onChange={(e) => setPassword(e.target.value)}
								placeholder='Password'
								className='mt-2 bg-zinc-800 text-white py-4 rounded-md pl-3 w-full'
							/>
						</div>
						<div className='flex flex-col justify-start items-start'>
							<label className='text-white'>Program</label>
							<Select
								onChange={(e) => setProgram(e.target.value)}
								className='mt-2 bg-zinc-800 text-white py-4 rounded-md pl-3 w-full'>
								<option>BSIT</option>
								<option>BSCS</option>
								<option>BSIS</option>
							</Select>
						</div>
						<div className='flex flex-col justify-start items-start'>
							<label className='text-white'>Year</label>
							<Select
								onChange={(e) => setYear(e.target.value)}
								className='mt-2 bg-zinc-800 text-white py-4 rounded-md pl-3 w-full'>
								<option>First Year</option>
								<option>Second Year</option>
								<option>Third Year</option>
								<option>Fourth Year</option>
							</Select>
						</div>
					</form>
					<Button
						onClick={handleRegister}
						className='font-bold bg-primary py-2 rounded-md text-2xl w-full mt-4'>
						Sign up
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Signup;
