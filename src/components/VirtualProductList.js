import React, { useEffect, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import ProductCard from './ProductCard';

const VirtualProductList = ({ products, onEndReached, hasMore, loading, threshold = 5, bufferMs = 800 }) => {
  const triggeredRef = useRef(false);
  const timerRef = useRef(null);

  const Row = ({ index, style }) => (
    <div style={style}>
      <ProductCard product={products[index]} />
    </div>
  );

  useEffect(() => {
    if (!loading) {
      triggeredRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [loading, products.length]);

  return (
    <List
      height={600}
      itemCount={products.length}
      itemSize={200}
      width="100%"
      onItemsRendered={({ visibleStopIndex }) => {
        if (hasMore && !loading && !triggeredRef.current && visibleStopIndex >= Math.max(0, products.length - threshold)) {
          triggeredRef.current = true;
          if (!timerRef.current && typeof onEndReached === 'function') {
            timerRef.current = setTimeout(() => {
              timerRef.current = null;
              onEndReached();
            }, bufferMs);
          }
        }
      }}
    >
      {Row}
    </List>
  );
};

export default VirtualProductList;
