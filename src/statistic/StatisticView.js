import { Component } from "react";
import Barchart from "./Barchart";


class StatisticView extends Component {
    render() {
        return (
            <div className="statisticView">
                <Barchart
                    intakeFood={this.props.intakeFood}
                />
            </div>
        )
    }
}

export default StatisticView;