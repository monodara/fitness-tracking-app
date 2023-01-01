import { Component } from "react";
import PubSub from 'pubsub-js';
import { UserUpdatedFoodFromIntakeList, UserDeletedFoodFromIntakeList } from "../event";
import Divider from '@mui/material/Divider';

import * as React from 'react';
import Box from '@mui/material/Box';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DatePicker';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

class IntakeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intakeDate: new Date(),
    }
  }

  onAddByOne = (f) => {
    PubSub.publish(UserUpdatedFoodFromIntakeList,
      {
        foodId: f.foodId,
        quantity: 1,
        intakeDate: this.state.intakeDate,
      });
  }

  onRemoveByOne = (f) => {
    if (f.quantity === 1) {
      PubSub.publish(UserDeletedFoodFromIntakeList,
        {
          foodId: f.foodId,
          intakeDate: this.state.intakeDate,
        });
    } else {
      PubSub.publish(UserUpdatedFoodFromIntakeList,
        {
          foodId: f.foodId,
          quantity: -1,
          intakeDate: this.state.intakeDate,
        });
    }
  }

  render() {

    return (
      <div className="foodIntake">
        <hr />
        <h3 style={{ textAlign: 'center', color: "white", padding: "20px", backgroundColor: "#33a3dc" }}>Here is Your Daily Intake:</h3>
        <div style={{ marginLeft: '20px', right: 'auto' }} >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Custom input"
              value={this.state.intakeDate}
              onChange={(newValue) => {
                this.setState({ intakeDate: newValue });
              }}
              renderInput={({ inputRef, inputProps, InputProps }) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <input ref={inputRef} {...inputProps} />
                  {InputProps?.endAdornment}
                </Box>
              )}
            />
          </LocalizationProvider>
        </div>
        {this.props.intakeFood.map((f, index) => ((f.intakeDate.toDateString() === this.state.intakeDate.toDateString()) &&
          <div style={{ paddingLeft: "20px" }} key={index}>
            
          <List sx={{ width: '100%',  bgcolor: 'background.paper' }}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={f.name} src={f.photo} />
              </ListItemAvatar>
              <ListItemText
                primary={f.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {f.calories}
                    </Typography>
                  </React.Fragment>
                }
              />
              <IconButton aria-label="remove" onClick={() => {this.onRemoveByOne(f)}}>
                <RemoveCircleIcon />
              </IconButton>
              <span style={{ color: '#009ad6', padding: '5px', margin: '5px' }}> {f.quantity}</span>
              <IconButton aria-label="add" onClick={() => {this.onAddByOne(f)}}>
                <AddCircleIcon />
              </IconButton>
            </ListItem>
            <Divider variant="inset" component="li" />
          </List>
          </div>
          
        ))}
      </div>)
  }
}

export default IntakeView;
