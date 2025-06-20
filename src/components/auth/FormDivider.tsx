
const FormDivider = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-slate-300 dark:border-slate-600" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span 
          className="bg-white dark:bg-card px-2 text-slate-600 dark:text-slate-400 force-readable"
          style={{ color: 'rgb(75, 85, 99)', fontWeight: '700' }}
        >
          Ou
        </span>
      </div>
    </div>
  );
};

export default FormDivider;
