import React, { Component } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import BottomNavigation, {
    FullTab,
    Badge
} from 'react-native-material-bottom-navigation'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../../themes/Colors";

export default class BottomBar extends Component {
    state = {
        activeTab: 'home'
    }

    tabs = [
        {
            key: 'home',
            icon: 'home',
            label: 'Home',
            barColor: colors.backgroundcolor,
            pressColor: 'rgba(255, 255, 255, 0.16)'
        },
        {
            key: 'song',
            icon: 'music',
            label: 'Songs',
            barColor: colors.backgroundcolor,
            pressColor: 'rgba(255, 255, 255, 0.16)'
        },
        {
            key: 'calendar',
            icon: 'calendar-multiple-check',
            label: 'Calendar',
            barColor: colors.backgroundcolor,
            pressColor: 'rgba(255, 255, 255, 0.16)'
        },
        {
            key: 'menu',
            icon: 'menu',
            label: 'Menu',
            barColor: colors.backgroundcolor,
            pressColor: 'rgba(255, 255, 255, 0.16)'
        }
    ]

    renderIcon = icon => ({ isActive }) => (
        <MaterialCommunityIcons size={26} color="white" name={icon} />
    )

    setScreen(key) {
        this.setState({
            activeTab: key
        })
        if (key == "home"){
            this.setState({
                activeTab: key
            })
            this.props.navigation.navigate("Home")
        } else if (key == "song") {
            this.setState({
                activeTab: key
            })
            this.props.navigation.navigate("Songs")
        } else if (key == "calendar") {
            this.setState({
                activeTab: key
            })
            this.props.navigation.navigate("Calendar")
        } else if (key == "menu") {
            this.setState({
                activeTab: key
            })
            this.props.navigation.navigate("Menu")
        }
    }

    renderTab = ({ tab, isActive }) => (
        <FullTab
            isActive={false}
            showBadge={tab.key === 'movies-tv'}
            renderBadge={() => <Badge>2</Badge>}
            key={tab.key}
            label={tab.label}
            renderIcon={this.renderIcon(tab.icon)}
        />
    )

    render() {
        return (
            <BottomNavigation
                onTabPress={newTab => this.setScreen(newTab.key)}
                renderTab={this.renderTab}
                // activeTab={this.state.activeTab}
                tabs={this.tabs}
            />
        )
    }
}