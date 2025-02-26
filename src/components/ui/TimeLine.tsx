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


  calculateActualTimer(): number {
    let currentActiveItem = -1;
    for (let index = 0; index < this.props.timer.workoutTimeMap.length; index++) {
      if (!this.props.timer?.workoutIsActiveMap[index - 1] && this.props.timer?.workoutIsActiveMap[index] && currentActiveItem === -1) {
        currentActiveItem = index;
        break;
      }
    }
    return currentActiveItem
  }

  calculateTimer(withDuration: boolean, actualTimer: number): string {
    const zeroPad = (num: string, places: number) => num.padStart(places, '0');
    let dur = this.props.timer.workoutTimeRawMap[actualTimer];
    if (dur) {
      dur = dur.replace(".", ":");
      const digits = dur.split(":");
      dur = `${zeroPad(digits[0], 2)}:${zeroPad(digits[1], 2)}`;
      const curTime = `${zeroPad((this.props.timer.curTime / 60).toString().split(".")[0], 2)}:${zeroPad(String(this.props.timer.curTime % 60), 2)}`
      return withDuration ? `${curTime} / ${dur}` : dur;
    }
    return `0`
  }

  public render(): JSX.Element {
    const actualTimer = this.calculateActualTimer()

    return (
      <>
        <section className="relative min-h-screen flex flex-col justify-center bg-slate-50 overflow-hidden">
          <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-10">
            <div className="flex flex-col justify-center divide-y divide-slate-200">
              <div className="w-full max-w-3xl mx-auto">

                <div className="flex justify-between text-4xl mb-2">
                  {actualTimer % 2 === 0 &&
                    <div className={`center min-w-9/12 select-none whitespace-nowrap rounded-lg py-2 px-3.5 align-baseline font-sans  font-bold uppercase leading-none text-white ${true ? "bg-red-500" : "bg-orange-300"}`}>
                      <div className="mt-px">{this.calculateTimer(actualTimer % 2 === 0, actualTimer)}</div>
                    </div>
                  }
                  <div className={`center min-w-2/12 select-none whitespace-nowrap rounded-lg py-2 px-3.5 align-baseline font-sans  font-bold uppercase leading-none text-white ${true ? "bg-green-700" : "bg-green-500"}`}>
                    <div className="mt-px">{this.calculateTimer(actualTimer % 2 !== 0, actualTimer % 2 !== 0 ? actualTimer : actualTimer + 1)}</div>
                  </div>
                </div>

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
