import { axiosInstance } from "../../helpers/axiosInstance";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetching from "../../hooks/useFetching";
import { Loader } from "../../components/Loader/Loader";
import { usePopup } from "../../hooks/usePopup";
import { useAppSelector } from "../../hooks/redux";

export const Confirm: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading: isLoadingUser } = useAppSelector((state) => state.user);
  const { isLoading: isLoadingAuth } = useAppSelector((state) => state.auth);

  const { key } = useParams();
  const [response, setResponse] = useState<string>("");
  const confirm = async () => {
    const response = await axiosInstance.post<string>("/api/auth/confirm", {
      key,
    });
    setResponse(response.data);
  };
  const { fetching: sendConfirm, isLoading, error } = useFetching(confirm);
  useEffect(() => {
    sendConfirm();
  }, []);

  useEffect(() => {
    if (response.length > 0 || error.length > 0) {
      const body = response.length > 0 ? response : error;
      setPopup("Активация почты", body);
    }
  }, [response, error]);
  const { popup, setPopup } = usePopup(() => {
    navigate("/", {
      replace: true,
    });
  });

  return (
    <div>
      {isLoading && !isLoadingAuth && !isLoadingUser && <Loader />}
      {popup}
    </div>
  );
};
