import { StyleSheet } from "react-native";
import { ColorConstants, FontConstants, SizeConstants } from "../../constants/StyleConstants";

export const FormStyles = StyleSheet.create({
    buttonAdd: {
        // flex: 0.3,
        // backgroundColor: 'red',
        alignItems: 'center',
        // marginVertical: SizeConstants.paddingRegular,
        // marginBottom: SizeConstants.paddingRegular,
        paddingVertical: SizeConstants.paddingSmallX,
        paddingHorizontal: SizeConstants.paddingLarge,
        // backgroundColor: ColorConstants.surfaceEl5,
        backgroundColor: ColorConstants.background,

        borderRadius: SizeConstants.borderRadius,
        borderWidth: 1,
        borderColor: ColorConstants.primary,
        // borderTopLeftRadius: SizeConstants.borderRadius,
        // borderTopRightRadius: SizeConstants.borderRadius,
    },
    buttonText: {
        fontSize: FontConstants.sizeLarge,
        fontWeight: FontConstants.weightBold,
        color: ColorConstants.onSurface,
        // backgroundColor: ColorConstants.background,
        // color: ColorConstants.font,
    },
    errorText: {
        position: 'absolute',
        bottom: 0,
        right: SizeConstants.paddingSmallX,
        fontSize: FontConstants.sizeRegular * 0.8,
        color: ColorConstants.errorEl1,
    },
    numericFieldContainer: {
        width: '35%',
    }
});