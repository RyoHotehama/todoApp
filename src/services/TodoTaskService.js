import AsyncStorage from '@react-native-async-storage/async-storage';

export default class TodoTaskService {
  /**
   * タスク一覧を取得
   *
   * @return {Promiose<[string]>} タスク一覧(ストレージにタスク情報が存在しない場合、空配列を返却)
   * @memberof TodoTaskService
   */
  async getTaskList() {
    try {
      const jsonValue = await AsyncStorage.getItem('@taskKey');
      const jsonParse = jsonValue ? JSON.parse(jsonValue) : [];

      return jsonParse;
    } catch (e) {
      throw e;
    }
  }

  /**
   * タスクを取得
   *
   * @return {Promiose<[string]>} タスク一覧(ストレージにタスク情報が存在しない場合、空配列を返却)
   * @memberof TodoTaskService
   */
  async getTaskById(taskId) {
    try {
      const jsonValue = await AsyncStorage.getItem('@taskKey');
      const jsonParse = jsonValue ? JSON.parse(jsonValue) : [];
      if (jsonParse) {
        const task = jsonParse.find((item) => {
          return item.id === taskId;
        });

        return task;
      } else {
        return jsonParse;
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   * TodoタスクのIDを作成
   *
   * @return {string} タスクID
   * @memberof TodoTaskService
   */
  createTaskId() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < 20; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
  }

  /**
   * Todoタスクを追加する
   *
   * @param {string} tabKey タブキー
   * @param {string} taskName タスク名
   * @memberof TodoTaskService
   */
  async addTask(tabKey, taskName, originDestination, destination) {
    const addTaskObj = {
      id: this.createTaskId(),
      key: tabKey,
      name: taskName,
      originLatitude: originDestination.latitude,
      originLongitude: originDestination.longitude,
      latitude: destination.latitude,
      longitude: destination.longitude,
      latitudeDelta: destination.latitudeDelta,
      longitudeDelta: destination.longitudeDelta,
      date: new Date(),
    };

    try {
      let taskList = await this.getTaskList();
      taskList.push(addTaskObj);
      await AsyncStorage.setItem('@taskKey', JSON.stringify(taskList));
    } catch (e) {
      throw e;
    }
  }

  /**
   * Todoタスクを編集する
   *
   * @param {string}  taskId 編集するタスクのID
   * @param {string} editTaskName 編集するタスクのタスク名
   * @memberof TodoTaskService
   */
  async editTask(taskId, editTaskName, originDestination, destination) {
    try {
      const taskList = await this.getTaskList();
      const editTaskObj = taskList.filter((taskObj) => taskObj.id == taskId)[0];
      editTaskObj.name = editTaskName;
      editTaskObj.originLatitude = originDestination.latitude;
      editTaskObj.originLongitude = originDestination.longitude;
      editTaskObj.latitude = destination.latitude;
      editTaskObj.longitude = destination.longitude;
      editTaskObj.latitudeDelta = destination.latitudeDelta;
      editTaskObj.longitudeDelta = destination.longitudeDelta;
      const updateTaskList = taskList.map((taskObj) => (taskObj.id == taskId ? editTaskObj : taskObj));

      await AsyncStorage.setItem('@taskKey', JSON.stringify(updateTaskList));
    } catch (e) {
      throw e;
    }
  }

  /**
   * Todoタスクを削除する
   *
   * @param {string} taskId 削除するタスクのID
   * @memberof TodoTaskService
   */
  async deleteTask(taskId) {
    try {
      const taskList = await this.getTaskList();
      const updateTaskList = taskList.filter((taskObj) => taskObj.id != taskId);
      await AsyncStorage.setItem('@taskKey', JSON.stringify(updateTaskList));
    } catch (e) {
      throw e;
    }
  }

  /**
   * 指定したタブのタスクを削除する
   *
   * @param {string} tabKey タブキー
   * @memberof TodoTaskService
   */
  async deleteTaskTargetTabKey(tabKey) {
    try {
      const taskList = await this.getTaskList();
      const updateTaskList = taskList.filter((taskObj) => taskObj.key != tabKey);
      await AsyncStorage.setItem('@taskKey', JSON.stringify(updateTaskList));
    } catch {
      throw e;
    }
  }

  /**
   * Todoタスクチェック
   *
   * @param {string} taskId タスクID
   * @param {bool} complete タスク完了フラグ
   * @memberof TodoTaskService
   */
  async checkTask(taskId, complete) {
    try {
      const taskList = await this.getTaskList();
      const editTaskObj = taskList.filter((taskObj) => taskObj.id == taskId)[0];
      editTaskObj.complete = complete;
      const updateTaskList = taskList.map((taskObj) => (taskObj.id == taskId ? editTaskObj : taskObj));

      await AsyncStorage.setItem('@taskKey', JSON.stringify(updateTaskList));
    } catch (e) {
      throw e;
    }
  }
}
