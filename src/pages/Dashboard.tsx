import React from "react";
import { Balance, Head, Logs, Navbar } from "@/components";

const Dashboard: React.FC = () => {
	return (
		<div className='bg-dark h-full font-main'>
			<Head />
			<div className='xxxxs:p-6 xxxs:p-8 sm:p-10 md:p-12'>
				<Balance />
				<Logs />
			</div>
			<Navbar />
		</div>
	);
};

export default Dashboard;
