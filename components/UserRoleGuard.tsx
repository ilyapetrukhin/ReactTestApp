import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';

interface UserRoleGuardProps {
  children: ReactNode;
}

const UserRoleGuard: FC<UserRoleGuardProps> = (props) => {
  const { children } = props;
  const { user } = useAuth();
  const location = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!user) {
    // TODO: add role/permission checks here and to the component params
    if (location.pathname !== requestedLocation) {
      setRequestedLocation(location.pathname);
    }

    return <Navigate to="401" />;
  }

  // This is done so that in case the route changes by any chance through other
  // means between the moment of request and the render we navigate to the initially
  // requested route.
  if (requestedLocation && location.pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
};

UserRoleGuard.propTypes = {
  children: PropTypes.node
};

export default UserRoleGuard;
