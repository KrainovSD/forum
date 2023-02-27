import { axiosInstance } from "../../helpers/axiosInstance";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetching from "../../hooks/useFetching";
import { Loader } from "../../components/Loader/Loader";

export const Confirm: React.FC = () => {
  const { key } = useParams();
  const [response, setResponse] = useState<string>("");
  const [sendConfirm, isLoading, error, errorStatus] = useFetching(async () => {
    const response = await axiosInstance.post<string>("/api/auth/confirm", {
      key,
    });
    setResponse(response.data);
  });
  const navigate = useNavigate();

  useEffect(() => {
    console.log("work");
    setTimeout(() => {
      navigate("/home", {
        replace: true,
      });
    }, 3000);
  }, [response, error]);

  useEffect(() => {
    sendConfirm();
  }, []);

  return (
    <div>
      {isLoading && <Loader />}
      <h1 className="auth__confirm">
        {response.length > 0 ? response : error}
      </h1>
    </div>
  );
};
