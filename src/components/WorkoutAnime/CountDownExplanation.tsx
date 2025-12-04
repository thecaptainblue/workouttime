import {StyleSheet, Text, View} from 'react-native';
import {ColorConstants, FontConstants, SizeConstants} from '../../constants/StyleConstants';
import {AnimeConstants} from './AnimeConstants';
import {AutoSizeText} from './AutoSizeText';

export interface CountDownExplanationProps {
  explanationText: String;
}

export default function CountDownExplanation(props: CountDownExplanationProps) {
  const {explanationText} = props;
  // const explanationText =
  ('This is a long text that goes beyond the available width of the screen. It demonstrates how to handle truncation and provide options for users to view the full content.This is a long text that goes beyond the available width of the screen. It demonstrates how to handle truncation and provide options for users to view the full content.This is a long text that goes beyond the available width of the screen. It demonstrates how to handle truncation and provide options for users to view the full content.');
  // const explanationText = 'This is a long text that goes beyond the available width of the screen. It';

  return (
    <View style={styles.container}>
      {/* <Text
        style={styles.textExplanation}
        // numberOfLines={5}
        ellipsizeMode="tail"
        // maxFontSizeMultiplier={2} android de calismiyor sanirim.
        adjustsFontSizeToFit={true}
        minimumFontScale={0.6}>
        {explanationText}
      </Text> */}
      <AutoSizeText text={explanationText} textStyle={styles.textExplanation} />
    </View>
  );
}

// const fontSize = 38; //FontConstants.sizeLarge,
// const fontSize = FontConstants.sizeXLarge * 1.2;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // borderColor: 'brown',
    // borderWidth: 1,
    // flexWrap: 'wrap',
    // flexDirection: 'row',
  },
  textExplanation: {
    // backgroundColor: 'yellow',
    // flex: 1,
    // height: '100%',
    color: ColorConstants.primary,
    fontSize: AnimeConstants.FontSize, //FontConstants.sizeLarge,
    // fontSize: FontConstants.sizeLarge,
    fontFamily: FontConstants.familyRegular,
    fontWeight: FontConstants.weightBold,
    // textAlign: 'justify',
    textAlign: 'center',
    marginBottom: SizeConstants.paddingSmallX,
    // lineHeight: fontSize * 1.1,
    // borderColor: 'cyan',
    // borderWidth: 1,
  },
});
