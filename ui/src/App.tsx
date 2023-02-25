import { useRoutes } from "react-router-dom";
import { Header } from "./models/header/Header";
import { routes } from "./routes/routes";

export const App: React.FC = () => {
  const publicRoutes = useRoutes(routes);
  return (
    <div className="container">
      <Header />
      <div className="workplace">{publicRoutes}</div>
    </div>
  );
};
