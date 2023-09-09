import { PuffLoader } from "react-spinners";

interface LoadingProps {
	isLoading: boolean;
}
export default function LoadingIndicator({ isLoading }: LoadingProps) {
	return (
		<>
			{isLoading && (
				<div className="flex h-5">
					<PuffLoader color={"#000000"} loading={isLoading} size={20} />
				</div>
			)}
		</>
	);
}
