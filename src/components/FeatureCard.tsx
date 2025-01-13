import clsx from 'clsx';
import React from 'react';

type FeatureCardProps = {
  image: React.ReactNode;
  className?: string;
  title: string;
  description: string;
};

export const FeatureCard = ({
  image,
  className,
  title,
  description,
}: FeatureCardProps) => {
  return (
    <div className={clsx('bg-black-opacity-06 border border-gray-400 rounded-lg', className)}>
      <div className="relative flex flex-col">
        <div className="absolute p-6">
          <p className="mb-1 text-base font-medium">{title}</p>
          <p className="text-base font-medium text-black-opacity-50">
            {description}
          </p>
        </div>
        <div className="w-full">{image}</div>
      </div>
    </div>
  );
};
