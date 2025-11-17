const Card = ({ title, children, className = '', onClick }) => {
  return (
    <div
      className={`card ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
