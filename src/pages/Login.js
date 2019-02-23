import React from "react";
import {
  ActivityIndicator,
  Button,
  TextInput,
  StyleSheet,
  Text,
  View
} from "react-native";
import firebase from "firebase";

export default class Login extends React.Component {
  state = {
    email: "",
    password: "",
    isLoadingLogin: false,
    isLoadingSignIn: false,
    warning: ""
  };

  componentDidMount() {
    const config = {
      apiKey: "",
      authDomain: "contatosos-82cf5.firebaseapp.com",
      databaseURL: "https://contatosos-82cf5.firebaseio.com",
      projectId: "contatosos-82cf5",
      storageBucket: "contatosos-82cf5.appspot.com",
      messagingSenderId: "484120196028"
    };
    firebase.initializeApp(config);
  }

  async handleSignIn() {
    this.setState({ isLoadingSignIn: true, warning: "" });
    const { email, password } = this.state;

    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        let account = {};
        account.email = email.toLowerCase();
        account.uid = user.user.uid;
        this.setState({ warning: "Sucesso!" });

        firebase
          .database()
          .ref(`users/${user.user.uid}`)
          .set({ account });
      })
      .catch(error => this.setState({ warning: error.message }));

    this.setState({ isLoadingSignIn: false });
  }

  async handleLogin() {
    this.setState({ isLoadingLogin: true, warning: "" });
    const { email, password } = this.state;

    const success = user => {
      this.props.navigation.navigate("Home", { uid: user.user.uid });
      this.setState({ password: "", warning: "" });
    };

    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => success(user))
      .catch(error => this.setState({ warning: error.message }));

    this.setState({ isLoadingLogin: false });
  }

  renderButtonLogin() {
    if (this.state.isLoadingLogin) {
      return <ActivityIndicator />;
    }
    return <Button title="Login" onPress={() => this.handleLogin()} />;
  }

  renderButtonSignIn() {
    if (this.state.isLoadingSignIn) {
      return <ActivityIndicator />;
    }
    return (
      <Button
        style={styles.button}
        title="Cadastrar"
        onPress={() => this.handleSignIn()}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.forms}>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={email => this.setState({ email })}
            placeholder="email@example.com"
            style={styles.form}
            textContentType="emailAddress"
            value={this.state.email}
          />
          <TextInput
            autoCapitalize="none"
            onChangeText={password => this.setState({ password })}
            placeholder="******"
            secureTextEntry
            style={styles.form}
            textContentType="password"
            value={this.state.password}
          />
        </View>
        <View style={styles.button}>{this.renderButtonLogin()}</View>
        <View style={styles.button}>{this.renderButtonSignIn()}</View>
        <Text style={styles.warning}>{this.state.warning}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    paddingBottom: 10,
    paddingHorizontal: 10
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 30
  },
  forms: {
    paddingBottom: 10
  },
  form: {
    borderColor: "#CCC",
    borderWidth: 1,
    fontSize: 18,
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  warning: {
    paddingLeft: 10
  }
});
