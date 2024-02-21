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
 * @param {any} navigation
 * @param {string} taskId TodoタスクID
 * @param {string} todoTitle Todoタイトル
 * @param {(taskId: string) => void} deleteBtnTapped 削除ボタン押下時の処理
 * @return {TodoListItem}
 */
export default function TodoListItem({ navigation, taskId, todoTitle, deleteBtnTapped, tabName }) {
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
      <TouchableOpacity onPress={() => navigation.navigate('Map', { taskId: taskId, tabName: tabName })} activeOpacity={1}>
        <ListItem topDivider style={{ width: '100%' }}>
          <ListItem.Content style={styles.listItem}>
            <ListItem.Title style={styles.listItemTitle}>{todoTitle}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
    </SwipeableRow>
  );
}
