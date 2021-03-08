
import { StyleSheet } from 'react-native';

export const colors = {
    primary: '#2E3190',
    primaryDark: '#7377C1', 
    primaryLight: '#C7CAFC', 
    outline: '#BDBDBD' 
  }

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
    },
    separator: {
        width: '100%', 
        height: 1, 
        backgroundColor: colors.primaryLight
    },
    header: {
      flex: 0.1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%',
      padding: 10,
      backgroundColor: colors.primary
    },
      headerText: {
        fontSize: 24,
        color: '#ffffff',
      },
    body: {
      flex: 0.5,
      alignItems: 'stretch',
      justifyContent: 'center',
      width: '100%',
      padding: '5%',
    },
      emptyListContainer: {  // added this to style the empty list message
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 15,
      },
        emptyListText: {
          fontSize: 18,
        },
      listHeaderText: {
        fontSize: 16,
        padding: 15
      },  
      listContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch', // this turns out to be important!
        padding: 15,
      },
        // Home Screen body
        listItemContainer: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
        },
        listItemIcon: {
          paddingRight: 8,
        },
        listItemTextContainer: {
          flex: 0.8,
          flexDirection: 'row',
          justifyContent: 'flex-start',
        },
          listItemText: {
            fontSize: 18,
          },
        listItemButtonContainer: {
          flex: 0.2,
          flexDirection: 'row',
          justifyContent: 'space-between',
        },

        // Detail Screen body
        textInputContainer: {
          flex: .2,
          justifyContent: 'center',
          alignItems: 'flex-start',
          flexDirection: 'row',
          paddingBottom: 15,
          paddingTop: 25,
        },
          textInputLabel: {
            fontSize: 18,
            paddingBottom: 10
          },
          textInputBox: {
            borderBottomColor: colors.outline,
            borderBottomWidth: 1,
            width: '60%', 
            height: 25, 
            fontSize: 18,
          },
          switchbuttonContainer: {
            flex: .2,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexDirection: 'row',
            paddingLeft: 20,
           },
           switchButton: {
            transform: [{ scaleX: .7 }, { scaleY: .7 }],
           },
           switchButtonText: {
             paddingTop: 8,
             paddingLeft: 8,
           },

    footer: {
      flex: 0.2,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },

      // Detail Screen footer
      footerButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
        footerAddButton: {
          paddingBottom: 25,
        },
        footerButton: {
          flex: 0.2,
          borderRadius: 12,
          borderColor: colors.outline,
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          marginHorizontal: '5%',
          backgroundColor: colors.primaryDark
        },
        footerButtonDisabled: {  //added to style the save button when disabled
          flex: 0.2,
          borderRadius: 12,
          borderColor: colors.outline,
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          marginHorizontal: '5%',
          backgroundColor: colors.outline
        },

      //List Items Screen

      footerListItems: {
        flex: 0.2,
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
      
        
});