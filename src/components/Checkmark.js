import { Image, StyleSheet, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  checkmark: {
    width: 28,
    height: 28,
  },
});

/**
 * チェックマーク
 *
 * @export
 * @param {bool} complete タスク完了フラグ true: 完了, false: 未完了
 * @param {(complete: bool) => void} onPress チェックマーク押下処理
 * @return {Checkmark}
 */
export default function Checkmark({ complete, onPress }) {
  return (
    // activeOpacity クリック時の透明度をなくす
    <TouchableOpacity activeOpacity={1} onPress={() => onPress(complete)}>
      {/* 未チェック */}
      {complete && <Image style={styles.checkmark} source={require('../../assets/images/checkmark.png')}></Image>}
      {/* チェック */}
      {!complete && <Image style={styles.checkmark} source={require('../../assets/images/un_checkmark.png')}></Image>}
    </TouchableOpacity>
  );
}
