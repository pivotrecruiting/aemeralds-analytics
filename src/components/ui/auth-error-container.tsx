import React from "react";

type AuthErrorContainerProps = {
  error?: string;
  className?: string;
};

export const AuthErrorContainer = ({
  error,
  className = "min-h-[1.5rem] mt-4",
}: AuthErrorContainerProps) => {
  return (
    <div className={className}>
      {error && <div className="text-destructive text-sm">{error}</div>}
    </div>
  );
};
