import React, { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  alt?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, alt, className = 'w-10 h-10 rounded-full' }) => {
  const [errored, setErrored] = useState(false);

  const initials = name
    ? name
        .split(' ')
        .map(n => n.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  if (src && !errored) {
    return (
      // eslint-disable-next-line jsx-a11y/img-redundant-alt
      <img
        src={src}
        alt={alt || name || 'avatar'}
        className={className}
        onError={() => setErrored(true)}
      />
    );
  }

  return (
    <div className={`${className} flex items-center justify-center bg-primary/20 text-primary font-medium`} aria-hidden>
      {initials}
    </div>
  );
};

export default Avatar;
