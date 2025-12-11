import React from 'react';
import { Select, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setSort } from '../../store/productSlice';

const SortHeader = () => {
  const dispatch = useDispatch();
  const { sort } = useSelector(state => state.products);

  const handleSortChange = (value) => {
    dispatch(setSort(value));
  };

  

  const sortOptions = [
    { value: 'default', label: '默认排序' },
    { value: 'price_asc', label: '价格从低到高' },
    { value: 'price_desc', label: '价格从高到低' },
    { value: 'sales', label: '销量最高' },
    { value: 'rating', label: '评分最高' },
  ];

  

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'flex-start', 
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
    </div>
  );
};

export default React.memo(SortHeader);
