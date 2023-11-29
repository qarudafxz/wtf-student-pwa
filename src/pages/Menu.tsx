import React from "react";
import ccislsg from "@/assets/ccislsg_logo.png";
import { Link } from "react-router-dom";
import bg from "@/assets/bg.svg";

const Menu: React.FC = () => {
	return (
		<div
			className='bg-dark h-screen font-main'
			style={{
				backgroundImage: `url(${bg})`,
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}>
			<div className='xxxxs:p-6 xxxs:p-8 sm:p-10 md:p-12'>
				<div className='flex flex-col justify-center items-center gap-4'>
					<img
						src={ccislsg}
						alt='CCISLSG logo'
						className='w-24 h-24'
					/>
					<h1 className='text-white text-3xl font-bold mb-16'>Menu</h1>
					<div className='flex flex-col w-full gap-4'>
						<Link
							to='/login'
							className='w-full rounded-md font-semibold text-center py-2 text-white text-2xl bg-primary'>
							Login{" "}
						</Link>
						<Link
							className='w-full rounded-md font-semibold text-center py-2 text-primary text-2xl border border-primary'
							to='/register'>
							Register{" "}
						</Link>
					</div>
					<p className='text-white mt-8 fixed bottom-10'>
						CCISLSG Extension{" "}
						{new Date().toLocaleDateString("en-US", {
							year: "numeric",
						})}
					</p>
				</div>
			</div>
		</div>
	);
};

export default Menu;
