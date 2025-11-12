// Button.jsx – 재사용 가능한 기본 버튼 컴포넌트
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-200 disabled:opacity-60';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#f4c390] via-[#f2b774] to-[#e7a152] text-[#3a2f2b] hover:brightness-105',
    secondary:
      'border border-[#e3cfb5] bg-white/80 text-[#5c4f45] hover:bg-white',
    ghost: 'text-[#5c4f45] hover:text-[#2f2a27] hover:bg-[#f8efe3]',
    danger:
      'bg-gradient-to-r from-[#d98a6b] to-[#c6674d] text-white hover:brightness-105',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
