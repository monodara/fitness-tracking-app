
import { Component } from "react";
import React from 'react';
import { UserTypedSearchKeyword, UserSearchFood, UserAddedFoodToIntakeList, UserDeletedFoodFromIntakeList, UserAttemptsToLogin, UserLoginFail, UserUpdatedFoodFromIntakeList } from "./event";
import getFoodList from "./api";
import { apiStatus } from "./enums";
import PubSub from 'pubsub-js';
import SearchView from "./search/SearchView";
import IntakeView from './intake/IntakeView';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CssBaseline from '@mui/material/CssBaseline';
import LoginView from "./login/LoginView";
import StatisticView from "./statistic/StatisticView";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "./fbconfig";
import { addFood, getFood, updateFood, deleteFood } from "./repository"
import 'antd/dist/antd.css';
import ListAltIcon from '@mui/icons-material/ListAlt';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "searchKeyword": "",
      "foundFoods": [],
      "fetchingStatus": apiStatus.no_fetch,
      "fetchingError": "",
      "intakeFood": [],
      "layout": "home",
      "user": {
        isLogin: false,
        email: "",
        accessToken: null,
        uid: null
      },
      "singleKindOfFood": []
    }
  }
  componentDidMount() {
    const parent = this;
    PubSub.subscribe(UserTypedSearchKeyword, (msg, data) => {
      parent.setState({
        "searchKeyword": data.keyword,
        "fetchingStatus": apiStatus.no_fetch
      })
    })

    PubSub.subscribe(UserSearchFood, (msg, data) => {
      parent.setState({
        "foundFoods": [],
        "fetchingStatus": apiStatus.fetching,
        "fetchingError": ""
      })
      getFoodList(data.keyword)
        .then(function (result) {
          if (result.success) {
            parent.setState({
              "searchKeyword": data.keyword,
              "foundFoods": result.data.foodList,
              "fetchingStatus": apiStatus.success,
              "fetchingError": ""
            });
          } else {
            parent.setState({
              "searchKeyword": data.keyword,
              "foundFoods": [],
              "fetchingStatus": apiStatus.failed,
              "fetchingError": result.data.error
            })
          }
        });
    })

    PubSub.subscribe(UserAddedFoodToIntakeList, async (msg, { foodId, name, calories, photo, quantity, intakeDate }) => {
      const newFood = await addFood(this.state.user.uid, { foodId, name, calories, photo, quantity, intakeDate });
      parent.setState({
        intakeFood: [newFood, ...parent.state.intakeFood],
      })
    });
    PubSub.subscribe(UserUpdatedFoodFromIntakeList, async (msg, { foodId, quantity, intakeDate }) => {
      const foodToUpdate = parent.state.intakeFood.find((f) => f.foodId === foodId && f.intakeDate.toDateString() === intakeDate.toDateString());
      await updateFood(this.state.user.uid, foodToUpdate.id, foodToUpdate.quantity + quantity);

      var qty = foodToUpdate.quantity + quantity;
      foodToUpdate.quantity = qty;
      this.setState({ intakeFood: [...this.state.intakeFood] })
    });


    //DELETE food from food list
    PubSub.subscribe(UserDeletedFoodFromIntakeList, async (msg, { foodId, intakeDate }) => {
      const foodToDelete = parent.state.intakeFood.find((f) => f.foodId === foodId && f.intakeDate.toDateString() === intakeDate.toDateString());
      const index = this.state.intakeFood.indexOf(foodToDelete);
      await deleteFood(this.state.user.uid, foodToDelete.id);
      this.removeProduct(index);
    });

    PubSub.subscribe(UserAttemptsToLogin, (msg, { email, password }) => {
      const auth = getAuth(firebaseApp);
      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredentials) => {
          const user = userCredentials.user;
          const foods = await getFood(user.uid);
          this.setState({
            intakeFood: foods,
            user: {
              isLogin: true,
              email: user.email,
              accessToken: user.accessToken,
              uid: user.uid
            }
          });
        })
        .catch((error) => {
          PubSub.publish(UserLoginFail, { reason: error })
        });
    })
  }


  removeProduct(indexToRemove) {
    if (this.state.intakeFood.length > 0) {
      const tempList = [...this.state.intakeFood];
      tempList.splice(indexToRemove, 1);
      this.setState({ intakeFood: tempList });
    }
  }


  render() {
    if (this.state.user.isLogin) {
      const layouts = {
        "search":
          <SearchView
            searchKeyword={this.state.searchKeyword}
            fetchingStatus={this.state.fetchingStatus}
            fetchingError={this.state.fetchingError}
            foundFoods={this.state.foundFoods}
            intakeList={this.state.intakeFood}
          />,
        "intake":
          <IntakeView
            intakeFood={this.state.intakeFood}
          />,
        "home":
          <StatisticView
            intakeFood={this.state.intakeFood} />
      };
      return (
        <div className="App">
          <Box sx={{ pb: 7 }}>
            <CssBaseline />
            {layouts[this.state.layout]}
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={2}>
              <BottomNavigation
                showLabels
                value={this.state.layout}
                onChange={(event, newLayout) => {
                  this.setState({ layout: newLayout });
                }}
              >
                <BottomNavigationAction label="Home" value="home" icon={<AnalyticsIcon />} />
                <BottomNavigationAction label="Search" value="search" icon={<SearchIcon />} />
                <BottomNavigationAction label="Intake" value="intake" icon={<ListAltIcon />} />
              </BottomNavigation>
            </Paper>
          </Box>
        </div >
      );
    } else {
      return (<div className="App">
        <Box sx={{ pb: 7 }}>
          <CssBaseline />
          <LoginView />
        </Box>
      </div >);
    }

  }
}

export default App;
