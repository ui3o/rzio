import Card from "./Card"
import React from "react";
import { Workout } from "../interfaces/workout";
import { Timer } from "../interfaces/timer";

interface Props {
  allRound?: number
  round?: number
  workout: Array<Workout>
  timer?: Timer;
}

interface State {
  clicks: number;
}

const initialState: State = {
  clicks: 0
};

export default class TimeLineItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }
  public render(): JSX.Element {
    let exerciseCounter = ((Number(this.props.round) + 1) * Number(this.props.workout?.length) * 2) - 1;
    return (
      <>
        {this.props.timer?.workoutIsActiveMap[exerciseCounter] &&
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <Card timer={this.props.timer} round={this.props.round} workout={this.props.workout} allRound={this.props.allRound}></Card>
          </div>
        }
      </>
    )
  }
}
