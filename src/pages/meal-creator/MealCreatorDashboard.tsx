import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MealCreatorDashboardLayout } from '@/layouts/MealCreatorDashboardLayout';
import MyMeals from './MyMeals';
import Earnings from './Earnings';
import MealCreatorProfile from './MealCreatorProfile';

const MealCreatorDashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<MealCreatorDashboardLayout />}>
        <Route index element={<Navigate to="meals" replace />} />
        <Route path="meals" element={<MyMeals />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="profile" element={<MealCreatorProfile />} />
      </Route>
    </Routes>
  );
};

export default MealCreatorDashboard;
