import React from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/circle_icon.png";
import poster from "@/assets/poster.svg";
import { IoMdArrowForward } from "react-icons/io";

const GreetingsCard = () => {
	return (
		<div className='xxxxs:block md:hidden'>
			<div className='bg-[#3b9390] border border-[#69e7e3] rounded-md p-4 flex flex-col place-items-center justify-center text-center w-full'>
				<div className='flex space-x-2 items-center'>
					<div className='bg-white w-3 h-3 rounded-full' />
					<div className='bg-white opacity-50 w-3 h-3 rounded-full' />
				</div>
				<div className='mt-6 flex flex-col justify-center items-center'>
					<img
						src={logo}
						alt='Logo'
						className='w-10 h-10 mb-4'
					/>
					<h1 className='font-bold text-3xl text-white leading-[26px]'>
						Start monitoring your balance
					</h1>
					<p className='mt-4 text-white leading-[14px] text-xs'>
						You can also check the total amount collected in your college for
						transparency, including the fees you paid.
					</p>
					<Link to='/menu'>
						<IoMdArrowForward
							className='text-white bg-dark rounded-full p-4 text-2xl mt-4 shadow-md shadow-black'
							size={50}
						/>
					</Link>
				</div>
			</div>
		</div>
	);
};

const GetStarted: React.FC = () => {
	return (
		<div className='bg-primary w-full h-screen font-main'>
			<div className='xxxxs:p-6 xxxs:p-8 sm:p-10 md:p-12'>
				<div className='flex flex-col justify-center'>
					<img
						src={poster}
						alt='Poster'
						className='w-full h-full'
					/>
					<GreetingsCard />
				</div>
			</div>
		</div>
	);
};

export default GetStarted;
