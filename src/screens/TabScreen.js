import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useLayoutEffect } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import TabListItem from '../components/TabListItem';
import TodoTabService from '../services/TodoTabService';
import { TabContext } from '../contexts/TabContext';
import ModalSelector from 'react-native-modal-selector';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  overlayStyle: {
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  optionContainerStyle: {
    marginVertical: 80,
    paddingHorizontal: 0,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  optionStyle: {
    paddingVertical: 20,
    borderBottomWidth: 0.3,
  },
  optionTextStyle: {
    color: '#000',
    fontSize: 17,
  },
  cancelStyle: {
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  cancelTextStyle: {
    color: 'rgb(0,118,255)',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTextStyle: {
    color: '#666',
    fontSize: 19,
  },
  sectionStyle: {
    borderBottomWidth: 0.5,
  },
});

export default function TabScreen({ navigation }) {
  const [distance, setDistance] = React.useState(0);
  const [tabList, setTabList] = React.useState([]);
  const data = Array.from({ length: 20 }, (_, i) => ({ key: i + 1, label: `${i + 1}km` }));

  const { tabReload } = React.useContext(TabContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <ModalSelector
            onChange={(value) => setDistance(value.key)}
            data={data}
            animationType="fade"
            ref={(ref) => (selector = ref)}
            cancelText="キャンセル"
            overlayStyle={styles.overlayStyle}
            backdropPressToClose={true}
            optionContainerStyle={styles.optionContainerStyle}
            optionStyle={styles.optionStyle}
            optionTextStyle={styles.optionTextStyle}
            cancelStyle={styles.cancelStyle}
            cancelTextStyle={styles.cancelTextStyle}
            sectionTextStyle={styles.sectionTextStyle}
            sectionStyle={styles.sectionStyle}>
            <Icon name="plus" color={'white'} size={25} style={{ marginRight: 15 }}></Icon>
          </ModalSelector>
        );
      },
    });
  }, []);

  useEffect(() => {
    (async function () {
      try {
        const todoTabService = new TodoTabService();
        const storageTabList = await todoTabService.getTabList();

        setTabList(storageTabList);
      } catch (e) {
        setTabList([]);
      }
    })();
  }, []);

  /**
   * タブ追加処理
   *
   * @param {string} tabName 追加するタブ名
   */
  async function addTab(tabName) {
    try {
      const todoTabService = new TodoTabService();
      await todoTabService.addTab(tabName);

      const storageTabList = await todoTabService.getTabList();

      setTabList(storageTabList);

      tabReload.set(true);
    } catch (e) {
      Alert.alert('エラー', 'タブの追加に失敗しました', [{ text: 'OK' }]);
    }
  }

  /**
   * タブ削除処理
   *
   * @param {string} tabKey 削除するタブのキー
   */
  async function deleteTab(tabKey) {
    try {
      const todoTabService = new TodoTabService();
      await todoTabService.deleteTab(tabKey);

      const storageTabList = await todoTabService.getTabList();
      setTabList(storageTabList);

      tabReload.set(true);
    } catch (e) {
      Alert.alert('エラー', 'タブの削除に失敗しました', [{ text: 'OK' }]);
    }
  }

  useEffect(() => {
    const handleChange = async (value) => {
      await addTab(value);
    };

    if (distance) {
      let tabListNames = tabList.map((item) => item.name);
      if (tabListNames.includes(distance)) {
        return Alert.alert('エラー', '既に登録済みです。', [{ text: 'OK' }]);
      }

      handleChange(distance);
    }
  }, [distance]);

  const renderItem = ({ item }) => {
    return <TabListItem tabKey={item.key} tabTitle={item.name} deleteBtnTapped={deleteTab}></TabListItem>;
  };
  return (
    <View style={styles.container}>
      <FlatList contentContainerStyle={{ marginTop: 30 }} data={tabList} renderItem={renderItem} keyExtractor={(item) => item.key} />
      <ModalSelector data={data} style={{ display: 'none' }} />
      <StatusBar style="light" />
    </View>
  );
}
