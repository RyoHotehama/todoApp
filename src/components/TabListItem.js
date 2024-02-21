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
 * @param {string} tabKey tabキー
 * @param {string} tabTitle tabタイトル
 * @param {(tabKey: string) => void} deleteBtnTapped 削除ボタン押下時の処理
 * @return {TabListItem}
 */
export default function TabListItem({ tabKey, tabTitle, deleteBtnTapped }) {
  /**
   * ボタン押下処理
   *
   * @param {number} btnId ボタンID 0:削除ボタン
   */
  function btnTapped(btnId) {
    if (btnId == 0) {
      // 削除処理を実行
      deleteBtnTapped(tabKey);
    }
  }
  return (
    <SwipeableRow onPress={btnTapped}>
      <TouchableOpacity activeOpacity={1}>
        <ListItem topDivider style={{ width: '100%' }}>
          <ListItem.Content style={styles.listItem}>
            <ListItem.Title style={styles.listItemTitle}>{tabTitle}km</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
    </SwipeableRow>
  );
}
