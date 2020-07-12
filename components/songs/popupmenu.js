import React, {Component} from 'react';
import {
  View,
  UIManager,
  findNodeHandle,
  TouchableOpacity,
  Text,
} from 'react-native';
// console.log('UIManager------->>', UIManager);
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import {
  Menu,
  MenuOptions,
  MenuProvider,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
const ICON_SIZE = 24;

export default class PopupMenu extends Component {
  static propTypes = {
    // array of strings, will be list items of Menu
    actions: PropTypes.arrayOf(PropTypes.string).isRequired,
    onPress: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      icon: false,
    };
  }

  onOptionSelect = value => {
    console.log('the value is', value, this.props);
    this.props.onPress('itemSelected', value);
    this.setState({icon: false});
  };

  onTriggerPress = () => {
    this.setState({icon: true});
  };

  onBackdropPress = () => {
    this.setState({icon: false});
  };
  render() {
    const {icon} = this.state;
    return (
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity onPress={this.onTriggerPress}>
          <Icon
            name="more-vert"
            size={ICON_SIZE}
            color={'white'}
            ref={this.onRef}
          />
        </TouchableOpacity>
        <Menu
          opened={icon}
          onBackdropPress={() => this.onBackdropPress()}
          onSelect={value => this.onOptionSelect(value)}>
          <MenuTrigger onPress={() => this.onTriggerPress()} />
          <MenuOptions>
            <MenuOption value={0} text="Edit" />

            <MenuOption value={1} text="Delete" />
          </MenuOptions>
        </Menu>
      </View>
    );
  }


}
