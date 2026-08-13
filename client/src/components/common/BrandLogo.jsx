const BrandLogo = ({ compact = false, dark = false }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-2 ring-slate-200">
        <img
          src="/assets/digital-krishii-mark-square.png"
          alt="Digital Krishii logo"
          className="h-full w-full scale-125 object-contain translate-y-1"
        />
      </div>

      {!compact && (
        <div>
          <h1
            className={`text-2xl font-black leading-tight ${
              dark ? "text-slate-950" : "text-white"
            }`}
          >
            Digital Krishii
          </h1>

          <p
            className={`text-sm font-bold ${
              dark ? "text-green-700" : "text-green-100"
            }`}
          >
            Empowering Farmers, Bridging Markets
          </p>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
