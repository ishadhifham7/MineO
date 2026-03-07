declare module "@react-native-picker/picker" {
  import { Component, ReactNode, FC } from "react";
  import { StyleProp, ViewStyle, TextStyle } from "react-native";

  export interface PickerItemProps {
    label: string;
    value: any;
    color?: string;
    fontFamily?: string;
    style?: StyleProp<TextStyle>;
    enabled?: boolean;
  }

  export interface PickerProps<T = any> {
    selectedValue?: T;
    onValueChange?: (itemValue: T, itemIndex: number) => void;
    style?: StyleProp<ViewStyle>;
    enabled?: boolean;
    mode?: "dialog" | "dropdown";
    dropdownIconColor?: string;
    dropdownIconRippleColor?: string;
    prompt?: string;
    testID?: string;
    accessibilityLabel?: string;
    children?: ReactNode;
  }

  export const PickerItem: FC<PickerItemProps>;

  export class Picker<T = any> extends Component<PickerProps<T>> {
    static Item: typeof PickerItem;
  }

  export default Picker;
}
