import React, { useState } from "react";
import {
  View,
  Button,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import {
  BluetoothManager,
  BluetoothTscPrinter,
} from "react-native-bluetooth-escpos-printer";

const HelloPrintScreen = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  const scan = async () => {
    setLoading(true);
    try {
      const res = await BluetoothManager.scanDevices();
      const { found = [], paired = [] } = JSON.parse(res);
      setDevices([...paired, ...found]);
    } catch (e) {
      Alert.alert("Scan Error", e.message || JSON.stringify(e));
    }
    setLoading(false);
  };

  const printLabel = async (device) => {
    // setLoading(true);
    // try {
    //   await BluetoothManager.connect(device.address);

    //   await BluetoothTscPrinter.printLabel({
    //     width: 72, // mm print width max 72 mm :contentReference[oaicite:6]{index=6}
    //     height: 30, // label height in mm (adjustable)
    //     gap: 2, // gap between labels in mm
    //     direction: BluetoothTscPrinter.DIRECTION.FORWARD,
    //     reference: [0, 0],
    //     tear: BluetoothTscPrinter.TEAR.ON,
    //     sound: 0,
    //     text: [
    //       {
    //         text: "Hello Developers",
    //         x: 10,
    //         y: 20,
    //         fonttype: BluetoothTscPrinter.FONTTYPE.SIMPLIFIED_CHINESE,
    //         rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
    //         xscal: BluetoothTscPrinter.FONTMUL.MUL_2,
    //         yscal: BluetoothTscPrinter.FONTMUL.MUL_2,
    //       },
    //     ],
    //   });

    //   Alert.alert("Success", "Printed label successfully");
    // } catch (e) {
    //   Alert.alert("Print Error", e.message || JSON.stringify(e));
    // } finally {
    //   setLoading(false);
    // }

    BluetoothTscPrinter.printLabel({
      width: 40,
      height: 30,
      gap: 20,
      direction: BluetoothTscPrinter.DIRECTION.FORWARD,
      reference: [0, 0],
      tear: BluetoothTscPrinter.TEAR.ON,
      sound: 1,
      text: [
        {
          text: "I am a testing txt",
          x: 20,
          y: 0,
          fonttype: BluetoothTscPrinter.FONTTYPE.SIMPLIFIED_CHINESE,
          rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
          xscal: BluetoothTscPrinter.FONTMUL.MUL_1,
          yscal: BluetoothTscPrinter.FONTMUL.MUL_1,
        },
        {
          text: "你在说什么呢?",
          x: 20,
          y: 50,
          fonttype: BluetoothTscPrinter.FONTTYPE.SIMPLIFIED_CHINESE,
          rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
          xscal: BluetoothTscPrinter.FONTMUL.MUL_1,
          yscal: BluetoothTscPrinter.FONTMUL.MUL_1,
        },
      ],
      //   qrcode: [
      //     {
      //       x: 20,
      //       y: 96,
      //       level: BluetoothTscPrinter.EEC.LEVEL_L,
      //       width: 3,
      //       rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
      //       code: "show me the money",
      //     },
      //   ],
      //   barcode: [
      //     {
      //       x: 120,
      //       y: 96,
      //       type: BluetoothTscPrinter.BARCODETYPE.CODE128,
      //       height: 40,
      //       readable: 1,
      //       rotation: BluetoothTscPrinter.ROTATION.ROTATION_0,
      //       code: "1234567890",
      //     },
      //   ],
      //   image: [
      //     {
      //       x: 160,
      //       y: 160,
      //       mode: BluetoothTscPrinter.BITMAP_MODE.OVERWRITE,
      //       width: 80,
      //       image: base64JpgLogo,
      //     },
      //   ],
    }).then(
      () => {
        alert("done");
      },
      (err) => {
        alert(err);
      }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Scan Devices" disabled={loading} onPress={scan} />
      {loading && <ActivityIndicator size="large" />}
      {devices.map((d, i) => (
        <TouchableOpacity
          key={i}
          style={styles.deviceBtn}
          onPress={() => printLabel(d)}
        >
          <Text>
            {d.name || "Unknown"} ({d.address})
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  deviceBtn: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#eef",
    borderRadius: 5,
  },
});

export default HelloPrintScreen;
