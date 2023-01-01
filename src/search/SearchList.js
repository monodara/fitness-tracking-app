import { Component } from "react";
import Food from "./Food";


class SearchList extends Component {
  render() {
    return (
      <div className="foodList" >
        
        {this.props.foodList.map((f) => (
          <div key={f.id}>
            <Food foodId={f.id} name={f.name} calories={f.cal} photo={f.photo}
              intakeList={this.props.intakeList}
            />
          </div>
        ))}
      </div>
    )
  }
}

export default SearchList;