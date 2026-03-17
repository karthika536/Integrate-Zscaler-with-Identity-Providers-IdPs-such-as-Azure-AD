import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="glass rounded-xl p-8 text-center">
        <h1 className="font-display text-3xl">404 Page Not Found</h1>
        <p className="mt-3 text-slate-300">The page you are looking for does not exist.</p>
        <Link className="btn-primary mt-4 inline-block" to="/">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
