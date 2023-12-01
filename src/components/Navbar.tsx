/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { BsFillGrid1X2Fill } from "react-icons/bs";
import { FaBell } from "react-icons/fa";
import { IoExitOutline } from "react-icons/io5";
import { useGetStorage } from "@/hooks/useGetStorage";
import TopLoadingBar from "react-top-loading-bar";
import notif_bell from "@/assets/notif-bell.mp3";

const Navbar: React.FC<{ notifications?: any }> = ({ notifications }) => {
	const [progress, setProgress] = useState(0);
	const { removeItem } = useGetStorage("token");
	const menu = [
		{
			label: <FaBell className='text-xl' />,
			path: "/notifications",
		},
		{
			label: <BsFillGrid1X2Fill className='text-xl' />,
			path: "/dashboard",
		},
	];

	const logout = async () => {
		setProgress(30);
		try {
			await fetch("http://localhost:8000/api/auth/logout", {
				method: "POST",
				credentials: "include",
			});
			setProgress(100);
			setTimeout(() => {
				sessionStorage.clear();
				removeItem();
			}, 1500);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (notifications?.length !== 0) {
			const bell = new Audio(notif_bell);
			bell.play();
		}
	}, [notifications]);

	return (
		<div className='fixed bottom-0 w-full'>
			<TopLoadingBar
				progress={progress}
				color='#49B0AD'
				height={3}
				onLoaderFinished={() => setProgress(0)}
			/>
			<div className='bg-[#202020] w-full rounded-t-[50px] shadow-[#000] shadow-2xl'>
				<div className='flex justify-around items-center py-5'>
					{menu.map((item, index) => (
						<NavLink
							key={index}
							to={item.path}
							className={({ isActive }) =>
								`flex flex-col items-center justify-center text-white text-md ` +
								(isActive
									? "text-white bg-primary duration-150 rounded-full p-3"
									: "text-zinc-600 ")
							}>
							{item.path === "/notifications" && notifications?.length > 0 && (
								<span className='relative left-3 bg-red-500 rounded-full w-4 h-4 flex justify-center items-center text-center text-xs text-white'>
									{notifications?.length}
								</span>
							)}
							{item.label}
						</NavLink>
					))}
					<button onClick={logout}>
						<IoExitOutline className='text-2xl text-zinc-600' />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
