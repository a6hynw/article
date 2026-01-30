import React, { forwardRef } from 'react';

const Button = forwardRef(
  (
    {
      className = '',
      variant = 'default',
      size = 'md',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      ghost: 'hover:bg-accent/10 text-foreground',
      outline: 'border border-input bg-background hover:bg-accent/10',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm rounded-md',
      md: 'h-10 px-4 text-sm rounded-md',
      lg: 'h-12 px-8 text-base rounded-lg',
      icon: 'h-10 w-10 rounded-md',
    };

    const variantStyle = variants[variant] || variants.default;
    const sizeStyle = sizes[size] || sizes.md;

    return (
      <button
        ref={ref}
        type={type}
        className={`${baseStyles} ${variantStyle} ${sizeStyle} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
