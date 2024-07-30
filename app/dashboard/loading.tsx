import { CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      Please Wait,...
      <CircularProgress />
    </div>
  );
};
export default Loading;
