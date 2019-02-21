import React from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Contacts, Permissions } from "expo";
import firebase from "firebase";

export default class Home extends React.Component {
  state = {
    isLoadingGet: false,
    isLoadingSet: false,
    warning: ""
  };

  async _setContacts() {
    this.setState({ isLoadingSet: true, warning: "" });

    const { status } = await Permissions.askAsync(Permissions.CONTACTS);

    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync();
      const { uid } = this.props.navigation.state.params;

      await firebase
        .database()
        .ref(`users/${uid}/account/contacts`)
        .set({ data })
        .then(() => this.setState({ warning: "Sucesso!" }))
        .catch(error => this.setState({ warning: error.message }));
    }
    this.setState({ isLoadingSet: false });
  }

  async _getContacts() {
    this.setState({ isLoadingGet: true, warning: "" });

    // const { status } = await Permissions.askAsync(Permissions.CONTACTS);
    const { status } = await Permissions.askAsync(...types);

    if (status === "granted") {
      try {
        const contact = {
          name: "Teste Expo",
          phoneNumbers: [123, 321],
          email: "teste@teste.com"
        };

        await Contacts.addContactAsync(contact);

        this.setState({ warning: "Sucesso!" });
      } catch (err) {
        this.setState({ warning: err.message });
      }

      this.setState({ isLoadingGet: false });
    }
  }

  renderButtonEnviar() {
    if (this.state.isLoadingSet) {
      return <ActivityIndicator />;
    }

    return (
      <Button title="Enviar contatos" onPress={() => this._setContacts()} />
    );
  }

  renderButtonReceber() {
    if (this.state.isLoadingGet) {
      return <ActivityIndicator />;
    }

    return (
      <Button title="Receber contatos" onPress={() => this._getContacts()} />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>{this.renderButtonEnviar()}</View>
        <View style={styles.content}>{this.renderButtonReceber()}</View>
        <Text style={styles.warning}>{this.state.warning}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 10
  },
  content: {
    marginVertical: 5
  }
});
