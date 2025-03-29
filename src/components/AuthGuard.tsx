import { useEffect } from "react";

export interface AuthGuardLayoutProps {
  children: React.ReactNode;
}

const AuthGuardLayout: React.FC<AuthGuardLayoutProps> = ({
  children,
}): React.ReactElement => {
  return <>{children}</>;
};

export default AuthGuardLayout;
