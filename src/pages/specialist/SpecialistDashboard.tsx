import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SpecialistDashboardLayout } from '@/layouts/SpecialistDashboardLayout';
import ManagePatients from './ManagePatients';
import SpecialistProfile from './SpecialistProfile';

const SpecialistDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<SpecialistDashboardLayout />}>
        <Route index element={<Navigate to="patients" replace />} />
        <Route path="patients" element={<ManagePatients />} />
        <Route path="profile" element={<SpecialistProfile />} />
      </Route>
    </Routes>
  );
};

export default SpecialistDashboard;
