interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-16 h-16',
    xl: 'w-32 h-32',
    '2xl': 'w-48 h-48'
  };

  return (
    <img 
      src="/logo.png" 
      alt="Logo" 
      className={`${sizeClasses[size]} object-contain ${className}`}
    />
  );
};

export default Logo;
