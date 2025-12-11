import React from 'react';
import { Select, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setSort, setPagination } from '../../store/productSlice';

const SortHeader = () => {
  const dispatch = useDispatch();
  const { sort, pagination } = useSelector(state => state.products);

  const handleSortChange = (value) => {
    dispatch(setSort(value));
  };

  const handlePageSizeChange = (value) => {
    dispatch(setPagination({ pageSize: value, current: 1 }));
  };

  const sortOptions = [
    { value: 'default', label: '默认排序' },
    { value: 'price_asc', label: '价格从低到高' },
    { value: 'price_desc', label: '价格从高到低' },
    { value: 'sales', label: '销量最高' },
    { value: 'rating', label: '评分最高' },
  ];

  const pageSizeOptions = [
    { value: 12, label: '12条/页' },
    { value: 24, label: '24条/页' },
    { value: 48, label: '48条/页' },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: 16, 
      padding: '16px', 
      background: '#fff', 
      borderRadius: 6,
      flexWrap: 'wrap',
      gap: 16
    }}>
      <Space>
        <span style={{ fontWeight: 500 }}>排序：</span>
        <Select
          value={sort}
          onChange={handleSortChange}
          options={sortOptions}
          style={{ width: 150 }}
        />
      </Space>
      
      <Space>
        <span style={{ fontWeight: 500 }}>显示数量：</span>
        <Select
          value={pagination.pageSize}
          onChange={handlePageSizeChange}
          options={pageSizeOptions}
          style={{ width: 120 }}
        />
      </Space>
    </div>
  );
};

export default React.memo(SortHeader);
