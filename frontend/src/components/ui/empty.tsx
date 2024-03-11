const Empty = ({ message = 'No data' }: { message?: string }) => {
	return (
		<div className="w-full grid place-items-center gap-2">
			<img src="/empty.svg" alt="empty" />
			<span className="text-sm font-md opacity-50 text-center">{message}</span>
		</div>
	);
};

export default Empty;
