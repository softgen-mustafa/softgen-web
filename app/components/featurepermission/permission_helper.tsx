import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import permission_config from "@/app/assets/FeaturePermissionConfig/permission_config";

type PermissionKeys = keyof typeof permission_config;

const FeatureControl = async (ScreenCode: PermissionKeys): Promise<boolean> => {
  try {
    const permissionCode = permission_config[ScreenCode];
    if (!permissionCode) {
      // alert(`No permission code found for screen: ${ScreenCode}`);
      return false;
    }

    const url = `${getBmrmBaseUrl()}/user-info/seek-permission?code=${permissionCode}`;
    console.log("FeatureControl", url);
    const response = await getAsync(url);

    if (response.status) {
      return true;
    } else {
      // console.log('Permission Refused:', response.message);
      return false;
    }
  } catch (error) {
    // alert('Error fetching permission: ' + error.message);
    console.log(`Error fetching permission for ${ScreenCode}`);

    return false;
  }
};

export { FeatureControl };
