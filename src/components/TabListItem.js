import { StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import SwipeableRow from './SwipeableRow';

const styles = StyleSheet.create({
  listItem: {
    // rowにすると横並び
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  listItemTitle: {
    flex: 1,
  },
});

/**
 * タブリストItem
 *
 * @export
 * @param {string} tabTitle tabタイトル
 * @return {TabListItem}
 */
export default function TabListItem({ tabTitle }) {
  /**
   * ボタン押下処理
   *
   * @param {number} btnId ボタンID 0:削除ボタン
   */
  function btnTapped(btnId) {
    if (btnId == 0) {
      // 削除処理を実行
    }
  }
  return (
    <SwipeableRow onPress={btnTapped}>
      <TouchableOpacity activeOpacity={1}>
        <ListItem topDivider style={{ width: '100%' }}>
          <ListItem.Content style={styles.listItem}>
            <ListItem.Title style={styles.listItemTitle}>{tabTitle}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
    </SwipeableRow>
  );
}
