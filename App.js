import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";

export default function App() {
  const [isBiometricSuported, setIsBiometricSuported] = useState(false);
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSuported(compatible);
    })();
  });

  const fallBackTODefaultAuth = () => {
    console.log("fall back to password authentication");
  };

  const alertComponent = (title, mess, btnText, btnFunc) => {
    return Alert.alert(title, mess, [
      {
        text: btnText,
        onPress: btnFunc,
      },
    ]);
  };

  const TwoBtnAllert = () =>
    Alert.alert("Welcome  to APP", "Subscribe Now", [
      {
        text: "Back",
        onPress: () => console.log("cancel Pressed"),
        style: "cancel",
      },
      {
        text: "ok",
        onPress: () => console.log("ok pressed"),
      },
    ]);

  const handleBiometricAuth = async () => {
    //check if hardware supports biometric
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    //fall back to default authentication method(password) if biometric is not supported

    if (!isBiometricAvailable)
      return alertComponent(
        "Please Enter your password",
        "Biometric Auth not supported",
        "ok",
        () => fallBackTODefaultAuth()
      );

    //check biometric types available
    let supportedBiometrics;
    if (isBiometricAvailable)
      supportedBiometrics =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

    //check biometric are saved locally in users device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics)
      return alertComponent(
        "Biometric record not found",
        "Please login with password",
        "Ok",
        () => fallBackTODefaultAuth()
      );

    //authenticate with biometric
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Loginwith Biometric",
      cancelLabel: "cancel",
      disableDeviceFallback: true,
    });

    //log the user in on success
    if (biometricAuth) {
      TwoBtnAllert();
    }
    console.log({ isBiometricAvailable });
    console.log({ supportedBiometrics });
    console.log({ savedBiometrics });
    console.log({ biometricAuth });
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text>
          {isBiometricSuported
            ? "Your device is compaitable with biometrics"
            : "Face or fingerprint is available on this device"}
        </Text>
        <TouchableHighlight style={{ height: 60, marginTop: 200 }}>
          <Button
            title="Login with biometric"
            color="black"
            onPress={handleBiometricAuth}
          />
        </TouchableHighlight>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
});
