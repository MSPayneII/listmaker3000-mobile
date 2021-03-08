import { StatusBar, setStatusBarBackgroundColor } from 'expo-status-bar';
import React from 'react';
import { TextInput, Text, View, FlatList, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { styles, colors } from './Styles';
import firebase from 'firebase';
import '@firebase/firestore';
import { firebaseConfig } from './Secrets.js';



 // Initialize Firebase and get references
 if (!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}


const db = firebase.firestore();
const listCollectionRef = db.collection('Project2ListCollection');
const Stack = createStackNavigator();
const appName = "ListMaker 3000";

let appInventory = [];

let listInventory = [];




class HomeScreen extends React.Component {

  constructor(props) {
    super(props);

   
    console.log("in HomeScreen, route.params = ", props.route.params);

    // this.nextKey = 0;
    this.state = {
      theMainList: []
    }
  }

  getListsFromFirebase = async () => {  //gets firebase collection and sets it to this.state.theMainList
    appInventory = [];
    let qSnap = await listCollectionRef.get();
    qSnap.forEach(qDocSnap => {
      let data = qDocSnap.data();
      data.key = qDocSnap.id;
      appInventory.push(data);
    });
    this.setState({theMainList:appInventory})

        console.log(this.state.theMainList)

  }

  componentDidMount() {
    this.getListsFromFirebase(); 
    this.focusUnsubscribe = this.props.navigation.addListener('focus', this.onFocus);
    console.log("Home Screen did mount"); 
  }

  componentWillUnmount() {
    this.focusUnsubscribe();
  }
  
  onFocus = () => {
    if (this.props.route.params) {
      const {operation, item} = this.props.route.params;
      if (operation === 'add') {
        this.addList(item.text);
      } else if (operation === 'edit') {
        this.updateList(item.key, item.text);
      } 
    }
    this.props.navigation.setParams({operation: 'none'});
  }

  //adds item to firebase and updates this.state.theMainList
  addList = async (itemText) => {
    if (itemText) { // false if undefined
      let docRef = await listCollectionRef.add({text:itemText});
      appInventory.push({text: itemText, key: docRef.id});

    }  
    this.setState({theMainList:appInventory});
  }

  //updates existing item to firebase and updates this.state.theMainList
  updateList = async (itemKey, itemText) => {
    let docRef = listCollectionRef.doc(itemKey);
    await docRef.update({text:itemText});

    let foundIndex = -1;
    for (let idx in appInventory) {
      if (appInventory[idx].key === itemKey) {
        foundIndex = idx;
        break;
      }
    }
    if (foundIndex !== -1) { // silently fail if item not found
      itemText.key = itemKey;
      appInventory[foundIndex].text = itemText;
    }
    this.setState({theMainList: appInventory});
  }

  deleteList = async (itemKey) => {
    let docRef = listCollectionRef.doc(itemKey);
    await docRef.delete();

    let foundIndex = -1;
    for (let idx in appInventory) {
      if (appInventory[idx].key === itemKey) {
        foundIndex = idx;
        break;
      }
    }
    if (foundIndex !== -1) { // silently fail if item not found
      appInventory.splice(foundIndex, 1); // remove one element 
    }
    this.setState({theMainList: appInventory});
  }

  onDelete = (itemWhichIsAListKey) => {
    this.deleteList(itemWhichIsAListKey);
  }

  onEdit = (itemWhichIsAList) => {
    this.props.navigation.navigate("List", {
      operation: 'edit',
      item: itemWhichIsAList
    });
  }
  
  emptyListComponent = () => {
    return (
      <View style={styles.emptyListContainer}>
        <Text style={styles.emptyListText}>
        You don't have any lists!</Text>
        <Text style={styles.emptyListText}>Tap "+" below to add one!</Text>
     </View>);
  }



  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {appName}
          </Text>
        </View>
        <View style={styles.body}>
          <View style={styles.listContainer}>
            
            <FlatList
              data={this.state.theMainList}
              ItemSeparatorComponent={()=>(
                <View style={styles.separator}
                />
              )}
              ListEmptyComponent={this.emptyListComponent}
            
              renderItem={({item})=>{
                return(
                  <View style={styles.listItemContainer}>
                  <View style={styles.listItemIcon}>
                    <Feather name="list" 
                      size={24} 
                      color={colors.primaryDark}/>
                  </View>
                
                    <View style={styles.listItemTextContainer}> 
                      <Text style={styles.listItemText}>
                        {item.text}
                      </Text> 
                    </View>
                    <View style={styles.listItemButtonContainer}>
                      <Ionicons name="md-create" 
                        size={24} 
                        color={colors.primaryDark}
                        onPress={()=>{this.onEdit(item)}} />
                      <Ionicons name="md-trash" 
                        size={24} 
                        color={colors.primaryDark}
                        /*Confirmation dialog is displayed when the user tries to 
                          delete an item, and the delete only occurs if the user
                          confirms the operation*/
                        onPress={()=>{
                          Alert.alert(   
                            'Delete Item?',
                            `Are you sure you want to delete "${item.text}"?` ,
                            [
                              {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel'
                              },
                              { text: 'Delete', 
                                onPress: () => {
                                  this.onDelete(item.key)
                                  console.log('Delete Pressed') }}
                            ],
                            { cancelable: false }
                          );
                          }} />
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={()=>
              this.props.navigation.navigate('List', 
                {operation: "add"})}>
            <Ionicons name="md-add-circle" 
              size={80} 
              color={colors.primaryDark} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class ListScreen extends React.Component {

  constructor(props) {
    super(props);

    console.log("in ListScreen, route.params = ", props.route.params);

    this.operation = this.props.route.params.operation;
    this.item = this.props.route.params.item;

    let listName = '';

    if (this.operation === 'edit') {
      listName = this.props.route.params.item.text;
      this.listID = this.props.route.params.item.key;
    }



    // console.log("List Key in List Screen constructor: ", this.listID);
    // console.log("List Object: ", this.item)

    
    this.state = {
      inputText: listName,
      switchValue: true,
      theSecondaryList: []
    }
    
  }
   
  // gets Query Document Snapshots of the list of items
  getItemsFromFirebase = async () => {  //gets firebase collection and sets it to this.state.theMainList
    listInventory = [];
    let listRef = listCollectionRef.doc(this.listID)
    let qSnap = await listRef.collection('items').get();
    qSnap.forEach(qDocSnap => {
      let data = qDocSnap.data();
      data.key = qDocSnap.id;
      listInventory.push(data);

      // console.log ("list inventory in getitemsfromfirebase", listInventory)
      
    });
    this.setState({theSecondaryList:listInventory})
  }

  componentDidMount() {
    this.getItemsFromFirebase();
    this.focusUnsubscribe = this.props.navigation.addListener('focus', this.onFocus);
    console.log("Home Screen did mount");
    

  }

  componentWillUnmount() {
    this.focusUnsubscribe();
    
  }
  
 
  onFocus = () => {
    if (this.props.route.params.item) {
      const {operation, item} = this.props.route.params;
      if (operation === 'add') {
        this.addListItem(item.text);
      } 
      else if (operation === 'edit') {
        this.updateListItem(item.key, item.text);
      } 
    }
    this.props.navigation.setParams({operation: 'none'});
  }

  addListItem = async (itemText) => {
    // console.log("List Key for adding: ", this.listID);
    
    if (itemText) { // false if undefined
      let itemListRef = listCollectionRef.doc(this.listID).collection("items");
      let itemRef = await itemListRef.add({text:itemText, checked: false});
      listInventory.push({text: itemText, key: itemRef.id, checked: false});
      // console.log("Item id is: ", itemRef.id)
      // console.log("addlistitem listInventory is: ",listInventory)
    }  
    this.setState({theSecondaryList:listInventory});
  }


  updateListItem = async (itemKey, itemText) => {
    let itemListRef = listCollectionRef.doc(this.listID).collection("items");
    let docRef = itemListRef.doc(itemKey);
    await docRef.update({text:itemText});
    // console.log("updatedlistitem itemref: ", docRef.id)


    let foundIndex = -1;
    for (let idx in listInventory) {
      if (listInventory[idx].key === itemKey) {
        foundIndex = idx;
        break;
      }
    }
    if (foundIndex !== -1) { // silently fail if item not found
      itemText.key = itemKey;
      listInventory[foundIndex].text = itemText;
    }
    

    this.setState({theSecondaryList: listInventory});
  }


  onEdit = (itemWhichIsAList) => {
    this.props.navigation.navigate("ListItems", {
      operation: 'edit',
      item: itemWhichIsAList
    });
  }

  // deletes an item
  deleteListItem = async (itemKey) => {
    let itemListRef = listCollectionRef.doc(this.listID).collection("items");
    let docRef = itemListRef.doc(itemKey);
    await docRef.delete();

    let foundIndex = -1;
    for (let idx in listInventory) {
      if (listInventory[idx].key === itemKey) {
        foundIndex = idx;
        break;
      }
    }
    if (foundIndex !== -1) { // silently fail if item not found
      listInventory.splice(foundIndex, 1); // remove one element 
    }
    this.setState({theSecondaryList: listInventory});
    // console.log("listitem deleted")
  }

  onDelete = (itemWhichIsAListKey) => {
    this.deleteListItem(itemWhichIsAListKey);
  }


  // function for the "show completed" switch. I did not finish this
  onShowCompletedValueChange = (value) => {

    
    this.setState({
      switchValue: value,
    });
  }



 // was able to get this to return the boolean field value for an item but couldn't change the checkbox "checked" value with it. 

  updateStatus = async (status,itemKey) => {
    let theList = listInventory
    let itemListRef = listCollectionRef.doc(this.listID).collection("items");
    let docRef = itemListRef.doc(itemKey);
    // let {status } = this.state
    if (status) {
      // console.log("prop is true");
      await docRef.update({checked:false});
      // this.setState({checked: item.checked =false})

    } else {
      // console.log("prop is false")
      await docRef.update({checked:true});
      // this.setState({checked: item.checked =true})

    }
    this.setState({theSecondaryList: theList});

  }
 

 

  emptyListItemsComponent = () => {
    return (
      <View style={styles.emptyListContainer}>
        <Text style={styles.emptyListText}>
        Nothing in your list.</Text>
        <Text style={styles.emptyListText}>Tap "Add Item" below to add something!</Text>
     </View>);
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {appName}
          </Text>
        </View>
        <View style={styles.body}>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>
             List name: </Text>
            <TextInput
              placeholder='Enter a list name'
              style={styles.textInputBox}
              onChangeText={(text) => this.setState({inputText: text})}
              value={this.state.inputText}
            />
          </View>

          <View style={styles.switchbuttonContainer}>
            <Switch
              trackColor={{true:'#7377C1',false: '#BDBDBD'}}
              style={styles.switchButton}
              onValueChange={this.onShowCompletedValueChange}
              value={this.state.switchValue}/>
              <Text style={styles.switchButtonText}>
              Show Completed </Text>  
          </View>
          <View style={styles.listContainer}>
            
            <FlatList
              data={this.state.theSecondaryList}
              ItemSeparatorComponent={()=>(
                <View style={styles.separator}
                />
              )}
              ListEmptyComponent={this.emptyListItemsComponent}
              renderItem={({item})=>{
                return(
                  <View style={styles.listItemContainer}>
                  {/* <View style={styles.listItemIcon}>
                    <Feather name="list" 
                      size={24} 
                      color={colors.primaryDark}/>
                  </View> */}
                  <CheckBox  
                    checked={item.checked}
                    onPress={()=>{
                      this.updateStatus(item.checked,item.key)}}
                  />
                    <View style={styles.listItemTextContainer}> 
                      <Text style={styles.listItemText}>
                        {item.text}
                      </Text> 
                    </View>
                    <View style={styles.listItemButtonContainer}>
                      <Ionicons name="md-create" 
                        size={24} 
                        color={colors.primaryDark}
                        onPress={()=>{this.onEdit(item)}} />
                      <Ionicons name="md-trash" 
                        size={24} 
                        color={colors.primaryDark}

                        /*Confirmation dialog is displayed when the user tries to 
                          delete an item, and the delete only occurs if the user
                          confirms the operation*/

                        onPress={()=>{
                          Alert.alert(   
                            'Delete Item?',
                            `Are you sure you want to delete "${item.text}"?` ,
                            [
                              {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel'
                              },
                              { text: 'Delete', 
                                onPress: () => {
                                  this.onDelete(item.key)
                                  console.log('Delete Pressed') }}
                            ],
                            { cancelable: false }
                          );
                          }} />
                    </View>
                  </View>
                );
              }}
            />
          </View>

        </View>
        <View style={styles.footer}>

            <TouchableOpacity
              style={styles.footerAddButton}
              onPress={()=>
                this.props.navigation.navigate('ListItems', 
                  {operation: "add"})}>
              <Ionicons name="md-add-circle" 
                size={80} 
                color={colors.primaryDark} />
            </TouchableOpacity>
          <View style={styles.footerButtonContainer}>
          
            <TouchableOpacity 
              style={styles.footerButton}
              onPress={()=>{this.props.navigation.navigate("Home")}}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
            /* save button is visually greyed out and disabled when there is no
               text in the List screen text box. */
              style={this.state.inputText ? styles.footerButton : styles.footerButtonDisabled}
              disabled={this.state.inputText ? false : true}
              onPress={()=>{
                let theItem = {};
                if (this.operation === 'add') {
                  theItem = {
                    text: this.state.inputText,
                    key: -1 // placeholder for "no ID"
                  }
                } else { // operation === 'edit'
                  theItem = this.props.route.params.item;
                  theItem.text = this.state.inputText;
                }
                this.props.navigation.navigate("Home", {
                  operation: this.operation,
                  item: theItem
                });
              }}>
              <Text style={styles.footerButtonText}>Save</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    );
  }
}

class ListItemsScreen extends React.Component{
  constructor(props){
    super(props);

    this.operation = this.props.route.params.operation;

    let itemName = '';
    if (this.operation === 'edit') {
      itemName = this.props.route.params.item.text;
      // this.itemID = this.props.route.params.item.key;
      
    }

    this.state = {
      inputText: itemName,

    }
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {appName}
          </Text>
        </View>
        <View style={styles.body}>
          <View style={styles.textInputContainer}>
            <Text style={styles.textInputLabel}>
             Item: </Text>
            <TextInput
              placeholder='Enter an item'
              style={styles.textInputBox}
              onChangeText={(text) => this.setState({inputText: text})}
              value={this.state.inputText}
            />
          </View>

        </View>
        <View style={styles.footerListItems}>

          <View style={styles.footerButtonContainer}>
          
            <TouchableOpacity 
              style={styles.footerButton}
              onPress={()=>{this.props.navigation.navigate("List")}}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
            /* save button is visually greyed out and disabled when there is no
               text in the List screen text box. */
              style={this.state.inputText ? styles.footerButton : styles.footerButtonDisabled}
              disabled={this.state.inputText ? false : true}
              onPress={()=>{
                let theItem = {};
                if (this.operation === 'add') {
                  theItem = {
                    text: this.state.inputText,
                    key: -1, // placeholder for "no ID",
                  }
                } else { // operation === 'edit'
                  theItem = this.props.route.params.item;
                  theItem.text = this.state.inputText;
                }
                this.props.navigation.navigate("List", {
                  operation: this.operation,
                  item: theItem
                });
              }}>
              <Text style={styles.footerButtonText}>Save</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    );
  }
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"   
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen name="ListItems" component={ListItemsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
