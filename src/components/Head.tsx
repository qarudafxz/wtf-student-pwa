import React from "react";
import icon from "@/assets/icon.png";
import bg from "@/assets/bg.svg";

const Head: React.FC = () => {
	const name: string | null = sessionStorage.getItem("name");
	const student_id: string | null = sessionStorage.getItem("student_id");
	const programID: string | null = sessionStorage.getItem("program");

	const programs = [
		{
			program_id: 1,
			name: "BSIT",
		},
		{
			program_id: 2,
			name: "BSIS",
		},
		{
			program_id: 3,
			name: "BSCS",
		},
	];

	const program = programs?.map((program) => {
		if (program.program_id === Number(programID)) {
			return program.name;
		}
	});

	return (
		<div
			className='flex justify-between items-center'
			style={{
				backgroundImage: `url(${bg})`,
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
				backgroundPosition: "bottom-right",
			}}>
			<div className='w-full flex flex-col gap-2 xxxxs:p-6 xxxs:p-8 sm:p-10 md:p-1'>
				<div className='flex justify-between items-center'>
					<div className='flex space-x-2 items-center'>
						<img
							src={icon}
							alt={name || "Icon"}
							className='w-10 h-10'
						/>
						<h1 className='font-bold text-md text-white leading-[26px] flex flex-col'>
							{name} <span className='text-sm font-normal'>{program}</span>
						</h1>
					</div>
					<p className='text-primary font-bold bg-zinc-800 px-3 py-1 rounded-full border border-zinc-400 text-sm'>
						{student_id}
					</p>
				</div>
				<h1 className='mt-2 font-bold text-white text-lg leading-[24px]'>
					Check your current balance and updates.
				</h1>
			</div>
		</div>
	);
};

export default Head;
