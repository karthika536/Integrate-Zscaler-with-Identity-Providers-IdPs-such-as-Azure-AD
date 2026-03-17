const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="glass rounded-xl p-8 text-center">
        <h1 className="font-display text-3xl">401 Unauthorized</h1>
        <p className="mt-3 text-slate-300">You need to sign in to access this resource.</p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
