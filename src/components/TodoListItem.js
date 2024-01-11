import { StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import Checkmark from './Checkmark';
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
    marginLeft: 10,
  },
});

/**
 * TodoリストItem
 *
 * @export
 * @param {bool} complete Todoタスク完了フラグ
 * @param {string} taskId TodoタスクID
 * @param {string} todoTitle Todoタイトル
 * @param {(taskId: string, complete: bool) => void} checkmarkTapped チェックマーク押下時の処理
 * @param {(taskId: string, todoTitle: string) => void} listItemTapped リストタップ時の処理
 * @param {(taskId: string) => void} deleteBtnTapped 削除ボタン押下時の処理
 * @return {TodoListItem}
 */
export default function TodoListItem({ complete, taskId, todoTitle, checkmarkTapped, listItemTapped, deleteBtnTapped }) {
  /**
   * ボタン押下処理
   *
   * @param {number} btnId ボタンID 0:削除ボタン
   */
  function btnTapped(btnId) {
    if (btnId == 0) {
      // 削除処理を実行
      deleteBtnTapped(taskId);
    }
  }
  return (
    <SwipeableRow onPress={btnTapped}>
      <TouchableOpacity onPress={() => listItemTapped(taskId, todoTitle)} activeOpacity={1}>
        <ListItem topDivider style={{ width: '100%' }}>
          <ListItem.Content style={styles.listItem}>
            <Checkmark complete={complete} onPress={(complete) => checkmarkTapped(taskId, complete)}></Checkmark>
            <ListItem.Title style={styles.listItemTitle}>{todoTitle}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
    </SwipeableRow>
  );
}
