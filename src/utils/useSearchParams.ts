import React from 'react';
import { useLocation } from 'umi';

export default function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
