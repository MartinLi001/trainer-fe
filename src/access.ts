export default function access(initialState: { scopes: string[]; hasBatch: any }) {
  const { scopes = [] } = initialState as any;
  const checkAccessFun = (route: any) => {
    for (const scope of scopes) {
      if (
        (scope.endsWith('::*') &&
          route?.accessKey?.startsWith(scope.substring(0, scope.length - 2))) ||
        scope === route?.accessKey
      ) {
        return true;
      }
    }
    return false;
  };
  return {
    checkAccessFun,
  };
}
