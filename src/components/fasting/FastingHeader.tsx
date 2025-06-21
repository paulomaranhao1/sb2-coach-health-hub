interface FastingHeaderProps {
  title: string;
  description: string;
}
const FastingHeader = ({
  title,
  description
}: FastingHeaderProps) => {
  return <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-center text-gray-700">
        {title}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>;
};
export default FastingHeader;