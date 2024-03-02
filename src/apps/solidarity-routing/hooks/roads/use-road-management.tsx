import { useState, useEffect } from 'react';
import { useCreateRoadPoint } from './CRUD/use-create-road';
import { useDeleteRoadPoint } from './CRUD/use-delete-road';

export const useRoadManagement = () => {
  // State and functions related to road management
  const { addRoadPointByLatLng } = useCreateRoadPoint();
  const { deleteRoadPointByID } = useDeleteRoadPoint();

  // Other road management functions...

  return {
    addRoadPointByLatLng,
    deleteRoadPointByID,
    // Return other functions or state
  };
};