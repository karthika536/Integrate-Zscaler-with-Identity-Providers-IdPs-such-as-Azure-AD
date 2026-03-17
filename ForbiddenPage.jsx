const ForbiddenPage = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="glass rounded-xl p-8 text-center">
        <h1 className="font-display text-3xl">403 Forbidden</h1>
        <p className="mt-3 text-slate-300">Your role does not have permission for this page.</p>
      </div>
    </div>
  );
};

export default ForbiddenPage;
