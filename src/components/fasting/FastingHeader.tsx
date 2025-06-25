interface FastingHeaderProps {
  title: string;
  description: string;
}
const FastingHeader = ({
  title,
  description
}: FastingHeaderProps) => {
  return <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent text-center">
        {title}
      </h1>
      <p className="text-slate-600 font-medium">
        {description}
      </p>
    </div>;
};
export default FastingHeader;