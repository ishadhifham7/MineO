import { Image, StyleSheet } from "react-native";
import { ImageBlock as ImageBlockType } from "../../../../types/journal";

type Props = {
  block: ImageBlockType;
};

export function ImageBlock({ block }: Props) {
  return (
    <Image
      source={{ uri: block.imageUri }}
      style={[
        styles.image,
        {
          width: block.width,
          height: block.height,
          transform: [{ translateX: block.x }, { translateY: block.y }],
        },
      ]}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    position: "absolute",
    borderRadius: 8,
  },
});
