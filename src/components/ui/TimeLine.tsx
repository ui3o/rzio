import React from "react";
import { Workout } from "../interfaces/workout";
import TimeLineItem from "./TimeLineItem";
import { Timer } from "../interfaces/timer";

interface Props {
  workout?: Array<Array<Workout>>
  timer: Timer;

}

interface State {
  clicks: number;
}

const initialState: State = {
  clicks: 0
};

export default class TimeLine extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  componentDidUpdate(_prevProps: Props, _prevState: State): void {
    console.log("componentDidUpdate")
  }

  createTimeLine(): JSX.Element {
    if (this.props.workout) {
      const timeLineList: Array<JSX.Element> = []
      for (let index = 0; index < this.props.workout.length; index++) {
        timeLineList.push((<TimeLineItem timer={this.props.timer} round={index} workout={this.props.workout[index]} allRound={this.props.workout.length}></TimeLineItem>))
      }
      return (
        <>
          {timeLineList}
        </>
      )
    }
    return (<></>);
  }

  public render(): JSX.Element {
    return (
      <>
        <section className="relative min-h-screen flex flex-col justify-center bg-slate-50 overflow-hidden">
          <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-10">
            <div className="flex flex-col justify-center divide-y divide-slate-200">
              <div className="w-full max-w-3xl mx-auto">
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  {this.createTimeLine()}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }
}
