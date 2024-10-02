import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import permission_config from "@/app/assets/FeaturePermissionConfig/permission_config";
import { hasPermission } from "@/app/services/Local/helper";

export type PermissionKeys = keyof typeof permission_config;

const Permission = permission_config;

const FeatureControl = async (ScreenCode: PermissionKeys): Promise<boolean> => {
  try {
    const permissionCode = permission_config[ScreenCode];
    if (!permissionCode) {
      // alert(`No permission code found for screen: ${ScreenCode}`);
      return false;
    }
    return hasPermission(permissionCode);
  } catch (error) {
    // alert('Error fetching permission: ' + error.message);
    console.log(`Error fetching permission for ${ScreenCode}`);

    return false;
  }
};

export { FeatureControl, Permission };
