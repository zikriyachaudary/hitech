import React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  Text,
  Platform,
} from "react-native";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  ScreenSize,
} from "../../../../Utils/AppConstants";

export interface CodeInputProps extends TextInputProps {
  cellStyle?: ViewStyle;
  value: string;
  codeLength: number;
  cellSize: number;
  cellSpacing: number;
  onFulfill: (value: string) => void;
}

export interface CodeInputState {
  focused: boolean;
}

class CodeInput extends React.PureComponent<CodeInputProps, CodeInputState> {
  public static defaultProps = {
    cellSize: 40,
    cellSpacing: 10,
    codeLength: 6,
    value: "",
  };

  constructor(props: CodeInputProps) {
    super(props);
    this.state = {
      focused: false,
    };
  }

  public render() {
    const { value, codeLength, cellSize, cellSpacing } = this.props;
    const mainContainerSize = {
      height: cellSize,
      width: cellSize * codeLength + cellSpacing * (codeLength - 1),
    };
    return (
      <View style={[mainContainerSize, styles.mainContainerStyle]}>
        {this.renderCodeInputCells()}
        <TextInput
          hitSlop={{ top: 40, bottom: 40, right: 20, left: 20 }}
          disableFullscreenUI={true}
          onFocus={this.onFocused}
          onBlur={this.onBlurred}
          spellCheck={false}
          numberOfLines={1}
          placeholderTextColor={AppColors.grey.greyLevel2}
          caretHidden={true}
          maxLength={codeLength}
          selection={{ end: value.length, start: value.length }}
          style={styles.textinputStyles}
          {...this.props}
          onChangeText={this.inputCode}
        />
      </View>
    );
  }

  private renderCodeInputCells = () => {
    const { codeLength, cellSize, cellSpacing, value } = this.props;
    const inputCells = Array.apply(null, Array(codeLength)).map((_, idx) => {
      const isCellFocused = this.state.focused && idx === value.length;
      const cellText = value.charAt(idx);
      const cellSizeStyles = {
        height: cellSize,
        marginLeft: cellSpacing / 2,
        marginRight: cellSpacing / 2,
        width: cellSize,
      };
      const cellFocusedStyles = isCellFocused ? styles.cellFocused : null;
      return (
        <View
          key={idx}
          style={[
            cellSizeStyles,
            styles.cellStyles,
            this.props.cellStyle,
            cellFocusedStyles,
          ]}
        >
          <Text
            allowFontScaling={false}
            style={cellText ? styles.textStyle : styles.emptyTextStyle}
          >
            {cellText ? cellText : "-"}
          </Text>
        </View>
      );
    });
    return <View style={styles.innerContainerStyle}>{inputCells}</View>;
  };

  private inputCode = (code: string) => {
    if (this.props.onChangeText) {
      this.props.onChangeText(code);
    }

    if (code.length === this.props.codeLength && this.props.onFulfill) {
      this.props.onFulfill(code);
    }
  };

  private onFocused = () => {
    this.setState({ focused: true });
  };

  private onBlurred = () => {
    this.setState({ focused: false });
  };
}

const styles = StyleSheet.create({
  cellFocused: {
    borderColor: AppColors.red.dark,
    borderWidth: 2,
  },
  cellStyles: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  innerContainerStyle: {
    alignItems: "center",
    flexDirection: "row",
    height: "100%",
    margin: 0,
    position: "absolute",
  },
  inputFieldContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  mainContainerStyle: {
    alignItems: "stretch",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  textStyle: {
    color: AppColors.black.black,
    fontSize: 18,
    fontFamily: AppFonts.PoppinsRegular,
    lineHeight: 30,
  },
  emptyTextStyle: {
    color: AppColors.grey.greyLevel10,
    fontSize: 16,
    fontFamily: AppFonts.PoppinsRegular,
    marginTop: Platform.OS == "ios" ? 0 : 2,
  },
  textinputStyles: {
    flex: 1,
    fontSize: -1,
    opacity: 0,
    textAlign: "left",
  },
});

export default CodeInput;
