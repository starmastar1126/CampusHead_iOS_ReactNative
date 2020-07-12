import { Dimensions } from "react-native";
import React, { Component } from 'react'

import { createStackNavigator, createDrawerNavigator, createSwitchNavigator } from "react-navigation";
import Home from "../components/home/index";
import Songs from "../components/songs/index";
import EditSong from "../components/songs/editsong";
import ViewSong from "../components/songs/viewsong";
import Lyrics from "../components/songs/lyrics";
import Calendar from "../components/calendar/index";
import TeamMembers from "../components/teammembers/index";
import TeamList from "../components/teamlist/index";
import Pricing from "../components/pricing/index";
import Profile from "../components/profile/index";
import Event from "../components/event/index";
import Media from "../components/songs/media";
import ViewMedia from "../components/songs/viewmedia";
import Teams from "../components/teams/index";
import CreateTeam from "../components/teams/createteam";
import ViewProfile from "../components/profile/viewprofile";
import CreateSong from "../components/songs/createsong";
import YouTubeVideo from "../components/songs/youtubevideo";
import Notification from "../components/notification/index";
import AddEvent from "../components/event/addevent";
import Menu from "../components/menu/index";
import firebase from 'firebase';
// import SideMenu from "../components/sidemenu/sidemenu";
import SignIn from "../components/signin/index";
import TermsAndCondition from "../components/signin/termsAndCondition";
import SignUp from "../components/signup/index";
import Splash from "../components/splash";
const { width, height } = Dimensions.get("window");

const AppStack = createDrawerNavigator(
    {
        Home: { screen: Home },
        Songs: { screen: Songs },
        EditSong: { screen: EditSong },
        CreateSong: { screen: CreateSong },
        ViewSong: { screen: ViewSong },
        Lyrics: { screen: Lyrics },
        Calendar: { screen: Calendar },
        TeamMembers: { screen: TeamMembers },
        TeamList: { screen: TeamList },
        Pricing: { screen: Pricing },
        Profile: { screen: Profile },
        Event: { screen: Event },
        Media: { screen: Media },
        ViewMedia: { screen: ViewMedia },
        Teams: { screen: Teams },
        CreateTeam: { screen: CreateTeam },
        ViewProfile: { screen: ViewProfile },
        SignIn: { screen: SignIn },
        SignUp: { screen: SignUp },
        Splash: { screen: Splash },
        TermsAndCondition: { screen: TermsAndCondition },
        YouTubeVideo: { screen: YouTubeVideo },
        Notification: { screen: Notification },
        AddEvent: { screen: AddEvent },
        Menu: { screen: Menu },
    },
    {
        headerMode: "none",
        initialRouteName: "Splash",
        gesturesEnabled: false,
        drawerLockMode: "locked-closed"
        // contentComponent: SideMenu
        
    }
);

export default AppStack;