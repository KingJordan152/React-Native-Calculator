import "react-native-gesture-handler";
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// updates the operation text
function updateOperation(op) {
  this.setState({opValue: op})

  if (op == "AC") { // clear all
    this.setState({operation: ""});
  }
  else if (op == "(-)") { // negate operation
    this.setState({operation: "-" + this.state.operation})  
  }
  else if (op == "%") { // turn expression into a percentage decimal
    this.setState({operation: eval(this.state.operation) / 100})
  }
  else if (op == "x") { // change to proper multiplication sign
    this.setState({operation: this.state.operation += "*"})
  }
  else if (op == "÷") { // change to proper division sign
    this.setState({operation: this.state.operation += "/"})
  }
  else if (op == "=") {  // check for = sign, just solve the expression
    if (this.state.operation.includes("^")) { // check for exponent operator
      var base = this.state.operation.substring(0, this.state.operation.indexOf("^"))
      var exponent = this.state.operation.substring(this.state.operation.indexOf("^") + 1)
      // holds both leftover component and actual base
      // e.g. 3+2^6 -> arrBase[0] == 3+, arrBase[1] == 2
      var arrBase = new Array(2);
      // holds both leftover component and actual exponent
      // e.g. 3+2^6+5 -> arrExponent[0] == 6, arrBase[1] == +5
      var arrExponent = new Array(2);
  
      function configurePow(sign, section, type) {
        if (type == "base") {
          if (section.includes(sign)) {
            arrBase[0] = section.substring(0, section.indexOf(sign) + 1);
            arrBase[1] = section.substring(section.indexOf(sign) + 1, section.length); // actual base
          }
        } else if (type == "exponent") {
          if (section.includes(sign)) {
            arrExponent[1] = section.substring(section.indexOf(sign), section.length);
            arrExponent[0] = section.substring(0, section.indexOf(sign)); // actual exponent
          }
        }
        return section;
      }
  
      // holds both leftover component and actual base
      var arrBase = new Array(2); // e.g. 3+2^6 -> arrBase[0] == 3+, arrBase[1] == 2
      configurePow("+", base, "base");
      configurePow("-", base, "base");
      configurePow("*", base, "base");
      configurePow("/", base, "base");
  
      configurePow("+", exponent, "exponent");
      configurePow("-", exponent, "exponent");
      configurePow("*", exponent, "exponent");
      configurePow("/", exponent, "exponent");
      
      this.setState({operation: eval(arrBase[0].concat(Math.pow(arrBase[1], arrExponent[0]), arrExponent[1]))});
    }
    else {
      this.setState({operation: eval(this.state.operation)})
    }
  }
  else { // add new operands and operators to expression
    this.setState({opValue: op})
    this.setState({operation: this.state.operation += op}); // i.e. new operation = current op += new op
  }
}

// all of the buttons with numbers and math signs
class CalcButton extends Component {
  constructor(props) {
    super(props);
  }

  // Variables declared in render function can be used in return function!
  render() {
    var type = this.props.type; //either "num", "operator", or "function"
    var value = this.props.value; // string to be put inside of button (ex. "1" or "+")

    // Determine color of button
    var colors = new Array(2);
    if (type == "num") {
      colors[0] = "#3b3b3b";
      colors[1] = "#5e5e5e";
    } else if (type == "operator") {
      colors[0] = "#3a7ff0";
      colors[1] = "#70a6ff";
    } else if (type == "function") {
      colors[0] = "#f53838";
      colors[1] = "#ff7575";
    }

    return (
      <TouchableHighlight
        style={[styles.buttonContainer, {backgroundColor: colors[0]}]}
        onPress={() => {
          updateOperation(value);
        }}
        underlayColor={colors[1]}
      >
        <Text style={styles.buttonText}>{value}</Text>
      </TouchableHighlight>
    );
  }
}

// View for the text that displays the current operation
class OperationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operation: "",
      opValue: ""
    };
    updateOperation = updateOperation.bind(this);
  }

  render() { 
    

    return(
      <View style={styles.operationContainer}>
        <View style={styles.operationContainer}>
          <Text style={styles.operationText}>{this.state.operation}</Text>
        </View>
      </View>
       
    );
  }
}

// Main
export default function App() {
  return (
    <View style={styles.container}>

      <OperationView/>

      <View style={{ margin: 12 }}>
        <View style={styles.buttonRows}>
          <CalcButton type="function" value="AC"/>
          <CalcButton type="function" value="(-)"/>
          <CalcButton type="function" value="%"/>
          <CalcButton type="operator" value="÷"/>
        </View>
        <View style={styles.buttonRows}>
          <CalcButton type="num" value="7"/>
          <CalcButton type="num" value="8"/>
          <CalcButton type="num" value="9"/>
          <CalcButton type="operator" value="x"/>
        </View>
        <View style={styles.buttonRows}>
          <CalcButton type="num" value="4"/>
          <CalcButton type="num" value="5"/>
          <CalcButton type="num" value="6"/>
          <CalcButton type="operator" value="-"/>
        </View>
        <View style={styles.buttonRows}>
          <CalcButton type="num" value="1"/>
          <CalcButton type="num" value="2"/>
          <CalcButton type="num" value="3"/>
          <CalcButton type="operator" value="+"/>
        </View>
        <View style={styles.buttonRows}>
          <CalcButton type="function" value="^"/>
          <CalcButton type="num" value="0"/>
          <CalcButton type="function" value="."/>
          <CalcButton type="operator" value="="/>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#000"
  },
  buttonContainer: {
    height: 80,
    width: 80,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 40,
    fontFamily: "Helvetica",
    color: "#fff"
  },
  buttonRows: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  operationContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    margin: 10,
  },
  operationText: {
    fontSize: 70,
    fontFamily: "Helvetica",
    color: "#fff"
  },
});
