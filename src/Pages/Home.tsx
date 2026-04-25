
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="flex gap-4">
        <Link to={"/"}>Home Page</Link>
        <Link to={"/products"}>Product Page</Link>
      </div>
    </>
  );
};

export default Home;