export default function access(initialState: {
  hasRoutes?: [];
  serviceAccess: Record<string, boolean>;
  permissionAccess: Record<string, boolean>;
}) {
  const { serviceAccess = {}, permissionAccess } = initialState ?? {};

  return {
    checkAccessFun: (route: any) => serviceAccess[route?.accessKey],
    ...permissionAccess,
  };
}
