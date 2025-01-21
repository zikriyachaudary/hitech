import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useSelector} from 'react-redux';
import {Alert} from 'react-native';
import {AppRootStore} from '../Redux/store/AppStore';
import {AppStrings} from '../Utils/AppStrings';
import CommonDataManager from '../Utils/CommonManager';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/auth';
import appleAuth from '@invertase/react-native-apple-authentication';

const SocialAuthManager = () => {
  const {isNetConnected} = useSelector(
    (state: AppRootStore) => state.SliceReducer,
  );
  const gmailLoginRequest = async () => {
    let socialParams = {};
    try {
      if (!isNetConnected) {
        return {
          message: AppStrings.Network.internetError,
          data: null,
          success: false,
        };
      }
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const userInfo = await auth().signInWithCredential(googleCredential);

      if (userInfo?.user) {
        const splitName: any = userInfo?.user?.displayName?.split(' ');
        socialParams = {
          token: userInfo?.user?.uid,
          firstName: splitName[0]
            ? CommonDataManager.getSharedInstance().truncateString(splitName[0])
            : '',
          lastName: splitName[1]
            ? CommonDataManager.getSharedInstance().truncateString(splitName[1])
            : '',
          email: userInfo?.user?.email,
        };
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('', AppStrings.Permissions.cancelled);
      }
    }
    if (socialParams) {
      return {
        ...socialParams,
        provider_type: 'google',
      };
    } else {
      return null;
    }
  };

  const appleAuthReq = async () => {
    let socialParams = {};
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const {identityToken, nonce, fullName, email, user} =
        appleAuthRequestResponse;

      if (identityToken) {
        const appleCredential = firebase.auth.AppleAuthProvider.credential(
          identityToken,
          nonce,
        );
      }

      if (identityToken && fullName) {
        const firstName = fullName.givenName || '';
        const lastName = fullName.familyName || '';
        socialParams = {
          token: user,
          firstName: firstName,
          lastName: lastName,
          email: email || '',
        };
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('', AppStrings.Permissions.cancelled);
      }
      return null;
    }

    if (socialParams) {
      return {
        ...socialParams,
        provider_type: 'apple',
      };
    } else {
      return null;
    }
  };

  return {
    gmailLoginRequest,
    appleAuthReq,
  };
};
export default SocialAuthManager;
