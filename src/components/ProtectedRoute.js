import React, {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {Store} from '../Store';

export function UserProtectedRoute({children}) {
  const {state}= useContext(Store)
  const {userInfo}= state;
  return userInfo ? children : <Navigate to="/signin"/>
}

export function AdminRoute({children}) {
  const {state}= useContext(Store)
  const {userInfo}= state;
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/signin"/>
}