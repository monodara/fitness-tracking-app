import { Component } from "react";
import { UserTypedSearchKeyword, UserSearchFood } from "../event";
import PubSub from 'pubsub-js';
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";


class SearchInput extends Component {
    render() {
        return (
            <div className="SearchFormComponent">
                <hr />
                
				<Paper
                    sx={{ p: "5px 50px", display: "flex", alignItems: "center", width: 250, }}
                >
                    {<form>
					<InputBase
                        sx={{ ml: -5, flex: 2 }}
                        placeholder="Search Food"
                        inputProps={{ "aria-label": "search food" }}
                        value={this.props.searchKeyword}
                        onChange={event => {
                            PubSub.publish(UserTypedSearchKeyword, { keyword: event.target.value });
                        }}
                    />
					</form>}
					
                    <IconButton type="submit" sx={{ p: "9px" }} aria-label="search" onClick={event => {
                    PubSub.publish(UserSearchFood, { keyword: this.props.searchKeyword });
                }}>
                        <SearchIcon/>
                    </IconButton>
                </Paper>
				
                <hr />
            </div>
        );
    }
}

export default SearchInput;