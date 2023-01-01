import React, { Component } from 'react'
import PubSub from 'pubsub-js';
import { UserAddedFoodToIntakeList, UserUpdatedFoodFromIntakeList } from "../event";
import { Modal, InputNumber } from 'antd';
import Box from '@mui/material/Box';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DatePicker';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';

export default class Food extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "isDateModalVisible": false,
      "isQuantityModalVisible": false,
      "intakeDate": new Date(),
      "foodQuantity": 1,
      "foodToAdd": null,
    }
  }

  addButtonHandler = () => {
    this.setState({
      isDateModalVisible: true,
      foodToAdd: { foodId: this.props.foodId, name: this.props.name, photo: this.props.photo, calories: this.props.calories }
    })
  };

  //close the date selector window
  dateHandleOk = () => {
    this.setState({ isDateModalVisible: false });
    //pop a hint window to select food quantity
    this.setState({ isQuantityModalVisible: true });
    //date has been stored when the user selects in the calendar
  };

  dateHandleCancel = () => {
    this.setState({ isDateModalVisible: false });
  };

  //when ok button is clicked, add food to the intakeList
  quantityHandleOk = () => {
    this.setState({ isQuantityModalVisible: false });

    //check if this kind of food is in the intake list;
    const exist = this.props.intakeList.find((f) => f.foodId === this.state.foodToAdd.foodId && f.intakeDate.toDateString() === this.state.intakeDate.toDateString());
    if (exist) {
      PubSub.publish(UserUpdatedFoodFromIntakeList,
        {
          foodId: exist.foodId,
          quantity: this.state.foodQuantity,
          intakeDate: this.state.intakeDate,
        });
    } else {
      PubSub.publish(UserAddedFoodToIntakeList,
        {
          foodId: this.props.foodId,
          name: this.props.name,
          calories: this.props.calories,
          photo: this.props.photo,
          quantity: this.state.foodQuantity,
          intakeDate: this.state.intakeDate,
        });
    }
  };
  //close the quantity selector window
  quantityHandleCancel(e) {
    e.nativeEvent.stopImmediatePropagation();
    this.setState({ isQuantityModalVisible: false });
  };
  //get the quantity of the food
  onQuantityChange = (value) => {
    this.setState({ foodQuantity: value });
  };

  render() {
    const { name, calories, photo } = this.props;
    return (
      <div className="SingleFood" style={{ paddingLeft: '20px', position: 'relative', height: '80px' }}>
        <h3 style={{ color: "#33a3dc", textAlign: "center" }}>Here is your search result</h3>
        <hr />
        <img src={photo} alt={name} style={{ position: 'relative', width: '40px', float: 'left', margin: '10px 5px', verticalAlign: 'center' }} />
        <div style={{ position: 'relative', paddingLeft: '20px' }}>
          <span style={{ color: 'black', fontSize: '1.2rem', paddingLeft: '20px' }}> {name} </span> <br />
          <span style={{ color: 'orange', fontSize: '0.8rem', fontWeight: 'bold', paddingLeft: '20px' }}>{calories}&nbsp;cal&nbsp;</span>
        </div>
        <IconButton style={{float:'right', position:'relative', marginRight:'40px', marginTop:'-50px'}}color="primary" aria-label="add" onClick={this.addButtonHandler}>
          <AddCircleIcon />
        </IconButton>

        <Modal title="Select the date" visible={this.state.isDateModalVisible} onOk={this.dateHandleOk} onCancel={this.dateHandleCancel}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Custom input"
              value={this.state.intakeDate}
              onChange={(newDate) => {
                this.setState({ intakeDate: newDate });
              }}
              renderInput={({ inputRef, inputProps, InputProps }) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <input ref={inputRef} {...inputProps} />
                  {InputProps?.endAdornment}
                </Box>
              )}
            />
          </LocalizationProvider>
        </Modal>
        <Modal title="Select the quantity" visible={this.state.isQuantityModalVisible} onOk={this.quantityHandleOk} onCancel={e => this.quantityHandleCancel(e)}>
          <InputNumber style={{ width: '200px !important' }} min={1} max={1000} defaultValue={1} onChange={this.onQuantityChange} />
        </Modal>
      </div>
    )
  }
}
