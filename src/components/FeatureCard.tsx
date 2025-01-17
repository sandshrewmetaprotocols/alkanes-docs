import clsx from 'clsx';
import React from 'react';

interface FeatureCardProps {
  image: React.ReactNode;
  className?: string;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  image,
  className,
  title,
  description,
}) => {
  return (
    <article
      className={clsx(
        'bg-black-opacity-06 rounded-lg',
        'transition-transform hover:transform hover:scale-105',
        className
      )}
    >
      <div className="relative flex flex-col">
        <div className="absolute p-6">
          <h3 className="mb-1 text-base font-medium">{title}</h3>
          <p className="text-base font-medium text-black-opacity-50" aria-label={description}>
            {description}
          </p>
        </div>
        <div className="w-full" role="img" aria-hidden="true">
          {image}
        </div>
      </div>
    </article>
  );
};
