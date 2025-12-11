import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Spin, Empty, Alert, message, Skeleton } from 'antd';
import { fetchProducts, setPagination, prefetchProducts, refreshFeed } from '../../store/productSlice';
import FilterSidebar from '../../components/FilterSidebar';
import SortHeader from '../../components/SortHeader';
import ProductCard from '../../components/ProductCard';
import { useDebounce } from '../../hooks/useDebounce';
import VirtualProductList from '../../components/VirtualProductList';

const ProductList = () => {
  const dispatch = useDispatch();
  const { items, loading, error, filters, sort, pagination, feedSeed, hasMore } = useSelector(state => state.products);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startYRef = useRef(0);
  const containerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const loadMoreTimerRef = useRef(null);
  
  // 防抖处理筛选条件变化
  const debouncedFilters = useDebounce(filters, 500);
  
  // 构建请求参数
  const requestParams = useMemo(() => ({
    ...debouncedFilters,
    sort,
    page: pagination.current,
    limit: pagination.pageSize,
    feedSeed
  }), [debouncedFilters, sort, pagination.current, pagination.pageSize, feedSeed]);

  // 获取商品数据
  useEffect(() => {
    dispatch(fetchProducts(requestParams));
  }, [dispatch, requestParams]);

  // 预取下一页数据
  useEffect(() => {
    if (pagination.current * pagination.pageSize < pagination.total) {
      const nextParams = { ...requestParams, page: pagination.current + 1 };
      dispatch(prefetchProducts(nextParams));
    }
  }, [dispatch, requestParams, pagination.current, pagination.pageSize, pagination.total]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMore && !loading && !loadMoreTimerRef.current) {
        loadMoreTimerRef.current = setTimeout(() => {
          loadMoreTimerRef.current = null;
          dispatch(setPagination({ current: pagination.current + 1 }));
        }, 800);
      }
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (loadMoreTimerRef.current) {
        clearTimeout(loadMoreTimerRef.current);
        loadMoreTimerRef.current = null;
      }
    };
  }, [dispatch, hasMore, loading, pagination.current]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onStart = (e) => {
      if (window.scrollY === 0 && !loading) {
        startYRef.current = e.touches[0].clientY;
        setIsPulling(true);
        setPullDistance(0);
      }
    };
    const onMove = (e) => {
      if (!isPulling) return;
      const diff = e.touches[0].clientY - startYRef.current;
      if (diff > 0) {
        e.preventDefault();
        const damped = Math.min(diff * 0.5, 120);
        setPullDistance(damped);
      }
    };
    const onEnd = () => {
      if (!isPulling) return;
      const threshold = 60;
      if (pullDistance >= threshold && !loading) {
        dispatch(refreshFeed());
        message.success('已为您刷新推荐');
      }
      setIsPulling(false);
      setTimeout(() => setPullDistance(0), 200);
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd);
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
    };
  }, [dispatch, loading, isPulling, pullDistance]);

  const handlePageChange = (page, pageSize) => {
    dispatch(setPagination({ 
      current: page, 
      pageSize 
    }));
  };

  if (error) {
    return (
      <Alert
        message="加载失败"
        description={error}
        type="error"
        showIcon
        style={{ margin: '20px 0' }}
      />
    );
  }

  return (
    <div className="product-list-page">
      <Row gutter={[24, 24]}>
        {/* 筛选侧边栏 */}
        <Col xs={24} sm={8} md={6}>
          <FilterSidebar />
        </Col>
        
        {/* 商品列表区域 */}
        <Col xs={24} sm={16} md={18}>
          <div ref={containerRef} style={{ transform: `translateY(${pullDistance}px)`, transition: 'transform 0.2s ease' }}>
          <div style={{ height: pullDistance ? 40 : 0, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', transition: 'height 0.2s ease' }}>
            <span style={{ fontSize: 12, color: '#999' }}>{pullDistance >= 60 ? '释放刷新推荐' : '下拉刷新推荐'}</span>
          </div>
          <SortHeader />
          
          {loading ? (
            <Row gutter={[16, 16]}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Col xs={24} sm={12} md={8} lg={6} key={i}>
                  <div style={{ background: '#fff', padding: 16, borderRadius: 6 }}>
                    <div style={{ width: '100%', height: 200, marginBottom: 12, borderRadius: 6, overflow: 'hidden' }}>
                      <Skeleton.Image style={{ width: '100%', height: '100%' }} active />
                    </div>
                    <Skeleton active paragraph={{ rows: 3 }} title={{ width: '60%' }} />
                  </div>
                </Col>
              ))}
            </Row>
          ) : items.length === 0 ? (
            <Empty 
              description="暂无商品数据" 
              style={{ 
                margin: '100px 0',
                background: '#fff',
                padding: '40px',
                borderRadius: 6
              }}
            />
          ) : (
            <>
              {items.length > 100 ? (
                <VirtualProductList 
                  products={items} 
                  onEndReached={() => {
                    if (hasMore && !loading) {
                      dispatch(setPagination({ current: pagination.current + 1 }));
                    }
                  }}
                  hasMore={hasMore}
                  loading={loading}
                />
              ) : (
                <Row gutter={[16, 16]}>
                  {items.map(product => (
                    <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                      <ProductCard product={product} />
                    </Col>
                  ))}
                </Row>
              )}
              
              <div ref={loadMoreRef} style={{ 
                marginTop: 24, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                background: '#fff',
                padding: '16px',
                borderRadius: 6
              }}>
                {loading && items.length > 0 ? (
                  <>
                    <Spin />
                    <div style={{ marginTop: 8, color: '#999' }}>加载更多...</div>
                  </>
                ) : (
                  <div style={{ color: '#999', fontSize: 12 }}>
                    {hasMore ? '上拉加载更多' : '已加载完毕'}
                  </div>
                )}
              </div>
              
            </>
          )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductList;
