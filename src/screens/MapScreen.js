import { useState, useEffect, useRef, useContext } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import TodoTaskService from '../services/TodoTaskService';
import TodoTabService from '../services/TodoTabService';
import { TabContext } from '../contexts/TabContext';
import { API_KEY } from '@env';

export default function MapScreen({ route }) {
  const { taskId, tabName } = route.params ?? '';
  const [distance, setDistance] = useState(0);
  const [selectedDistance, setSelectedDistance] = useState(0);
  const [tabList, setTabList] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [count, setCount] = useState(0);
  const [isResult, setIsResult] = useState(false);
  const mapViewRef = useRef();
  const [text, setText] = useState('');
  const [mileage, setMileage] = useState();
  const [saveFlg, setSaveFlg] = useState(false);
  const [courseFlg, setCourseFlg] = useState(false);

  const { mapReload } = useContext(TabContext);

  useEffect(() => {
    if (!taskId) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setOrigin({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      })();
    }
  }, []);

  useEffect(() => {
    (async function () {
      try {
        const todoTabService = new TodoTabService();
        const storageTabList = await todoTabService.getTabList();
        const viewTabList = storageTabList.map((tabObj) => {
          return {
            label: tabObj.name + 'km',
            value: tabObj.name,
          };
        });

        setTabList(viewTabList);
      } catch (e) {
        setTabList([]);
      }
    })();
  }, []);
  useEffect(() => {
    (async function () {
      if (taskId) {
        try {
          const todoTaskService = new TodoTaskService();
          const storageTask = await todoTaskService.getTaskById(taskId);
          setOrigin({
            latitude: storageTask.originLatitude,
            longitude: storageTask.originLongitude,
          });
          setDestination({
            latitude: storageTask.latitude,
            longitude: storageTask.longitude,
            latitudeDelta: storageTask.latitudeDelta,
            longitudeDelta: storageTask.longitudeDelta,
          });
          setText(storageTask.name);
          const todoTabService = new TodoTabService();
          const storageTabList = await todoTabService.getTabList();
          const selectedTab = storageTabList.find(function (value) {
            return value.name == tabName;
          });
          setSelectedDistance(selectedTab.name);
          setIsResult(true);
        } catch (e) {
          console.log('失敗です。無念。');
        }
      }
    })();
  }, []);

  const handleChange = (value) => {
    setDistance(value);
    setSelectedDistance(Number(value));
    if (value) {
      setCourseFlg(true);
    } else {
      setCourseFlg(false);
      setSaveFlg(false);
    }
  };

  const onChangeText = (newText) => {
    setText(newText);
  };

  const onPress = () => {
    setIsResult(false);
    // 座標を計算
    const destinationCoords = calculateDestination(origin.latitude, origin.longitude, distance);
    setDestination(destinationCoords);

    // 地図の拡大縮小を更新
    mapViewRef.current.animateToRegion({
      latitude: (origin.latitude + destinationCoords.latitude) / 2,
      longitude: (origin.longitude + destinationCoords.longitude) / 2,
      latitudeDelta: Math.abs(destinationCoords.latitude - origin.latitude) * 2,
      longitudeDelta: Math.abs(destinationCoords.longitude - origin.longitude) * 2,
    });
  };

  const rootSave = async () => {
    try {
      const todoTabService = new TodoTabService();
      const storageTabList = await todoTabService.getTabList();
      const selectedTab = storageTabList.find(function (value) {
        return value.name == distance;
      });

      const todoTaskService = new TodoTaskService();
      await todoTaskService.addTask(selectedTab.key, text, origin, destination);

      mapReload.set(true);
      Alert.alert('ルート作成成功', 'ルートを保存しました', [{ text: 'OK' }]);
    } catch (e) {
      Alert.alert('エラー', 'ルートの保存に失敗しました', [{ text: 'OK' }]);
    }
  };

  const rootEdit = async () => {
    try {
      const todoTaskService = new TodoTaskService();
      await todoTaskService.editTask(taskId, text, origin, destination);

      mapReload.set(true);
      Alert.alert('ルート更新成功', 'ルートを更新しました', [{ text: 'OK' }]);
    } catch (e) {
      Alert.alert('エラー', 'ルートの更新に失敗しました', [{ text: 'OK' }]);
    }
  };

  // 緯度経度取得
  const calculateDestination = (startLat, startLon, distance) => {
    const calDistance = (distance / 2) * 0.8;
    // ランダムな方向と距離を生成
    const randomDirection = Math.random() * 360;
    // 距離を緯度と経度の差に変換
    const latitudeDelta = (calDistance / 111) * 1.0;
    const longitudeDelta = (calDistance / (111.32 * Math.cos(startLat * (Math.PI / 180)))) * 1.0;
    // 新しい座標を計算
    const newLatitude = startLat + latitudeDelta * Math.sin(randomDirection * (Math.PI / 180));
    const newLongitude = startLon + longitudeDelta * Math.cos(randomDirection * (Math.PI / 180));

    return {
      latitude: newLatitude,
      longitude: newLongitude,
      latitudeDelta: latitudeDelta,
      longitudeDelta: longitudeDelta,
    };
  };

  const handleDirectionsReady = async (result) => {
    const resultDistance = result.distance; // 距離 (km)
    const duration = result.duration; // 所要時間 (時間)
    setCount((count) => count + 1);

    if (count > 1) {
      setCount(0);
      setDestination(null);
      setSaveFlg(false);

      return Alert.alert('エラー', 'ルートの設定に失敗しました。', [{ text: 'OK' }]);
    }

    console.log(`距離: ${resultDistance} km, 所要時間: ${duration} 時間`);

    if (resultDistance > distance / 2 + 1) {
      const destinationCoords = calculateDestination(origin.latitude, origin.longitude, distance);
      setDestination(destinationCoords);

      return;
    }
    setMileage(Math.round(resultDistance * 10) / 10);

    setIsResult(true);
    setSaveFlg(true);
  };

  return (
    <View style={{ flex: 1, marginHorizontal: 'auto' }}>
      {origin && (
        <MapView
          ref={mapViewRef}
          style={{ flex: 0.5 }}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          initialRegion={{
            latitude: origin.latitude,
            longitude: origin.longitude,
            latitudeDelta: destination ? Math.abs(destination.latitude - origin.latitude) * 2.5 : 0.0022,
            longitudeDelta: destination ? Math.abs(destination.longitude - origin.longitude) * 2.5 : 0.0121,
          }}>
          {isResult && <Marker coordinate={destination} />}
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={API_KEY}
            strokeWidth={3}
            strokeColor="blue"
            onReady={handleDirectionsReady}
          />
        </MapView>
      )}
      <View style={{ flex: 0.5, marginVertical: 10, marginHorizontal: 15 }}>
        <Text style={{ marginVertical: 10 }}>コース名</Text>
        <TextInput style={pickerSelectStyles.input} onChangeText={onChangeText} value={text} placeholder="タイトルを入力してください。" />
        <Text style={{ marginVertical: 10 }}>走行距離</Text>
        <RNPickerSelect
          onValueChange={handleChange}
          items={tabList}
          style={pickerSelectStyles}
          placeholder={{ label: '選択してください', value: 0 }}
          value={selectedDistance}
          Icon={() => <Text style={{ position: 'absolute', right: 45, top: 10, fontSize: 18, color: '#789' }}>▼</Text>}
          onDonePress={() => {}}
        />
        {mileage && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 50 }}>
              <Text style={{ fontSize: 20 }}>片道</Text>
              <Text style={{ marginVertical: 10, marginLeft: 30, fontSize: 20 }}>{mileage}km</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}>往復</Text>
              <Text style={{ marginVertical: 10, marginLeft: 30, fontSize: 20 }}>{mileage * 2}km</Text>
            </View>
          </View>
        )}
        <View style={{ flexDirection: 'row', marginVertical: 20 }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={{
              width: 150,
              height: 60,
              backgroundColor: courseFlg ? '#167476' : '#16747680',
              marginVertical: 10,
              marginHorizontal: 30,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: '#ffffff', fontSize: 18 }}>コースを作成する</Text>
          </TouchableOpacity>
          {taskId ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={rootEdit}
              disabled={!saveFlg}
              style={{
                width: 100,
                height: 60,
                backgroundColor: saveFlg ? '#ff2222' : '#ff222280',
                marginVertical: 10,
                marginHorizontal: 10,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 18 }}>更新する</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={1}
              onPress={rootSave}
              disabled={!saveFlg}
              style={{
                width: 100,
                height: 60,
                backgroundColor: saveFlg ? '#ff2222' : '#ff222280',
                marginVertical: 10,
                marginHorizontal: 10,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 18, color: 'white' }}>保存する</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#789',
    borderRadius: 4,
    width: 300,
    marginLeft: 30,
  },
  input: {
    height: 40,
    width: 300,
    borderColor: '#789',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginLeft: 30,
  },
});
