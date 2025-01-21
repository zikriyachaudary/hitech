import React from 'react';
import {Image, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {AppColors, AppFonts, hv, normalized} from '../../../Utils/AppConstants';

const SocialBtnComp = (props: any) => {
  return (
    <TouchableOpacity
      onPress={props?.atPress}
      activeOpacity={1}
      style={styles.mainCont}>
      <Image style={styles.googleImage} source={props?.image} />
      <Text style={styles.googleText}>{props?.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainCont: {
    height: hv(45),
    borderWidth: 0.7,
    borderColor: '#E4E7EB',
    borderRadius: normalized(20),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: normalized(160),
    alignSelf: 'center',
  },
  googleImage: {
    width: normalized(15),
    height: normalized(15),
    marginEnd: 5,
  },
  googleText: {
    color: AppColors.black.Level7,
    fontSize: normalized(12),
    fontFamily: AppFonts.PoppinsMedium,
  },
});

export default SocialBtnComp;
