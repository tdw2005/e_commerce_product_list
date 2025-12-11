import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, setSort, setPagination } from '../store/productSlice';

export const useProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products);

  const updateFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const updateSort = useCallback((sortType) => {
    dispatch(setSort(sortType));
  }, [dispatch]);

  const updatePagination = useCallback((pagination) => {
    dispatch(setPagination(pagination));
  }, [dispatch]);

  return {
    ...products,
    updateFilters,
    updateSort,
    updatePagination
  };
};
