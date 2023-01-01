import { Component } from "react";
import SearchInput from "./SearchInput"
import SearchList from "./SearchList"
import { apiStatus } from "../enums";


class SearchView extends Component {

    render() {
        if (this.props.fetchingStatus === apiStatus.failed && this.props.foundFoods.length === 0) {
            window.alert("Nothing found! Please try another food name!");
        }
        return (
            <div className="SearchView">
                <SearchInput
                    searchKeyword={this.props.searchKeyword}
                />
                <SearchList
                    fetchingStatus={this.props.fetchingStatus}
                    fetchingError={this.props.fetchingError}
                    foodList={this.props.foundFoods}
                    intakeList={this.props.intakeList}
                />
            </div>
        )
    }
}

export default SearchView;